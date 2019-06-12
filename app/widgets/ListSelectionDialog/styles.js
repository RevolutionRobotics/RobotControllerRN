import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
  listDialogBackdrop: dialogStyle.dialogBackdrop,
  listDialogContainer: {
    width: 300,
    height: 300,
    ...dialogStyle.dialogContainer
  },
  listDialogTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  listDialogTitle: {
    ...defaultValues.dialogTitle,
    flex: 1,
    paddingHorizontal: 10
  },
  listDialogItem: {
    padding: 15
  },
  listDialogItemsContainer: { 
    width: '100%', 
    height: 180, 
    flexDirection: 'row', 
    borderTopWidth: 1,
    borderColor: '#cacaca'
  },
  listDialogItemLabel: {
    color: 'white'
  },
  listDialogButton: defaultValues.dialogButton,
  listDialogButtonLabel: {
    ...defaultValues.dialogButtonLabel,
    bottom: 10,
    fontSize: 30
  }
});
