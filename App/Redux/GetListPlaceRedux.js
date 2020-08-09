import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  getlistplaceRequest: ["end","start","idDevice","token"],
  getlistplaceSuccess: ["data_get_list_place"],
  getlistplaceFailure: ["error"],
});

export const GetListPlaceTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  error: false,
  fetching: false,
  data_get_list_place: null
});
/* ------------- Selectors ------------- */

/* ------------- Reducers ------------- */

// we're attempting to signin
export const request = state => state.merge({ fetching: true, error: false });

// we've successfully logged in
export const success = (state, { data_get_list_place }) => {
  return state.merge({
    fetching: false,
    error: false,
    data_get_list_place: data_get_list_place,
  });
};

// we've had a problem logging in
export const failure = (state, { error }) =>
  state.merge({ fetching: false, error });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.GETLISTPLACE_REQUEST]: request,
  [Types.GETLISTPLACE_SUCCESS]: success,
  [Types.GETLISTPLACE_FAILURE]: failure,
});