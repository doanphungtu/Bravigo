import { put, call, select } from "redux-saga/effects";
import GetCurentLocationActions from "../Redux/GetCurentLocationRedux";
import Axios from "axios";
import reactotron from "reactotron-react-native";
import { BASE_URL } from "../Config/UrlConfig";

export function* getCurentLocation(action) {
  try {
    const data = yield Axios({
      method: "GET",
      url: `${BASE_URL}/api/journey?end=${action.end}&start=${action.start}&idDevice=${action.idDevice}`,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": action.token
      },
    });
    yield put(GetCurentLocationActions.getcurentlocationSuccess(data));
  } catch (err) {
    console.tron.log("err", err)
    yield put(
      GetCurentLocationActions.getcurentlocationFailure({
        errMessage: `Code sai. (${JSON.stringify(err.response.data)})`
      })
    );
  }
}
