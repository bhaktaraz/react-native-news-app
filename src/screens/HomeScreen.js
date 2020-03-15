import { View, Text, StyleSheet } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import { FlatList } from 'react-native';
import Article from "../components/Article";
import { getNews } from '../store/DhangadhiKhabarClient';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: () => <MenuButton onPress={() => navigation.openDrawer()} />,
      headerTitle: () => <Logo />,
      headerBackTitle: "Home",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props);
    this.state = { articles: [], refreshing: true };
    this.fetchNews = this.fetchNews.bind(this);
}

  componentDidMount() {
    this.fetchNews();
}

fetchNews() {
    getNews()
        .then(articles => this.setState({ articles, refreshing: false }))
        .catch(() => this.setState({ refreshing: false }));
}

handleRefresh() {
    this.setState(
        {
            refreshing: true
        },
        () => this.fetchNews()
    );
}

  render() {
    return (
      <FlatList
          data={this.state.articles}
          renderItem={({ item }) => <Article article={item} navigation={this.props.navigation} />}
          keyExtractor={item => item.url}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh.bind(this)}
      />
  )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
