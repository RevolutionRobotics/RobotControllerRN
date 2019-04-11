import React, { Component } from 'react';
import { AsyncStorage, StatusBar, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';

import CardListComponent from 'components/CardListComponent';
import BleSettingsComponent from 'components/BleSettingsComponent';
import ControllerComponent from 'components/ControllerComponent';
import BlocklyComponent from 'components/BlocklyComponent';
import RobotConfigComponent from 'components/RobotConfigComponent';
import CodeViewComponent from 'components/CodeViewComponent';

import styles from './styles';

import * as blocklyAction from 'actions/BlocklyAction';
import * as configAction from 'actions/RobotConfigAction';

const RootNavigator = createStackNavigator({
  CardList: { screen: CardListComponent },
  BleSettings: { screen: BleSettingsComponent },
  Controller: { screen: ControllerComponent },
  Blockly: { screen: BlocklyComponent },
  RobotConfig: { screen: RobotConfigComponent },
  CodeView: { screen: CodeViewComponent }
}, {
  initialRouteName: 'CardList',
  defaultNavigationOptions: {
    title: 'Revvy App',
    headerStyle: styles.headerStyle,
    headerTitleStyle: styles.headerTitleStyle,
    headerBackTitleStyle: styles.headerBackTitleStyle,
    headerTintColor: 'white'
  }
});

const AppContainer = createAppContainer(RootNavigator);

class NavigatorComponent extends Component {

  constructor(props) {
    super(props);

    this.loadSavedData('savedList', 'setBlocklyList');
    this.loadSavedData('savedConfig', 'setRobotConfig');
  }

  loadSavedData = (key, callbackKey) => {
    AsyncStorage.getItem(key)
      .then(data => {
        if (data) {
          this.props[callbackKey](JSON.parse(data));
        }
      });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle={'light-content'}
          translucent={false}
          hidden={true}
        />
        <AppContainer screenProps={this.props} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // TODO: Implement mapping...
});

const mapDispatchToProps = dispatch => ({
  setBlocklyList: list => dispatch(blocklyAction.setBlocklyList(list)),
  setRobotConfig: config => dispatch(configAction.setRobotConfig(config))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);
