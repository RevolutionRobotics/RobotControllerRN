import React, { Component } from 'react';
import {  
  FlatList, 
  TouchableOpacity, 
  Text,
  TextInput,
  Alert,
  View,
  SafeAreaView,
  Platform,


  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import RNPickerSelect from 'react-native-picker-select';

import KeyboardAwareSectionList from 'widgets/KeyboardAwareSectionList';

import ArrayUtils from 'utilities/ArrayUtils';
import * as action from 'actions/RobotConfigAction';
import { robotConfigStyle as styles } from 'components/styles';

class RobotConfigComponent extends Component {

  constructor(props) {
    super(props);

    const typeLabels = {
      motors: [
        'None',
        'Motor',
        'Drivetrain'
      ],
      sensors: [
        'None',
        'Ultrasonic',
        'Button'
      ]
    };

    this.state = {
      motorTypes: Array.from({length: 3}, (_, index) => ({
        label: typeLabels.motors[index],
        value: index
      })),
      sensorTypes: Array.from({length: 3}, (_, index) => ({
        label: typeLabels.sensors[index],
        value: index
      })), 
      configPickerStyle: StyleSheet.create({
        inputIOS: {
          ...styles.configPicker
        },
        inputAndroid: {
          ...styles.configPicker
        }
      })
    }
  }

  renderMotorTypes = () => (
    <View>
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        itemKey={'None'}
        items={this.state.motorTypes}
        onValueChange={() => {}}
      />
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        itemKey={'Clockwise'}
        items={[
          {
            label: 'Clockwise',
            value: true
          },
          {
            label: 'Counter clockwise',
            value: false
          }
        ]}
        onValueChange={() => {}}
      />
    </View>
  );

  renderSensorTypes = () => (
    <RNPickerSelect
      style={this.state.configPickerStyle}
      useNativeAndroidPickerStyle={false}
      placeholder={{}}
      itemKey={'None'}
      items={this.state.sensorTypes}
      onValueChange={() => {}}
    />
  );

  renderRow = itemProps => {
    const itemIndex = itemProps.index;
    const isMotor = itemProps.section.title === 'Motors';

    return (
      <View style={styles.rowContainer}>
        {itemProps.item.map((item, rowIndex) => {
          const id = `${isMotor ? 'M' : 'S'}${itemIndex * 2 + rowIndex + 1}`;

          return (
            <View style={styles.itemPropsContainer} key={id}>
              <Text style={styles.itemLabel}>{id}</Text>
              <Text style={styles.configLabel}>Name:</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder='name'
                placeholderTextColor={'#aaaaaa'}
                onChangeText={text => console.log(text)}
              />

              <Text style={styles.configLabel}>Type:</Text>
              {isMotor ? this.renderMotorTypes() : this.renderSensorTypes()}
            </View>
          );
        })}
      </View>
    );
  };

  renderList = sections => (
    <KeyboardAwareSectionList
      style={styles.listContainer}
      contentContainerStyle={styles.listContentStyle}
      sections={sections.map(section => ({
        ...section, 
        data: ArrayUtils.chunk(section.data, 2)
      }))}
      renderItem={itemProps => this.renderRow(itemProps)}
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderSectionFooter={({section}) => <View />}
      keyExtractor={ (item, index) => index }
      removeClippedSubviews={true}
    />
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.renderList(this.props.savedConfig)}
      </SafeAreaView>
    );
  }

}

const mapStateToProps = state => ({
  savedConfig: state.RobotConfigReducer.get('savedConfig').toJS()
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping... 
});

export default connect(mapStateToProps, mapDispatchToProps)(RobotConfigComponent);
