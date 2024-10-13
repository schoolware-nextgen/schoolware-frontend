import { Pressable, StyleSheet, FlatList, RefreshControl, View, Platform, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import BerichtenCard from '@/components/berichtenCard';
import { berichtenDict, getSchoolware } from '@/components/schoolware';
import { useColorScheme } from '@/components/useColorScheme.web';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper';



export default function BerichtenScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const [data, setData] = useState<berichtenDict[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setopenSettings] = useState(false);

  const loadBerichten = async () => {
    setLoading(true);
    const schoolware = await getSchoolware();
    if (!schoolware.valid) {
      
        Toast.show({
          type: 'info',
          text1: 'No saved info found, please go to settings',
        });
      
      
      setLoading(false)
      setopenSettings(true)

    } else {
      
    }
    if (schoolware.valid) {
      
        schoolware.getBerichten().then((res) => {setData(res); setLoading(false);});
    }
  }
  var web = false
  if(Platform.OS === 'web')
    web = true

  useEffect(() => {
    loadBerichten()
  }, []);

  const renderItem = ({ item }: { item: berichtenDict }) => (
    <View>
      <BerichtenCard titel={item.titel} bericht={item.bericht} date={item.date}  ></BerichtenCard>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        // show a loading indicator
        <View>
          <Text>Loading...</Text>
          <ActivityIndicator animating={true} color={MD2Colors.blue800} size="large" style={styles.loading} />
        </View>

      ) : openSettings ? (

        <View>
          <Text>Open settings to enter credentials</Text>
        </View>

      ) : data.length === 0 ? (
        // show a message if the data is empty
        <Text>No points available</Text>
      ) : (
        // render your FlatList
        <FlatList style={web ? [styles.list] : [styles.list, {width: "90%"}]}
          data={data}
          renderItem={({ item }) => renderItem({ item })}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadBerichten} />
          }
        />
        
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    backgroundColor: "rgb(25, 25, 25)"
  },
  list: {
    width: "80%",
    maxWidth: 1200,
    marginHorizontal: 'auto',
    marginTop: 0,
    marginBottom: 0,
  },
  loading: {
    marginTop: 20
  }
});
