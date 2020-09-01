import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { SigninTypes } from '../Redux/SigninRedux'
import { CheckAuthCodeTypes } from '../Redux/checkAuthCode'
import { SignupTypes } from '../Redux/SignupRedux'
import { UpdateUserInforTypes } from '../Redux/UpdateUserInforRedux'
import { GetUserInforTypes } from '../Redux/GetUserInforRedux'
import { ResetPasswordTypes } from '../Redux/ResetPasswordRedux'
import { GetListPlaceTypes } from '../Redux/GetListPlaceRedux'
import { GetListPlaceStopTypes } from '../Redux/GetListPlaceStopRedux'
import { GetCurentLocationTypes } from '../Redux/GetCurentLocationRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import { signin } from './SigninSagas'
import { check_auth_code } from './checkAuthCodeSagas'
import { signup } from './SignupSagas'
import { update_user_infor } from './UpdateUserInforSagas'
import { get_userinfor } from './GetUserInforSagas'
import { reset_password } from './ResetPasswordSagas'
import { get_list_place } from './GetListPlaceSagas'
import { get_list_place_stop } from './GetListPlaceStopSagas'
import { getCurentLocation } from './GetCurentLocationSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    //signin
    takeLatest(SigninTypes.SIGNIN_REQUEST, signin),

    //check_auth_code
    takeLatest(CheckAuthCodeTypes.CHECKAUTHCODE_REQUEST, check_auth_code),

    //signup
    takeLatest(SignupTypes.SIGNUP_REQUEST, signup),

    //update_user_infor
    takeLatest(UpdateUserInforTypes.UPDATEUSERINFOR_REQUEST, update_user_infor),

    //get_userinfor
    takeLatest(GetUserInforTypes.GETUSERINFOR_REQUEST, get_userinfor),

    //reset_password
    takeLatest(ResetPasswordTypes.RESETPASSWORD_REQUEST, reset_password),

    //get_list_place
    takeLatest(GetListPlaceTypes.GETLISTPLACE_REQUEST, get_list_place),

    //get_list_place_stop
    takeLatest(GetListPlaceStopTypes.GETLISTPLACESTOP_REQUEST, get_list_place_stop),

    takeLatest(GetCurentLocationTypes.GETCURENTLOCATION_REQUEST, getCurentLocation),

  ])
}
