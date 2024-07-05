import { Pressable, StyleSheet,FlatList } from 'react-native';


import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import axios, { formToJSON } from 'axios';
import SimpleCard from '@/components/PuntenCard';

interface CardData {
  DW: string;
  EX: string;
  cat: string;
  datum: string;
  day: string;
  gew_sc: number;
  pub_datum: string;
  score: number;
  soort: string;
  titel: string;
  tot_sc: number;
  vak: string;
}

export default function puntenScreen() {
  const [data, setData] = useState<CardData[]>([]);

  useEffect(() => {
    // Fetch data from your API
    axios.get('http://192.168.0.38:7964/punten_api')
      .then(response => {
        setData(response.data);
        console.log(response)
        
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const renderItem = ({ item }: { item: CardData }) => (
    
    <View>
      <SimpleCard DW={''} EX={''} cat={''} datum={''} day={''} gew_sc={0} pub_datum={''} score={0} soort={''} titel={item.titel} tot_sc={0} vak={''}>

      </SimpleCard>
        
        
    </View>
  );

  return (

    <View style={styles.container}>
      <Text>DATA:</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
      />
      <Text>DATA:</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

