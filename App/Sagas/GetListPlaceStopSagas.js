import { put, call, select } from "redux-saga/effects";
import GetListPlaceStopActions from "../Redux/GetListPlaceStopRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";
import AsyncStorage from '@react-native-community/async-storage';

export function* get_list_place_stop(action) {
  try {
    const data = yield Axios({
      method: "GET",
      url: `${BASE_URL}/api/current-position?end=${action.end}&start=${action.start}&idDevice=${action.idDevice}`,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": action.token
      },
    });
    yield put(GetListPlaceStopActions.getlistplacestopSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      GetListPlaceStopActions.getlistplacestopFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
