import Immutable from 'immutable';
import AsyncStorage from '@react-native-community/async-storage';
import * as Actions from 'actions/ActionTypes';

const lastDeviceKey = 'lastDevice';
const save = state => {
  AsyncStorage.setItem(lastDeviceKey, state.toJS().lastDevice);
  return state;
};

const initialState = Immutable.fromJS({
  robotServices: null,
  lastDevice: null
});

const BleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ROBOT_SERVICES:
      return state.set('robotServices', action.services);
    case Actions.SET_LAST_DEVICE:
      return save(state.set(lastDeviceKey, action.device));
    default:
      return state;
  }
};

export default BleReducer;
