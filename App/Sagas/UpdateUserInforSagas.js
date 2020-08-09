import { put, call, select } from "redux-saga/effects";
import UpdateUserInforActions from "../Redux/UpdateUserInforRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* update_user_infor(action) {
  const newBody = {
    lastName: action.lastName,
    firstname: action.firstname,
    licesePlates: action.licesePlates,
    phoneNumber: action.phoneNumber,
  };
  try {
    const data = yield Axios({
      method: "PATCH",
      url: `${BASE_URL}/api/license/update`,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": action.token
      },
      data: JSON.stringify(newBody)
    });
    yield put(UpdateUserInforActions.updateuserinforSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      UpdateUserInforActions.updateuserinforFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
