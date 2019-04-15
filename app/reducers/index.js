import { combineReducers, createStore } from 'redux';

import ButtonAssignmentReducer from './assignment';
import BleReducer from './ble';
import BlocklyReducer from './blockly';
import RobotConfigReducer from './robotconfig';

const AppReducers = combineReducers({
  ButtonAssignmentReducer,
  BleReducer,
  BlocklyReducer,
  RobotConfigReducer
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
}

export default createStore(rootReducer);
