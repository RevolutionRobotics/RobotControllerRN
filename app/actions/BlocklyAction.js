import * as Actions from './ActionTypes';

export const saveBlocklyXml = data => ({
  type: Actions.SAVE_BLOCKLY_XML,
  data
});

export const setBlocklyList = list => ({
  type: Actions.SET_BLOCKLY_LIST,
  list
});

export const deleteBlocklyXml = name => ({
  type: Actions.DELETE_BLOCKLY_XML,
  name
});
