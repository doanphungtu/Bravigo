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
import MapView, { Marker } from 'react-native-maps';
import posed from 'react-native-pose';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Svg, { G, Path } from 'react-native-svg';
import BottomSheet from 'reanimated-bottom-sheet'
import DatePicker from '../Transforms/DatePicker/DatePicker'
import CardView from 'react-native-cardview'
import SwitchSelector from "react-native-switch-selector";
import MapViewDirections from 'react-native-maps-directions';
import Modal from 'react-native-modal'
import moment from 'moment'
import Slider from '../Config/Slider.js'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import ActionGetUserInfor from '../Redux/GetUserInforRedux'
import ActionGetListPlaceStop from '../Redux/GetListPlaceStopRedux'
import ActionGetListPlace from '../Redux/GetListPlaceRedux'
// Styles
import styles from './Styles/HomeScreenStyle'
import { Colors, Metrics, Images } from '../Themes';
import AsyncStorage from '@react-native-community/async-storage';
import { TouchableOpacity as Touchable } from 'react-native-gesture-handler'
import { get_current_date, get_current_hour } from '../Transforms/Function_Of_Tu';
const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const GOOGLE_MAPS_APIKEY = "AIzaSyD_x8kFDvxo9vFvzMMJ98m6u4KfVmI12dY";

const options = [
  { label: "Điểm dừng", value: "0" },
  { label: "Lưu vết", value: "1" },
];

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
    this.marker_place_stop = React.createRef();
    this.bs1 = React.createRef();
    this.bs2 = React.createRef();
    this.state = {
      name_place: '',
      message: '',
      show_modal_alert: false,
      show_direction: false,
      dateStart: get_current_date() + ", 00:01",
      dateEnd: get_current_date() + ", " + get_current_hour(),
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
      max_slider: 1,
      running: false,
      speed: 1,
      latitude_car: 0,
      longitude_car: 0,
      interval: "",
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, data_get_list_place_stop } = props.data_get_list_place_stop;

    const { data_get_list_place } = props.data_get_list_place;

    if (error === false) {
      if (fetching === false && data_get_list_place_stop) {
        if (data_get_list_place_stop.data && this.state.gender === '0') {
          if (data_get_list_place_stop.data.success) {
            this.fitAllMarkers(data_get_list_place_stop.data.data);
          } else {
            this.setState({ message: data_get_list_place_stop.data.msg, show_modal_alert: true })
          }
        }
      }
    }

    if (props.data_get_list_place.error === false) {
      if (props.data_get_list_place.fetching === false && data_get_list_place) {
        if (data_get_list_place.data) {
          if (data_get_list_place.data.success) {
            this.setState({ max_slider: data_get_list_place.data.data.length });
            if (this.state.tab !== 2) {
              if (this.state.gender === '1') {
                this.fitAllMarkers(data_get_list_place.data.data);
              }
            } else {
              this.get_currents_location_1(data_get_list_place.data.data[0]);
            }
          } else {
            this.setState({ message: data_get_list_place.data.msg, show_modal_alert: true })
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

  get_currents_location() {
    this.props.data_get_list_place.data_get_list_place ?
      (
        this.map.animateToCoordinate({
          latitude: Number(this.props.data_get_list_place.data_get_list_place.data.data[0].latitude),
          longitude: Number(this.props.data_get_list_place.data_get_list_place.data.data[0].longitude),
        },
          100
        ),
        this.setState({
          marker_curren_location: {
            ...this.state.marker_curren_location,
            latitude: Number(this.props.data_get_list_place.data_get_list_place.data.data[0].latitude),
            longitude: Number(this.props.data_get_list_place.data_get_list_place.data.data[0].longitude)
          }
        })
      ) : null
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
      ),
        this.setState({
          name_place: data.namePlace,
          marker_curren_location: {
            ...this.state.marker_curren_location,
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
    let MARKERS = [];
    data.map((marker, index) => {
      MARKERS.findIndex(e => e.longitude === Number(marker.longitude)) === MARKERS.findIndex(e => e.latitude === Number(marker.latitude)) && MARKERS.findIndex(e => e.longitude === Number(marker.longitude)) === -1 ?
        MARKERS.push({ latitude: Number(marker.latitude), longitude: Number(marker.longitude) }) : null
    })
    if (MARKERS.length >= 2) {
      this.map.fitToCoordinates(MARKERS, {
        edgePadding: DEFAULT_PADDING,
        animated: true,
      });
    } else {
      this.get_currents_location_1(MARKERS[0]);
    }
  }

  region_one_place(latitude, longitude) {
    this.map.animateToCoordinate({
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
      100
    )
  }

  dateStart() {
    return (
      <DatePicker
        typeDate="Từ ngày "
        style={{ width: "100%" }}
        date={this.state.dateStart}
        mode="datetime"
        placeholder="select date"
        format="YYYY-MM-DD, HH:mm"
        minDate="2000-01-01 00:00"
        maxDate={this.state.dateEnd}
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        is24Hour={true}
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: 'flex-start',
          },
        }}
        onDateChange={(date) => { this.setState({ dateStart: date }) }}
      />
    )
  }

  dateEnd() {
    return (
      <DatePicker
        typeDate="Đến ngày "
        style={{ width: "100%" }}
        date={this.state.dateEnd}
        mode="datetime"
        placeholder="select date"
        format="YYYY-MM-DD, HH:mm"
        minDate={this.state.dateStart}
        maxDate="2100-01-01 00:00"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={false}
        is24Hour={true}
        customStyles={{
          dateInput: {
            borderWidth: 0,
            alignItems: 'flex-start',
          },
        }}
        onDateChange={(date) => { this.setState({ dateEnd: date }) }}
      />
    )
  }

  _renderItemHistory(item, index) {
    return (
      <Touchable
        disabled={this.state.running}
        style={styles.viewItemInnerHistory}
        activeOpacity={.5}
        onPress={() => {
          // this.region_one_place(item.latitude, item.longitude);
          this.get_currents_location_1({ latitude: item.latitude, longitude: item.longitude });
          this.bs1.current.snapTo(2);
          this.state.gender === '0' ?
            this.marker_place_stop[index].showCallout()
            :
            this.marker_place[index].showCallout()
        }}
      >
        <View style={styles.itemInnerLocation}>
          <View style={styles.viewIconItem}>
            <MaterialIcons name="location-on" size={28} color={'blue'} />
          </View>
          <View style={[styles.viewContentItem, { flex: this.state.gender === '0' ? .6 : .9 }]}>
            <View style={{ width: '100%' }}>
              <Text numberOfLines={1}>{item.namePlace}</Text>
            </View>
            <View style={{ width: '100%' }}>
              <Text>{item.creatTimeFormat}</Text>
            </View>
          </View>
          {
            this.state.gender === '0' ?
              <View style={styles.viewRightItem}>
                <Text>{item.timeToStop}</Text>
              </View> : null
          }
        </View>
      </Touchable>
    )
  }

  renderInnerHistory = () => (
    <View style={styles.itemInnerHistory} >
      {
        this.state.gender === '0' ?
          this.props.data_get_list_place_stop.data_get_list_place_stop ?
            <FlatList1
              extraData={this.props}
              data={
                this.props.data_get_list_place_stop.data_get_list_place_stop.data.data
              }
              renderItem={({ item, index }) => this._renderItemHistory(item, index)}
              keyExtractor={(item, index) => index.toString()}
            /> : null
          : this.props.data_get_list_place.data_get_list_place ?
            <FlatList1
              extraData={this.props}
              data={this.props.data_get_list_place.data_get_list_place.data.data}
              renderItem={({ item, index }) => this._renderItemHistory(item, index)}
              keyExtractor={(item, index) => index.toString()}
            /> : null
      }
      <View style={{ height: 54 }}></View>
    </View>
  )

  renderHeaderHistory = () => (
    <View
      style={styles.viewheaderInnerHistory}
    >
      <SwitchSelector
        initial={0}
        onPress={(value) => {
          this.setState({ gender: value, show_direction: false });
        }}
        textColor={Colors.main}
        selectedColor={'white'}
        buttonColor={Colors.main}
        backgroundColor={'white'}
        hasPadding
        animationDuration={100}
        options={options}
        borderRadius={8}
        style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8, width: '90%' }}
      />

      <View style={styles.viewCard}>
        <CardView
          style={styles.viewItemHeaderHistory}
          cardElevation={10}
          cardMaxElevation={10}
          cornerRadius={8}
        >
          <View style={styles.iconItemHistory}>
            <Octicons name="primitive-dot" size={25} color={Colors.main} />
            <FontAwesome5 name="grip-lines-vertical" size={25} color="grey" />
            <AntDesign name="caretdown" size={20} color="black" />
          </View>
          <View style={styles.viewContentItemHistory}>
            <View style={styles.fromDay}>
              {this.dateStart()}
            </View>
            <View style={styles.toDay}>
              {this.dateEnd()}
            </View>
          </View>
        </CardView>
      </View>

      <View style={styles.view_btn_bottom}>
        <TouchableOpacity
          style={styles.btn_bottom}
          activeOpacity={.7}
          onPress={() => {
            this.setState({ show_direction: false });
            if (this.state.gender === "0")
              this.call_api_get_list_place_stop();
            else
              this.call_api_get_list_place();
          }}
        >{
            this.state.gender === "0" ?
              this.props.data_get_list_place_stop.fetching ?
                <ActivityIndicator size="small" color={"white"} />
                :
                <Text style={styles.txt_btn_bottom}>Tìm kiếm</Text>
              :
              this.props.data_get_list_place.fetching ?
                <ActivityIndicator size="small" color={"white"} />
                :
                <Text style={styles.txt_btn_bottom}>Tìm kiếm</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.7}
          style={styles.btn_bottom}
          onPress={() => {
            (this.state.gender == "0" && this.props.data_get_list_place_stop.data_get_list_place_stop) || (this.state.gender == "1" && this.props.data_get_list_place.data_get_list_place) ?
              this.setState({ show_direction: !this.state.show_direction }) : null
          }}
        >
          <Text style={styles.txt_btn_bottom}>{this.state.show_direction ? "Ẩn lộ trình" : "Hiện lộ trình"}</Text>
        </TouchableOpacity>
      </View>

      {
        (this.state.gender == "0" && this.props.data_get_list_place_stop.data_get_list_place_stop) || (this.state.gender == "1" && this.props.data_get_list_place.data_get_list_place) ?
          <View style={styles.view_slider}>
            <TouchableOpacity
              style={styles.touch_slider}
              onPress={async () => {
                await this.setState({
                  running: !this.state.running
                });

                this.show_car(this.props.data_get_list_place.data_get_list_place.data.data);
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
              onPress={async () => {
                if (this.state.speed == 3)
                  await this.setState({ speed: 1 })
                else
                  await this.setState({ speed: this.state.speed + 1 })
                this.show_car(this.props.data_get_list_place.data_get_list_place.data.data);
              }}
            >
              <Text style={styles.txt_touch_slider}>X{this.state.speed}</Text>
            </TouchableOpacity>
          </View> :
          null
      }

    </View>
  )

  renderInnerLocation = () => (
    <View style={styles.viewInnerLocation}>
      <View style={styles.itemInnerLocation}>
        <View style={styles.viewIconItem}>
          <MaterialIcons name="location-on" size={40} color={'blue'} />
        </View>
        <View style={[styles.viewContentItem, { flex: .9, paddingHorizontal: 10 }]}>
          <View>
            <Text>Bạn đang ở :</Text>
          </View>
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
          onPress={async () => {
            await this.setState({
              tab: 1,
              title: 'Lịch sử',
            });
            this.bs1.current.snapTo(1);
            this.bs2.current.snapTo(1);
            // if (this.state.gender === "0") {
            //   this.call_api_get_list_place_stop();
            // } else {
            //   this.call_api_get_list_place();
            // }
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
          onPress={async () => {
            await this.setState({
              tab: 3,
              running: false
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

  getCoordinate(data) {
    var MARKERS = [];
    data.map((marker, index) => (
      MARKERS.push({ latitude: Number(marker.latitude), longitude: Number(marker.longitude) })
    ))
    return MARKERS;
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
    const end = moment(this.state.dateEnd.replace(',', '')).format('X');
    const start = moment(this.state.dateStart.replace(',', '')).format('X');
    this.props.get_list_place_stop(end, start, idDevice, token);
  }

  async call_api_get_list_place() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const end = moment(this.state.dateEnd.replace(',', '')).format('X');
    const start = moment(this.state.dateStart.replace(',', '')).format('X');
    this.props.get_list_place(end, start, idDevice, token);
  }

  async call_api_get_list_place_first() {
    const idDevice = await AsyncStorage.getItem("idDevice");
    const token = await AsyncStorage.getItem("token");
    const end = moment(get_current_date() + " " + get_current_hour()).format('X');
    const start = "0";
    this.props.get_list_place(end, start, idDevice, token);
    this.marker.showCallout();
  }

  render_place_stop() {
    return (
      this.props.data_get_list_place_stop.data_get_list_place_stop.data.data.map((item, index) => {
        if (index > 0) {
          return (
            <MapViewDirections
              origin={{
                latitude: this.props.data_get_list_place_stop.data_get_list_place_stop.data.data[index - 1].latitude,
                longitude: this.props.data_get_list_place_stop.data_get_list_place_stop.data.data[index - 1].longitude
              }}
              destination={{
                latitude: Number(item.latitude),
                longitude: Number(item.longitude)
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="DRIVING"
              precision="high"
              optimizeWaypoints={true}
              strokeWidth={3}
              strokeColor="#512DA8"
            />
          )
        }
      })
    )
  }

  render_place() {
    return (
      this.props.data_get_list_place.data_get_list_place.data.data.map((item, index) => {
        if (index > 0) {
          return (
            <MapViewDirections
              origin={{
                latitude: this.props.data_get_list_place.data_get_list_place.data.data[index - 1].latitude,
                longitude: this.props.data_get_list_place.data_get_list_place.data.data[index - 1].longitude
              }}
              destination={{
                latitude: Number(item.latitude),
                longitude: Number(item.longitude)
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              mode="DRIVING"
              precision="high"
              optimizeWaypoints={true}
              strokeWidth={3}
              strokeColor="#512DA8"
            />
          )
        }
      })
    )
  }

  show_car = (data) => {
    let interval = setInterval(async () => {
      await this.setState({ interval });
      if (!this.state.running) {
        clearInterval(this.state.interval);
      }
      await this.setState({
        latitude_car: Number(data[this.state.valueSlider].latitude),
        longitude_car: Number(data[this.state.valueSlider].longitude),
        valueSlider: this.state.valueSlider == data.length - 1 ? 0 : this.state.valueSlider + 1,
      })
    }, this.state.speed == 1 ? 1500 : this.state.speed == 2 ? 1000 : 500)
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
                  >
                    <Image source={Images.location_car} style={{ height: 40, width: 40 }} />
                  </Marker> : null
              }

              {
                this.state.tab === 1 ?
                  (
                    <Marker
                      coordinate={{
                        latitude: this.state.latitude_car,
                        longitude: this.state.longitude_car
                      }}
                    >
                      <Image source={Images.car} style={{ height: 40, width: 40 }} />
                    </Marker>
                  )
                  : null
              }

              {
                this.state.tab === 1 ? (
                  this.state.gender === '0' ? (
                    this.props.data_get_list_place_stop.data_get_list_place_stop ? (
                      this.props.data_get_list_place_stop.data_get_list_place_stop.data.data.map((marker, index) => (
                        index != 0 && index != this.props.data_get_list_place_stop.data_get_list_place_stop.data.data.length - 1 && this.state.running ?
                          null
                          :
                          <Marker
                            ref={(ref) => { this.marker_place_stop = ref }}
                            tracksViewChanges={false}
                            key={index.toString()}
                            coordinate={{
                              latitude: marker.latitude ? Number(marker.latitude) : 0,
                              longitude: marker.longitude ? Number(marker.longitude) : 0
                            }}
                            title={marker.namePlace}
                            description={marker.creatTimeFormat.toString() + ",    " + marker.timeToStop}
                          >{
                              index == 0 ?
                                <Image source={Images.location_end} style={{ height: 40, width: 40 }} /> :
                                index == this.props.data_get_list_place_stop.data_get_list_place_stop.data.data.length - 1 ?
                                  < Image source={Images.location_start} style={{ height: 40, width: 40 }} /> :
                                  < Image source={Images.stop} style={{ height: 15, width: 15 }} />
                            }
                          </Marker>
                      ))
                    ) : null
                  ) :
                    (
                      this.props.data_get_list_place.data_get_list_place ? (
                        this.props.data_get_list_place.data_get_list_place.data.data.map((marker, index) => (
                          index != 0 && index != this.props.data_get_list_place.data_get_list_place.data.data.length - 1 && this.state.running ?
                            null
                            :
                            <Marker
                              ref={(ref) => { this.marker_place[index] = ref }}
                              tracksViewChanges={false}
                              key={index.toString()}
                              coordinate={{
                                latitude: marker.latitude ? Number(marker.latitude) : 0,
                                longitude: marker.longitude ? Number(marker.longitude) : 0
                              }}
                              title={marker.namePlace}
                              description={marker.creatTimeFormat.toString()}
                            >{
                                index == 0 ?
                                  <Image source={Images.location_end} style={{ height: 40, width: 40 }} /> :
                                  index == this.props.data_get_list_place.data_get_list_place.data.data.length - 1 ?
                                    < Image source={Images.location_start} style={{ height: 40, width: 40 }} /> :
                                    < Image source={Images.stop} style={{ height: 15, width: 15 }} />
                              }</Marker>
                        ))
                      ) : null
                    )
                )
                  : null
              }
              {
                this.state.show_direction && (this.props.data_get_list_place_stop.data_get_list_place_stop || this.props.data_get_list_place.data_get_list_place) ?
                  this.state.gender === '0' ?
                    this.render_place_stop()
                    :
                    this.render_place()
                  : null

              }
            </MapView> : null
        }
        {
          this.state.tab === 2 ?
            <TouchableOpacity
              style={styles.btnLocation}
              activeOpacity={.8}
              onPress={() => {
                // this.get_currents_location()
                this.call_api_get_list_place_first();
              }}
            >
              <Ionicons name="md-locate" size={20} color="grey" />
            </TouchableOpacity>
            : null
        }

        <TouchableOpacity
          style={styles.viewBaoLocation}
          onPress={async () => {
            // this.get_currents_location();
            this.call_api_get_list_place_first();
            await this.setState({
              tab: 2,
              title: 'Vị trí hiện tại',
              running: false
            });
            await clearInterval(this.state.interval);
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
})

const mapDispatchToProps = (dispatch) => ({
  get_user_infor: (idDevice) =>
    dispatch(ActionGetUserInfor.getuserinforRequest(idDevice)),

  get_list_place_stop: (end, start, idDevice, token) =>
    dispatch(ActionGetListPlaceStop.getlistplacestopRequest(end, start, idDevice, token)),

  get_list_place: (end, start, idDevice, token) =>
    dispatch(ActionGetListPlace.getlistplaceRequest(end, start, idDevice, token)),
})


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
