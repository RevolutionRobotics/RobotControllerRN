import React, { Component } from 'react';
import { 
  TouchableOpacity,
  View,
  Text,
  Modal,
  TextInput
} from 'react-native';
import styles from './styles';

export default class InputDialog extends Component {

  /***

    Input Dialog
    _____________________

    Attributes:

    * dialogTitle         - String
    * value               - String
    * visible             - Boolean
    * onValueSet          - Function
    * onRequestClose      - Function
    * buttonPositiveText  - String

  ***/

  constructor(props) {
    super(props);

    this.state = {
      value: props.value || ''
    };
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
            <View style={styles.inputDialogMainContainer}>
              <TextInput 
                style={styles.textInput}
                value={this.state.value}
                onChangeText={text => this.setState({ value: text })}
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
        </View>
      </Modal>
    );
  }
};
