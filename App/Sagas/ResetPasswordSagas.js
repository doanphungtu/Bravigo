import { put, call, select } from "redux-saga/effects";
import ResetPasswordActions from "../Redux/ResetPasswordRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* reset_password(action) {
  const newBody = {
    password: action.password,
    newPassword: action.new_password,
    confirmPassword: action.confirm_password,
  };
  try {
    const data = yield Axios({
      method: "POST",
      url: `${BASE_URL}/api/reset-password`,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": action.token
      },
      data: JSON.stringify(newBody)
    });
    yield put(ResetPasswordActions.resetpasswordSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      ResetPasswordActions.resetpasswordFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
