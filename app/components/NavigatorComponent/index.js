import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import CardListComponent from '../CardListComponent';
import BleSettingsComponent from '../BleSettingsComponent';
import ControllerComponent from '../ControllerComponent';
import BlocklyComponent from '../BlocklyComponent';

const RootNavigator = createStackNavigator({
  CardList: { screen: CardListComponent },
  BleSettings: { screen: BleSettingsComponent },
  Controller: { screen: ControllerComponent },
  Blockly: { screen: BlocklyComponent }
}, {
  initialRouteName: 'CardList',
  defaultNavigationOptions: {
    title: 'Revvy App',
    headerStyle: {
      backgroundColor: '#3370a2'
    },
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerTintColor: 'white'
  }
});

const AppContainer = createAppContainer(RootNavigator);

export default class NavigatorComponent extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar 
          backgroundColor={'#234d70'}
          barStyle={'light-content'}
          translucent={false}
          hidden={true}
        />
        <AppContainer screenProps={this.props} />
      </View>
    );
  }
}
