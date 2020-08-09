import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1
  },
  logo: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    width: '100%',
    height: '20%',
    paddingHorizontal: '5%',
    justifyContent: 'center',
    alignItems:'center'
  },
  link: {
    color: 'blue',
    textDecorationLine: "underline",
  },
  txt_des: {
    fontSize: 15,
    textAlign: 'center',
    fontFamily: Fonts.type.setting,
  }
})
