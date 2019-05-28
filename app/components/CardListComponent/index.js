import React, { Component } from 'react';
import {  
  FlatList, 
  TouchableOpacity, 
  ImageBackground,
  View,
  Text,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import { BleManager } from 'react-native-ble-plx';
import { SafeAreaView } from 'react-navigation';
import styles from './styles';
import AppConfig from 'utilities/AppConfig';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderButtons, { HeaderButton, Item } from 'react-navigation-header-buttons';

const MaterialHeaderButton = props => (
  <HeaderButton {...props} IconComponent={MaterialIcons} iconSize={23} color="white" />
);

const listData = [
  {
    title: 'Remote Controller',
    navigation: 'Controller',
    background: require('images/cardBorderRed/cardBorderRed.png')
  },
  {
    title: 'Blockly Editor',
    navigation: 'Blockly',
    background: require('images/cardBorderYellow/cardBorderYellow.png')
  },
  {
    title: 'Robot Configurator',
    navigation: 'RobotConfig',
    background: require('images/cardBorderBlue/cardBorderBlue.png')
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

  componentDidUpdate(prevProps) {
    if (prevProps.robotServices !== this.props.robotServices) {
      this.props.navigation.setParams({
        bleIcon: this.bleIcon()
      });
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      bleManager: this.state.bleManager,
      isConnected: this.isConnected,
      bleIcon: this.bleIcon()
    });

    this.state.bleManager.onStateChange(state => {
      this.props.navigation.setParams({
        bleIcon: (state === 'PoweredOn') ? 'bluetooth' : 'bluetooth-disabled'
      });
    }, true)
  }

  bleIcon = () => this.props.robotServices
    ? 'bluetooth-connected'
    : 'bluetooth';

  isConnected = () => {
    if (!this.props.robotServices) {
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
    const liveMessageService = this.props.robotServices.find(item => (
      item.uuid === AppConfig.services.liveMessage.id
    ));

    if (liveMessageService) {
      this.state.bleManager.cancelDeviceConnection(liveMessageService.deviceID);
    }
  };

  renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => this.props.navigation.navigate(item.navigation)}
    >
      <ImageBackground
        source={item.background}
        resizeMode='contain'
        style={styles.cardBackground}
      >
        <View style={styles.cardContent}>
          <Text style={styles.cardLabel}>{item.title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={listData}
          renderItem={this.renderItem}
          horizontal={true}
          removeClippedSubviews={true}
          keyExtractor={item => item.title}
        />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  robotServices: state.BleReducer.get('robotServices')
});

const mapDispatchToProps = dispatch => ({
  // TODO: Implement mapping... 
});

export default connect(mapStateToProps, mapDispatchToProps)(CardListComponent);
