// SimpleCard.tsx
import React, { useState } from 'react';
import { Card, Text} from 'react-native-paper';
import { berichtenDict } from '@/components/schoolware';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { View as ViewStyled } from '@/components/Themed';
import RenderHTML from 'react-native-render-html';



const BerichtenCard: React.FC<berichtenDict> = (data) => {
    const [expanded, setExpanded] = useState(false);
    var decodedString = decodeURIComponent(data.bericht as string);
    decodedString = decodedString.replaceAll("<strong></strong>", "",)
    decodedString = decodedString.replaceAll("&nbsp;", "",)
    decodedString = decodedString.replaceAll("<br>", "")
    decodedString = decodedString.replaceAll("<p></p>", " ")

    const tagsStyles = {
        body: {
            color: 'white'
        },
        a: {
            color: 'green'
        }
    }

    return (
        <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
            <Card style={[styles.card, { minHeight: 80 }, { justifyContent: 'center', alignItems: 'center' }]}>
                <Card.Content>
                    {!expanded ? (
                        <View style={styles.row}>

                            <Text style={[styles.titleSize, { maxWidth: "105%" }, { justifyContent: 'center', alignItems: 'center' }]}>{data.titel}</Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={[styles.titleSize, { maxWidth: "105%" }, { justifyContent: 'center', alignItems: 'center' }]}>{data.titel}</Text>
                            <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                            <RenderHTML
                                contentWidth={300} // You can adjust this as needed
                                source={{ html: decodedString }}
                                tagsStyles={tagsStyles}
                                enableCSSInlineProcessing={false}
                            />
                        </View>
                    )
                    }
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );
};

export default BerichtenCard;

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 0,
        paddingBottom: 10
    },
    progressContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    progressBar: {
        height: 20,
        width: '100%',
    },
    textContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        textAlign: "center"
    },
    title: {
        fontSize: 20,
        textAlign: "center"
    },
    container: {
        display: "flex"
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    keepRight: {
        textAlign: "right",
        marginRight: 10
    },
    keepLeft: {
        textAlign: "left",
        marginLeft: 10
    },
    red: {
        color: "red"
    },
    orange: {
        color: "orange"
    },
    separator: {
        marginVertical: 30,
        height: 3,
        width: '100%',
        marginTop: 5,
        marginBottom: 15
    },
    titleSize: {
        fontSize: 20,
        textAlign: 'center',
    },
    textSize: {
        fontSize: 16
    }

});

