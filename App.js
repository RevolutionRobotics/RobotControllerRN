/**
 * RobotController React Native App
 * https://github.com/RevolutionRobotics/RobotController
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { NativeModules, Platform } from 'react-native';
import { Provider } from 'react-redux';
import NavigatorComponent from 'components/NavigatorComponent';
import store from 'reducers/index';

export default class App extends Component {

  componentDidMount() {
    if (Platform.OS === 'android') {
      NativeModules.SofNavModule.startSoftNavListener();
    }
  }

  render() {
    return (
      <Provider store={store}>
        <NavigatorComponent />
      </Provider>
    );
  }
}
