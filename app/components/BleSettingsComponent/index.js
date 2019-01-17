import React, { Component } from 'react';
import { 
  StyleSheet,
  Platform, 
  PermissionsAndroid,
  Alert, 
  View, 
  Text,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class BleSettingsComponent extends Component {

  constructor() {
    super();
    this.manager = new BleManager();

    this.state = {
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

  render() {
    return (
      <View style={styles.container}>
        {this.renderListOrEmpty()}
      </View>
    );
  }

  renderListOrEmpty = () => {
    return this.state.foundDevices.length === 0 ?
    (<Text style={{styles.emptyString}}>{this.state.emptyString}</Text>) : (
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
      <Text style={styles.deviceItemTitle}>{item.localName || item.id}</Text>
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
    const appName = 'RobotController';
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
      }, () => console.log('TODO: Will need to close component here...'));
    }
  };

  showError = (error, callback = () => {}) => {
    Alert.alert(
      error.message,
      error.reason,
      [{ text: 'OK', onPress: callback() }],
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
      //} else if (this.state.foundDevices.includes(device) || !device.name) {
      } else {
        const deviceInList = this.state.foundDevices.some(element => {
          return element.id === device.id;
        });

        if (deviceInList) {
          return;
        }
      }

      console.log(device);

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

    // Proceed with connection.
    device.connect()
      .then(device => device.discoverAllServicesAndCharacteristics())
      .then(device => {
        console.log('LISTING DEVICE CHARACTERISTICS...');
        console.log(device);
        // Do work on device with services and characteristics
      })
      .catch(error => this.showError(error));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignSelf: 'stretch',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  deviceList: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: 20
  },
  listBottomPadding: {
    paddingBottom: 50
  },
  emptyString: {
    padding: 30
  },
  deviceItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0.3,
    },
    elevation: 3
  },
  deviceItemTitle: {
    padding: 20
  }
});
