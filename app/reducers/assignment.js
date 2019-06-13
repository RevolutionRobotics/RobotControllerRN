import * as Actions from 'actions/ActionTypes';
import Immutable from 'immutable';
import AsyncStorage from '@react-native-community/async-storage';

const assignmentKey = 'assignments';
const save = state => {
  AsyncStorage.setItem(assignmentKey, JSON.stringify(state.toJS().assignments));
  return state;
};

const removeAssignment = (state, action) => state.get(assignmentKey)
  .filter(item => (
    item.layoutId !== action.layoutId || item.btnId !== action.btnId
  ));

const initialState = Immutable.fromJS({
  assignments: []
});

const ButtonAssignmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ASSIGNMENTS:
      return state.set(assignmentKey, action.assignments);
    case Actions.ADD_BUTTON_ASSIGNMENT:
      return save(state.set(assignmentKey, [
        ...removeAssignment(state, action),
        {
          layoutId: action.layoutId,
          btnId: action.btnId,
          blocklyName: action.blocklyName
        }
      ]));
    case Actions.REMOVE_BUTTON_ASSIGNMENT:
      return save(state.set(assignmentKey, removeAssignment(state, action)));
    case Actions.UPDATE_BACKGROUND_TASKS:
      return save(state.set(assignmentKey, [
        ...state.get(assignmentKey).filter(item => item.btnId !== -1),
        ...action.assignments
      ]));
    default:
      return state;
  }
};

export default ButtonAssignmentReducer;
