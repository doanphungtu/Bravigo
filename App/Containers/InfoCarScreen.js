import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  TouchableOpacity,
  View,
  TextInput,
  Button,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Actions from '../Redux/UpdateUserInforRedux'
// Styles
import styles from './Styles/InfoCarScreenStyle'
import { Images, Colors, Fonts } from '../Themes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CardView from 'react-native-cardview';
import { AppInput } from '../Components/AppInput';
import AsyncStorage from '@react-native-community/async-storage';

class InfoCarScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Thông tin xe',
      headerStyle: {
        backgroundColor: Colors.main,
        shadowOpacity: 0,
        elevation: 0,
      },
      headerTitleStyle: {
        fontFamily: Fonts.type.title_navigation,
        fontWeight: "200",
        textAlign: "center",
        flex: 1,
        color: 'white'
      },
      headerLeft: () => (
        <TouchableOpacity activeOpacity={.7} style={{ paddingHorizontal: 15, paddingVertical: 5 }} onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={25} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View></View>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.data_userinfor.data_get_userinfor.data.msg.firstname,
      last_name: this.props.data_userinfor.data_get_userinfor.data.msg.lastName,
      license_plates: this.props.data_userinfor.data_get_userinfor.data.msg.licesePlates,
      phone_number: this.props.data_userinfor.data_get_userinfor.data.msg.phoneNumber,
      token: ''
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, data_update_user_infor } = props.UpdateUserInfor;
    if (error === false) {
      if (fetching === false && data_update_user_infor) {
        if (data_update_user_infor.data.success)
          this.props.navigation.navigate("DrawerNav");
        else
          alert(data_update_user_infor.data.msg);
      }
    }
  }

  componentDidMount() {
    this.getToken();
  }

  async getToken() {
    const token = await AsyncStorage.getItem("token");
    this.setState({ token });
  }

  render() {
    {
      StatusBar.setBackgroundColor(Colors.main);
      StatusBar.setBarStyle('light-content');
    }
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: '#FAFAFA', flex: 1 }}
      >
        <CardView
          cardElevation={5}
          cardMaxElevation={5}
          cornerRadius={8}
          style={styles.card}
        >
          <View style={styles.viewCard}>

            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Họ"
              value={this.state.first_name}
              onChange={first_name => this.setState({ first_name })}
            />

            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Tên"
              value={this.state.last_name}
              onChange={last_name => this.setState({ last_name })}
            />

            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Biển số xe"
              value={this.state.license_plates}
              onChange={license_plates => this.setState({ license_plates })}
            />

            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Số điện thoại"
              value={this.state.phone_number}
              onChange={phone_number => this.setState({ phone_number })}
            />
          </View>
        </CardView>
        <View style={styles.view_btn_next}>
          <TouchableOpacity
            onPress={() => this.btn_next()}
            style={[styles.btnNext, { backgroundColor: Colors.main }]}
            activeOpacity={.7}
          >
            <Text style={styles.txtBtnNext}>Cập nhật</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={[styles.btnNext, { backgroundColor: "#7C7B83" }]}
            activeOpacity={.7}
          >
            <Text style={styles.txtBtnNext}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    )
  }

  btn_next() {
    this.props.update_user_infor(
      this.state.last_name,
      this.state.first_name,
      this.state.license_plates,
      this.state.phone_number,
      this.state.token
    )
  }

}

const mapStateToProps = (state) => ({
  UpdateUserInfor: state.update_user_infor,
  data_userinfor: state.get_user_infor,
  data_sigin: state.signin
})

const mapDispatchToProps = (dispatch) => ({
  update_user_infor: (lastName, firstname, licesePlates, phoneNumber, token) =>
    dispatch(Actions.updateuserinforRequest(lastName, firstname, licesePlates, phoneNumber, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoCarScreen)
