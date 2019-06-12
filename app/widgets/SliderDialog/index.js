import React, { Component } from 'react';
import { 
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  Text,
  Modal
} from 'react-native';
import Slider from 'react-native-slider';
import styles from './styles';

export default class SliderDialog extends Component {

  /***

    Slider Dialog
    _____________________

    Attributes:

    * dialogTitle         - String
    * value               - Number
    * minValue            - Number
    * maxValue            - Number
    * visible             - Boolean
    * onValueSet          - Function
    * onRequestClose      - Function
    * buttonPositiveText  - String

  ***/

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || 0
    };
  }

  /**
   * This lifecycle method is deprecated, but we still need to update the
   * state on input change events. Updating the state does not trigger 
   * 'getDerivedStateFromProps()' function, so until there's no solution 
   * for that, we'll use 'componentWillReceiveProps()'.
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.inputDialogBackdrop}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={-25}
            behavior='position'
          >
            <View style={styles.inputDialogContainer}>
              <View style={styles.inputDialogTitleContainer}>
                <Text style={styles.inputDialogTitle}>
                  {this.props.dialogTitle}
                </Text>
                <TouchableOpacity 
                  style={styles.inputDialogButton} 
                  onPress={this.props.onRequestClose}
                >
                  <Text style={styles.inputDialogButtonLabel}>×</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.sliderLabel}>
                {this.state.value}
              </Text>
              <View style={styles.inputDialogMainContainer}>
                <Slider
                  style={styles.sliderInput}
                  minimumTrackTintColor='#e60312'
                  thumbTintColor='#e60312'
                  value={this.state.value}
                  minimumValue={this.props.minValue}
                  maximumValue={this.props.maxValue}
                  onValueChange={number => this.setState({ 
                    value: Math.round(number)
                  })}
                />
              </View>
              <View style={styles.inputDialogButtonContainer}>
                <TouchableOpacity 
                  style={styles.inputDialogButtonPositive}
                  onPress={() => this.props.onValueSet(this.state.value)}
                >
                  <Text style={styles.inputDialogLabelPositive}>
                    {this.props.buttonPositiveText || 'OK'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  }
}
