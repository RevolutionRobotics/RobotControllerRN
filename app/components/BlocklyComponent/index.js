import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class BlocklyComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      xmlData: ''
    };
  }

  renderWebView = isAndroid => {
    if (isAndroid) {
      return (
        <WebView
          source={{ uri: 'file:///android_asset/blockly/index.html' }}
          onMessage={this.onWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      );
    }

    return (
      <WebView
        source={require('./blockly.html')}
        onMessage={this.onWebViewMessage}
        useWebKit={true}
      />
    );
  };

  onWebViewMessage = event => {
    this.setState({
      xmlData: event.nativeEvent.data
    });
  };

  render() {
    return (
      <View {...this.props}>
        { this.renderWebView(Platform.OS === 'android') }
      </View>
    );
  }
}