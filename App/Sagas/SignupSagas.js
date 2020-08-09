import { put, call, select } from "redux-saga/effects";
import SignupActions from "../Redux/SignupRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* signup(action) {
  const newBody = {
    email: action.email,
    password: action.password,
    codeActive: action.codeActive
  };
  try {
    const data = yield Axios({
      method: "POST",
      url: `${BASE_URL}/api/license/registration`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(newBody)
    });
    yield put(SignupActions.SignupSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      SignupActions.SignupFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
