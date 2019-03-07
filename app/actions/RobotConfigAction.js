import * as Actions from './ActionTypes';

export const setRobotConfig = config => ({
  type: Actions.SET_ROBOT_CONFIG,
  config
});

export const updateRobotConfig = (path, value) => ({
  type: Actions.UPDATE_ROBOT_CONFIG,
  path,
  value
});
