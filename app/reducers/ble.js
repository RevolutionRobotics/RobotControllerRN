import * as Actions from 'actions/ActionTypes';
import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  robotServices: null
});

const BleReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.SET_ROBOT_SERVICES:
      return state.set('robotServices', action.services);
    default:
      return state;
  }
};

export default BleReducer;
