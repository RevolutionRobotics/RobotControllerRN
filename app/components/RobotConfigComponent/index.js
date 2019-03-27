import React, { Component } from 'react';
import {  
  Text,
  TextInput,
  View,
  SafeAreaView,
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
    };
  }

  updateValue = (section, item, key, value) => {
    this.props.updateConfig([section, 'data', item, key], value);
  };

  renderMotorTypes = itemIndex => (
    <View>
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        value={this.props.savedConfig.getIn([0, 'data', itemIndex, 'type'])}
        items={this.state.motorTypes}
        onValueChange={(_, index) => {
          this.updateValue(0, itemIndex, 'type', index);
        }}
      />
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        value={this.props.savedConfig.getIn([0, 'data', itemIndex, 'direction'])}
        items={[
          {
            label: 'Clockwise',
            value: 0
          },
          {
            label: 'Counter clockwise',
            value: 1
          }
        ]}
        onValueChange={(_, index) => {
          this.updateValue(0, itemIndex, 'direction', index);
        }}
      />
      {this.renderSidePicker(itemIndex)}
    </View>
  );

  renderSidePicker = itemIndex => {
    if (this.props.savedConfig.getIn([0, 'data', itemIndex, 'type']) !== 2) {
      return <View />;
    }

    return (
      <View>
        <Text style={styles.configLabel}>Side:</Text>
        <RNPickerSelect
          style={this.state.configPickerStyle}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
          value={this.props.savedConfig.getIn([0, 'data', itemIndex, 'side'])}
          items={[
            {
              label: 'Left',
              value: 0
            },
            {
              label: 'Right',
              value: 1
            }
          ]}
          onValueChange={(_, index) => {
            this.updateValue(0, itemIndex, 'side', index);
          }}
        />
      </View>
    );
  }

  renderSensorTypes = itemIndex => (
    <RNPickerSelect
      style={this.state.configPickerStyle}
      useNativeAndroidPickerStyle={false}
      placeholder={{}}
      value={this.props.savedConfig.getIn([1, 'data', itemIndex, 'type'])}
      items={this.state.sensorTypes}
      onValueChange={(_, index) => {
        this.updateValue(1, itemIndex, 'type', index);
      }}
    />
  );

  renderRow = itemProps => {
    const itemIndex = itemProps.index;
    const isMotor = itemProps.section.title === 'Motors';
    const sectionIndex = isMotor ? 0 : 1;

    return (
      <View style={styles.rowContainer}>
        {itemProps.item.map((item, rowIndex) => {
          const index = itemIndex * 2 + rowIndex;
          const id = `${isMotor ? 'M' : 'S'}${index + 1}`;

          return (
            <View style={styles.itemPropsContainer} key={id}>
              <Text style={styles.itemLabel}>{id}</Text>
              <Text style={styles.configLabel}>Name:</Text>
              <TextInput
                style={styles.dialogInput}
                placeholder='name'
                placeholderTextColor={'#aaaaaa'}
                onChangeText={text => {
                  this.updateValue(sectionIndex, index, 'name', text);
                }}
                value={this.props.savedConfig.getIn(
                  [sectionIndex, 'data', index, 'name']
                )}
              />

              <Text style={styles.configLabel}>Type:</Text>
              { isMotor 
                ? this.renderMotorTypes(index) 
                : this.renderSensorTypes(index)
              }
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
      sections={sections.toJS().map(section => ({
        ...section, 
        data: ArrayUtils.chunk(section.data, 2)
      }))}
      renderItem={itemProps => this.renderRow(itemProps)}
      stickySectionHeadersEnabled={false}
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
  savedConfig: state.RobotConfigReducer.get('savedConfig')
});

const mapDispatchToProps = dispatch => ({
  updateConfig: (path, value) => dispatch(action.updateRobotConfig(path, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(RobotConfigComponent);
