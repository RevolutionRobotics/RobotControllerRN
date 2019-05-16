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

import * as assignmentAction from 'actions/AssignmentAction';
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
const cachedData = [
  { key: 'assignments',     action: 'setAssignments'     },
  { key: 'savedList',       action: 'setBlocklyList'     },
  { key: 'savedConfigList', action: 'setRobotConfigList' }
];

class NavigatorComponent extends Component {

  constructor(props) {
    super(props);
    
    cachedData.forEach(item => AsyncStorage.getItem(item.key).then(data => {
      if (data) {
        this.props[item.action](JSON.parse(data));
      }
    }));
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
  setRobotConfigList: list => dispatch(configAction.setRobotConfigList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);
