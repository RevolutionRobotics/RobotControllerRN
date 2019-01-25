import React, { Component } from 'react';
import { 
  TouchableOpacity,
  SafeAreaView,
  View,
  Text,
  PanResponder
} from 'react-native';
import { controllerStyle as styles } from '../styles';

export default class ControllerComponent extends Component {

  static navigationOptions = {
    title: 'Remote Controller'
  };

  constructor() {
    super();

    this.joystickSize = 180;
    this.state = {
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

  radToDeg = rad => (rad / Math.PI * 180);

  offsetPercent = offset => Math.round(offset / (this.joystickSize / 2) * 100);

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
