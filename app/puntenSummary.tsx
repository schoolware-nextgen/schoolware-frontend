import { Pressable, StyleSheet, FlatList, RefreshControl, View, Platform, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import PuntenCard from '@/components/PuntenCard';
import { pointsDict, getSchoolware, summaryDict } from '@/components/schoolware';
import { useColorScheme } from '@/components/useColorScheme.web';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper';
import PuntenSummaryCard from '@/components/puntenSummaryCard';


export default function ModalScreen() {
const [data, setData] = useState<summaryDict[]>([]);
const [loading, setLoading] = useState(true);
const [openSettings, setopenSettings] = useState(false);

  var web = false
  if (Platform.OS === 'web')
    web = true

  const loadSummary = async () => {
    setLoading(true);

    const schoolware = await getSchoolware();
    if (!schoolware.valid) {
        Toast.show({
          type: 'info',
          text1: 'No saved info found, please go to settings',
        });
    
      setLoading(false)
      setopenSettings(true)

    }
    if (schoolware.valid) {
        console.log("logging in")
        schoolware.getSummary().then((res) => {setData(res); setLoading(false);});
    }
  }

  useEffect(() => {
    loadSummary()
  }, []);

  const renderItem = ({ item }: { item:  summaryDict}) => (
    <View style={{flex:1, flexDirection:'row', justifyContent:"space-between", width: "99%"}}>
      <PuntenSummaryCard vak={item.vak} dws={item.dws}></PuntenSummaryCard>
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
            <RefreshControl refreshing={loading} onRefresh={loadSummary} />
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
    backgroundColor: "rgb(25, 25, 25)"
  },
  loading: {
    marginTop: 20
  },
  list: {
    width: "80%",
    maxWidth: 1200,
    marginHorizontal: 'auto',
    marginTop: 0,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '50%',
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 5,
    paddingLeft: 5,
    fontSize: 16,
    height: 40,
    width: "80%",
    maxWidth: 500,
    color: "rgb(255, 255, 255)",
    margin: 'auto'
  },
  label: {
    paddingVertical: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10
  },
  button: {
    marginTop: 20,
    marginBottom: 30
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
  },
  errorInput: {
    borderColor: 'red',
    color: "rgb(255, 255, 255)"
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: "center"
  },
  card: {
    marginVertical: 5,
    marginHorizontal: 5,
    paddingBottom: 5,
    width: Platform.OS === 'web' ? '60%' : '90%',
    textAlign: 'center',
    maxWidth: 550,
    borderRadius: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


