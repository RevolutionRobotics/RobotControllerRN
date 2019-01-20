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

  onWebViewMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);

    this.setState({
      xmlData: data.xmlData,
      pythonCode: data.pythonCode
    });
  };

  render() {
    const htmlPath = (Platform.OS === 'android') 
      ? 'file:///android_asset/blockly/index.html' 
      : './blockly/index.html';

    return (
      <View {...this.props}>
        <WebView
          originWhitelist={['*']}
          source={{ uri: htmlPath }}
          onMessage={this.onWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          useWebKit={true}
        />
      </View>
    );
  }
}