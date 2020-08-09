import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getlistplacestopRequest: ["end","start","idDevice","token"],
  getlistplacestopSuccess: ["data_get_list_place_stop"],
  getlistplacestopFailure: ["error"],
});

export const GetListPlaceStopTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  data_get_list_place_stop: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { data_get_list_place_stop }) => {
  return state.merge({
    fetching: false,
    error: false,
    data_get_list_place_stop: data_get_list_place_stop,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GETLISTPLACESTOP_REQUEST]: request,
  [Types.GETLISTPLACESTOP_SUCCESS]: success,
  [Types.GETLISTPLACESTOP_FAILURE]: failure,
});