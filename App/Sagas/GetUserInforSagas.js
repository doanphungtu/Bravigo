import { put, call, select } from "redux-saga/effects";
import GetUserInforActions from "../Redux/GetUserInforRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* get_userinfor(action) {
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
    yield put(GetUserInforActions.getuserinforSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      GetUserInforActions.getuserinforFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
