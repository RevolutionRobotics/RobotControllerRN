import React, { Component } from 'react';
import { 
  View, 
  FlatList, 
  TouchableOpacity, 
  Text 
} from 'react-native';
import { cardListStyle as styles } from '../styles';

const listData = [
  {
    title: 'Remote Controller',
    navigation: 'Controller'
  },
  {
    title: 'Blockly',
    navigation: 'Blockly'
  }
];

export default class CardListComponent extends Component {

  static navigationOptions = ({navigation}) => ({
    headerRight: (
      <TouchableOpacity
        onPress={() => navigation.navigate('BleSettings', {})}
      >
        <Text style={styles.btnConnect}>Connect</Text>
      </TouchableOpacity>
    )
  });

  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => this.props.navigation.navigate(item.navigation, {})}
      >
        <Text style={styles.cardLabel}>{item.title}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={listData}
          renderItem={this.renderItem}
          horizontal={true}
          removeClippedSubviews={true}
          keyExtractor={(item, index) => item.title}
        />
      </View>
    );
  }
}
