import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  PanResponder
} from 'react-native';
import base64 from 'base64-js';
import { connect } from 'react-redux';
import { controllerStyle as styles } from 'components/styles';

class ControllerComponent extends Component {

  static navigationOptions = {
    title: 'Remote Controller'
  };

  constructor(props) {
    super(props);

    this.joystickSize = 180;
    this.state = {
      counter: 0,
      sendTimer: null,
      joystickX: 0,
      joystickY: 0,
      joystickR: 0,
      joystickPhi: 0,
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
        sendTimer: setInterval(() => this.sendData(), 100)
      });
    }
  }

  componentWillUnmount() {
    if (this.state.sendTimer) {
      clearInterval(this.state.sendTimer);
    }
  }

  radToDeg = rad => (rad / Math.PI * 180);

  offsetPercent = offset => Math.round(offset / (this.joystickSize / 2) * 100);

  sendData = async () => {
    const byteArray = new Uint8Array([
      0xff,
      this.offsetPercent(this.state.joystickR),
      this.state.joystickPhi,
      0x0,
      this.state.counter
    ]);

    this.setState({
      counter: (this.state.counter >= 0x0f) ? 0 : this.state.counter + 1
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

  renderButtons = () => (
    <View style={styles.btnContainer}>
      <View style={[styles.btnContainerColumn, { top: 25 }]}>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
      </View>
      <View style={[styles.btnContainerColumn, { top: -10 }]}>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
      </View>
      <View style={[styles.btnContainerColumn, { top: -25 }]}>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
        <TouchableOpacity style={styles.btnProgrammable}></TouchableOpacity>
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

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderJoystick()}
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eeeeee'
        }}>
          <Text style={{ width: 45 }}>
            {`r: ${this.offsetPercent(this.state.joystickR)}, \n𝜑: ${this.state.joystickPhi}`}
          </Text>
        </View>

        {this.renderButtons()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  uartCharacteristic: state.BleReducer.get('uartCharacteristic')
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping... 
});

export default connect(mapStateToProps, mapDispatchToProps)(ControllerComponent);
