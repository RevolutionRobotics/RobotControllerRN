import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { controllerStyle as styles } from '../styles';

export default class ControllerComponent extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Revvy Controller</Text>
      </View>
    );
  }
}
