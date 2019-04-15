import { Alert } from 'react-native';

export default class AlertUtils {

  static showError = (title, message) => Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: null }],
    { cancelable: false }
  );

  static prompt = (title, message, callback) => Alert.alert(
    title,
    message,
    [
      { text: 'OK', onPress: callback },
      { text: 'Cancel', onPress: null }
    ],
    { cancelable: false }
  );
}
