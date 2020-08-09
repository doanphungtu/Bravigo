import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  resetpasswordRequest: ["password", "new_password", "confirm_password", "token"],
  resetpasswordSuccess: ["reset_password"],
  resetpasswordFailure: ["error"],
});

export const ResetPasswordTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  reset_password: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { reset_password }) => {
  return state.merge({
    fetching: false,
    error: false,
    reset_password: reset_password,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RESETPASSWORD_REQUEST]: request,
  [Types.RESETPASSWORD_SUCCESS]: success,
  [Types.RESETPASSWORD_FAILURE]: failure,
});