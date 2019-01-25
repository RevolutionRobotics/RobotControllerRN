import * as Actions from './ActionTypes';

export const setUartCharacteristic = characteristic => ({
  type: Actions.SET_UART_CHARACTERISTIC,
  characteristic
});
