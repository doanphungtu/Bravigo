import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Metrics, Fonts, Colors } from '../../Themes/'
const { height } = Dimensions.get('screen');
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  viewTab: {
    height: 54,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderRadius: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    zIndex: 102
  },
  scaler: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 102
  },
  viewLocation: {
    flex: .5,
    height: 100,
  },
  touchLocation: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#c63f17'
  },
  viewBaoLocation: {
    position: 'absolute',
    bottom: 25,
    width: 1.15 * 56,
    height: 1.15 * 56,
    left: Metrics.screenWidth / 2 - (1.15 * 56) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 45,
    zIndex: 105,
    backgroundColor: 'white'
  },
  viewMap: {
    width: Metrics.screenWidth,
    height: height,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  viewTitle: {
    position: 'absolute',
    top: 20,
    width: '100%',
    height: 0,
    zIndex: 1
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    zIndex: 1,
    fontFamily: 'OpenSans-ExtraBold',
  },
  btnLocation: {
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0.45 * Metrics.screenHeight,
    right: 0.03 * Metrics.screenHeight
  },
  viewHeaderLocation: {
    height: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 0.1 * Metrics.screenHeight,
    alignContent: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    backgroundColor: 'white'
  },
  viewInnerLocation: {
    backgroundColor: '#fafafa',
    height: 0.3 * Metrics.screenHeight
  },
  itemInnerLocation: {
    height: 80,
    flexDirection: 'row'
  },
  viewIconItem: {
    flex: .1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewContentItem: {
    flex: .6,
    alignContent: 'flex-start',
    justifyContent: 'center'
  },
  viewRightItem: {
    flex: .3,
    alignContent: 'flex-start',
    justifyContent: 'center'
  },
  viewheaderInnerHistory: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 0.3 * Metrics.screenHeight + 70,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  itemInnerHistory: {
    backgroundColor: '#e0e0e0',
    height: 0.7 * Metrics.screenHeight,
  },
  viewItemHeaderHistory: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: 90
  },
  iconItemHistory: {
    height: '80%',
    width: '15%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  viewContentItemHistory: {
    height: '100%',
    width: '85%',
    backgroundColor: 'grey'
  },
  fromDay: {
    flex: .5,
    marginBottom: 1,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  toDay: {
    flex: .5,
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  viewItemInnerHistory: {
    backgroundColor: '#fafafa',
    height: 60,
    marginBottom: 1
  },
  viewCard: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtHeaderSheetHistory: {
    fontSize: 15,
    fontFamily: 'OpenSans-SemiBold',
  },
  txtHeaderSheerLocation: {
    fontSize: 17,
    fontFamily: 'OpenSans-SemiBold',
  },
  view_btn_bottom: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50
  },
  btn_bottom: {
    height: 40,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.main,
    width: 0.4 * Metrics.screenWidth,
    borderRadius: 8
  },
  txt_btn_bottom: {
    fontSize: 14,
    fontFamily: Fonts.type.regular,
    color: 'white'
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
    fontSize: 17,
    width: '90%',
    fontFamily: Fonts.type.regular,
    textAlign: 'center'
  },
  view_alert_BtnNext: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  btn_alert: {
    width: 200,
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
  },
  view_slider: {
    width: Metrics.screenWidth,
    height: 0.175 * Metrics.screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  touch_slider: {
    width: 0.175 * Metrics.screenWidth,
    height: 0.175 * Metrics.screenWidth,
    justifyContent: "center",
    alignItems: 'center',
  },
  txt_touch_slider: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold'
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor:"#c63f17"
  }
})
