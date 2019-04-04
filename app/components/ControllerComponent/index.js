import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
  PanResponder
} from 'react-native';
import base64 from 'base64-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import AlertUtils from 'utilities/AlertUtils';
import DataSync from 'utilities/DataSync';
import MultiTouchComponent from 'widgets/MultiTouchComponent';
import { connect } from 'react-redux';
import { controllerStyle as styles } from 'components/styles';

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

class ControllerComponent extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Remote Controller',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <Item 
          title='settings' 
          iconName={navigation.getParam('settingsIcon') || 'settings'} 
          onPress={navigation.getParam('settingsPressed')} 
        />
      </HeaderButtons>
    )
  });

  constructor(props) {
    super(props);

    this.joystickSize = 180;
    this.state = {
      isSyncing: false,
      counter: 0,
      sendTimer: null,
      settingsMode: false,
      assignListVisible: false,
      joystickX: 0,
      joystickY: 0,
      joystickR: 0,
      joystickPhi: 0,
      buttonsInput: 0,
      panResponder: PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
          const x = gestureState.dx;
          const y = gestureState.dy;

          const phiRad = Math.atan2(-y, x);
          const r = Math.min(this.joystickSize / 2, Math.sqrt(x * x + y * y));

          const phiDeg = this.radToDeg((phiRad < 0) 
            ? (phiRad + 2 * Math.PI) 
            : phiRad
          );

          this.setState({
            joystickX: r * Math.cos(phiRad),
            joystickY: r * Math.sin(phiRad + Math.PI),
            joystickR: Math.round(r),
            joystickPhi: Math.round(phiDeg / 2)
          });
        },
        onPanResponderRelease: (event, gestureState) => this.setState({
          joystickX: 0,
          joystickY: 0,
          joystickR: 0,
          joystickPhi: 0
        })
      })
    };
  }

  componentDidMount() {
    if (this.props.uartCharacteristic) {
      this.setState({
        isSyncing: true
      }, () => DataSync.sync(this.props, error => {
        if (error) {
          this.interruptSync();
          return;
        }

        this.setState({
          sendTimer: setInterval(this.sendData, 100), 
          isSyncing: false 
        });
      }));
    }

    this.props.navigation.setParams({
      settingsPressed: this.settingsPressedHandler
    });
  }

  componentWillUnmount() {
    if (this.state.sendTimer) {
      clearInterval(this.state.sendTimer);
    }
  }

  renderSyncDialog = () => (
    <Modal
      animationType='fade'
      transparent={true}
      visible={this.state.isSyncing}
      onRequestClose={this.interruptSync}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.dialogBackdrop}>
        <View style={styles.syncDialogContainer}>
          <Text style={styles.dialogTitle}>{'Syncing data...'}</Text>
          <View style={styles.syncIndicatorContainer}>
            <ActivityIndicator size="large" color="#e60312" />
          </View>
          <View style={styles.dialogButtonContainer}>
            <TouchableOpacity style={styles.dialogButton} onPress={this.interruptSync}>
              <Text style={styles.dialogButtonLabel}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  interruptSync = () => {
    this.setState({ isSyncing: false }, this.props.navigation.goBack);
  }

  radToDeg = rad => (rad / Math.PI * 180);

  offsetPercent = offset => Math.round(offset / (this.joystickSize / 2) * 100);

  settingsPressedHandler = () => {
    this.setState({
      settingsMode: !this.state.settingsMode
    }, () => {
      this.props.navigation.setParams({
        settingsIcon: this.state.settingsMode ? 'check' : 'settings'
      });
    });
  };

  sendData = async () => {
    const byteArray = new Uint8Array([
      0xff,
      this.offsetPercent(this.state.joystickR),
      this.state.joystickPhi,
      this.state.buttonsInput,
      this.state.counter
    ]);

    this.setState({
      counter: (this.state.counter >= 0xf) ? 0 : this.state.counter + 1
    });

    try {
      const base64Data = base64.fromByteArray(byteArray);
      
      this.props.uartCharacteristic.writeWithResponse(base64Data)
        .then()
        .catch(e => {
          clearInterval(this.state.sendTimer);
          console.warn(e.message);
        });
    } catch (e) {
      console.warn(e.message);
    }
  };

  buttonPressed = btnId => {
    if (this.state.settingsMode) {
      if (!this.props.savedList.length) {
        AlertUtils.showError(
          'Nothing to assign', 
          'There are no Blockly scripts saved yet.'
        );
      } else {
        this.setState({ assignListVisible: true });
      }
    }
  };

  renderButton = btnId => {
    const inputProps = Platform.OS === 'ios'
      ? {
        onTouchStart: () => this.setBitForButton(btnId, 1),
        onTouchEnd: () => this.setBitForButton(btnId, 0)
      }
      : {
        onMultiTouch: event => this.setBitForButton(btnId, ~~event.isActive)
      };

    return (
      <View
        style={[styles.btnProgrammable, { 
          opacity: this.opacityForButton(btnId) 
        }]}
        {...inputProps}
      />
    );
  }

  opacityForButton = btnId => (
    ((this.state.buttonsInput >> btnId) & 1) ? .2 : 1
  );

  setBitForButton = (btnId, bit) => {
    const clearMask = ~(1 << btnId);
    const currentValue = this.state.buttonsInput;

    this.setState({ buttonsInput: (currentValue & clearMask) | (bit << btnId) });
  };

  renderButtons = () => (
    <View style={styles.btnContainer}>
      <View style={[styles.btnContainerColumn, { top: 25 }]}>
        {this.renderButton(0)}
        {this.renderButton(1)}
      </View>
      <View style={[styles.btnContainerColumn, { top: -10 }]}>
        {this.renderButton(2)}
        {this.renderButton(3)}
      </View>
      <View style={[styles.btnContainerColumn, { top: -25 }]}>
        {this.renderButton(4)}
        {this.renderButton(5)}
      </View>
    </View>
  );

  renderJoystick = () => (
    <View style={styles.joystickContainer}>
      <View
        style={[styles.joystickBase, {
          width: this.joystickSize,
          height: this.joystickSize,
          borderRadius: this.joystickSize / 2
        }]}
      >
        <View
          style={[styles.joystickHandle, {
            width: this.joystickSize / 2,
            height: this.joystickSize / 2,
            borderRadius: this.joystickSize / 4,
            top: this.state.joystickY,
            left: this.state.joystickX
          }]}
          {...this.state.panResponder.panHandlers}
        >
          <View style={styles.joystickHandleGloss} />
        </View>
      </View>
    </View>
  );

  renderAssignList = () => (
    <View />
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <MultiTouchComponent style={styles.multiTouch}>
          {this.renderJoystick()}
          <View style={styles.centerImageContainer}>
            <Image 
              style={styles.centerImage} 
              resizeMode='contain'
              source={require('images/rrf-tall-full-color.png')}
            />
          </View>

          {this.renderButtons()}
          {this.renderAssignList()}
          {this.renderSyncDialog()}
        </MultiTouchComponent>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  uartCharacteristic: state.BleReducer.get('uartCharacteristic'),
  savedConfig: state.RobotConfigReducer.get('savedConfig'),
  savedList: state.BlocklyReducer.get('savedList')
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping... 
});

export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent);
