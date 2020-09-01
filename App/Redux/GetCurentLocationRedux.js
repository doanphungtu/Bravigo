import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getcurentlocationRequest: ["end","start","idDevice","token"],
  getcurentlocationSuccess: ["dataGetCurentLocation"],
  getcurentlocationFailure: ["error"],
});

export const GetCurentLocationTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  dataGetCurentLocation: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { dataGetCurentLocation }) => {
  return state.merge({
    fetching: false,
    error: false,
    dataGetCurentLocation,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GETCURENTLOCATION_REQUEST]: request,
  [Types.GETCURENTLOCATION_SUCCESS]: success,
  [Types.GETCURENTLOCATION_FAILURE]: failure,
});