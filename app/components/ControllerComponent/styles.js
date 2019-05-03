import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: defaultValues.appBackground
  },
  multiTouch: {
    flex: 1,
    flexDirection: 'row'
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
  joystickHandleGloss: {
    width: 25,
    height: 30,
    borderRadius: 30,
    backgroundColor: 'white',
    transform: [{ rotate: '40deg' }],
    margin: 12,
    opacity: 0.7
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
  },
  dialogBackdrop: dialogStyle.dialogBackdrop,
  dialogTitle: defaultValues.dialogTitle,
  syncDialogContainer: { 
    width: 300,
    ...dialogStyle.dialogContainer
  },
  syncIndicatorContainer: { 
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
