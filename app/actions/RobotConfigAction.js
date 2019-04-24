import * as Actions from './ActionTypes';

export const createRobotConfig = config => ({
  type: Actions.CREATE_ROBOT_CONFIG,
  config
});

export const setRobotConfig = name => ({
  type: Actions.SELECT_ROBOT_CONFIG,
  name
});

export const updateRobotConfig = (path, value) => ({
  type: Actions.UPDATE_ROBOT_CONFIG,
  path,
  value
});

export const deleteRobotConfig = config => ({
  type: Actions.DELETE_ROBOT_CONFIG,
  config
});
