import React, { Component } from 'react';
import { Text, Button, Card, Divider } from 'react-native-elements';
import { View, Linking, TouchableNativeFeedback } from 'react-native';
import moment from 'moment';
import {Icon} from "native-base";

export default class Tag extends Component {
    render() {
        const {
            tag_id,
            total_count,
            name,
            slug
        } = this.props.tag;
        const { noteStyle, featuredTitleStyle } = styles;
       
        return (
            <TouchableNativeFeedback
                useForeground
                onPress={() => this.props.navigation.navigate('ArticleDetailScreen', {id: id})}
            >
                <Card
                    featuredTitle={name}
                    featuredTitleStyle={featuredTitleStyle}
                >
                    <Text style={{ marginBottom: 10 }}>
                        #{name} [{total_count}]
                    </Text>
                </Card>
            </TouchableNativeFeedback>
        );
    }
}

const styles = {
    noteStyle: {
        margin: 5,
        fontStyle: 'italic',
        color: '#b2bec3',
        fontSize: 10
    },
    featuredTitleStyle: {
        marginHorizontal: 5,
        textShadowColor: '#00000f',
        textShadowOffset: { width: 3, height: 3 },
        textShadowRadius: 3
    }
};
