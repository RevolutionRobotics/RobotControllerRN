import * as Actions from './ActionTypes';

export const setRobotServices = services => ({
  type: Actions.SET_ROBOT_SERVICES,
  services
});

export const setLastDevice = device => ({
  type: Actions.SET_LAST_DEVICE,
  device
});
