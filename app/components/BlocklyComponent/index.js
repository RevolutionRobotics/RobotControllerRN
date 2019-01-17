import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default class BlocklyComponent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      xmlData: '',
      pythonCode: ''
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
        source={require('../../../assets/blockly/index.html')}
        onMessage={this.onWebViewMessage}
        useWebKit={true}
      />
    );
  };

  onWebViewMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);

    this.setState({
      ...this.state,
      xmlData: data.xmlData,
      pythonCode: data.pythonCode
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