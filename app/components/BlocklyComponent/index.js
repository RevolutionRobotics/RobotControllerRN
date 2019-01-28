import React, { Component } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { blocklyStyle as styles } from 'components/styles';

class BlocklyComponent extends Component {

  static navigationOptions = {
    title: 'Blockly Editor'
  };

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
      <View style={styles.safeAreaContainer}>
        <SafeAreaView style={styles.blockly}>
          <WebView
            originWhitelist={['*']}
            source={{ uri: htmlPath }}
            onMessage={this.onWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            useWebKit={true}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  // TODO: Implement mapping...
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping...
});

export default connect(mapStateToProps, mapDispatchToProps)(BlocklyComponent);
