import { StyleSheet } from 'react-native';
import { defaultValues } from 'components/appStyles';

export default StyleSheet.create({
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
