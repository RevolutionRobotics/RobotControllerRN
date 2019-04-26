import * as Actions from './ActionTypes';

export const createRobotConfig = config => ({
  type: Actions.CREATE_ROBOT_CONFIG,
  config
});

export const selectRobotConfig = name => ({
  type: Actions.SELECT_ROBOT_CONFIG,
  name
});

export const saveRobotConfig = (index, config) => ({
  type: Actions.SAVE_ROBOT_CONFIG,
  index,
  config
});

export const deleteRobotConfig = name => ({
  type: Actions.DELETE_ROBOT_CONFIG,
  name
});

export const setRobotConfigList = data =>({
  type: Actions.SET_ROBOT_CONFIG_LIST,
  data
});
