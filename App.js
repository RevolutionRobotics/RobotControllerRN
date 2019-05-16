/**
 * RobotController React Native App
 * https://github.com/RevolutionRobotics/RobotController
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import NavigatorComponent from 'components/NavigatorComponent';
import store from 'reducers/index';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <NavigatorComponent />
      </Provider>
    );
  }
}
