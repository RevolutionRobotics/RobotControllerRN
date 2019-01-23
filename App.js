/**
 * RobotController React Native App
 * https://github.com/RevolutionRobotics/RobotController
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform, 
  Text, 
  View,
  SafeAreaView
} from 'react-native';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import NavigatorComponent from './app/components/NavigatorComponent';
import reducer from './app/reducers/index';

export default class App extends Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <NavigatorComponent />
      </Provider>
    );
  }
}
