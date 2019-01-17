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
  StyleSheet, 
  Text, 
  View,
  SafeAreaView
} from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  blockly: {
    width: '100%',
    flex: 1,
    flexDirection: 'column'
  }
});
