import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import CardListComponent from 'components/CardListComponent';
import BleSettingsComponent from 'components/BleSettingsComponent';
import ControllerComponent from 'components/ControllerComponent';
import BlocklyComponent from 'components/BlocklyComponent';
import CodeViewComponent from 'components/CodeViewComponent';

const RootNavigator = createStackNavigator({
  CardList: { screen: CardListComponent },
  BleSettings: { screen: BleSettingsComponent },
  Controller: { screen: ControllerComponent },
  Blockly: { screen: BlocklyComponent },
  CodeView: { screen: CodeViewComponent }
}, {
  initialRouteName: 'CardList',
  defaultNavigationOptions: {
    title: 'Revvy App',
    headerStyle: {
      backgroundColor: '#f90000'
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
          backgroundColor={'#f90000'}
          barStyle={'light-content'}
          translucent={false}
          hidden={true}
        />
        <AppContainer screenProps={this.props} />
      </View>
    );
  }
}
