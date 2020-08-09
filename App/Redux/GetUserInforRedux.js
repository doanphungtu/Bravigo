import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getuserinforRequest: ["idDevice"],
  getuserinforSuccess: ["data_get_userinfor"],
  getuserinforFailure: ["error"],
});

export const GetUserInforTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  data_get_userinfor: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { data_get_userinfor }) => {
  return state.merge({
    fetching: false,
    error: false,
    data_get_userinfor: data_get_userinfor,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GETUSERINFOR_REQUEST]: request,
  [Types.GETUSERINFOR_SUCCESS]: success,
  [Types.GETUSERINFOR_FAILURE]: failure,
});