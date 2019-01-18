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
import { appStyle as styles } from './app/components/styles.js';

import BlocklyComponent from './app/components/BlocklyComponent';
import BleSettingsComponent from './app/components/BleSettingsComponent';

export default class App extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/*<BlocklyComponent style={styles.blockly} />*/}
        <BleSettingsComponent />
      </SafeAreaView>
    );
  }
}
