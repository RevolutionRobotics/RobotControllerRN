import { combineReducers } from 'redux';

import BleReducer from './ble';
import BlocklyReducer from './blockly';

export default combineReducers({
  BleReducer,
  BlocklyReducer
});
