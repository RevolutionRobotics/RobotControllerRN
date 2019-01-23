import React, { Component } from 'react';
import { SafeAreaView, FlatList, Text } from 'react-native';
import { controllerStyle as styles } from '../styles';

export default class ControllerComponent extends Component {

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Revvy Controller</Text>
      </SafeAreaView>
    );
  }
}
