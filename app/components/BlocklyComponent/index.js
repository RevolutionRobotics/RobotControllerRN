import React, { Component } from 'react';
import {
  View
} from 'react-native';
import { WebView } from 'react-native-webview';

export default class BlocklyComponent extends Component {
  render() {
    return (
      <View {...this.props}>
        <WebView
          source={require('./blockly.html')}
        />
      </View>
    );
  }
}