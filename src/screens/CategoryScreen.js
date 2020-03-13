
import React, { Component } from 'react';
import { FlatList } from 'react-native';
import Category from "../components/Category";
import { getCategories } from '../store/DhangadhiKhabarClient';

class CategoryScreen extends Component {
    static navigationOptions = {
        title: 'वर्ग',
    };

    constructor(props) {
        super(props);
        this.state = { categories: [], refreshing: true };
        this.fetchCategories = this.fetchCategories.bind(this);
    }

    componentDidMount() {
        this.fetchCategories();
    }

    fetchCategories() {
        getCategories()
            .then(categories => this.setState({ categories, refreshing: false }))
            .catch(() => this.setState({ refreshing: false }));
    }

    handleRefresh() {
        this.setState(
            {
                refreshing: true
            },
            () => this.fetchCategories()
        );
    }

    render() {
        return (
            <FlatList
                data={this.state.categories}
                renderItem={({ item }) => <Category category={item} navigation={this.props.navigation} />}
                keyExtractor={item => item.id}
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh.bind(this)}
            />
        )
    }
};

export default CategoryScreen;
