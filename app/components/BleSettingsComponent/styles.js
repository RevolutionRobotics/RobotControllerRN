import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
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
