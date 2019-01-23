import { StyleSheet } from 'react-native';

const defaultValues = {
  appBackground: '#f5f5f5',
  cardBackground: 'white',
  shadow: {
    borderRadius: 2,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0.3,
    },
    elevation: 3
  }
};

const cardListStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultValues.appBackground
  },
  card: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 180,
    backgroundColor: defaultValues.cardBackground,
    padding: 10,
    marginHorizontal: 20,
    ...defaultValues.shadow
  },
  cardLabel: {
    textAlign: 'center'
  },
  btnConnect: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20
  }
});

const controllerStyle = StyleSheet.create({

});

const blocklyStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: defaultValues.appBackground,
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
    alignItems: 'center',
    backgroundColor: defaultValues.appBackground
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
    backgroundColor: defaultValues.cardBackground,
    marginTop: 20,
    marginHorizontal: 20,
    ...defaultValues.shadow
  },
  deviceItemTitle: {
    padding: 20
  }
});

export {
  cardListStyle,
  controllerStyle,
  blocklyStyle,
  bleStyle
}
