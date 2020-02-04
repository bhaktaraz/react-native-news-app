import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Article from "../components/Article";
import { getNews } from '../store/DhangadhiKhabarClient';

class LatestNews extends Component {
    static navigationOptions = {
        title: 'भर्खरै',
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
};

export default LatestNews;
