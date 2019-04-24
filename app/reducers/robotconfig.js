import * as Actions from 'actions/ActionTypes';
import { fromJS } from 'immutable';
import { AsyncStorage } from 'react-native';

const motorCount = 6;
const sensorCount = 4;

const savedListKey = 'savedConfigList';
const save = state => {
  AsyncStorage.setItem(savedListKey, JSON.stringify(state.get('savedConfig').toJS()));
  return state;
};

const initialState = fromJS({
  savedConfigList: []
});

const RobotConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CREATE_ROBOT_CONFIG:
      const configList = state.get(savedListKey).toJS();
      return save(state.set(savedListKey, fromJS([
        ...configList,
        action.config
      ])));
    case Actions.SET_ROBOT_CONFIG:
      return state.set(savedListKey, fromJS(action.config));
    case Actions.UPDATE_ROBOT_CONFIG:
      return save(state.setIn([savedListKey, ...action.path], action.value));
    default:
      return state;
  }
};

export default RobotConfigReducer;
