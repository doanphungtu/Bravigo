import React, { Component } from 'react'
import {
    Text,
    // TouchableOpacity,
    View
} from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';
import { Colors, Metrics, Images } from '../Themes';
import Slider from '../Config/Slider';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class SliderCustom extends Component {
    constructor(props) {
        super(props);
        this.interval = null;
        this.state = {
            running: false,
            valueSlider: 0,
            max_slider: 100,
            speed: 1
        }
    }
    _setRunning(data) {
        this.setState({ running: data })
    }
    _clearInterval() {
        clearInterval(this.interval);
    }
    start() {
        clearInterval(this.interval);
        this.interval = setInterval(() => {
            if (this.state.running) {
                this.props.callback(this.state.valueSlider);
                if (this.state.valueSlider < this.state.max_slider) {
                    this.setState({
                        valueSlider: this.state.valueSlider + 1,
                    })
                } else {
                    clearInterval(this.interval);
                    this.setState({ running: false });
                }
            }
        }, this.state.speed == 1 ? 1500 : this.state.speed == 2 ? 1000 : 500)
    }
    render() {
        return (
            <View style={styles.view_slider}>
                <TouchableOpacity
                    style={styles.touch_slider}
                    onPress={() => {
                        this.setState({
                            running: !this.state.running,
                        });
                        if (this.props.enable)
                            this.start();
                    }}
                >
                    {this.state.running ?
                        <FontAwesome name="pause" size={18} color="grey" />
                        :
                        <FontAwesome name="play" size={20} color="grey" />
                    }
                </TouchableOpacity>
                <Slider
                    style={{ width: "65%" }}
                    value={this.state.valueSlider}
                    step={1}
                    minimumValue={0}
                    maximumValue={this.state.max_slider}
                    onValueChange={value => this.setState({ valueSlider: value })}
                    thumbTouchSize={{ width: 60, height: 60 }}
                    minimumTrackTintColor={Colors.main}
                    thumbImage={Images.car_slider}
                    thumbStyle={styles.thumb}
                />
                <TouchableOpacity
                    style={styles.touch_slider}
                    onPress={async () => {
                        let speed = this.state.speed;
                        if (speed == 3)
                            speed = 1
                        else
                            speed += 1
                        await this.setState({ speed });
                        if (this.props.enable)
                            this.start();
                    }}
                >
                    <Text style={styles.txt_touch_slider}>X{this.state.speed}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export const styles = StyleSheet.create({
    view_slider: {
        width: Metrics.screenWidth,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'white'
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
        backgroundColor: "#c63f17"
    }
})
