import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Tag from "../components/Tag";
import { getTrendingTags } from '../store/DhangadhiKhabarClient';

class TrendingTags extends Component {
    static navigationOptions = {
        title: 'ट्रेंडिंग',
    };

    constructor(props) {
        super(props);
        this.state = { tags: [], refreshing: true };
        this.fetchTags = this.fetchTags.bind(this);
    }

    componentDidMount() {
        this.fetchTags();
    }

    fetchTags() {
        getTrendingTags()
            .then(tags => this.setState({ tags, refreshing: false }))
            .catch(() => this.setState({ refreshing: false }));
    }

    handleRefresh() {
        this.setState(
            {
                refreshing: true
            },
            () => this.fetchTags()
        );
    }

    render() {
        return (
            <FlatList
                data={this.state.tags}
                renderItem={({ item }) => <Tag tag={item} navigation={this.props.navigation} />}
                keyExtractor={item => item.tag_id}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
            />
        )
    }
};

export default TrendingTags;
