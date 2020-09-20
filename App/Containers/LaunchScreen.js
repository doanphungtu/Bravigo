import React, { Component } from 'react'
import {
  ScrollView, Text, Image, View,
  TouchableOpacity
} from 'react-native'
import { Images, Colors } from '../Themes'
import MapView, { Polyline, Marker, AnimatedRegion } from "react-native-maps";
import { decode } from "@mapbox/polyline";

// Styles
import styles from './Styles/LaunchScreenStyles'
import SliderCustom from '../Components/SliderCustom';

export default class LaunchScreen extends Component {

  constructor(props) {
    super(props);
    // this.ref = React.createRef();
    this.state = {
    }
  }

  render() {
    return (
      <View>
        <SliderCustom ref={refs => this.ref = refs} max_slider={100} />
        <TouchableOpacity onPress={() => console.tron.log("aaa", this.ref._getValueSlider())} style={{ width: 100, height: 50, backgroundColor: 'blue', alignSelf: 'center' }}><Text>aaaa</Text></TouchableOpacity>
      </View>
    )
  }
}
