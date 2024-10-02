// SimpleCard.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Card, Title, Paragraph, ProgressBar, useTheme, Text } from 'react-native-paper';
import { tasksDict } from '@/components/schoolware';
import { StyleSheet, View, Platform } from 'react-native';
import { View as ViewStyled } from '@/components/Themed';
import dayjs from "dayjs";





const TasksCard: React.FC<tasksDict> = (data) => {
  const { colors } = useTheme();


  var web = false
  if (Platform.OS === 'web')
    web = true

  return (
    <Card style={styles.card}>
      <Card.Content>

        <View style={styles.row}>
          
          <Title style={[ styles.titleSize, { maxWidth: "100%" }]}>{data.vak}</Title>
        </View>
        <ViewStyled style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />

        <Title style={[styles.title, { maxWidth: "100%" , textAlign: "center"}]}>{data.title}</Title>

        <View style={[styles.row, { marginBottom: 5, marginTop: 20}]}>
        
          <Text style={[data.type === 'toets' || data.type === "hertoets" ? styles.red : styles.orange, styles.textSize, styles.keepLeft]}>{data.type}</Text>
          <Text style={{ textAlign: "center" }}>{dayjs(data.deadline).format('dddd DD/MM')}</Text>

        </View>

        <Paragraph style={{textAlign: "center"}}>{data.comment}</Paragraph>

      </Card.Content>
    </Card>
  );
};

export default TasksCard;

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

