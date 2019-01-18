import { StyleSheet } from 'react-native';

const appStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  blockly: {
    width: '100%',
    flex: 1,
    flexDirection: 'column'
  }
});

const bleStyle = StyleSheet.create({
  container: {
    flex: 1, 
    alignSelf: 'stretch',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  deviceList: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: 20
  },
  listBottomPadding: {
    paddingBottom: 50
  },
  emptyString: {
    padding: 30,
    textAlign: 'center'
  },
  deviceItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0.3,
    },
    elevation: 3
  },
  deviceItemTitle: {
    padding: 20
  }
});

export {
  appStyle,
  bleStyle
}
