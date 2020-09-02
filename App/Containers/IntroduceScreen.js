import React, { Component } from 'react'
import {
  ScrollView, Text, KeyboardAvoidingView,
  Image,
  View,
  Linking,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons';

// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/IntroduceScreenStyle'
import { Images, Colors, Fonts, Metrics } from '../Themes'

class IntroduceScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Giới thiệu',
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

  render() {
    {
      StatusBar.setBackgroundColor(Colors.main);
      StatusBar.setBarStyle('light-content');
    }
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image style={{ width: 0.6 * Metrics.screenWidth, height: 0.6 * Metrics.screenWidth }} source={Images.logo1} />
        </View>
        <View style={styles.text}>
          <Text style={styles.txt_des}>Bản quyền thuộc về  <Text style={styles.link} onPress={() => Linking.openURL('http://lifetek.com.vn')}>LIFETEK.COM.VN</Text></Text>
          <Text style={styles.txt_des}>Mọi thắc mắc vui lòng liên hệ qua ứng dụng hoặc hotro@cni.vn</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IntroduceScreen)
