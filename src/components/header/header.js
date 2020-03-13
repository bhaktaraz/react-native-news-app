import React from 'react'
import {Image, TouchableOpacity, Dimensions} from 'react-native'
import Icon from "react-native-vector-icons/Ionicons";
import {View} from "react-native";
const deviceWidth = Dimensions.get("window").width;

export class Logo extends React.Component {
    render() {
        return (
            //Add your logo in the image tag
            <View style={{ flex: 0.8 }}>
            <Image
                source={require('../../assets/dk-logo.jpeg')}
                resizeMode = "contain"
                style = {{
                    width: 110,
                    marginTop: 10,
                    alignSelf:'center'
                }}
            />
            </View>
        );
    }
}

export class MenuButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress = {this.props.onPress} ><Icon name = "md-menu" size={30} style = {{color: 'black',paddingLeft: 10}}/></TouchableOpacity>
        );
    }
}