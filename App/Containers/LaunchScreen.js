import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'
import MapView, { Polyline, Marker, AnimatedRegion } from "react-native-maps";
import { decode } from "@mapbox/polyline";

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      coords: '',
      setCoords: '',
      valueSlider: 0,
      latitude_car: 0,
      longitude_car: 0,
      coordinate: new AnimatedRegion({
        latitude: 21.054910,
        longitude: 105.731700,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1
      })
    },
      this.marker = React.createRef();
  }

  convert_data(lat, lng) {
    return lat + "," + lng;
  }

  getDirections = async (startLoc, destinationLoc) => {
    const start = this.convert_data(startLoc.latitude, startLoc.longitude);
    const destionation = this.convert_data(destinationLoc.latitude, destinationLoc.longitude);
    try {
      const KEY = "AIzaSyD_x8kFDvxo9vFvzMMJ98m6u4KfVmI12dY";
      let resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destionation}&key=${KEY}`
      );
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      return coords;
    } catch (error) {
      return error;
    }
  };

  componentDidMount() {
    const data = [
      { latitude: "21.055186", longitude: "105.731547" },
      { latitude: "21.058711", longitude: "105.726393" },
      // { latitude: "21.062796", longitude: "105.720613" },
      // { latitude: "21.064638", longitude: "105.717435" },
      // { latitude: "21.064357", longitude: "105.715833" },
      // { latitude: "21.063446", longitude: "105.716305" },
      // { latitude: "21.061915", longitude: "105.716155" }
    ]
    this.show_car(data);
  }

  show_car = (data) => {
    if (data.length < 3) {
      this.getDirections(data[0], data[1])
        .then(coords => {
          this.setState({ coords });
          let interval = setInterval(async () => {
            if (this.state.valueSlider == coords.length)
              clearInterval(interval);
            await this.setState({
              // latitude_car: Number(coords[this.state.valueSlider].latitude),
              // longitude_car: Number(coords[this.state.valueSlider].longitude),
              valueSlider: this.state.valueSlider == coords.length - 1 ? 0 : this.state.valueSlider + 1,
            })
            const newCoordinate = {
              latitude: Number(coords[this.state.valueSlider].latitude),
              longitude: Number(coords[this.state.valueSlider].longitude),
            };
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
          }, 1000)
        })
        .catch(err =>
          console.tron.log("Something went wrong")
        );
    } else {
      for (let i = 0; i < data.length; i++) {
        if (i <= data.length - 2) {
          const newCoordinate = {
            latitude: Number(data[i + 1].latitude),
            longitude: Number(data[i + 1].longitude),
          };
          this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
        }
      }
    }
  }

  render() {
    console.tron.log("a",this.state.coords)
    return (
      <View style={styles.mainContainer}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 21.054910,
            longitude: 105.731700,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1
          }}
        >
          {this.state.coords.length > 0 && <Polyline coordinates={this.state.coords} />}
          <Marker.Animated
            ref={(ref) => { this.marker = ref }}
            coordinate={this.state.coordinate}
          >
            <Image source={Images.car} style={{ height: 40, width: 40 }} />
          </Marker.Animated>
        </MapView>
      </View >
    )
  }
}
