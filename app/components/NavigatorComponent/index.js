import React, { Component } from 'react';
import { AsyncStorage, StatusBar, View } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { connect } from 'react-redux';

import CardListComponent from 'components/CardListComponent';
import BleSettingsComponent from 'components/BleSettingsComponent';
import ControllerComponent from 'components/ControllerComponent';
import BlocklyComponent from 'components/BlocklyComponent';
import CodeViewComponent from 'components/CodeViewComponent';

import * as action from 'actions/BlocklyAction';

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

class NavigatorComponent extends Component {

  constructor(props) {
    super(props);

    AsyncStorage.getItem('savedList')
      .then(list => {
        if (list) {
          props.setBlocklyList(JSON.parse(list));
        }
      });
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

const mapStateToProps = state => ({
  // TODO: Implement mapping...
});

const mapDispatchToProps = dispatch => ({
  setBlocklyList: list => dispatch(action.setBlocklyList(list))
});

export default connect(mapStateToProps, mapDispatchToProps)(NavigatorComponent);
