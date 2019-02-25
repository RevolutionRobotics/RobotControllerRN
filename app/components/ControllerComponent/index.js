import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  PanResponder
} from 'react-native';
import ListViewSelect from 'react-native-list-view-select';
import base64 from 'base64-js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import AlertUtils from 'utilities/AlertUtils';
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
        sendTimer: setInterval(this.sendData, 100)
      });
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

  renderButton = btnId => (
    <View
      style={[styles.btnProgrammable, { opacity: this.opacityForButton(btnId) }]}
      onTouchStart={() => this.setBitForButton(btnId, 1)}
      onTouchEnd={() => this.setBitForButton(btnId, 0)}
    />
  );

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
    <ListViewSelect
      list={this.props.savedList.map(item => item.name)}
      isVisible={this.state.assignListVisible}
      onClick={() => {}}
      onClose={() => this.setState({ assignListVisible: false })}
    />
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
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  uartCharacteristic: state.BleReducer.get('uartCharacteristic'),
  savedList: state.BlocklyReducer.get('savedList')
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping... 
});

export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent);
