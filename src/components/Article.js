import React, { Component } from 'react';
import { Text, Button, Card, Divider } from 'react-native-elements';
import { View, Linking, TouchableNativeFeedback } from 'react-native';
import moment from 'moment';
import {Icon} from "native-base";

export default class Article extends Component {
    render() {
        const {
            id,
            title,
            intro,
            created_on,
            date_en,
            date_np,
            author,
            image,
            url
        } = this.props.article;
        const { noteStyle, featuredTitleStyle } = styles;
        const time = moment(created_on || moment.now()).fromNow();
        const defaultImg = 'https://www.dhangadhikhabar.com/uploads/configuration/DHANGADHI-KHABAR-HD-FINAL-LOGO.jpeg';

        return (
            <TouchableNativeFeedback
                useForeground
                onPress={() => this.props.navigation.navigate('ArticleDetail', {id: id})}
            >
                <Card
                    // featuredTitle={title}
                    // featuredTitleStyle={featuredTitleStyle}
                    image={{
                        uri: image || defaultImg
                    }}
                >
                    <Text style={featuredTitleStyle}>
                        {title}
                    </Text>
                    <Divider style={{ backgroundColor: '#dfe6e9' }} />
                    <View
                        style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                    >
                        <Text style={noteStyle}><Icon name="person" style={{fontSize: 10}} /> {author.name}</Text>
                        <Text style={noteStyle}><Icon name="clock" style={{fontSize: 10}} /> {time}</Text>
                    </View>
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
        textShadowRadius: 0,
        fontSize: 22
    }
};
