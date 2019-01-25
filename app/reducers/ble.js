import * as Actions from '../actions/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  uartCharacteristic: null
});

const BleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_UART_CHARACTERISTIC:
      return state.set('uartCharacteristic', action.characteristic);
    default:
      return state;
  }
}

export default BleReducer;
