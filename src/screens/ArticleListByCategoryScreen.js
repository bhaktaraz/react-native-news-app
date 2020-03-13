import React, { Component } from 'react';
import {FlatList} from 'react-native';
import Article from "../components/Article";
import { getNewsByCategory } from '../store/DhangadhiKhabarClient';

class ArticleListByCategoryScreen extends Component {

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const id = navigation.getParam('id');

        this.state = { news: [], id: id, refreshing: true };
        this.fetchNews = this.fetchNews.bind(this);
    }

    componentDidMount() {
        this.fetchNews();
    }

    fetchNews() {
        getNewsByCategory(this.state.id)
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

export default ArticleListByCategoryScreen;
