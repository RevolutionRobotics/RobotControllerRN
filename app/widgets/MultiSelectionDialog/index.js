import React, { Component } from 'react';
import { 
  TouchableOpacity,
  View,
  Text,
  Modal,
  FlatList
} from 'react-native';
import CheckBox from 'react-native-check-box';
import styles from './styles';

export default class MultiSelectionDialog extends Component {

  /***

    Multi Selection Dialog
    _____________________

    Attributes:

    * dialogTitle         - String
    * listItems           - Array
    * visible             - Boolean
    * onItemsSelected     - Function
    * onRequestClose      - Function
    * buttonPositiveText  - String

  ***/

  constructor(props) {
    super(props);

    this.state = {
      values: props.listItems
    };
  }

  renderListDialogItem = ({item, index}) => (
    <View 
      key={item.key}
      style={styles.listDialogItem}
    >
      <CheckBox 
        isChecked={item.checked}
        checkBoxColor={'white'}
        leftText={item.name}
        leftTextStyle={styles.listDialogItemLabel}
        onClick={() => this.setState({
          values: this.state.values.map((checkboxItem, itemIndex) => (
            (itemIndex === index)
              ? { ...checkboxItem, checked: !checkboxItem.checked }
              : checkboxItem
          ))
        })}
      />
    </View>
  );

  render() {
    return (
      <Modal
        animationType='fade'
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}
        supportedOrientations={['portrait', 'landscape']}
      >
        <View style={styles.listDialogBackdrop}>
          <View style={styles.listDialogContainer}>
            <View style={styles.listDialogTitleContainer}>
              <Text style={styles.listDialogTitle}>
                {this.props.dialogTitle}
              </Text>
              <TouchableOpacity 
                style={styles.listDialogButton} 
                onPress={this.props.onRequestClose}
              >
                <Text style={styles.listDialogButtonLabel}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.listDialogItemsContainer}>
              <FlatList
                contentContainerStyle={{ paddingVertical: 20 }}
                data={this.state.values}
                renderItem={this.renderListDialogItem}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => `${item.name || 'item'} - ${index}`}
              />
            </View>
            <View style={styles.listDialogButtonContainer}>
              <TouchableOpacity 
                style={styles.listDialogButtonPositive}
                onPress={() => this.props.onItemsSelected(this.state.values)}
              >
                <Text style={styles.listDialogLabelPositive}>
                  {this.props.buttonPositiveText || 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
