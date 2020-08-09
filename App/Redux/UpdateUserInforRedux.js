import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateuserinforRequest: ["lastName", "firstname", "licesePlates", "phoneNumber", "token"],
  updateuserinforSuccess: ["data_update_user_infor"],
  updateuserinforFailure: ["error"],
});

export const UpdateUserInforTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  data_update_user_infor: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { data_update_user_infor }) => {
  return state.merge({
    fetching: false,
    error: false,
    data_update_user_infor: data_update_user_infor,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATEUSERINFOR_REQUEST]: request,
  [Types.UPDATEUSERINFOR_SUCCESS]: success,
  [Types.UPDATEUSERINFOR_FAILURE]: failure,
});