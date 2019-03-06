import React, { Component } from 'react';
import {  
  FlatList, 
  TouchableOpacity, 
  Text,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';
import { SafeAreaView } from 'react-navigation';
import { cardListStyle as styles } from 'components/styles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

const listData = [
  {
    title: 'Remote Controller',
    navigation: 'Controller'
  },
  {
    title: 'Blockly Editor',
    navigation: 'Blockly'
  },
  {
    title: 'Robot Configurator',
    navigation: 'RobotConfig'
  }
];

class CardListComponent extends Component {

  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <Item 
          title="connect" 
          iconName={navigation.getParam('bleIcon') || 'bluetooth'} 
          onPress={() => {
            const bleManager = navigation.getParam('bleManager');

            if (bleManager.state !== 'PoweredOn') {
              bleManager.enable();
            } 

            if (!navigation.getParam('isConnected')()) {
              navigation.navigate('BleSettings', {
                bleManager: bleManager
              });
            }
          }} 
        />
      </HeaderButtons>
    )
  });

  constructor(props) {
    super(props);

    this.state = {
      bleManager: new BleManager()
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.uartCharacteristic === nextProps.uartCharacteristic) {
      return;
    }

    const bleIcon = (nextProps.uartCharacteristic) 
      ? 'bluetooth-connected' 
      : 'bluetooth';

    this.props.navigation.setParams({
      bleIcon: bleIcon
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({
      bleManager: this.state.bleManager,
      isConnected: this.isConnected
    });

    this.state.bleManager.onStateChange(state => {
      this.props.navigation.setParams({
        bleIcon: (state === 'PoweredOn') ? 'bluetooth' : 'bluetooth-disabled'
      });
    }, true)
  }

  isConnected = () => {
    if (!this.props.uartCharacteristic) {
      return false;
    }
    
    Alert.alert(
      'Disconnect?',
      'Current device must be disconnected to continue',
      [
        { text: 'OK', onPress: this.disconnect},
        { text: 'Cancel', onPress: () => null }
      ],
      { cancelable: false }
    );

    return true;
  };

  disconnect = () => {
    this.state.bleManager
      .cancelDeviceConnection(this.props.uartCharacteristic.deviceID);
  };

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => this.props.navigation.navigate(item.navigation)}
      >
        <Text style={styles.cardLabel}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={listData}
          renderItem={this.renderItem}
          horizontal={true}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => item.title}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(CardListComponent);
