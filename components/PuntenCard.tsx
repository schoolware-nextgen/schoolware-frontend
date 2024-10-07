// SimpleCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, Title, Paragraph, ProgressBar, useTheme, Text } from 'react-native-paper';
import { pointsDict } from '@/components/schoolware';
import { StyleSheet, View, Platform } from 'react-native';
import { View as ViewStyled } from '@/components/Themed';
import dayjs from "dayjs";

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

const PuntenCard: React.FC<pointsDict> = (data) => {
  const { colors } = useTheme();

  var scoreFloat = Number(data.scoreFloat)
  if (Number.isNaN(scoreFloat)) {
    scoreFloat = 0
  }
  const color = getColorFromValue(scoreFloat); // Get the color based on the value

  var web = false
  if(Platform.OS === 'web')
    web = true

  return (
    
    <Card style={styles.card}>
      <Card.Content>
        
        <View style={styles.row}> 
          
          <Title style={[styles.titleSize, {maxWidth: "105%"}]}>{data.vak}</Title>
        </View>
        <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Title style={[styles.title, {maxWidth: "100%"}]}>{data.title}</Title>

        <View style={[styles.row, { marginBottom: 10 , marginTop: 10 }]} >
        <Text style={[styles.textSize, styles.keepRight]}>{data.dw}</Text>
          <Text style={[data.type === 'toets' || data.type === "hertoets" ? styles.red : styles.orange, styles.textSize, styles.keepLeft]}>{data.type}</Text>
          <Text style={{textAlign: "center"}}>{dayjs(data.date).format('dddd DD/MM')}</Text>
        </View>

        <View>
            <ProgressBar progress={scoreFloat} color={color} style={styles.progressBar}/>

            <Text style={web ? [styles.text, {position: "relative", top: -20}] : [styles.text, {position: "relative", top: -24}]   }>{(scoreFloat * data.scoreTotal).toPrecision(2)}/{data.scoreTotal} {Math.round(scoreFloat * 100)}%</Text>
        </View>
        
        <Paragraph>{data.comment}</Paragraph>

      </Card.Content>
    </Card>
  );
};

export default PuntenCard;

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
  },
  textSize: {
    fontSize: 16
  }

});

