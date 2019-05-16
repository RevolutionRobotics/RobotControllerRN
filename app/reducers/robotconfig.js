import * as Actions from 'actions/ActionTypes';
import { fromJS } from 'immutable';
import { AsyncStorage } from 'react-native';

const savedListKey = 'savedConfigList';
const savedSelectionKey = 'selectedName';

const save = state => {
  AsyncStorage.setItem(savedListKey, JSON.stringify(state.toJS()));
  return state;
};

const initialState = fromJS({
  savedConfigList: [],
  selectedName: null
});

const RobotConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CREATE_ROBOT_CONFIG:
      return save(state
        .set(savedListKey, [
          ...(state.get(savedListKey) || []), 
          action.config
        ])
        .set(savedSelectionKey, action.config.name)
      );
    case Actions.SELECT_ROBOT_CONFIG:
      return save(state.set(savedSelectionKey, action.name));
    case Actions.SAVE_ROBOT_CONFIG:
      return save(state
        .setIn([savedListKey, action.index], action.config)
        .set(savedSelectionKey, action.config.name)
      );
    case Actions.DELETE_ROBOT_CONFIG:
      return save(state
        .set(savedListKey, state.get(savedListKey).filter(config => (
          config.name !== action.name
        )))
        .set(savedSelectionKey, null)
      );
    case Actions.SET_ROBOT_CONFIG_LIST:
      return state
        .set(savedListKey, action.data[savedListKey])
        .set(savedSelectionKey, action.data[savedSelectionKey]);
    default:
      return state;
  }
};

export default RobotConfigReducer;
