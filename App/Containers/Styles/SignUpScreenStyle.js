import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
  },
  viewTitle: {
    width: "100%",
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtTitle: {
    fontSize: 20,
  },
  viewLogo: {
    width: '100%',
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 110,
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 15
  },
  input: {
    width: '90%',
    borderWidth: .5,
    borderRadius: 15,
    backgroundColor: '#F7F8F9',
    borderColor: '#D5DDE0',
    paddingHorizontal: '5%',
    height: 44
  },
  txtLable: {
    fontSize: 15,
    color: 'black',
    paddingBottom: 7,
  },
  btnNext: {
    height: 48,
    width: '90%',
    backgroundColor: Colors.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30
  },
  txtBtnNext: {
    fontSize: 15,
    color: 'white'
  },
  containerStyle: {
    marginBottom: 10,
    position: 'relative'
  },
  touchEye: {
    position: 'absolute',
    right: '5%',
    bottom: 6,
    zIndex: 1,
    height: 44,
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBottom: {
    width: '90%',
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtBottom: {
    fontSize: 15,
    color: '#97ADB6'
  },
  txNextBottom: {
    color: Colors.main,
    textDecorationLine: 'underline'
  },
  modal_loading_Container: {
    width: 0.8 * Metrics.screenWidth,
    height: 140,
    borderRadius: 8,
    backgroundColor: 'white',
    position: 'absolute',
    top: Metrics.screenHeight / 2 - 50,
    left: Metrics.screenWidth / 2 - 0.4 * Metrics.screenWidth,
    margin: 0
  },
  view_modal_loading: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 70
  },
  txt_modal_loading: {
    color: 'black',
    fontSize: 15,
    fontFamily: Fonts.type.regular,
    textAlign: 'center'
  },
  img_modal: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: -30,
    left: Metrics.screenWidth / 2 - 60
  },
  btn_ok_modal: {
    height: 40,
    width: 100,
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: "#F15249",
    borderRadius: 5,
    alignSelf: 'center'
  },
  txt_btn_ok_modal: {
    fontSize: 15,
    color: 'white',
    fontFamily: Fonts.type.bold
  }
})
