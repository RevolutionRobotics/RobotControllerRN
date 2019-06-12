import { StyleSheet, Platform } from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';

/**
  To fix Dimensions bug on Android: 
  https://github.com/facebook/react-native/issues/4934
**/
const extraDimensions = StyleSheet.create({
  dialogSizeAndroid: {
    width: ExtraDimensions.get('REAL_WINDOW_WIDTH'),
    height: ExtraDimensions.get('REAL_WINDOW_HEIGHT')
  },
  dialogSizeIOS: {
    flex: 1
  }
});

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
    flex: 1,
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
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
    ...((Platform.OS === 'android') 
      ? extraDimensions.dialogSizeAndroid 
      : extraDimensions.dialogSizeIOS
    ),
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

export {
  defaultValues,
  dialogStyle
}
