import React, { Component } from 'react';
import {
  Platform, View
} from 'react-native';
import { WebView } from 'react-native-webview';

export default class BlocklyComponent extends Component {

  renderWebView = isAndroid => {
    if (isAndroid) {
      return (
        <WebView
          source={{ uri: 'file:///android_asset/blockly/index.html' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      );
    }

    return(
      <WebView
        source={require('./blockly.html')}
      />
    );
  };

  render() {
    return (
      <View {...this.props}>
        { this.renderWebView(Platform.OS === 'android') }
      </View>
    );
  }
}