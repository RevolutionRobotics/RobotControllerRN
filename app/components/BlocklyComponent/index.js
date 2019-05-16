import React, { Component } from 'react';
import { 
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  BackHandler,
  View,
  Text,
  TextInput,
  Alert,
  Modal
} from 'react-native';
import { WebView } from 'react-native-webview';
import { connect } from 'react-redux';
import { HeaderBackButton } from 'react-navigation';
import styles from './styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { 
  HeaderButton,
  Item
} from 'react-navigation-header-buttons';
import AlertUtils from 'utilities/AlertUtils';
import * as action from 'actions/BlocklyAction';
import InputDialog from 'widgets/InputDialog';
import ListSelectionDialog from 'widgets/ListSelectionDialog';

const debugMode = false;
const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

class BlocklyComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const menuIconType = (Platform.OS === 'android') ? 'vert' : 'horiz';

    return {
      title: 'Blockly Editor',
      gesturesEnabled: false,
      headerLeft: (<HeaderBackButton 
        tintColor={'white'} 
        onPress={navigation.getParam('onBackPress')}  
      />),
      headerRight: (
        <HeaderButtons 
          HeaderButtonComponent={MaterialHeaderButton}
          OverflowIcon={<MaterialIcons name={`more-${menuIconType}`} size={23} color='white' />}
        >
          <Item 
            title="code" 
            iconName="code" 
            onPress={navigation.getParam('codeView')} 
          />
          <Item title="New" show="never" onPress={navigation.getParam('newPressed')} />
          <Item title="Open" show="never" onPress={navigation.getParam('openPressed')} />
          <Item title="Save" show="never" onPress={navigation.getParam('savePressed')} />
          <Item title="Delete" show="never" onPress={navigation.getParam('deletePressed')} />
        </HeaderButtons>
      )
    };
  };

  constructor(props) {
    super(props);

    this.webView = null;
    this.state = {
      currentName: '',
      openDialogVisible: false,
      saveDialogVisible: false,
      saveInputValue: '',
      unsavedChanges: false,
      xmlData: '',
      pythonCode: '',
      webInputDialogVisible: false,
      webInputDialogTitle: '',
      webInputDialogValue: ''
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    this.props.navigation.setParams({ onBackPress: this.handleBackPress });

    this.props.navigation.setParams({
      codeView: this.codeViewPressed,
      newPressed: this.newPressed,
      openPressed: this.openPressed,
      savePressed: this.savePressed,
      deletePressed: this.deletePressed
    });
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    this.promptUnsaved(this.props.navigation.goBack);
    return this.state.unsavedChanges;
  };

  onWebViewMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);

    if (data.inputDialog) {
      this.setState({ 
        webInputDialogTitle: data.inputDialog.message,
        webInputDialogValue: data.inputDialog.defaultValue,
        webInputDialogVisible: true
      });

      return;
    }

    this.setState({
      unsavedChanges: true,
      xmlData: data.xmlData,
      pythonCode: data.pythonCode
    });
  };

  renderWebInputDialog = () => (
    <InputDialog
      dialogTitle={this.state.webInputDialogTitle}
      value={this.state.webInputDialogValue}
      visible={this.state.webInputDialogVisible}
      onRequestClose={() => {
        this.setState({ webInputDialogVisible: false });
        this.postData({ dialogValue: null });
      }}
      onValueSet={value => {
        this.setState({ webInputDialogVisible: false });
        this.postData({ dialogValue: value });
      }}
    />
  );

  postData = data => {
    this.webView && this.webView.postMessage(JSON.stringify(data));
  };

  codeViewPressed = () => {
    const code = this.state.pythonCode;
    
    if (!code) {
      AlertUtils.showError(
        'Nothing to show',
        'Please add some blocks to view your code.'
      );
    } else {
      this.props.navigation.push('CodeView', { code: code });
    }
  };

  newPressed = () => {
    this.promptUnsaved(() => this.setState({
      currentName: '',
      unsavedChanges: false,
      xmlData: '',
      pythonCode: ''
    }, () => this.postData({})));
  };

  openPressed = () => {
    if (!this.props.savedList.length) {
      AlertUtils.showError('Nothing to open', 'There are no scripts saved yet.');
      return;
    }

    this.promptUnsaved(() => this.setState({ openDialogVisible: true }));
  };

  savePressed = () => {
    const data = this.state.xmlData;

    if (!data) {
      AlertUtils.showError(
        'Nothing to save', 
        'Please add some blocks before saving.'
      );
    } else {
      this.setState({ 
        saveDialogVisible: true,
        saveInputValue: this.state.currentName 
      });
    }
  };

  saveScript = () => {
    const name = this.state.saveInputValue;
    const fileExists = this.props.savedList.some(item => (
      item.name === name && item.name !== this.state.currentName
    ));

    if (!name) {
      return;
    } else if (fileExists) {
      AlertUtils.showError(
        'This file already exists', 
        'Please specify a new name.'
      );

      return;
    }

    this.props.saveBlocklyXml({ 
      name: name,
      unsavedChanges: false,
      xmlData: this.state.xmlData,
      pythonCode: this.state.pythonCode
    });

    this.setState({ currentName: name });
    this.closeSaveDialog();
  };

  deletePressed = () => {
    const name = this.state.currentName;

    if (!name) {
      AlertUtils.showError(
        'Nothing to delete', 
        'This script has not been saved yet.'
      );

      return;
    }

    Alert.alert(
      'Are you sure?',
      `Delete ${name}?`,
      [
        { text: 'Delete', onPress: () => {
          this.props.deleteBlocklyXml(name);
          this.newPressed();
        }},
        { text: 'Cancel', onPress: () => null }
      ],
      { cancelable: false }
    );
  };

  promptUnsaved = callback => {
    if (!this.state.unsavedChanges) {
      callback();
      return;
    }

    const blocklyName = this.state.currentName || 'Blockly';
    AlertUtils.promptConfirm(
      `Unsaved changes in ${blocklyName}`,
      'Continue without saving?',
      callback
    )
  };

  closeSaveDialog = () => this.setState({ 
    saveDialogVisible: false,
    saveInputValue: ''
  });

  renderSaveDialog = () => (
    <Modal
      animationType='fade'
      transparent={true}
      visible={this.state.saveDialogVisible}
      onRequestClose={this.closeSaveDialog}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.dialogBackdrop}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={-25}
          behavior='position'
        >
          <View style={styles.saveDialogContainer}>
            <Text style={styles.dialogTitle}>Save code as...</Text>
              <TextInput 
                style={styles.dialogInput} 
                placeholder={'Script name...'}
                placeholderTextColor={'#aaaaaa'}
                onChangeText={value => this.setState({ saveInputValue: value })}
                value={this.state.saveInputValue}
              ></TextInput>
            <View style={styles.dialogButtonContainer}>
              <TouchableOpacity style={styles.dialogButton} onPress={this.saveScript}>
                <Text style={styles.dialogButtonLabel}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.dialogButton} onPress={this.closeSaveDialog}>
                <Text style={styles.dialogButtonLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );

  renderOpenDialog = () => (
    <ListSelectionDialog
      dialogTitle={'Open code'}
      listItems={this.props.savedList}
      visible={this.state.openDialogVisible}
      onItemSelected={item => {
        this.setState({ 
          currentName: item.name,
          openDialogVisible: false
        }, () => this.postData({ domValue: item.xmlData }));
      }}
      onRequestClose={() => this.setState({ openDialogVisible: false })}
    />
  );

  render() {
    const debugPath = 'http://localhost:8083/index.html';
    const htmlPath = (Platform.OS === 'android') 
      ? 'file:///android_asset/blockly/index.html' 
      : './blockly/index.html';

    return (
      <View style={styles.safeAreaContainer}>
        <View style={styles.blockly}>
          <WebView
            ref={webViewRef => (this.webView = webViewRef)}
            originWhitelist={['*']}
            source={{ uri: debugMode ? debugPath : htmlPath }}
            onMessage={this.onWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            injectedJavaScript={'document.body.classList.add("webview")'}
            useWebKit={true}
          />
          {this.renderSaveDialog()}
          {this.renderOpenDialog()}
          {this.renderWebInputDialog()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  savedList: state.BlocklyReducer.get('savedList')
});

const mapDispatchToProps = dispatch => ({
  saveBlocklyXml: data => dispatch(action.saveBlocklyXml(data)),
  deleteBlocklyXml: name => dispatch(action.deleteBlocklyXml(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(BlocklyComponent);
