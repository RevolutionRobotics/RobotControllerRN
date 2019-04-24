import React, { Component } from 'react';
import { 
  TouchableOpacity,
  View,
  Text,
  Modal,
  FlatList
} from 'react-native';
import styles from './styles';

export default class ListSelectionDialog extends Component {

  /***

    List Selection Dialog
    _____________________

    Attributes:

    * dialogTitle     - String
    * listItems       - Array
    * visible         - Boolean
    * onItemSelected  - Function
    * onRequestClose  - Function

  ***/

  constructor(props) {
    super(props);
  }

  renderListDialogItem = ({item}) => (
    <TouchableOpacity 
      key={item.key}
      style={styles.listDialogItem}
      onPress={() => this.props.onItemSelected(item)}
    >
      <Text style={styles.listDialogItemLabel}>{item.name}</Text>
    </TouchableOpacity>
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
                data={this.props.listItems}
                renderItem={this.renderListDialogItem}
                removeClippedSubviews={true}
                keyExtractor={(item, index) => `${item.name || 'item'} - ${index}`}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};
