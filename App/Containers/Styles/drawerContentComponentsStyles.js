import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    alignItems: 'center',
  },
  headerContainer: {
    height: 200,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  contentDrawer: {
    backgroundColor: 'red'
  },
  txtHeaderDrawer: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: 'white'
  },
  touchItemDrawer: {
    flexDirection: 'row',
    width: '100%',
    // alignItems: 'center',
    height: 55,
    marginBottom: 1,
    backgroundColor: 'white'
  },
  viewIconDreawer: {
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center'
  },
  contentItemDrawer: {
    flex: 1,
    justifyContent: "center",
    alignContent: 'flex-start',
    width: 0.8 * Metrics.screenWidth - 55
  },
  txtContentItemDrawer: {
    fontSize: 17,
    color: 'black',
    fontFamily: 'OpenSans-SemiBold'
  },
  modal_alert_Container: {
    width: '80%',
    height: 200,
    borderRadius: 8,
    backgroundColor: 'white',
    position: 'absolute',
    top: Metrics.screenHeight / 2 - 125,
    left: Metrics.screenWidth / 2 - 0.4 * Metrics.screenWidth,
    margin: 0
  },
  view_alert_Title: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8
  },
  txt_alert_Title: {
    color: 'white',
    fontSize: 17,
    fontFamily: Fonts.type.title_navigation
  },
  view_alert_Content: {
    width: '100%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt_alert_Content: {
    fontSize: 15,
    width: '90%',
    fontFamily: Fonts.type.regular
  },
  view_alert_BtnNext: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  btn_alert: {
    width: 0.3 * Metrics.screenWidth,
    height: 40,
    backgroundColor: Colors.main,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txt_btn_alert: {
    fontSize: 15,
    color: 'white',
    fontFamily: Fonts.type.regular
  }
})