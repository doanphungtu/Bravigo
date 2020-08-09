import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts, Metrics } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    alignItems: 'center'
  },
  containerStyle: {
    marginBottom: 10,
    position: 'relative'
  },
  txtLable: {
    fontSize: 15,
    color: 'black',
    paddingBottom: 7,
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
  input: {
    width: '90%',
    borderWidth: .5,
    borderRadius: 15,
    backgroundColor: '#F7F8F9',
    borderColor: '#D5DDE0',
    paddingHorizontal: '5%',
    height: 44
  },
  view_btn_next: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    height: 50,
  },
  content: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 30
  },
  btnNext: {
    height: 45,
    width: 0.4 * Metrics.screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  txtBtnNext: {
    fontSize: 15,
    fontFamily: Fonts.type.bold,
    color: 'white'
  }
})
