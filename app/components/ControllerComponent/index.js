import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  Image,
  Modal,
  ActivityIndicator,
  PanResponder
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
import ListSelectionDialog from 'widgets/ListSelectionDialog';
import { connect } from 'react-redux';
import styles from './styles';
import * as action from 'actions/AssignmentAction';

const btnBackgroundTask = -1;
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

          const joystickX = r * Math.cos(phiRad);
          const joystickY = r * Math.sin(phiRad + Math.PI);

          this.setState({
            joystickX: joystickX,
            joystickY: joystickY
          });
        },
        onPanResponderRelease: (event, gestureState) => this.setState({
          joystickX: 0,
          joystickY: 0
        })
      })
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
    }

    this.syncData();
    this.props.navigation.setParams({
      settingsPressed: this.settingsPressedHandler,
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
    if (this.props.robotServices) {
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
    } else {
      this.setState({ isSyncing: false });
    }
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

  offsetPercent = offset => Math.round(offset / (this.joystickSize / 2) * 100);

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

  sendData = async () => {
    const byteArray = new Uint8Array([
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
      this.state.buttonsInput,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff,
      0xff
    ]);

    this.setState({
      counter: (this.state.counter >= 0xf) ? 0 : this.state.counter + 1
    });

    try {
      const base64Data = base64.fromByteArray(byteArray);
      
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

  renderButton = btnId => this.state.settingsMode
    ? (<TouchableOpacity 
      style={styles.btnProgrammable} 
      onPress={() => this.buttonPressed(btnId)}
      onLongPress={() => this.promptUnassign(btnId)}
    />)
    : (<View
      style={[styles.btnProgrammable, { opacity: this.opacityForButton(btnId) }]}
      onTouchStart={() => this.setBitForButton(btnId, 1)}
      onTouchEnd={() => this.setBitForButton(btnId, 0)}
    />);

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
    Math.floor((value + this.joystickSize / 2) * (255 / this.joystickSize))
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderJoystick()}
        <View 

        style={styles.centerImageContainer}>
          <Image 
            style={styles.centerImage} 
            resizeMode='contain'
            source={require('images/rrf-tall-full-color.png')}
          />
        </View>

        {this.renderButtons()}
        {this.renderAssignList()}
        {this.renderSyncDialog()}
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
