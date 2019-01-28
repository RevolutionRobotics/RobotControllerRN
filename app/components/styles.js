import { StyleSheet } from 'react-native';

const defaultValues = {
  appPrimary: '#f90000',
  appBackground: '#f5f5f5',
  cardBackground: 'white',
  headerButton: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20
  },
  shadow: {
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
    alignItems: 'center',
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
    borderRadius: 2,
    ...defaultValues.shadow
  },
  cardLabel: {
    textAlign: 'center'
  },
  btnConnect: defaultValues.headerButton
});

const controllerStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  joystickContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickBase: {
    backgroundColor: '#eeeeee',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  joystickHandle: {
    backgroundColor: defaultValues.appPrimary,
    ...defaultValues.shadow
  },
  btnContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btnContainerColumn: {
    width: 50,
    marginHorizontal: 15,
    justifyContent: 'center'
  },
  btnProgrammable: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 15,
    backgroundColor: defaultValues.appPrimary,
    ...defaultValues.shadow
  }
});

const blocklyStyle = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#dddddd'
  },
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
  },
  btnCode: defaultValues.headerButton
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
    borderRadius: 2,
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
