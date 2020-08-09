import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  checkauthcodeRequest: ["idDevice"],
  checkauthcodeSuccess: ["data_check_authcode"],
  checkauthcodeFailure: ["error"],
});

export const CheckAuthCodeTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  data_check_authcode: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { data_check_authcode }) => {
  return state.merge({
    fetching: false,
    error: false,
    data_check_authcode: data_check_authcode,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHECKAUTHCODE_REQUEST]: request,
  [Types.CHECKAUTHCODE_SUCCESS]: success,
  [Types.CHECKAUTHCODE_FAILURE]: failure,
});