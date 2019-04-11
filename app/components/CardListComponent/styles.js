import { StyleSheet } from 'react-native';
import { defaultValues, dialogStyle } from 'components/appStyles';

export default StyleSheet.create({
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
