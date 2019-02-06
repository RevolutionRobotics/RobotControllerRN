import React, { Component } from 'react';
import { 
  Platform, 
  PermissionsAndroid,
  Alert,
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import BlocklySync from 'utilities/BlocklySync';
import { bleStyle as styles } from 'components/styles';
import { name as appName } from 'app.json';
import * as action from 'actions/BleAction';

class BleSettingsComponent extends Component {

  static navigationOptions = {
    title: 'BLE Device List'
  };

  constructor(props) {
    super(props);
    this.manager = props.navigation.state.params.bleManager;

    this.state = {
      device: null,
      connectingDialogVisible: false,
      uartServiceId: '0000ffe0-0000-1000-8000-00805f9b34fb',
      uartCharacteristicId: '0000ffe1-0000-1000-8000-00805f9b34fb',
      foundDevices: [],
      emptyString: 'Initializing BLE device list...'
    }
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      this.handlePermissionRequest();
    } else {
      this.setStateChangeListener();
    }
  }

  componentWillUnmount() {
    this.manager.stopDeviceScan();
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderListOrEmpty()}
        {this.renderConnectingDialog()}
      </SafeAreaView>
    );
  }

  renderConnectingDialog = () => {
    const currentDevice = this.state.device;
    const currentDeviceName = currentDevice?.localName || currentDevice?.name || currentDevice?.id;

    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.state.connectingDialogVisible}
        onRequestClose={() => this.setState({ connectingDialogVisible: false })}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.dialogBackdrop}>
          <View style={styles.connectingDialogContainer}>
            <Text style={styles.dialogTitle}>
              {`Connecting to ${currentDeviceName || 'BLE device'}...`}
            </Text>
            <View style={styles.connectingIndicatorContainer}>
              <ActivityIndicator size="large" color="#f90000" />
            </View>
            <View style={styles.dialogButtonContainer}>
              <TouchableOpacity style={styles.dialogButton} onPress={() => {
                this.state.device?.cancelConnection();
                this.setState({ connectingDialogVisible: false });
              }}>
                <Text style={styles.dialogButtonLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderListOrEmpty = () => {
    return this.state.foundDevices.length === 0 ?
    (<Text style={styles.emptyString}>{this.state.emptyString}</Text>) : (
      <FlatList 
        style={styles.deviceList}
        contentContainerStyle={styles.listBottomPadding}
        data={this.state.foundDevices}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
      />
    );
  };

  renderItem = ({item, index}) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => this.connect(item)}>
      <Text style={styles.deviceItemTitle}>
        {item.localName || item.name || item.id}
      </Text>
    </TouchableOpacity>
  );

  setStateChangeListener = () => {
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanDevices();
        subscription.remove();
      } else {
        this.setState({
          foundDevices: [],
          emptyString: 'Please enable Bluetooth to start scanning for devices...'
        });
      }
    }, true);
  };

  handlePermissionRequest = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        'title': `${appName} App needs permission to continue`,
        'message': 'You need to grant access to COARSE LOCATION to use BLE connection.'
      }
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.setStateChangeListener();
    } else {
      this.showError({
        message: 'Can\'t continue BLE device scan',
        reason: 'Requested permissions must be granted'
      }, this.props.navigation.goBack);
    }
  };

  showError = (error, callback = () => {}) => {
    Alert.alert(
      error.message,
      error.reason,
      [{ text: 'OK', onPress: callback }],
      { cancelable: false }
    );
  };

  scanDevices = () => {
    this.setState({
      emptyString: 'Searching for BLE devices...'
    });

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        this.showError(error);
        return;
      } else {
        const deviceInList = this.state.foundDevices.some(element => (
          element.id === device.id
        ));

        if (deviceInList || !device.serviceUUIDs?.includes(this.state.uartServiceId)) {
          return;
        }
      }

      this.setState({
        foundDevices: [
          ...this.state.foundDevices,
          device
        ]
      });
    });
  };

  connect = device => {
    // Stop scanning as it's not necessary if you are scanning for one device.
    this.manager.stopDeviceScan();

    this.setState({
      device: device,
      connectingDialogVisible: true
    });

    // Proceed with connection.
    device.connect()
      .then(device => {
        console.log('CONNECTED TO BLE DEVICE');
        return device.discoverAllServicesAndCharacteristics(device.id);
      })
      .then(device => {
        console.log('LISTING DEVICE CHARACTERISTICS...');
        console.log(device);
        device.services()
          .then(services => {
            const uartService = services.find(item => (
              item.uuid === this.state.uartServiceId
            ));

            if (uartService) {
              uartService.characteristics()
                .then(characteristics => {
                  const uartCharacteristic = characteristics.find(item => (
                    item.uuid === this.state.uartCharacteristicId
                  ));

                  if (uartCharacteristic) {
                    this.props.setUartCharacteristic(uartCharacteristic);
                    device.onDisconnected(() => {
                      this.props.setUartCharacteristic(null);
                    });

                    this.setState({ 
                      connectingDialogVisible: false 
                    }, () => {
                      BlocklySync.sync(this.props);
                      this.props.navigation.goBack();
                    });
                  } else {
                    this.disconnect(device.id);
                  }
                });
            } else {
              this.disconnect(device.id);
            }
          });
      })
      .catch(error => {
        this.setState({ connectingDialogVisible: false });
        this.showError(error)
      });
  };

  disconnect = id => this.manager.cancelDeviceConnection(id);
}

const mapStateToProps = state => ({
  uartCharacteristic: state.BleReducer.get('uartCharacteristic'),
  savedList: state.BlocklyReducer.get('savedList')
});

const mapDispatchToProps = dispatch => ({
  setUartCharacteristic: characteristic => dispatch(action.setUartCharacteristic(characteristic))
});

export default connect(mapStateToProps, mapDispatchToProps)(BleSettingsComponent);
