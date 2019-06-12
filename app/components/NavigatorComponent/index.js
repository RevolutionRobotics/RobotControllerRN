import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';

import CardListComponent from 'components/CardListComponent';
import BleSettingsComponent from 'components/BleSettingsComponent';
import ControllerComponent from 'components/ControllerComponent';
import BlocklyComponent from 'components/BlocklyComponent';
import RobotConfigComponent from 'components/RobotConfigComponent';
import CodeViewComponent from 'components/CodeViewComponent';

import styles from './styles';

import CacheUtils from 'utilities/CacheUtils';

import * as assignmentAction from 'actions/AssignmentAction';
import * as blocklyAction from 'actions/BlocklyAction';
import * as configAction from 'actions/RobotConfigAction';
import * as bleAction from 'actions/BleAction';

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
    CacheUtils.readCache(props);
  }

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
  setAssignments: assignments => dispatch(assignmentAction.setAssignments(assignments)),
  setBlocklyList: list => dispatch(blocklyAction.setBlocklyList(list)),
  setRobotConfigList: list => dispatch(configAction.setRobotConfigList(list)),
  setLastDevice: device => dispatch(bleAction.setLastDevice(device))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);
