import * as Actions from 'actions/ActionTypes';
import Immutable from 'immutable';
import { AsyncStorage } from 'react-native';

const savedKey = 'savedList';
const save = state => {
  AsyncStorage.setItem(savedKey, JSON.stringify(state.toJS().savedList));
  return state;
};

const initialState = Immutable.fromJS({
  savedList: []
});

const saveBlockly = (state, action) => {
  const blocklyArray = state.get(savedKey) || [];
  const existingIndex = blocklyArray.findIndex(item => (
    item.name === action.data.name
  ));

  // Save new
  if (existingIndex === -1) {
    return state.set(savedKey, [...blocklyArray, action.data]);
  }

  // Save existing
  return state.set(savedKey, Object.assign([], state.get(savedKey), {
    [existingIndex]: action.data
  }));
};

const BlocklyReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SAVE_BLOCKLY_XML:
      return save(saveBlockly(state, action));
    case Actions.SET_BLOCKLY_LIST:
      return state.set(savedKey, action.list);
    case Actions.DELETE_BLOCKLY_XML:
      return save(state.set(
        savedKey, 
        state.get(savedKey).filter(item => item.name !== action.name)
      ));
    default:
      return state;
  }
};

export default BlocklyReducer;
