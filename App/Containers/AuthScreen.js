import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AppInput } from '../Components/AppInput'

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Actions from '../Redux/checkAuthCode'
// Styles
import styles from './Styles/AuthScreenStyle'
import { Images, Colors, Metrics } from '../Themes'

class AuthScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();
    this.state = {
      input: '212523456943328'
    }
  }

  componentWillReceiveProps(props) {
    const { fetching, error, data_check_authcode } = props.CheckAuthCode;
    console.tron.log("propsAuth", props);
    if (error === false) {
      if (fetching === false && data_check_authcode) {
        if (data_check_authcode.data.success)
          this.props.navigation.navigate("SignUpScreen", { codeActive: this.state.input });
        else
          alert(data_check_authcode.data.msg);
      }
    }
  }

  render() {
    {
      StatusBar.setBackgroundColor("white");
      StatusBar.setBarStyle('dark-content');
    }
    return (
      <KeyboardAwareScrollView contentContainerStyle={{ width: '100%', height: Metrics.screenHeight }}>
        <View style={styles.container}>
          <View style={styles.viewTitle}>
            <Text style={styles.txtTitle}>Đăng ký</Text>
          </View>
          <View style={styles.viewLogo}>
            <Image source={Images.logo1} style={styles.logo} />
          </View>
          <View style={styles.content}>
            <AppInput
              lableStyle={styles.txtLable}
              style={styles.input}
              label="Mã kích hoạt"
              value={this.state.input}
              onChange={input => this.setState({ input })}
            />
            <TouchableOpacity
              style={styles.btnNext}
              activeOpacity={.7}
              onPress={() => this.btn_next()}
            >
              <Text style={styles.txtBtnNext}>Tiếp tục</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }

  btn_next() {
    this.props.check_auth_code(this.state.input);
  }
}

const mapStateToProps = (state) => ({
  CheckAuthCode: state.check_auth_code
})

const mapDispatchToProps = (dispatch) => ({
  check_auth_code: (idDevice) =>
    dispatch(Actions.checkauthcodeRequest(idDevice)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)
