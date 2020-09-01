import { combineReducers } from 'redux'
import configureStore from './CreateStore'
import rootSaga from '../Sagas/'

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  nav: require('./NavigationRedux').reducer,
  github: require('./GithubRedux').reducer,
  search: require('./SearchRedux').reducer,
  signin: require('./SigninRedux').reducer,
  check_auth_code: require('./checkAuthCode').reducer,
  signup: require('./SignupRedux').reducer,
  update_user_infor: require('./UpdateUserInforRedux').reducer,
  get_user_infor: require('./GetUserInforRedux').reducer,
  reset_password: require('./ResetPasswordRedux').reducer,
  get_list_place: require('./GetListPlaceRedux').reducer,
  get_list_place_stop: require('./GetListPlaceStopRedux').reducer,
  getCurentLocation: require('./GetCurentLocationRedux').reducer,
})

export default () => {
  let { store, sagasManager, sagaMiddleware } = configureStore(reducers, rootSaga)

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').reducers
      store.replaceReducer(nextRootReducer)

      const newYieldedSagas = require('../Sagas').default
      sagasManager.cancel()
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas)
      })
    })
  }

  return store
}
