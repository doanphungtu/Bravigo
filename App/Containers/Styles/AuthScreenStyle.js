import { StyleSheet, Dimensions } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes/'
export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
  },
  viewTitle: {
    width: "100%",
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  txtTitle: {
    fontSize: 20,
  },
  viewLogo: {
    width: '100%',
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logo: {
    width:120,
    height:120,
  },
  content: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingTop: 50
  },
  input: {
    width: '90%',
    borderWidth: .5,
    borderRadius: 15,
    backgroundColor: '#F7F8F9',
    borderColor: '#D5DDE0',
    paddingHorizontal: 10,
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
    marginTop: 39
  },
  txtBtnNext: {
    fontSize: 15,
    color: 'white'
  }
})
