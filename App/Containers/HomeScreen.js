import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Button,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native'
import { FlatList as FlatList1 } from 'react-native-gesture-handler'
import { connect } from 'react-redux';
import MapView, { Callout, Marker, Polyline } from 'react-native-maps';
import posed from 'react-native-pose';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Svg, { G, Path } from 'react-native-svg';
import BottomSheet from 'reanimated-bottom-sheet'
import DatePicker from '../Transforms/DatePicker/DatePicker'
import CardView from 'react-native-cardview'
import Modal from 'react-native-modal'
import moment from 'moment'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import ActionGetUserInfor from '../Redux/GetUserInforRedux'
import ActionGetListPlaceStop from '../Redux/GetListPlaceStopRedux'
import ActionGetListPlace from '../Redux/GetListPlaceRedux'
import ActionGetCurentLocation from '../Redux/GetCurentLocationRedux'
// Styles
import styles from './Styles/HomeScreenStyle'
import { Colors, Metrics, Images } from '../Themes';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity as Touchable } from 'react-native-gesture-handler'
import { get_current_date, get_current_hour } from '../Transforms/Function_Of_Tu';
import SliderCustom from '../Components/SliderCustom';
import Axios from 'axios';
import { BASE_URL } from '../Config/UrlConfig';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const GOOGLE_MAPS_APIKEY = "AIzaSyD_x8kFDvxo9vFvzMMJ98m6u4KfVmI12dY";

const Scaler = posed.View({ // define click zoom
  active: { scale: 1 },
  inactive: { scale: 0.8 }
})

const ScalerLocation = posed.View({ // define click zoom
  active: { scale: 1.1 },
  inactive: { scale: 1 }
})

const _heightScale = (value) => { return value };
const _widthScale = (value) => { return value };

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.marker = null;
    this.marker_place = [];
    this.marker_place_stop = [];
    this.marker_car = null;
    this.marker_animatedCamera = null;
    this.timer = null;
    this.bs1 = React.createRef();
    this.state = {
      name_place: '',
      speed_car: '',
      createTimeCar: '',
      message: '',
      show_modal_alert: false,
      show_direction: false,
      dateStart: get_current_date(),
      tab: 2,
      title: 'Vị trí hiện tại',
      showIconLocation: true,
      gender: '0',
      region: {
        latitude: 6.8523,
        longitude: 79.8895,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      marker_curren_location: {
        latitude: 0,
        longitude: 0
      },
      latitude_car: 0,
      longitude_car: 0,
      car_rotation: 0,
      coords: [],
      coordColor: [],
      dataPlaceStop: [],
      dataPlace: [],
      data_animatedCamera: {
        latitude: 0,
        longitude: 0,
        namePlace: '',
        creatTimeFormat: '',
        speed: 0,
        timeToStop: "unknown"
      },
      namePlaceCar: '',
      creatTimeFormatCar: '',
      speedCar: '',
      timeStopCar: "unknown",
      statusCar: 'unknown'
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, data_get_list_place_stop } = props.data_get_list_place_stop;

    const { data_get_list_place } = props.data_get_list_place;

    const { dataGetCurentLocation } = props.dataCurentLocation;

    if (error === false) {
      if (fetching === false && data_get_list_place_stop) {
        if (data_get_list_place_stop.data) {
          if (data_get_list_place_stop.data.success) {
            this.setState({ dataPlaceStop: data_get_list_place_stop.data.data });
          }
        }
      }
    }

    if (props.data_get_list_place.error === false) {
      if (props.data_get_list_place.fetching === false && data_get_list_place) {
        if (data_get_list_place.data.success) {
          this.fitAllMarkers(data_get_list_place.data.data);
        } else {
          this.setState({ dataPlace: [] })
        }
      }
    }

    if (props.dataCurentLocation.error === false) {
      if (props.dataCurentLocation.fetching === false && dataGetCurentLocation) {
        if (dataGetCurentLocation.data) {
          if (dataGetCurentLocation.data.success) {
            if (this.state.tab == 2)
              this.get_currents_location_1(dataGetCurentLocation.data.data[0]);
          } else {
            this.setState({ message: dataGetCurentLocation.data.msg, show_modal_alert: true });
          }
        }
      }
    }
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('didFocus', (payload) => {
      this.callAPIGetUserInfor();
      this.call_api_get_list_place_first();
      // this.call_api_get_list_place();
      // this.call_api_get_list_place_stop();
    })
  }

  get_currents_location_1(data) {
    if (data) {
      this.map.animateCamera({
        center: {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude)
        },
        pitch: 10,
        heading: 20,
        altitude: 20,
        zoom: 17
      },
        100
      );
      this.setState({
        name_place: data.namePlace,
        speed_car: data.speed,
        creatTimeFormatCar: data.creatTimeFormat,
        marker_curren_location: {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude)
        }
      });
    } else {
      this.setState({
        message: "Không tìm thấy lịch sử đi lại trong khoảng thời gian này",
        show_modal_alert: true,
        name_place: '',
        creatTimeFormatCar: ""
      });
    }
    if (this.marker != null)
      setTimeout(() => this.marker.showCallout(), 0);
  }

  async callAPIGetUserInfor() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    this.props.get_user_infor(idDevice)
  }

  fitAllMarkers(data) {
    let dataRevese = [];
    for (let i = data.length - 1; i >= 0; i--) {
      dataRevese.push(data[i]);
    }
    this.setState({ dataPlace: dataRevese });
    this.show_direction(dataRevese);
    if (dataRevese.length) {
      let MARKERS = [];
      dataRevese.map((marker, index) => {
        // MARKERS.findIndex(e => e.longitude == Number(marker.longitude)) == MARKERS.findIndex(e => e.latitude == Number(marker.latitude)) && MARKERS.findIndex(e => e.longitude == Number(marker.longitude)) == -1 ?
        MARKERS.push({ latitude: Number(marker.latitude), longitude: Number(marker.longitude) })
        // : null
      })
      if (MARKERS.length >= 2) {
        this.map.fitToCoordinates(MARKERS, {
          edgePadding: DEFAULT_PADDING,
          animated: true,
        });
      }
      // else if (MARKERS.length == 1) {
      //   this.get_currents_location_1(MARKERS[0]);
      // }
    }
  }

  fitAllMarkersNotRevese(data) {
    let dataRevese = data;
    let MARKERS = [];
    dataRevese.map((marker, index) => {
      MARKERS.push({ latitude: Number(marker.latitude), longitude: Number(marker.longitude) })
    })
    this.map.fitToCoordinates(MARKERS, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  dateStart() {
    return (
      <DatePicker
        typeDate="Ngày "
        style={{ width: Metrics.screenWidth - 120 }}
        date={this.state.dateStart}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2000-01-01"
        maxDate={this.state.dateEnd}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        onDateChange={(date) => { this.setState({ dateStart: date }) }}
      />
    )
  }

  findPlaceVSPlaceStop(item) {
    for (var i = 0; i < this.state.dataPlaceStop.length; i++) {
      if (this.state.dataPlaceStop[i].latitude == item.latitude && this.state.dataPlaceStop[i].longitude == item.longitude && item.creatTimeFormat == this.state.dataPlaceStop[i].creatTimeFormat)
        return i;
    }
    return -1;
  }

  _renderItemHistory(item, index) {
    return (
      <Touchable
        style={styles.viewItemInnerHistory}
        activeOpacity={.5}
        onPress={async () => {
          this.bs1.current.snapTo(0);
          await this.setState({
            data_animatedCamera:
            {
              latitude: item.latitude,
              longitude: item.longitude,
              namePlace: item.namePlace,
              creatTimeFormat: item.creatTimeFormat,
              speed: Math.round(100 * Number.parseFloat(item.speed)) / 100 + 'Km',
              timeToStop: this.findPlaceVSPlaceStop(item) != -1 ?
                + this.state.dataPlaceStop[this.findPlaceVSPlaceStop(item)].timeToStop : 'unknown'
            }
          })
          if (this.map != null) {
            this.map.animateCamera({
              center: {
                latitude: Number(item.latitude),
                longitude: Number(item.longitude)
              },
              pitch: 10,
              heading: 20,
              altitude: 200,
              zoom: 17
            },
              100
            );
          }
          if (this.marker_animatedCamera != null) {
            setTimeout(() => { this.marker_animatedCamera.showCallout() }, 0)
          }
        }}
      >
        <View style={styles.itemInnerLocation}>
          <View style={styles.viewIconItem}>
            {
              this.findPlaceVSPlaceStop(item) != -1 ?
                <Image source={Images.stop} style={{ height: 20, width: 20 }} /> :
                <MaterialIcons name="location-on" size={28} color={'blue'} />
            }
          </View>
          <View style={styles.viewContentItem}>
            <View style={{ width: '100%' }}>
              <Text numberOfLines={1}>{item.namePlace}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text>{item.creatTimeFormat}</Text>
            </View>
          </View>
          {
            <View style={styles.viewRightItem}>
              {
                this.findPlaceVSPlaceStop(item) != -1 ?
                  <Text>{this.state.dataPlaceStop[this.findPlaceVSPlaceStop(item)].timeToStop}'</Text>
                  : null
              }
              <Text>{Math.round(100 * Number.parseFloat(item.speed)) / 100} Km/h</Text>
            </View>
          }
        </View>
      </Touchable >
    )
  }

  renderHeaderHistory = () => (
    <View
      style={styles.viewheaderInnerHistory}
    >
      <View style={{ width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' }}>
        <FontAwesome5 name="minus" size={25} />
      </View>
      <View style={styles.viewCard}>
        <CardView
          style={styles.viewItemHeaderHistory}
          cardElevation={10}
          cardMaxElevation={10}
          cornerRadius={8}
        >
          <View style={styles.viewContentItemHistory}>
            {this.dateStart()}
            <TouchableOpacity
              style={styles.btn_bottom}
              activeOpacity={.7}
              onPress={() => {
                this.sliderRef._setRunning(false);
                this.setState({
                  show_direction: true,
                  valueSlider: 0,
                  data_animatedCamera: {
                    latitude: 0,
                    longitude: 0,
                    namePlace: '',
                    creatTimeFormat: '',
                    speed: 0,
                    timeToStop: "unknown"
                  },
                  latitude_car: 0,
                });
                this.call_api_get_list_place_stop();
                this.call_api_get_list_place();
              }}
            >{
                this.props.data_get_list_place_stop.fetching || this.props.data_get_list_place.fetching ?
                  <ActivityIndicator size="small" color={"white"} />
                  :
                  <Fontisto name="search" size={20} color="white" />
              }
            </TouchableOpacity>
          </View>
        </CardView>
      </View>
    </View>
  )

  renderInnerHistory = () => (
    <View style={styles.itemInnerHistory} >
      <SliderCustom enable={this.state.dataPlace.length} ref={refs => this.sliderRef = refs} callback={this.show_car} closeBottomsheet={this.closeBottomsheet} />
      {
        this.state.dataPlace.length ?
          <FlatList1
            extraData={this.state}
            data={this.state.dataPlace}
            renderItem={({ item, index }) => this._renderItemHistory(item, index)}
            keyExtractor={(item, index) => index.toString()}
          /> :
          <Text style={{ fontSize: 16, alignSelf: 'center', textAlign: 'center', color: Colors.main, marginTop: 20 }}>Không tìm thấy điểm dừng nào</Text>
      }
      <View style={{ height: 54 }}></View>
    </View>
  )

  _renderTab() {
    return (
      <View style={styles.viewTab}>
        <Svg style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1 }} width="100%" height="100%" viewBox={`0 0 ${_widthScale(Metrics.screenWidth)} ${_heightScale(54)}`} {...this.props}>
          <G data-name="Layer 2">
            <Path
              d={`M-15,0 L${Metrics.screenWidth / 2 - 40},0 A1,0.9 1 0 0 ${Metrics.screenWidth / 2 + 40},0 L${Metrics.screenWidth + 15},0 L${Metrics.screenWidth + 15},56 L-15,56 Z`}
              fill="white"
              data-name="Layer 1"
            />
          </G>
        </Svg>

        <TouchableOpacity
          onPress={() => {
            this.bs1.current.snapTo(1);
            this.setState({
              tab: 1,
              title: 'Lịch sử',
              show_direction: true
            });
            if (this.state.dataPlace.length) {
              let MARKERS = [];
              this.state.dataPlace.map((marker, index) => {
                MARKERS.push({ latitude: Number(marker.latitude), longitude: Number(marker.longitude) })
              })
              if (this.map != null) {
                this.map.fitToCoordinates(MARKERS, {
                  edgePadding: DEFAULT_PADDING,
                  animated: true,
                });
              }
            }
          }}
          style={styles.scaler}
          activeOpacity={.8}
        >
          <Scaler
            style={styles.scaler}
            pose={this.state.tab === 1 ? 'active' : 'inactive'}
          >
            <MaterialIcons name="history" size={28} color={this.state.tab === 1 ? Colors.main : 'grey'} />
          </Scaler>
        </TouchableOpacity>

        <View style={styles.viewLocation}></View>

        <TouchableOpacity
          onPress={() => {
            this.setState({
              tab: 3,
              show_direction: false
            });
            this.sliderRef._setRunning(false);
            this.callAPIGetUserInfor();
            this.sliderRef._clearInterval();
            this.bs1.current.snapTo(0);
            this.props.navigation.openDrawer();
          }}
          style={styles.scaler}
          activeOpacity={.8}
        >
          <Scaler
            style={styles.scaler}
            pose={this.state.tab === 3 ? 'active' : 'inactive'}
          >
            <Feather name="settings" size={25} color={this.state.tab === 3 ? Colors.main : 'grey'} />
          </Scaler>
        </TouchableOpacity>

      </View >
    )
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  modal_alert() {
    return (
      <Modal
        isVisible={this.state.show_modal_alert}
        style={styles.modal_alert_Container}
        onBackdropPress={() => this.setState({ show_modal_alert: false })}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.view_alert_Title}>
            <Text style={styles.txt_alert_Title}>Thông báo</Text>
          </View>
          <View style={styles.view_alert_Content}>
            <Text style={styles.txt_alert_Content}>{this.state.message}</Text>
          </View>
          <View style={styles.view_alert_BtnNext}>
            <TouchableOpacity
              style={styles.btn_alert}
              onPress={() => { this.setState({ show_modal_alert: false }) }}
              activeOpacity={.6}
            >
              <Text style={styles.txt_btn_alert}>
                Ok
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  callApiGetStatusCar(idDevice) {
    Axios
      .get(
        `${BASE_URL}/api/checkStatusCar?idDevice=${idDevice}`,
      )
      .then((res) => { this.setState({ statusCar: res.data.status }) })
      .catch((err) => {
        console.log(err);
      });
  }

  async call_api_get_list_place_stop() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const start = moment(this.state.dateStart + " 00:01").format('X');
    const end = moment(this.state.dateStart + " 23:59").format('X');
    try {
      this.props.get_list_place_stop(end, start, idDevice, token);
    } catch (e) {
      console.tron.log(e)
    }
  }

  async call_api_get_list_place() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const start = moment(this.state.dateStart + " 00:01").format('X');
    const end = moment(this.state.dateStart + " 23:59").format('X');
    try {
      this.props.get_list_place(end, start, idDevice, token);
    } catch (e) {
      console.tron.log(e)
    }
  }

  async call_api_get_list_place_first() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const end = moment(get_current_date() + " 23:59").format('X');
    try {
      this.props.getCurentLocation(end, "0", idDevice, token);
      this.callApiGetStatusCar(idDevice);
    } catch (e) {
      console.tron.log(e)
    }
  }

  show_direction = (data) => {
    let coords = [];
    for (let i = 0; i < data.length; i++) {
      let item = {};
      item.latitude = Number.parseFloat(data[i].latitude);
      item.longitude = Number.parseFloat(data[i].longitude);
      coords.push(item);
    }
    this.setState({ coords });
  }

  show_car = (valueSlider) => {
    const data = this.state.dataPlace;
    let index = Math.floor(valueSlider * data.length / 100);
    if (data[index]) {
      const newCoordinate = {
        latitude: Number(data[index].latitude),
        longitude: Number(data[index].longitude)
      };
      this.setState({
        latitude_car: Number(data[index].latitude),
        longitude_car: Number(data[index].longitude),
        namePlaceCar: data[index].namePlace,
        creatTimeFormatCar: data[index].creatTimeFormat,
        speedCar: Math.round(100 * Number.parseFloat(data[index].speed)) / 100 + 'Km/h',
        timeStopCar: this.findPlaceVSPlaceStop(data[index]) != -1 ? (this.state.dataPlaceStop[this.findPlaceVSPlaceStop(data[index])].timeToStop) : 'unknown'
      });
      setTimeout(() => { this.marker_car.showCallout() }, 0)
      this.marker_car.animateMarkerToCoordinate(newCoordinate, 50)
      this.map.animateCamera({ center: newCoordinate }, 10);
    }
  }

  closeBottomsheet = () => {
    this.bs1.current.snapTo(0);
  }

  convertDateGMT(date) {
    return moment.utc(date).local().format("YYYY-MM-DD HH:mm:ss");
  }

  render() {
    {
      StatusBar.setBackgroundColor(Colors.main);
      StatusBar.setBarStyle('light-content');
      console.disableYellowBox = true;
      // if (this.state.tab == 2)
      //   this.timer = setInterval(() => this.call_api_get_list_place_first(), 60000)
      // else
      //   clearInterval(this.timmer);
    }
    return (
      <View style={styles.container}>
        <View style={styles.viewTitle}>
          <Text style={styles.title}>
            {this.state.title}
          </Text>
        </View>

        {this.modal_alert()}

        <BottomSheet
          ref={this.bs1}
          // initialSnap={1}
          snapPoints={[0, Metrics.screenHeight]}
          renderContent={this.renderInnerHistory}
          renderHeader={this.renderHeaderHistory}
        />
        {
          this.state.region.latitude != 0 ?
            < MapView
              provider='google'
              loadingEnabled={true}
              ref={(ref) => { this.map = ref }}
              style={styles.viewMap}
              initialRegion={this.state.region}
              onRegionChangeComplete={(region) => this.onRegionChange(region)}
            >
              {
                this.state.tab == 2 ?
                  <Marker
                    key="aa"
                    ref={(ref) => { this.marker = ref }}
                    coordinate={this.state.marker_curren_location}
                  >
                    <Image source={Images.location_car} style={{ height: 40, width: 40 }} />
                    <Callout style={styles.callout}>
                      <View style={styles.viewCallout}>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{this.state.name_place}</Text>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{this.convertDateGMT(this.state.creatTimeFormatCar)}</Text>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Tốc độ: </Text>{Math.round(100 * Number.parseFloat(this.state.speed_car)) / 100 + 'Km/h'}</Text>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Trạng thái: </Text>{this.state.statusCar == true ? "Đang bật" : "Đang tắt"}</Text>
                      </View>
                    </Callout>
                  </Marker>
                  : null
              }

              {
                this.state.tab == 1 && this.state.latitude_car != 0 ?
                  (
                    <Marker
                      ref={(ref) => { this.marker_car = ref }}
                      coordinate={{
                        latitude: this.state.latitude_car,
                        longitude: this.state.longitude_car
                      }}

                    >
                      <Image source={Images.car} style={{ height: 45, width: 45 }} />
                      <Callout style={styles.callout} >
                        <View style={styles.viewCallout}>
                          <Text style={styles.txtCallout} ><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{this.state.namePlaceCar}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{this.state.creatTimeFormatCar}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Tốc độ: </Text>{Math.round(100 * Number.parseFloat(this.state.speedCar)) / 100 + 'Km/h'}</Text>
                        </View>
                      </Callout>
                    </Marker>
                  )
                  : null
              }

              {//end
                this.state.dataPlace[this.state.dataPlace.length - 1] ?
                  this.state.tab == 1 ?
                    <Marker
                      ref={(ref) => { this.marker_place[this.state.dataPlace.length - 1] = ref }}
                      key={'a0'}
                      coordinate={{
                        latitude: Number(this.state.dataPlace[this.state.dataPlace.length - 1].latitude),
                        longitude: Number(this.state.dataPlace[this.state.dataPlace.length - 1].longitude)
                      }}
                    >
                      <Image source={Images.location_end} style={{ height: 40, width: 40 }} />
                      <Callout style={styles.callout} >
                        <View style={styles.viewCallout}>
                          <Text style={styles.txtCallout} ><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{this.state.dataPlace[this.state.dataPlace.length - 1].namePlace}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{this.state.dataPlace[this.state.dataPlace.length - 1].creatTimeFormat}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Tốc độ: </Text>{Math.round(100 * Number.parseFloat(this.state.dataPlace[this.state.dataPlace.length - 1].speed)) / 100 + 'Km/h'}</Text>
                        </View>
                      </Callout>
                    </Marker>
                    : null
                  : null
              }
              {//start
                this.state.dataPlace[0] ?
                  this.state.tab == 1 ?
                    (
                      <Marker
                        ref={(ref) => { this.marker_place[0] = ref }}
                        // tracksViewChanges={false}
                        key={'b0'}
                        coordinate={{
                          latitude: Number(this.state.dataPlace[0].latitude),
                          longitude: Number(this.state.dataPlace[0].longitude)
                        }}
                        title={this.state.dataPlace[0].namePlace}
                        description={this.state.dataPlace[0].creatTimeFormat.toString()}
                      >
                        <Image source={Images.location_start} style={{ height: 40, width: 40 }} />
                        <Callout style={styles.callout} >
                          <View style={styles.viewCallout}>
                            <Text style={styles.txtCallout} ><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{this.state.dataPlace[0].namePlace}</Text>
                            <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{this.state.dataPlace[0].creatTimeFormat}</Text>
                            <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Tốc độ: </Text>{Math.round(100 * Number.parseFloat(this.state.dataPlace[0].speed)) / 100 + 'Km/h'}</Text>
                          </View>
                        </Callout>
                      </Marker>
                    )
                    : null
                  : null
              }
              {
                this.state.data_animatedCamera.latitude != 0 ?
                  <Marker
                    ref={(ref) => { this.marker_animatedCamera = ref }}
                    coordinate={{
                      latitude: Number(this.state.data_animatedCamera.latitude),
                      longitude: Number(this.state.data_animatedCamera.longitude)
                    }}
                    title={this.state.data_animatedCamera.namePlace}
                    description={this.state.data_animatedCamera.creatTimeFormat.toString()}
                  >
                    <Callout style={styles.callout} >
                      <View style={styles.viewCallout}>
                        <Text style={styles.txtCallout}  ><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{this.state.data_animatedCamera.namePlace}</Text>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{this.state.data_animatedCamera.creatTimeFormat}</Text>
                        <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>{this.state.data_animatedCamera.timeToStop == "unknown" ? 'Tốc độ: ' : 'Thời lượng dừng: '}</Text>{this.state.data_animatedCamera.timeToStop == "unknown" ? this.state.data_animatedCamera.speed : this.state.data_animatedCamera.timeToStop}</Text>
                      </View>
                    </Callout>
                  </Marker> : null
              }
              {
                this.state.tab == 1 && this.state.dataPlaceStop.length ? (
                  this.state.dataPlaceStop.map((marker, index) => (
                    <Marker
                      ref={(ref) => { this.marker_place_stop[index] = ref }}
                      key={index.toString()}
                      coordinate={{
                        latitude: Number(marker.latitude),
                        longitude: Number(marker.longitude)
                      }}
                      description={marker.creatTimeFormat.toString()}
                    >
                      <Image source={Images.stop} style={{ height: 15, width: 15 }} />
                      <Callout style={styles.callout}>
                        <View style={styles.viewCallout}>
                          <Text style={styles.txtCallout}  ><Text style={styles.txtCalloutBold}>Địa điểm: </Text>{marker.namePlace}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời gian: </Text>{marker.creatTimeFormat}</Text>
                          <Text style={styles.txtCallout}><Text style={styles.txtCalloutBold}>Thời lượng dừng: </Text>{marker.timeToStop}'</Text>
                        </View>
                      </Callout>
                    </Marker>
                  ))
                ) : null
              }
              {
                this.state.coords.length && this.state.show_direction ? <Polyline
                  coordinates={this.state.coords}
                  strokeColor={Colors.main}
                  strokeWidth={3}
                /> : null
              }
            </MapView> : null
        }
        {
          this.state.tab == 2 ?
            <TouchableOpacity
              style={styles.btnLocation}
              activeOpacity={.8}
              onPress={() => {
                this.call_api_get_list_place_first();
              }}
            >
              <Ionicons name="md-locate" size={20} color="grey" />
            </TouchableOpacity>
            : null
        }

        <TouchableOpacity
          style={styles.viewBaoLocation}
          onPress={() => {
            this.call_api_get_list_place_first();
            this.setState({
              tab: 2,
              title: 'Vị trí hiện tại',
              show_direction: false,
              latitude_car: 0,
              data_animatedCamera: {
                latitude: 0,
                longitude: 0,
                namePlace: '',
                creatTimeFormat: '',
                speed: 0,
                timeToStop: "unknown"
              }
            });
            this.sliderRef._setRunning(false);
            this.sliderRef._clearInterval();
            this.bs1.current.snapTo(0);
          }}
          activeOpacity={.5}
        >
          <ScalerLocation
            style={styles.touchLocation}
            pose={this.state.tab === 2 ? 'active' : 'inactive'}
          >
            <View
              style={styles.scaler}
            >
              <Scaler
                style={styles.scaler}
                pose={this.state.tab === 2 ? 'active' : 'inactive'}
              >
                <MaterialIcons name="location-on" size={28} color={'white'} />
              </Scaler>
            </View>
          </ScalerLocation>
        </TouchableOpacity>
        { this._renderTab()}

      </View >
    )
  }
}

const mapStateToProps = (state) => ({
  data_userinfor: state.get_user_infor,
  data_get_list_place_stop: state.get_list_place_stop,
  data_get_list_place: state.get_list_place,
  dataCurentLocation: state.getCurentLocation
})

const mapDispatchToProps = (dispatch) => ({
  get_user_infor: (idDevice) =>
    dispatch(ActionGetUserInfor.getuserinforRequest(idDevice)),

  get_list_place_stop: (end, start, idDevice, token) =>
    dispatch(ActionGetListPlaceStop.getlistplacestopRequest(end, start, idDevice, token)),

  get_list_place: (end, start, idDevice, token) =>
    dispatch(ActionGetListPlace.getlistplaceRequest(end, start, idDevice, token)),

  getCurentLocation: (end, start, idDevice, token) =>
    dispatch(ActionGetCurentLocation.getcurentlocationRequest(end, start, idDevice, token)),

})


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
