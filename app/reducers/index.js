import { combineReducers, createStore } from 'redux';

import BleReducer from './ble';
import BlocklyReducer from './blockly';

const AppReducers = combineReducers({
  BleReducer,
  BlocklyReducer
});

const rootReducer = (state, action) => {
  return AppReducers(state, action);
}

export default createStore(rootReducer);
