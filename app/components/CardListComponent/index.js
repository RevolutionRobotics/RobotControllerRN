import React, { Component } from 'react';
import {  
  FlatList, 
  TouchableOpacity, 
  Text 
} from 'react-native';
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
    navigation: ''
  }
];

export default class CardListComponent extends Component {

  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <HeaderButtons HeaderButtonComponent={MaterialHeaderButton}>
        <Item 
          title="connect" 
          iconName="bluetooth" 
          onPress={() => navigation.navigate('BleSettings')} 
        />
      </HeaderButtons>
    )
  });

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
