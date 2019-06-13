import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
  inputDialogBackdrop: dialogStyle.dialogBackdrop,
  inputDialogContainer: {
    width: 300,
    ...dialogStyle.dialogContainer
  },
  inputDialogTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputDialogTitle: {
    ...defaultValues.dialogTitle,
    flex: 1,
    paddingHorizontal: 10
  },
  inputDialogItem: {
    padding: 15
  },
  inputDialogMainContainer: { 
    width: '100%', 
    height: 60, 
    flexDirection: 'row'
  },
  textInput: {
    flex: 1,
    color: 'white',
    ...dialogStyle.dialogContainer,
    height: 40,
    marginTop: 5,
    paddingHorizontal: 15,
    paddingVertical: 0
  },
  inputDialogButton: defaultValues.dialogButton,
  inputDialogButtonLabel: {
    ...defaultValues.dialogButtonLabel,
    bottom: 10,
    fontSize: 30
  },
  inputDialogButtonContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  inputDialogButtonPositive: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingHorizontal: 10
  },
  inputDialogLabelPositive: {
    height: 30,
    fontSize: 20,
    color: 'white'
  }
});
