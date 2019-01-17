import React, { Component } from 'react';
import { 
  Platform, 
  PermissionsAndroid,
  Alert, 
  View, 
  Text 
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default class BleSettingsComponent extends Component {

  constructor() {
    super();
    this.manager = new BleManager();

    this.state = {
      foundDevices: []
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
      <View>
        <Text>BLE settings placeholder...</Text>
      </View>
    );
  }

  setStateChangeListener = () => {
    const subscription = this.manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
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

  scanAndConnect = () => {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        this.showError(error);
        return;
      } else if (this.state.foundDevices.includes(device.id)) {
        return;
      }

      this.setState({
        ...this.state,
        foundDevices: [
          ...this.state.foundDevices,
          device.id
        ]
      })

      console.log(device);

      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'Revvy_RPi') {
        
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.manager.stopDeviceScan();

        // Proceed with connection.
        device.connect()
          .then(device => device.discoverAllServicesAndCharacteristics())
          .then(device => {
            console.error(device.name);
            // Do work on device with services and characteristics
          })
          .catch(error => this.showError(error));
      }
    });
  };
}
