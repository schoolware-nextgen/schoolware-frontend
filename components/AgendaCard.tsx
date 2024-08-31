// SimpleCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, Title, Paragraph, ProgressBar, useTheme, Text } from 'react-native-paper';
import { agendaDict } from '@/components/schoolware';
import { StyleSheet, View, Platform } from 'react-native';
import { View as ViewStyled } from '@/components/Themed';
import dayjs from "dayjs";


const AgendaCard: React.FC<agendaDict> = (data) => {
  const { colors } = useTheme();


  var web = false
  if(Platform.OS === 'web')
    web = true

  return (
    <Card style={styles.card}>
      <Card.Content>
        
        <View style={styles.row}> 
          <Title style={[styles.title, styles.keepLeft, {maxWidth: "60%"}]}>{data.title}</Title>
          <Title style={[styles.keepRight, styles.titleSize, {maxWidth: "45%"}]}>{data.vak}</Title>
        </View>
        <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <View style={[styles.row, { marginBottom: 2 }]}>
          <Text style={{textAlign: "center"}}>{data.period}</Text>
          <Text style={{textAlign: "center"}}>{dayjs(data.date).format('dddd DD/MM')}</Text>
        </View>

        <Paragraph>{data.comment}</Paragraph>

      </Card.Content>
    </Card>
  );
};

export default AgendaCard;

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
    width: '85%',
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

