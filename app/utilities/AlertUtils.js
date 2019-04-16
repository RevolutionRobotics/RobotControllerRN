import { Alert } from 'react-native';

export default class AlertUtils {

  static showError = (title, message) => Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: null }],
    { cancelable: false }
  );

  static prompt = (title, message, label, callback) => Alert.alert(
    title,
    message,
    [
      { text: label, onPress: callback },
      { text: 'Cancel', onPress: null }
    ],
    { cancelable: false }
  );

  static promptConfirm = (title, message, callback) => {
    AlertUtils.prompt(title, message, 'OK', callback);
  };

  static promptDelete = (title, message, callback) => {
    AlertUtils.prompt(title, message, 'Delete', callback);
  };
}
