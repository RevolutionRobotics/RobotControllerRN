/* eslint-disable no-console */
import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Image,
  Modal,
  ActivityIndicator
} from 'react-native';
import base64 from 'base64-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { 
  HeaderButton, 
  Item 
} from 'react-navigation-header-buttons';
import AlertUtils from 'utilities/AlertUtils';
import DataSync from 'utilities/DataSync';
import AppConfig from 'utilities/AppConfig';
import MultiTouchComponent from 'widgets/MultiTouchComponent';
import ListSelectionDialog from 'widgets/ListSelectionDialog';
import { connect } from 'react-redux';
import styles from './styles';
import * as action from 'actions/AssignmentAction';

const btnBackgroundTask = -1;
const joystickSize = 180;

const buttonVerticalOffsets = [25, -10, -25];
const MaterialHeaderButton = props => (
  <HeaderButton 
    {...props} 
    IconComponent={MaterialIcons} 
    iconSize={23} 
    color="white" 
  />
);

class ControllerComponent extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'Remote Controller',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <Item 
          title='background task' 
          iconName={'assignment'} 
          style={{ display: navigation.getParam('settingsIcon') === 'check' 
            ? 'flex' 
            : 'none' 
          }}
          onPress={() => navigation.getParam('buttonPressed')(btnBackgroundTask)} 
        />
        <Item 
          title='ring led' 
          iconName={'highlight'} 
          style={{ display: navigation.getParam('settingsIcon') !== 'check' 
            ? 'flex' 
            : 'none' 
          }}
          onPress={() => navigation.getParam('ringLedPressed')()} 
        />
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

    this.state = {
      characteristics: {},
      layoutId: 0,
      isSyncing: false,
      assignDialogVisible: false,
      counter: 0,
      sendTimer: null,
      settingsMode: false,
      assigningButton: null,
      joystickX: 0,
      joystickY: 0,
      buttonsInput: 0,
      pendingButtonsInput: 0
    };
  }

  componentDidMount() {
    if (this.props.robotServices) {
      const liveMessageService = this.props.robotServices.find(item => (
        item.uuid === AppConfig.services.liveMessage.id
      ));

      if (!liveMessageService) {
        return;
      }

      liveMessageService.characteristics()
        .then(list => {
          this.setState({
            characteristics: {
              ...this.state.characteristics,
              periodicController: this.findCharacteristic(list, 'periodicController')
            }
          });
        });

      this.syncData();
    } else {
      this.setState({ isSyncing: false });
    }

    this.props.navigation.setParams({
      settingsPressed: this.settingsPressedHandler,
      ringLedPressed: this.ringLedPressed,
      buttonPressed: this.buttonPressed
    });
  }

  componentWillUnmount() {
    this.stopSending();
  }

  stopSending = () => {
    if (this.state.sendTimer) {
      clearInterval(this.state.sendTimer);
    }
  };

  findCharacteristic = (list, id) => (
    AppConfig.findCharacteristic(list, 'liveMessage', id)
  );

  syncData = () => {
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
  };

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
            <TouchableOpacity 
              style={styles.dialogButton} 
              onPress={this.interruptSync}
            >
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

  offsetPercent = offset => Math.round(offset / (joystickSize / 2) * 100);

  settingsPressedHandler = () => {
    this.setState({
      settingsMode: !this.state.settingsMode
    }, () => {
      if (this.state.settingsMode && this.state.sendTimer) {
        clearInterval(this.state.sendTimer);
      } else if (this.props.robotServices) {
        this.syncData();
      }

      this.props.navigation.setParams({
        settingsIcon: this.state.settingsMode ? 'check' : 'settings'
      });
    });
  };

  ringLedPressed = () => {
    if (!this.props.robotServices) {
      return;
    }
    
    const pythonTest = 'exec("""\nif robot._ring_led:\n    robot._ring_led.set_scenario(RingLed.ColorWheel)\n    time.sleep(2)\n    robot._ring_led.set_scenario(RingLed.Off)\n""")';
    const dataToSync = pythonTest.split('').map(c => c.charCodeAt());

    this.setState({ isSyncing: true });
    DataSync.syncLongMessage(this.props, 4, dataToSync, () => {
      this.setState({ isSyncing: false });
    });
  };

  sendData = async () => {
    const base64Data = base64.fromByteArray(new Uint8Array([
      this.state.counter,
      this.interpolate(this.state.joystickX),
      this.interpolate(this.state.joystickY),
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      this.state.pendingButtonsInput,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff
    ]));

    this.setState({
      counter: (this.state.counter >= 0xf) ? 0 : this.state.counter + 1,
      pendingButtonsInput: this.state.buttonsInput
    });

    try {
      this.state.characteristics.periodicController.writeWithResponse(base64Data)
        .then()
        .catch(e => {
          clearInterval(this.state.sendTimer);
          console.warn(e.message);
        });
    } catch (e) {
      console.warn(e.message);
      this.stopSending();
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
        this.setState({ assigningButton: btnId });
      }
    }
  };

  opacityForButton = btnId => (
    ((this.state.buttonsInput >> btnId) & 1) ? .2 : 1
  );

  setBitForButton = (btnId, bit) => {
    const clearMask = ~(1 << btnId);
    
    const currentValue = this.state.buttonsInput;
    const pendingValue = this.state.pendingButtonsInput;

    this.setState({ 
      buttonsInput: (currentValue & clearMask) | (bit << btnId),
      pendingButtonsInput: bit 
        ? (pendingValue & clearMask) | (bit << btnId)
        : pendingValue
    });
  };

  renderButtons = () => (
    <View style={styles.btnContainer}>
      {buttonVerticalOffsets.map((offset, index) => (
        <View 
          key={index}
          style={[styles.btnContainerColumn, { top: offset }]}
        >
          {this.renderButton(index * 2)}
          {this.renderButton(index * 2 + 1)}
        </View>
      ))}
    </View>
  );

  renderButton = btnId => this.state.settingsMode
  ? (<TouchableOpacity
      style={styles.btnProgrammable} 
      onPress={() => this.buttonPressed(btnId)}
      onLongPress={() => this.promptUnassign(btnId)}
    />)
  : (<View
      style={[styles.btnProgrammable, { opacity: this.opacityForButton(btnId) }]}
      onMultiTouch={event => this.setBitForButton(btnId, ~~event.isActive)}
    />);

  handleJoystickMove = event => {
    const x = event.coordinates.dx;
    const y = event.coordinates.dy;

    const phiRad = Math.atan2(-y, x);
    const r = Math.min(joystickSize / 2, Math.sqrt(x * x + y * y));

    const joystickX = r * Math.cos(phiRad);
    const joystickY = r * Math.sin(phiRad + Math.PI);

    this.setState({
      joystickX: joystickX,
      joystickY: joystickY
    });
  };

  renderJoystick = () => (
    <View style={styles.joystickContainer}>
      <View
        style={[styles.joystickBase, {
          width: joystickSize,
          height: joystickSize,
          borderRadius: joystickSize / 2
        }]}
      >
        <View
          style={[styles.joystickHandle, {
            width: joystickSize / 2,
            height: joystickSize / 2,
            borderRadius: joystickSize / 4,
            top: this.state.joystickY,
            left: this.state.joystickX,
            opacity: this.state.joystickOpacity
          }]}
          onMultiTouch={event => {
            if (!event.isActive) {
              this.setState({
                joystickX: 0,
                joystickY: 0
              });
            }
          }}
          onMultiPan={this.handleJoystickMove}
        >
          <View style={styles.joystickHandleGloss} />
        </View>
      </View>
    </View>
  );

  renderAssignList = () => (
    <ListSelectionDialog
      dialogTitle={'Assign code'}
      listItems={this.props.savedList}
      onItemSelected={item => {
        const btnId = this.state.assigningButton;

        this.props.addButtonAssignment(this.state.layoutId, btnId, item.name);
        this.setState({ assigningButton: null });
      }}
      visible={this.state.assigningButton !== null}
      onRequestClose={() => this.setState({ assigningButton: null })}
    />
  );

  promptUnassign = btnId => {
    const selectedBlockly = this.props.buttonAssignments.find(item => (
      item.layoutId === this.state.layoutId && item.btnId === btnId
    ));

    if (!selectedBlockly) {
      AlertUtils.showError(
        'Button unassigned', 
        'There\'s no code assigned for this button'
      );

      return;
    }

    AlertUtils.promptDelete(
      selectedBlockly.blocklyName,
      `Do you want to unassign blockly for this button?`,
      () => this.props.removeButtonAssignment(this.state.layoutId, btnId)
    );
  }

  interpolate = value => (
    Math.floor((value + joystickSize / 2) * (255 / joystickSize))
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
  robotServices: state.BleReducer.get('robotServices'),
  savedConfigList: state.RobotConfigReducer.get('savedConfigList'),
  selectedName: state.RobotConfigReducer.get('selectedName'),
  savedList: state.BlocklyReducer.get('savedList'),
  buttonAssignments: state.ButtonAssignmentReducer.get('assignments')
});

const mapDispatchToProps = dispatch => ({
  addButtonAssignment: (layoutId, btnId, blocklyName) => dispatch(action.addButtonAssignment(layoutId, btnId, blocklyName)),
  removeButtonAssignment: (layoutId, btnId) => dispatch(action.removeButtonAssignment(layoutId, btnId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent);
