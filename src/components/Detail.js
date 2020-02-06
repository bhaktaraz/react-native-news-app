import React, { Component } from 'react';
import {Image, ScrollView, Share, TouchableNativeFeedback, Linking} from 'react-native';
import { H1, H2, Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body, List, ListItem } from 'native-base';
import moment from 'moment';
import HTMLView from 'react-native-htmlview';
import YouTube from 'react-native-youtube';

export default class Detail extends Component {

    handleShare(article) {
        Share.share({
            title: article.title,
            message: article.url +' '+ article.intro,
            url: article.url
        }, {
            url: article.url,
            // Android only:
            dialogTitle: article.title,
            // iOS only:
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter'
            ]
        }).then((res) => console.log(res))
            .catch((error) => console.log(error))
    }

    renderNode(node, index, siblings, parent, defaultRenderer) {
        if (node.name == 'img') {
            return ( <Image style={{width: 380, height: 400}} source={{uri: node.attribs.src}} /> );
        }
    }

    render() {
        const {
            id,
            title,
            intro,
            content,
            categories,
            created_on,
            date_en,
            date_np,
            author,
            image,
            url,
            view_count,
            youtube_video_id,
            related_news
        } = this.props.news;
        const { noteStyle, featuredTitleStyle } = styles;
        const time = moment(created_on || moment.now()).fromNow();
        const defaultImg = 'https://www.dhangadhikhabar.com/uploads/configuration/LOGO.jpg';

        return (
            <ScrollView>
                <Card style={{flex: 0}}>
                    <CardItem>
                        <Body>
                            <H1>{title}</H1>
                        </Body>
                    </CardItem>

                    <CardItem>
                        <Body>
                        <Text note><Icon name="person" style={{fontSize: 15}} /> {author ? author.name : author} &nbsp; &nbsp;  <Icon name="clock" style={{fontSize: 15}} /> {date_np}</Text>
                        </Body>
                    </CardItem>

                    <CardItem>
                        <Left>
                            <Button
                                transparent
                                textStyle={{color: '#87838B'}}
                                onPress={() => {
                                    this.handleShare(this.props.news)
                                }}
                            >
                                <Icon name="share" />
                            </Button>

                            <TouchableNativeFeedback
                                useForeground
                                textStyle={{color: '#87838B'}}
                                onPress={() => Linking.openURL(url)}
                            >
                            <Icon name="link" />
                            </TouchableNativeFeedback>
                        </Left>
                    </CardItem>

                    <CardItem>
                        <Body>
                            <Image source={{uri: image || defaultImg}}  style={{width: 380, height: 200}} />
                        </Body>
                    </CardItem>

                    <CardItem>
                        <Body>
                            <HTMLView
                                addLineBreaks={false}
                                stylesheet={styles_content}
                                value={content}
                                renderNode={this.renderNode}
                            />
                        </Body>
                    </CardItem>

                    {
                        youtube_video_id &&

                            <YouTube
                                apiKey="AIzaSyBqsWwIfLTfgKuTPsoc6QoWKlTfH-czUTY"
                                videoId={youtube_video_id}
                                play={true}
                                loop={true}
                                controls={1}

                                style={{ alignSelf: 'stretch', height: 300 }}
                            />
                    }
                </Card>

                <Card style={{flex: 0}}>

                    <CardItem>
                        <Body>
                            <H2>सम्बन्धित शीर्षकहरु</H2>
                        </Body>
                    </CardItem>

                    <List>
                        {
                            related_news && related_news.map((n) => {
                                return (

                                    <TouchableNativeFeedback
                                        key={n.id}
                                        onPress={() => this.props.navigation.push('ArticleDetailScreen', {id: n.id})}
                                    >

                                        <ListItem key={n.id} thumbnail>
                                            <Left>
                                                <Thumbnail square size={80} source={{ uri: n.image }} />
                                            </Left>
                                            <Body>
                                                <Text>{n.title}</Text>
                                                <Text note>{n.intro}</Text>
                                            </Body>
                                        </ListItem>

                                    </TouchableNativeFeedback>
                                )
                            })
                        }
                    </List>
                </Card>

            </ScrollView>
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

const styles_content = {
    p: {
        marginTop: 0,
        marginBottom: 0,
        fontSize: 18,
    }
};
