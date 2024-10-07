// SimpleCard.tsx
import React, { useState } from 'react';
import { Card, Text, ProgressBar } from 'react-native-paper';
import { periodDws, summaryDict } from '@/components/schoolware';
import { StyleSheet, View, TouchableWithoutFeedback, FlatList, Platform } from 'react-native';
import { View as ViewStyled } from '@/components/Themed';

const getColorFromValue = (value: number) => {
    if (value <= 0.5) {
        // Keep it red for values <= 0.5
        return `rgb(255, 0, 0)`;
    } else {
        // Transition from red to green for values > 0.5
        const green = Math.floor(255 * ((value - 0.5) * 2));  // Progressively increase green
        const red = Math.floor(255 * (1 - (value - 0.5) * 2));  // Decrease red
        return `rgb(${red}, ${green}, 0)`;
    }
};


const PuntenSummaryCard: React.FC<summaryDict> = (data) => {
    const [expanded, setExpanded] = useState(false);
    var web = false
    if (Platform.OS === 'web')
        web = true

    return (
        <TouchableWithoutFeedback onPress={() => setExpanded(!expanded)}>
            <Card style={[styles.card, { minHeight: 80 }, { justifyContent: 'center', alignItems: 'center' }]} contentStyle={{ width: "80%" }}>
                <Card.Content >
                    {!expanded ? (
                        <View style={styles.row}>
                            <Text style={[styles.titleSize, { width: "100%" }, { justifyContent: 'center', alignItems: 'center' }]}>{data.vak}</Text>
                        </View>
                    ) : (
                        <View style={styles.list}>
                            <Text style={[styles.titleSize, { width: "100%" }, { justifyContent: 'center', alignItems: 'center' }]}>{data.vak}</Text>
                            <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

                            {data.dws.map((dw, index) => (
                                    <View style={styles.list} key={index}>
                                        <Text style={[styles.titleSize, { maxWidth: "105%" }, { justifyContent: 'center', alignItems: 'center' }]}>{dw.dw}</Text>
                                        <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
                                        <ProgressBar progress={dw.summary} color={getColorFromValue(dw.summary)} style={styles.progressBar} />
                                        <Text style={Platform.OS === 'web' ? [styles.text, { position: "relative", top: -20 }] : [styles.text, { position: "relative", top: -24 }]}>{(dw.summary * 100).toPrecision(2)}%</Text>
                                    </View>
                                ))}

                        </View>
                    )
                    }
                </Card.Content>
            </Card>
        </TouchableWithoutFeedback>
    );
};

export default PuntenSummaryCard;

const styles = StyleSheet.create({
    card: {
        width: "100%",
        marginVertical: 8,
        marginHorizontal: 0,
        paddingBottom: 10
    },
    list: {
        width: "100%",
        maxWidth: 1200,
        marginHorizontal: 'auto',
        marginTop: 0,
        marginBottom: 0,
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

