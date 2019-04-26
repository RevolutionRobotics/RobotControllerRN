import * as Actions from './ActionTypes';

export const setAssignments = assignments => ({
  type: Actions.SET_ASSIGNMENTS,
  assignments
});

export const addButtonAssignment = (layoutId, btnId, blocklyName) => ({
  type: Actions.ADD_BUTTON_ASSIGNMENT,
  layoutId,
  btnId,
  blocklyName
});

export const removeButtonAssignment = (layoutId, btnId) => ({
  type: Actions.REMOVE_BUTTON_ASSIGNMENT,
  layoutId,
  btnId
});
