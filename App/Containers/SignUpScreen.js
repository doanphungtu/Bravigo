import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppInput, BaseInput } from '../Components/AppInput'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Actions from "../Redux/SignupRedux"
// Styles
import styles from './Styles/SignUpScreenStyle'
import { Images, Colors, Metrics } from '../Themes'
import AsyncStorage from '@react-native-community/async-storage'

class SignUpScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      codeActive: '',
      hidePassword: false,
      show_modal_success: false,
      show_modal_fail: false,
      message: '',
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, data_signup } = props.Signup;
    if (error === false) {
      if (fetching === false && data_signup) {
        if (data_signup.data.success === true) {
          AsyncStorage.setItem("idDevice", data_signup.data.data.idDevice);
          this.setState({ show_modal_success: true });
          setTimeout = () => {
            this.setState({ show_modal_success: false }),
              50
          }
        } else {
          this.setState({ message: data_signup.data.msg, show_modal_fail: true });
        }
      }
    }
  }

  modal_fail() {
    return (
      <Modal
        isVisible={this.state.show_modal_fail}
        style={styles.modal_loading_Container}
        onBackdropPress={() => this.setState({ show_modal_fail: false })}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <Image source={Images.fail} style={styles.img_modal} />
        <View style={styles.view_modal_loading}>
          <Text style={styles.txt_modal_loading}>{this.state.message}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={.5}
          style={styles.btn_ok_modal}
          onPress={() => this.setState({ show_modal_fail: false })}
        >
          <Text style={styles.txt_btn_ok_modal}>Thử lại</Text>
        </TouchableOpacity>
      </Modal>
    );
  }

  modal_success() {
    return (
      <Modal
        isVisible={this.state.show_modal_success}
        style={[styles.modal_loading_Container, { height: 100 }]}
        onBackdropPress={() => this.setState({ show_modal_success: false })}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onModalHide={() => this.props.navigation.navigate("DrawerNav")}
      >
        <Image source={Images.tick} style={styles.img_modal} />
        <View style={styles.view_modal_loading}>
          <Text style={[styles.txt_modal_loading, { fontSize: 16 }]}>Đăng ký thành công</Text>
        </View>
      </Modal >
    );
  }

  render() {
    {
      StatusBar.setBackgroundColor("white");
      StatusBar.setBarStyle('dark-content');
    }
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ width: '100%' }}>
        <View style={styles.container}>
          {this.modal_fail()}
          {this.modal_success()}
          <View style={styles.viewTitle}>
            <Text style={styles.txtTitle}>Đăng ký</Text>
          </View>
          <View style={styles.viewLogo}>
            <Image source={Images.logo} style={styles.logo} />
          </View>
          <View style={styles.content}>
            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Mã kích hoạt"
              value={this.state.codeActive}
              onChange={codeActive => this.setState({ codeActive })}
            />
            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Họ tên"
              value={this.state.name}
              onChange={name => this.setState({ name })}
            />
            <AppInput
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Email"
              value={this.state.email}
              onChange={email => this.setState({ email })}
            />
            <BaseInput
              label="Mật khẩu"
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
            >
              <TextInput
                secureTextEntry={this.state.hidePassword}
                style={[styles.input, { paddingRight: '17%' }]}
                value={this.state.password}
                onChangeText={(password) => this.setState({ password })}
              />
              <TouchableOpacity
                onPress={() => this.setState({ hidePassword: (!this.state.hidePassword) })}
                activeOpacity={.7}
                style={styles.touchEye}
              >
                <Ionicons color="#97ADB6" name={this.state.hidePassword ? "ios-eye-off" : 'ios-eye'} size={25} />
              </TouchableOpacity>
            </BaseInput>
            <TouchableOpacity
              style={styles.btnNext}
              activeOpacity={.7}
              onPress={() => this.btn_next()}
            >{
                this.props.Signup.fetching ?
                  <ActivityIndicator size="small" color="white" />
                  :
                  <Text style={styles.txtBtnNext}>Đăng ký</Text>
              }
            </TouchableOpacity>
            <View style={styles.viewBottom}>
              <Text style={styles.txtBottom}>Bạn đã có tài khoản ?  <Text style={styles.txNextBottom} onPress={() => this.props.navigation.navigate('SignInScreen')}>Đăng nhập</Text></Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
  btn_next() {
    this.props.signup(this.state.email, this.state.password, this.state.codeActive);
  }
}

const mapStateToProps = (state) => ({
  Signup: state.signup
})

const mapDispatchToProps = (dispatch) => ({
  signup: (email, password, codeActive) =>
    dispatch(Actions.SignupRequest(email, password, codeActive)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen)
