import * as Actions from 'actions/ActionTypes';
import { fromJS } from 'immutable';
import { AsyncStorage } from 'react-native';

const savedListKey = 'savedConfigList';
const save = state => {
  AsyncStorage.setItem(savedListKey, JSON.stringify(state.toJS().savedConfigList));
  return state;
};

const initialState = fromJS({
  savedConfigList: [],
  selectedIndex: 0
});

const RobotConfigReducer = (state = initialState, action) => {
  const savedConfig = state.get(savedListKey) || [];

  switch (action.type) {
    case Actions.CREATE_ROBOT_CONFIG:
      return save(state.set(savedListKey, [...savedConfig, action.config]));
    case Actions.SET_ROBOT_CONFIG:
      return state.set(savedListKey, fromJS(action.config));
    case Actions.UPDATE_ROBOT_CONFIG:
      return save(state.setIn([savedListKey, ...action.path], action.value));
    default:
      return state;
  }
};

export default RobotConfigReducer;
