import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 30,
    height: 400
  },
  viewCard: {
    width: '90%',
    height: '90%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  btnNext: {
    width: 0.4 * Metrics.screenWidth,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
  },
  txtBtnNext: {
    fontSize: 15,
    fontFamily: Fonts.type.bold,
    color: "white"
  },
  view_btn_next: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    height: 50,
    // marginBottom: 30
  },
  containerStyle: {
    marginBottom: 10,
    position: 'relative'
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
})
