import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  TouchableOpacity,
  View,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Textarea } from 'native-base';
import CardView from 'react-native-cardview';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Actions from '../Redux/ResetPasswordRedux'
// Styles
import styles from './Styles/ChangePasswordScreenStyle'
import { AppInput, BaseInput } from '../Components/AppInput';
import { Colors, Fonts } from '../Themes'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextInput } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

class ChangePasswordScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Đổi mật khẩu',
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
      password: 'test',
      new_password: 'test',
      confirm_password: 'test',
      hidePassword: false,
      hidePassword1: false,
      hidePassword2: false,
      token:''
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, reset_password } = props.reset_password;
    if (error === false) {
      if (fetching === false && reset_password) {
        if (reset_password.data.success)
          this.props.navigation.navigate("DrawerNav");
        else
          alert(reset_password.data.msg);
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
      <KeyboardAwareScrollView contentContainerStyle={{ width: '100%' }}>
        <View style={styles.container}>
          <CardView
            style={styles.content}
            cardElevation={5}
            cardMaxElevation={5}
            cornerRadius={8}
          >
            <BaseInput
              label="Mật khẩu cũ"
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
            <BaseInput
              label="Mật khẩu mới"
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
            >
              <TextInput
                secureTextEntry={this.state.hidePassword2}
                style={[styles.input, { paddingRight: '17%' }]}
                value={this.state.new_password}
                onChangeText={(new_password) => this.setState({ new_password })}
              />
              <TouchableOpacity
                onPress={() => this.setState({ hidePassword2: (!this.state.hidePassword2) })}
                activeOpacity={.7}
                style={styles.touchEye}
              >
                <Ionicons color="#97ADB6" name={this.state.hidePassword2 ? "ios-eye-off" : 'ios-eye'} size={25} />
              </TouchableOpacity>
            </BaseInput>
            <BaseInput
              label="Nhập lại mật khẩu"
              containerStyle={styles.containerStyle}
              lableStyle={styles.txtLable}
            >
              <TextInput
                secureTextEntry={this.state.hidePassword3}
                style={[styles.input, { paddingRight: '17%' }]}
                value={this.state.confirm_password}
                onChangeText={(confirm_password) => this.setState({ confirm_password })}
              />
              <TouchableOpacity
                onPress={() => this.setState({ hidePassword3: (!this.state.hidePassword3) })}
                activeOpacity={.7}
                style={styles.touchEye}
              >
                <Ionicons color="#97ADB6" name={this.state.hidePassword3 ? "ios-eye-off" : 'ios-eye'} size={25} />
              </TouchableOpacity>
            </BaseInput>
          </CardView>
          <View style={styles.view_btn_next}>
            <TouchableOpacity
              style={[styles.btnNext, { backgroundColor: Colors.main }]}
              activeOpacity={.7}
              onPress={() => this.btn_next()}
            >
              <Text style={styles.txtBtnNext}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btnNext, { backgroundColor: "#7C7B83" }]}
              activeOpacity={.7}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={styles.txtBtnNext}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
  btn_next() {
    this.props.change_password(this.state.password, this.state.new_password, this.state.confirm_password, this.state.token);
  }
}

const mapStateToProps = (state) => ({
  reset_password: state.reset_password,
})

const mapDispatchToProps = (dispatch) => ({
  change_password: (password, new_password, confirm_password, token) =>
    dispatch(Actions.resetpasswordRequest(password, new_password, confirm_password, token)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordScreen)
