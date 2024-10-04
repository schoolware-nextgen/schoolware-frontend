import { Pressable, StyleSheet, FlatList, RefreshControl, View, Platform, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import TasksCard from '@/components/TasksCard';
import { tasksDict, getSchoolware } from '@/components/schoolware';
import { useColorScheme } from '@/components/useColorScheme.web';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper';



export default function puntenScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const [data, setData] = useState<tasksDict[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setopenSettings] = useState(false);

  const loadPunten = async () => {
    setLoading(true);

    const schoolware = await getSchoolware();
    if (!schoolware.valid) {
      
        Toast.show({
          type: 'info',
          text1: 'No saved info found, please go to settings',
        });
      
      //router.replace('/settings');
      setLoading(false)
      setopenSettings(true)

    } else {
      //console.log("Schoolware valid")
    }
    if (schoolware.valid) {
      //console.log("logging in")
        schoolware.getTasks().then((res) => {setData(res); setLoading(false);});
        

    }
  }
  var web = false
  if(Platform.OS === 'web')
    web = true

  useEffect(() => {
    loadPunten()
  }, []);

  const renderItem = ({ item }: { item: tasksDict }) => (
    <View>
      <TasksCard vak={item.vak} title={item.title} comment={item.comment} type={item.type} deadline={item.deadline}></TasksCard>
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
            <RefreshControl refreshing={loading} onRefresh={loadPunten} />
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
