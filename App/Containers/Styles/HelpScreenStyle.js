import { StyleSheet } from 'react-native'
import { ApplicationStyles,Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    width: '90%',
    // height: '100%',
    alignItems: 'center'
  },
  viewTitle: {
    width: '100%',
    height: 50,
    justifyContent: 'center'
  },
  txtTilte: {
    fontSize: 16,
    color: 'black',
    fontFamily:Fonts.type.bold
  },
  input: {
    height: 80,
    width: '100%',
    fontFamily:Fonts.type.regular
  },
  card: {
    height: 80,
    width: '100%'
  },
  viewBtnNext: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    height: 100
  },
  btnNext: {
    height: 40,
    width: 75,
    backgroundColor: Colors.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  txtBtnNext: {
    fontSize: 14,
    color: 'white',
    fontFamily:Fonts.type.regular
  }
})
