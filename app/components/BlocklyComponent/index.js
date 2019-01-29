import React, { Component } from 'react';
import { 
  Platform, 
  SafeAreaView, 
  View,
  Text,
  Alert,
  TouchableOpacity   
} from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { blocklyStyle as styles } from 'components/styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

class BlocklyComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const menuIconType = (Platform.OS === 'android') ? 'vert' : 'horiz';

    return {
      title: 'Blockly Editor',
      headerRight: (
        <HeaderButtons 
          HeaderButtonComponent={MaterialHeaderButton}
          OverflowIcon={<MaterialIcons name={`more-${menuIconType}`} size={23} color='white' />}
        >
          <Item 
            title="code" 
            iconName="code" 
            onPress={navigation.getParam('codeViewHandler')} 
          />
          <Item title="New" show="never" onPress={() => {}} />
          <Item title="Open" show="never" onPress={() => {}} />
          <Item title="Save" show="never" onPress={() => {}} />
          <Item title="Delete" show="never" onPress={() => {}} />
        </HeaderButtons>
      )
    };
  };

  constructor(props) {
    super(props);

    this.state = {
      xmlData: '',
      pythonCode: ''
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      codeViewHandler: this.codeViewPressed
    });
  }

  onWebViewMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);

    this.setState({
      xmlData: data.xmlData,
      pythonCode: data.pythonCode
    });
  };

  codeViewPressed = () => {
    const code = this.state.pythonCode;
    
    if (!code) {
      Alert.alert(
        'Nothing to show',
        'Please add some blocks to view your code.',
        [{ text: 'OK', onPress: null }],
        { cancelable: false }
      );
    } else {
      this.props.navigation.push('CodeView', { code: code });
    }
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
