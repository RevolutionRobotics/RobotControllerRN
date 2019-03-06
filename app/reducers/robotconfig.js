import * as Actions from 'actions/ActionTypes';
import { Map, List } from 'immutable';

import base64 from 'base64-js';

const motorCount = 6;
const sensorCount = 4;

const savedKey = 'savedConfig';
const save = state => {
  AsyncStorage.setItem(savedKey, JSON.stringify(state.toJS().savedConfig));
  return state;
};

const initialState = Map({
  savedConfig: List([
    {
      title: 'Motors',
      data: Array(motorCount).fill({
        name: '',
        type: 0,
        clockwise: true
      })
    },
    {
      title: 'Sensors',
      data: Array(sensorCount).fill({
        name: '',
        type: 0
      })
    }
  ])
});

const RobotConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ROBOT_CONFIG:
      return state.set(savedKey, action.data);
    case Actions.UPDATE_ROBOT_CONFIG:
      return save(state.set(savedKey, action.data));
    default:
      return state;
  }
};

export default RobotConfigReducer;
