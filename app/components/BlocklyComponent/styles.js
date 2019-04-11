import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
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
