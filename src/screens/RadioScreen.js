import { View, Text, StyleSheet } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import { HeaderBackButton } from "react-navigation-stack";
import TrackPlayer from 'react-native-track-player';
import { useTrackPlayerEvent, TrackPlayerEvents, STATE_PLAYING } from 'react-native-track-player';
import { Icon, Button } from 'native-base';

const events = [
  TrackPlayerEvents.PLAYBACK_STATE,
  TrackPlayerEvents.PLAYBACK_ERROR
];

export default class RadioScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = { isPlaying: true };
}
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      headerTitle: <Logo />,
      headerBackTitle: "Radio Dhangadhi",
      headerLayoutPreset: "center"
    };
  };

  togglePlayer = () => {
    if(this.state.isPlaying){
      TrackPlayer.stop();
      this.setState({ isPlaying: false });
    }else{
      TrackPlayer.play();
      this.setState({ isPlaying: true });
    }
  }

  render() {
    TrackPlayer.setupPlayer().then(async () => {
      // Adds a track to the queue
    await TrackPlayer.add({
      id: 'trackId',
      url: 'http://streaming.hamropatro.com:8617/;',
      title: 'You are listening',
      artist: 'Radio Dhangadhi 90.5',
      // artwork: require('track.png')
      });

      // Starts playing it
      if(this.state.isPlaying){
      TrackPlayer.play();
      }

    });

    const isPlaying = this.state.isPlaying;

    let button;

    if (isPlaying) {
      button = <Button transparent onPress={this.togglePlayer}>
        <Icon name="pause" />
      </Button>;
    } else {
      button = <Button transparent onPress={this.togglePlayer}>
        <Icon name="play" />
      </Button>;
    }

    return (
      <View style={styles.container}>
        <Text>You are listening Radio Dhangadhi 90.5 Mhz</Text>
        
        {button}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
