import React, { Component } from 'react';
import {FlatList} from 'react-native';
import {getNewsDetail} from "../store/DhangadhiKhabarClient";
import Detail from "../components/Detail";

class ArticleDetail extends Component {

    constructor(props) {
        super(props);

        const { navigation } = this.props;
        const id = navigation.getParam('id');

        this.state = { news: [], id: id, loading: true };
        this.fetchNews = this.fetchNews.bind(this);
    }

    componentDidMount() {
        this.fetchNews();
    }

    fetchNews() {
        getNewsDetail(this.state.id)
            .then(news => this.setState({ news, loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    render() {
        return (
             <Detail news={this.state.news} navigation={this.props.navigation} loading={this.state.loading} />
        )
    }
};

export default ArticleDetail;
