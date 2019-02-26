import { StyleSheet } from 'react-native';

const defaultValues = {
  appPrimary: '#e60312',
  appBackground: '#1a1a1a',
  headerButton: {
    color: 'white',
    fontSize: 16,
    marginHorizontal: 20
  },
  shadow: {
    borderStyle: 'solid',
    borderColor: '#e60312',
    borderWidth: 1
  },
  cardCorners: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 15
  },
  androidDialog: {
    marginLeft: 20,
    marginRight: 20
  },
  iosDialog: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    opacity: 0.9
  },
  dialogTitle: {
    fontSize: 20,
    marginBottom: 15,
    color: 'white'
  },
  dialogButtonContainer: {
    flex: 1, 
    flexDirection: 'row', 
    alignSelf: 'flex-end', 
    alignItems: 'flex-end'
  },
  dialogButton: {
    paddingHorizontal: 10
  },
  dialogButtonLabel: {
    fontSize: 18,
    color: 'white'
  }
};

const dialogStyle = StyleSheet.create({
  dialogBackdrop: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  dialogContainer: {
    alignItems: 'center',
    backgroundColor: defaultValues.appBackground,
    padding: 20,
    borderRadius: 4,
    ...defaultValues.cardCorners,
    ...defaultValues.shadow
  },
  blocklyDialog: {
    alignItems: 'center',
    backgroundColor: defaultValues.appBackground,
    padding: 20,
    borderRadius: 4
  }
});

const navigatorStyle = StyleSheet.create({
  headerStyle: {
    backgroundColor: defaultValues.appBackground,
    shadowOpacity: 0,
    shadowOffset: {
      height: 0
    },
    elevation: 0,
    borderWidth: 1,
    borderBottomColor: defaultValues.appPrimary
  },
  headerTitleStyle: {
    color: 'white'
  },
  headerBackTitleStyle: {
    color: 'white'
  }
});

/** SCREEN STYLES **/

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
    backgroundColor: defaultValues.appBackground,
    padding: 10,
    marginHorizontal: 20,
    ...dialogStyle.dialogContainer
  },
  cardLabel: {
    color: 'white',
    textAlign: 'center'
  },
  btnConnect: defaultValues.headerButton
});

const controllerStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: defaultValues.appBackground
  },
  joystickContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joystickBase: {
    backgroundColor: '#444444',
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
  },
  centerImageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  centerImage: {
    width: 120,
    bottom: 60,
    marginHorizontal: 10
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
  btnCode: defaultValues.headerButton,
  androidDialog: defaultValues.androidDialog,
  iosDialog: defaultValues.iosDialog,
  textInput: {
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: '#444444',
    borderWidth: 1,
    marginVertical: 10,
    paddingVertical: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  dialogBackdrop: dialogStyle.dialogBackdrop,
  saveDialogContainer: { 
    width: 300,
    height: 200,
    ...dialogStyle.dialogContainer,
    ...dialogStyle.blocklyDialog
  },
  openDialogContainer: {
    width: 300,
    height: 300,
    ...dialogStyle.dialogContainer,
    ...dialogStyle.blocklyDialog
  },
  openDialogListContainer: { 
    width: '100%', 
    height: 180, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#cacaca'
  },
  openDialogItem: {
    padding: 15,
  },
  dialogTitle: defaultValues.dialogTitle,
  dialogInput: {
    width: '100%',
    borderStyle: 'solid',
    borderRadius: 4,
    borderColor: defaultValues.appPrimary,
    borderWidth: 1,
    color: 'white',
    marginVertical: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  dialogButtonContainer: defaultValues.dialogButtonContainer,
  dialogButton: defaultValues.dialogButton,
  dialogButtonLabel: defaultValues.dialogButtonLabel
});

const codeViewStyle = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: defaultValues.appBackground
  },
  highlighter: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: defaultValues.appBackground
  },
  highlighterContent: {
    backgroundColor: defaultValues.appBackground,
    flex: 1
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
    textAlign: 'center',
    color: 'white'
  },
  deviceItem: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: defaultValues.appBackground,
    marginTop: 20,
    marginHorizontal: 20,
    ...defaultValues.cardCorners,
    ...defaultValues.shadow
  },
  deviceItemTitle: {
    color: 'white',
    padding: 20
  },
  dialogBackdrop: dialogStyle.dialogBackdrop,
  connectingDialogContainer: { 
    width: 300,
    ...dialogStyle.dialogContainer
  },
  dialogTitle: defaultValues.dialogTitle,
  connectingIndicatorContainer: { 
    width: '100%',
    margin: 20, 
    height: 50 
  },
  dialogButtonContainer: {
    height: 20, 
    flexDirection: 'column', 
    alignSelf: 'flex-end', 
    alignItems: 'flex-end'
  },
  dialogButton: defaultValues.dialogButton,
  dialogButtonLabel: defaultValues.dialogButtonLabel
});

export {
  navigatorStyle,
  cardListStyle,
  controllerStyle,
  blocklyStyle,
  codeViewStyle,
  bleStyle
}
