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
import MapView, { Marker, Polyline } from 'react-native-maps';
import posed from 'react-native-pose';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import Svg, { G, Path } from 'react-native-svg';
import BottomSheet from 'reanimated-bottom-sheet'
import DatePicker from '../Transforms/DatePicker/DatePicker'
import CardView from 'react-native-cardview'
import MapViewDirections from 'react-native-maps-directions';
import Modal from 'react-native-modal'
import moment from 'moment'
import Slider from '../Config/Slider.js'

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
import { decode } from "@mapbox/polyline";

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
    this.map = React.createRef();
    this.marker = React.createRef();
    this.marker_place = [];
    this.marker_place_stop = [];
    this.marker_car = React.createRef();
    this.marker_animatedCamera = React.createRef();

    this.bs1 = React.createRef();
    this.bs2 = React.createRef();

    this.state = {
      name_place: '',
      speed_car: '',
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
      valueSlider: 0,
      max_slider: 100,
      running: false,
      speed: 1,
      latitude_car: 0,
      longitude_car: 0,
      interval: "",
      car_rotation: 0,
      coords: [],
      coordColor: [],
      dataPlaceStop: [],
      dataPlace: [],
      data_animatedCamera: {
        latitude: 0,
        longitude: 0,
        namePlace: '',
        creatTimeFormat: ''
      },
      namePlaceCar: '',
      creatTimeFormatCar: ''
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
        if (data_get_list_place.data) {
          this.fitAllMarkers(data_get_list_place.data.data);
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
        marker_curren_location: {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude)
        }
      })
    } else {
      this.setState({ message: "Không tìm thấy lịch sử đi lại trong khoảng thời gian này", show_modal_alert: true, name_place: '' });
    }
  }

  async callAPIGetUserInfor() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    this.props.get_user_infor(idDevice)
  }

  fitAllMarkers(data) {
    dataRevese = [];
    for (let i = data.length - 1; i >= 0; i--) {
      dataRevese.push(data[i]);
    }
    this.setState({ dataPlace: dataRevese });
    if (dataRevese.length) {
      this.show_direction(dataRevese);
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
      else if (MARKERS.length == 1) {
        this.get_currents_location_1(MARKERS[0]);
      }
    }
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
        disabled={this.state.running}
        style={styles.viewItemInnerHistory}
        activeOpacity={.5}
        onPress={() => {
          if (index == 0 || index == this.state.dataPlace.length - 1) {
            this.get_currents_location_1({ latitude: item.latitude, longitude: item.longitude });
            this.bs1.current.snapTo(2);
            this.marker_place[index].showCallout()
          } else {
            this.setState({
              data_animatedCamera:
              {
                latitude: item.latitude,
                longitude: item.longitude,
                namePlace: item.namePlace,
                creatTimeFormat: item.creatTimeFormat
              }
            })
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
            this.marker_animatedCamera.showCallout()
          }
        }}
      >
        <View style={styles.itemInnerLocation}>
          <View style={styles.viewIconItem}>
            <MaterialIcons name="location-on" size={28} color={'blue'} />
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
      </Touchable>
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
                this.setState({ show_direction: true });
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
      <View style={styles.view_slider}>
        <TouchableOpacity
          style={styles.touch_slider}
          onPress={() => {
            this.setState({
              running: !this.state.running
            });
            this.show_car(this.state.dataPlace);
          }}
        >
          {this.state.running ?
            <FontAwesome name="pause" size={18} color="grey" />
            :
            <FontAwesome name="play" size={20} color="grey" />
          }
        </TouchableOpacity>
        <Slider
          disabled={this.state.running ? true : false}
          style={{ width: "65%" }}
          value={this.state.valueSlider}
          step={1}
          minimumValue={0}
          maximumValue={this.state.max_slider}
          onValueChange={value => this.setState({ valueSlider: value })}
          thumbTouchSize={{ width: 60, height: 60 }}
          minimumTrackTintColor={Colors.main}
          thumbImage={Images.car_slider}
          thumbStyle={styles.thumb}
        />
        <TouchableOpacity
          style={styles.touch_slider}
          onPress={() => {
            if (this.state.speed == 3)
              this.setState({ speed: 1 })
            else
              this.setState({ speed: this.state.speed + 1 })
            this.show_car(this.state.dataPlace);
          }}
        >
          <Text style={styles.txt_touch_slider}>X{this.state.speed}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  renderInnerHistory = () => (
    <View style={styles.itemInnerHistory} >
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

  renderInnerLocation = () => (
    <View style={styles.viewInnerLocation}>
      <View style={[styles.itemInnerLocation, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={styles.viewIconItem}>
          <MaterialIcons name="location-on" size={40} color={'blue'} />
        </View>
        <View style={{ width: Metrics.screenWidth - 60, paddingHorizontal: 10 }}>
          <View>
            <Text>{this.state.name_place}</Text>
          </View>
        </View>
      </View>
    </View>
  )

  renderHeaderLocation = () => (
    <View
      style={styles.viewHeaderLocation}
    >
      <Text style={styles.txtHeaderSheerLocation}>Thông tin địa chỉ</Text>
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
            this.setState({
              tab: 1,
              title: 'Lịch sử',
            });
            this.bs1.current.snapTo(1);
            this.bs2.current.snapTo(1);
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
              running: false,
              // show_direction: false
            });
            clearInterval(this.state.interval);
            this.bs1.current.snapTo(2);
            this.bs2.current.snapTo(1);
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

  async call_api_get_list_place_stop() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const start = moment(this.state.dateStart + " 00:01").format('X');
    const end = moment(this.state.dateStart + " 11:59").format('X');
    this.props.get_list_place_stop(end, start, idDevice, token);
  }

  async call_api_get_list_place() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const start = moment(this.state.dateStart + " 00:01").format('X');
    const end = moment(this.state.dateStart + " 11:59").format('X');
    this.props.get_list_place(end, start, idDevice, token);
  }

  async call_api_get_list_place_first() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const end = moment(get_current_date() + " 11:59").format('X');
    const start = moment(get_current_date() + " 00:01").format('X');
    this.props.getCurentLocation(end, "0", idDevice, token);
    this.props.get_list_place(end, start, idDevice, token);
    this.props.get_list_place_stop(end, start, idDevice, token);
    this.marker.showCallout();
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

  show_car = (data) => {
    let interval = setInterval(() => {
      this.setState({ interval });
      if (!this.state.running || this.state.valueSlider == 100) {
        clearInterval(this.state.interval);
      } else {
        let index = Math.floor(this.state.valueSlider * data.length / 100);
        console.tron.log("a", index),
          data[index] ?
            this.setState({
              car_rotation: data[index].rotation
            }) : null
        this.setState({
          valueSlider: this.state.valueSlider + 1,
        })
        if (data[index]) {
          const newCoordinate = {
            latitude: Number(data[index].latitude),
            longitude: Number(data[index].longitude)
          };
          index == 0 ?
            this.marker_car._component.animateMarkerToCoordinate(newCoordinate, 0) :
            this.marker_car._component.animateMarkerToCoordinate(newCoordinate, 700);
          // this.marker_car.showCallout();
        }
      }
    }, this.state.speed == 1 ? 3000 : this.state.speed == 2 ? 2000 : 1000)
  }

  render() {
    {
      StatusBar.setBackgroundColor(Colors.main);
      StatusBar.setBarStyle('light-content');
      console.disableYellowBox = true;
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
          initialSnap={2}
          snapPoints={[Metrics.screenHeight, 0.6 * Metrics.screenHeight, 0]}
          renderContent={this.renderInnerHistory}
          renderHeader={this.renderHeaderHistory}
        />

        <BottomSheet
          ref={this.bs2}
          initialSnap={0}
          snapPoints={[0.4 * Metrics.screenHeight, 0]}
          renderContent={this.renderInnerLocation}
          renderHeader={this.renderHeaderLocation}
        />
        {
          this.state.region.latitude !== 0 ?
            < MapView
              provider='google'
              loadingEnabled={true}
              ref={(ref) => { this.map = ref }}
              style={styles.viewMap}
              initialRegion={this.state.region}
              onRegionChangeComplete={(region) => this.onRegionChange(region)}
            >
              {
                this.state.tab === 2 ?
                  <Marker
                    ref={(ref) => { this.marker = ref }}
                    coordinate={this.state.marker_curren_location}
                    title={this.state.name_place}
                    description={this.state.speed_car.toString()}
                  >
                    <Image source={Images.location_car} style={{ height: 40, width: 40 }} />
                  </Marker> : null
              }

              {
                this.state.tab === 1 ?
                  (
                    <Marker.Animated
                      ref={(ref) => { this.marker_car = ref }}
                      coordinate={{
                        latitude: this.state.latitude_car,
                        longitude: this.state.longitude_car
                      }}
                      title={this.state.namePlaceCar}
                      description={this.state.creatTimeFormatCar.toString()}
                    // rotation={this.state.car_rotation}
                    >
                      <Image source={Images.car} style={{ height: 45, width: 45 }} />
                    </Marker.Animated>
                  )
                  : null
              }

              {
                this.state.tab === 1 && this.state.dataPlace.length ? (
                  this.state.dataPlace.map((marker, index) => (
                    index == 0 ?
                      <Marker
                        ref={(ref) => { this.marker_place[index] = ref }}
                        tracksViewChanges={false}
                        key={index.toString()}
                        coordinate={{
                          latitude: Number(marker.latitude),
                          longitude: Number(marker.longitude)
                        }}
                        title={marker.namePlace}
                        description={marker.creatTimeFormat.toString()}
                      >
                        < Image source={Images.location_start} style={{ height: 40, width: 40 }} />
                      </Marker>
                      : index == this.state.dataPlace.length - 1 ?
                        <Marker
                          ref={(ref) => { this.marker_place[index] = ref }}
                          tracksViewChanges={false}
                          key={index.toString()}
                          coordinate={{
                            latitude: Number(marker.latitude),
                            longitude: Number(marker.longitude)
                          }}
                          title={marker.namePlace}
                          description={marker.creatTimeFormat.toString()}
                        >
                          {
                            <Image source={Images.location_end} style={{ height: 40, width: 40 }} />
                          }
                        </Marker>
                        : null
                  ))
                ) : null
              }
              {
                this.state.data_animatedCamera ?
                  <Marker
                    ref={(ref) => { this.marker_animatedCamera = ref }}
                    tracksViewChanges={false}
                    // key={index.toString()}
                    coordinate={{
                      latitude: Number(this.state.data_animatedCamera.latitude),
                      longitude: Number(this.state.data_animatedCamera.longitude)
                    }}
                    title={this.state.data_animatedCamera.namePlace}
                    description={this.state.data_animatedCamera.creatTimeFormat.toString()}
                  /> : null
              }
              {
                this.state.tab === 1 && this.state.dataPlaceStop.length ? (
                  this.state.dataPlaceStop.map((marker, index) => (
                    <Marker
                      ref={(ref) => { this.marker_place_stop[index] = ref }}
                      tracksViewChanges={false}
                      key={index.toString()}
                      coordinate={{
                        latitude: Number(marker.latitude),
                        longitude: Number(marker.longitude)
                      }}
                      title={marker.namePlace}
                      description={marker.creatTimeFormat.toString()}
                    >
                      {
                        <Image source={Images.stop} style={{ height: 15, width: 15 }} />
                      }
                    </Marker>
                  ))
                ) : null
              }
              {
                this.state.coords && this.state.show_direction && <Polyline
                  coordinates={this.state.coords}
                  strokeColor={Colors.main}
                  strokeWidth={3}
                />
              }
            </MapView> : null
        }
        {
          this.state.tab === 2 ?
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
              running: false,
              show_direction: false,
              data_animatedCamera: {
                latitude: 0,
                longitude: 0,
                namePlace: '',
                creatTimeFormat: ''
              }
            });
            clearInterval(this.state.interval);
            this.bs2.current.snapTo(0);
            this.bs1.current.snapTo(2);
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
        {this._renderTab()}

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
