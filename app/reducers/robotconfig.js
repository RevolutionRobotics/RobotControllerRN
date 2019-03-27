import * as Actions from 'actions/ActionTypes';
import { fromJS } from 'immutable';
import { AsyncStorage } from 'react-native';

const motorCount = 6;
const sensorCount = 4;

const savedKey = 'savedConfig';
const save = state => {
  AsyncStorage.setItem(savedKey, JSON.stringify(state.get('savedConfig').toJS()));
  return state;
};

const initialState = fromJS({
  savedConfig: [
    {
      title: 'Motors',
      data: Array(motorCount).fill({
        name: '',
        type: 0, // ['None', 'Motor', 'Drivetrain']
        direction: 0, // ['Clockwise', 'Counter clockwise']
        side: 0 // ['Left', 'Right']
      })
    },
    {
      title: 'Sensors',
      data: Array(sensorCount).fill({
        name: '',
        type: 0 // ['None', 'Ultrasonic', 'Button']
      })
    }
  ]
});

const RobotConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ROBOT_CONFIG:
      return state.set('savedConfig', fromJS(action.config));
    case Actions.UPDATE_ROBOT_CONFIG:
      return save(state.setIn(['savedConfig', ...action.path], action.value));
    default:
      return state;
  }
};

export default RobotConfigReducer;
