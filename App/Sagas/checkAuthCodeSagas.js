import { put, call, select } from "redux-saga/effects";
import CheckAuthCodeActions from "../Redux/checkAuthCode";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* check_auth_code(action) {
  const newBody = {
    idDevice: action.idDevice,
  };
  try {
    const data = yield Axios({
      method: "POST",
      url: `${BASE_URL}/api/license/check`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(newBody)
    });
    yield put(CheckAuthCodeActions.checkauthcodeSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      CheckAuthCodeActions.checkauthcodeFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
