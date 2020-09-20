import React, { Component } from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import ChangePasswordScreen from '../Containers/ChangePasswordScreen'
import InfoCarScreen from '../Containers/InfoCarScreen'
import HelpScreen from '../Containers/HelpScreen'
import IntroduceScreen from '../Containers/IntroduceScreen'
import HomeScreen from '../Containers/HomeScreen'
import SignInScreen from '../Containers/SignInScreen'
import SignUpScreen from '../Containers/SignUpScreen'
import AuthScreen from '../Containers/AuthScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import { createDrawerNavigator } from 'react-navigation-drawer';

import styles from './Styles/NavigationStyles'
import { Easing, Animated } from 'react-native'
import drawerContentComponents from '../Containers/drawerContentComponents'
import { Metrics } from '../Themes'

// Manifest of possible screens
const transitionConfig = () => {
  return {
    transitionSpec: {
      duration: 600,
      easing: Easing.out(Easing.poly(10)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: sceneProps => {
      const { layout, position, scene } = sceneProps

      const thisSceneIndex = scene.index
      const width = layout.initWidth

      const translateX = position.interpolate({
        inputRange: [thisSceneIndex - 1, thisSceneIndex],
        outputRange: [width, 0],
      })

      return { transform: [{ translateX }] }
    },
  }
}

const DrawerNav = createDrawerNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
    },
  },
  {
    contentComponent: drawerContentComponents,
    drawerPosition: 'right',
    drawerWidth: 0.8 * Metrics.screenWidth,
  },
);

const PrimaryNav = createStackNavigator({
  ChangePasswordScreen: { screen: ChangePasswordScreen },
  InfoCarScreen: { screen: InfoCarScreen },
  HelpScreen: { screen: HelpScreen },
  IntroduceScreen: { screen: IntroduceScreen },
  DrawerNav: {
    screen: DrawerNav, navigationOptions: {
      header: null,
    },
  },
  LaunchScreen: { screen: LaunchScreen }
}, {
  headerMode: 'float',
  initialRouteName: 'DrawerNav',
  transitionConfig,
})

const SwitchNav = createSwitchNavigator({
  SignInScreen: { screen: SignInScreen },
  SignUpScreen: { screen: SignUpScreen },
  AuthScreen: { screen: AuthScreen },
  PrimaryStack: PrimaryNav,
  test: LaunchScreen
},
  {
    headerMode: 'none',
    initialRouteName: 'SignInScreen',
    transitionConfig,
  }
)

export default createAppContainer(SwitchNav);

