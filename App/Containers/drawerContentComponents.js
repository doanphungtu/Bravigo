import React, { Component } from 'react';
import { NavigationActions, FlatList } from 'react-navigation';
import {
  Text, View, StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity
} from 'react-native'
import { Images, Metrics, Colors } from '../Themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux'
import Modal from 'react-native-modal'

import Actions from '../Redux/SigninRedux'

import styles from './Styles/drawerContentComponentsStyles'
import AsyncStorage from '@react-native-community/async-storage';
class drawerContentComponents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      show_modal_alert: false,
    }
  }

  navigateToScreen = (route) => (
    () => {
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction);
    })

  logout() {
    AsyncStorage.removeItem("idDevice");
    AsyncStorage.removeItem("token");
    this.setState({ show_modal_alert: false });
    this.props.navigation.navigate('SignInScreen');
    this.props.logout();
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
            <Text style={styles.txt_alert_Content}>Bạn muốn đăng xuất ?</Text>
          </View>
          <View style={styles.view_alert_BtnNext}>
            <TouchableOpacity
              style={styles.btn_alert}
              onPress={() => { this.setState({ show_modal_alert: false }) }}
              activeOpacity={.6}
            >
              <Text style={styles.txt_btn_alert}>
                Không
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn_alert}
              onPress={() => this.logout()}
              activeOpacity={.6}
            >
              <Text style={styles.txt_btn_alert}>
                Có
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  _renderItems(item, index) {
    return (
      <TouchableOpacity
        style={styles.touchItemDrawer}
        activeOpacity={.6}
        onPress={() => {
          if (index === 3) {
            this.setState({ show_modal_alert: true });
          } else
            this.props.navigation.navigate(item.screen)
        }}
      >
        <View style={styles.viewIconDreawer}>
          {
            index !== 3 ?
              <MaterialIcons name={item.icon} size={25} color={'black'} />
              :
              <MaterialCommunityIcons name={item.icon} size={25} color={'black'} />
          }
        </View>
        <View style={styles.contentItemDrawer}>
          <Text style={styles.txtContentItemDrawer}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const data = [
      { name: 'Giới thiệu', icon: 'assistant', screen: 'IntroduceScreen' },
      { name: 'Đổi mật khẩu', icon: 'lock-outline', screen: 'ChangePasswordScreen' },
      { name: 'Thông tin xe', icon: 'directions-car', screen: 'InfoCarScreen' },
      { name: 'Đăng xuất', icon: 'logout', screen: 'SignInScreen' },
    ]
    return (
      <View style={styles.container}>
        {this.modal_alert()}
        <LinearGradient
          colors={[Colors.main, '#3b5998', '#192f6a']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.headerContainer}
        >
          <Image source={Images.user_avatar} style={{ width: 120, height: 120 }} />
          <Text style={styles.txtHeaderDrawer}>{this.props.data_userinfor.data_get_userinfor ? this.props.data_userinfor.data_get_userinfor.data.msg.firstname + " " + this.props.data_userinfor.data_get_userinfor.data.msg.lastName : 'Unknown'}</Text>
        </LinearGradient>
        <View style={styles.contentDrawer}>
          <FlatList
            style={{ backgroundColor: '#EFF3F6', width: 0.8 * Metrics.screenWidth }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'flex-start' }}
            data={data}
            renderItem={({ item, index }) => this._renderItems(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  data_userinfor: state.get_user_infor
})

const mapDispatchToProps = (dispatch) => ({
  logout: (token) =>
    dispatch(Actions.logout()),
})

export default connect(mapStateToProps, mapDispatchToProps)(drawerContentComponents)
