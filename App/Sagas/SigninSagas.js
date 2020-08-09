import { put, call, select } from "redux-saga/effects";
import SigninActions from "../Redux/SigninRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* signin(action) {
  const newBody = {
    email: action.email,
    password: action.password
  };
  try {
    const data = yield Axios({
      method: "POST",
      url: `${BASE_URL}/api/license/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(newBody)
    });
    if (Number(data.status) === 200) {
      if (data.data.token) {
        AsyncStorage.setItem("idDevice", data.data.idDevice);
        AsyncStorage.setItem("token", data.data.token);
      }
    }
    yield put(SigninActions.signinSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      SigninActions.signinFailure({
        errMessage: `Đăng nhập thất bại. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
