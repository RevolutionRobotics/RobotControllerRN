import React, { Component } from 'react';
import {  
  Text,
  TextInput,
  View,
  SafeAreaView,
  StyleSheet,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';
import KeyboardAwareSectionList from 'widgets/KeyboardAwareSectionList';
import InputDialog from 'widgets/InputDialog';
import ListSelectionDialog from 'widgets/ListSelectionDialog';
import AlertUtils from 'utilities/AlertUtils';
import ArrayUtils from 'utilities/ArrayUtils';
import StateUtils from 'utilities/StateUtils';
import AppConfig from 'utilities/AppConfig';
import * as action from 'actions/RobotConfigAction';
import styles from './styles';

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

class RobotConfigComponent extends Component {

  static navigationOptions = ({ navigation }) => {
    const menuIconType = (Platform.OS === 'android') ? 'vert' : 'horiz';

    return {
      title: 'Robot Configurator',
      headerRight: (
        <HeaderButtons 
          HeaderButtonComponent={MaterialHeaderButton}
          OverflowIcon={<MaterialIcons name={`more-${menuIconType}`} size={23} color='white' />}
        >
          <Item title="New" show="never" onPress={navigation.getParam('newPressed')} />
          <Item title="Select" show="never" onPress={navigation.getParam('openPressed')} />
          <Item title="Save" show="never" onPress={navigation.getParam('savePressed')} />
          <Item title="Delete" show="never" onPress={navigation.getParam('deletePressed')} />
        </HeaderButtons>
      )
    };
  };

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
      newDialogVisible: false,
      openDialogVisible: false,
      saveDialogVisible: false,
      selectedConfig: null,
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

  componentDidMount() {
    this.props.navigation.setParams({
      newPressed: () => this.setState({ newDialogVisible: true }),
      openPressed: () => {
        if (this.props.savedConfigList?.length) {
          this.setState({ openDialogVisible: true });
          return;
        }

        AlertUtils.showError(
          'Nothing to open',
          'There are no saved robot configurations yet.'
        );
      },
      savePressed: () => {
        if (this.state.selectedConfig) {
          this.setState({ saveDialogVisible: true });
          return;
        }

        AlertUtils.showError(
          'Nothing to save',
          'Please create or select a configuration first!'
        );
      },
      deletePressed: this.promptDelete
    });

    const selectedName = this.props.selectedName;
    if (this.props.savedConfigList?.length && selectedName) {
      this.setState({
        selectedConfig: this.props.savedConfigList.find(config => (
          config.name === selectedName
        ))
      });
    }
  }

  updateSelected = (section, item, key, value) => {
    this.setState({
      selectedConfig: StateUtils.setStateDeep(this.state.selectedConfig, value, [
        'ports', section, 'data', item, key
      ])
    });
  };

  renderMotorTypes = itemIndex => (
    <View>
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        value={this.state.selectedConfig.ports[0].data[itemIndex].type}
        items={this.state.motorTypes}
        onValueChange={(_, index) => {
          this.updateSelected(0, itemIndex, 'type', index);
        }}
      />
      <RNPickerSelect
        style={this.state.configPickerStyle}
        useNativeAndroidPickerStyle={false}
        placeholder={{}}
        value={this.state.selectedConfig.ports[0].data[itemIndex].direction}
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
          this.updateSelected(0, itemIndex, 'direction', index);
        }}
      />
      {this.renderSidePicker(itemIndex)}
    </View>
  );

  renderSidePicker = itemIndex => {
    if (this.state.selectedConfig.ports[0].data[itemIndex].type !== 2) {
      return <View />;
    }

    return (
      <View>
        <Text style={styles.configLabel}>Side:</Text>
        <RNPickerSelect
          style={this.state.configPickerStyle}
          useNativeAndroidPickerStyle={false}
          placeholder={{}}
          value={this.state.selectedConfig.ports[0].data[itemIndex].side}
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
            this.updateSelected(0, itemIndex, 'side', index);
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
      value={this.state.selectedConfig.ports[1].data[itemIndex].type}
      items={this.state.sensorTypes}
      onValueChange={(_, index) => {
        this.updateSelected(1, itemIndex, 'type', index);
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
                  this.updateSelected(sectionIndex, index, 'name', text);
                }}
                value={this.state.selectedConfig.ports[sectionIndex].data[index].name}
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

  renderNewDialog = () => (
    <InputDialog
      dialogTitle={'New Configuration'}
      buttonPositiveText={'Create'}
      onRequestClose={() => this.setState({ newDialogVisible: false })}
      visible={this.state.newDialogVisible}
      onValueSet={value => {
        if (!value) {
          AlertUtils.showError('Error', 'Config name must not be empty!');
          return;
        } else if (this.configExists(value)) {
          AlertUtils.showError(
            'This robot config already exists', 
            'Please specify a new name.'
          );
          return;
        }

        const newConfig = AppConfig.defaultRobotConfig(value);
        this.props.createRobotConfig(newConfig);

        this.setState({ 
          newDialogVisible: false,
          selectedConfig: newConfig
        }, () => this.props.selectRobotConfig(value));
      }}
    />
  );

  renderOpenDialog = () => (
    <ListSelectionDialog
      dialogTitle={'Select Configuration'}
      listItems={this.props.savedConfigList}
      onRequestClose={() => this.setState({ openDialogVisible: false })}
      visible={this.state.openDialogVisible}
      onItemSelected={config => this.setState({ 
        openDialogVisible: false,
        selectedConfig: config 
      }, () => {
        this.props.selectRobotConfig(config.name);
      })}
    />
  );

  configExists = name => this.props.savedConfigList?.some(config => (
    config.name === name
  ));

  renderSaveDialog = () => (
    <InputDialog
      dialogTitle={'Save Configuration'}
      buttonPositiveText={'Save'}
      onRequestClose={() => this.setState({ saveDialogVisible: false })}
      visible={this.state.saveDialogVisible}
      value={this.state.selectedConfig?.name || ''}
      onValueSet={value => this.saveRobotConfig(value)}
    />
  );

  saveRobotConfig = name => {
    const selectedConfig = this.state.selectedConfig;

    if (!selectedConfig) {
      AlertUtils.showError(
        'Nothing to save', 
        'Please select a configuration first!'
      );
      return;
    } else if (selectedConfig.name !== name && this.configExists(name)) {
      AlertUtils.showError(
        'This robot config already exists', 
        'Please specify a new name.'
      );
      return;
    }

    const configIndex = this.props.savedConfigList.findIndex(item => (
      item.name === this.state.selectedConfig.name
    ));

    this.setState({
      saveDialogVisible: false,
      selectedConfig: {
        ...selectedConfig,
        name: name
      }
    }, () => {
      this.props.saveRobotConfig(configIndex, this.state.selectedConfig);
    });
  };

  promptDelete = () => {
    if (!this.state.selectedConfig) {
      AlertUtils.showError(
        'Nothing to delete', 
        'Please select a configuration first!'
      );
      return;
    }

    const name = this.state.selectedConfig.name;
    AlertUtils.promptDelete('Delete Configuration', `Delete "${name}"?`, () => {
      this.setState({ selectedConfig: null }, () => {
        this.props.deleteRobotConfig(name);
      });
    });
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
      stickySectionHeadersEnabled={false}
      renderSectionHeader={({section}) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      renderSectionFooter={() => <View />}
      keyExtractor={ (_, index) => index }
      removeClippedSubviews={true}
    />
  );

  renderEmpty = () => (
    <View style={styles.containerEmpty}>
      <Text style={styles.labelEmpty}>
        No robot config selected...
      </Text>
    </View>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.selectedConfig 
          ? this.renderList(this.state.selectedConfig.ports) 
          : this.renderEmpty()
        }
        {this.renderNewDialog()}
        {this.renderSaveDialog()}
        {this.renderOpenDialog()}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  savedConfigList: state.RobotConfigReducer.get('savedConfigList'),
  selectedName: state.RobotConfigReducer.get('selectedName')
});

const mapDispatchToProps = dispatch => ({
  createRobotConfig: config => dispatch(action.createRobotConfig(config)),
  selectRobotConfig: name => dispatch(action.selectRobotConfig(name)),
  saveRobotConfig: (index, config) => dispatch(action.saveRobotConfig(index, config)),
  deleteRobotConfig: name => dispatch(action.deleteRobotConfig(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(RobotConfigComponent);
