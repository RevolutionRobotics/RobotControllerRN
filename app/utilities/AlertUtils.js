import { Alert } from 'react-native';

export default class AlertUtils {

  static showError = (title, message) => Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: null }],
    { cancelable: false }
  );
}
