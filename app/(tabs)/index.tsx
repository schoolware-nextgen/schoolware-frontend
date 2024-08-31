import { StyleSheet, FlatList, RefreshControl, View, Platform, PanResponder, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AgendaCard from '@/components/AgendaCard';
import { agendaDict, getSchoolware } from '@/components/schoolware';
import { useColorScheme } from '@/components/useColorScheme.web';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ActivityIndicator, MD2Colors, Text } from 'react-native-paper';
import dayjs from 'dayjs'
import { DatePickerModal } from 'react-native-paper-dates';
import { nl, registerTranslation } from 'react-native-paper-dates'
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
registerTranslation('nl', nl)


export default function puntenScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  console.log(colorScheme)
  const [data, setData] = useState<agendaDict[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setopenSettings] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  var dateString = dayjs(date).format('dddd DD-MM');

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => { },
    onPanResponderEnd: async (evt, gestureState) => {
      // Get the current swipe direction
      const dx = gestureState.dx;
      console.log(`dx: ${dx}`);
      if (dx > 10) {
        // Swipe right detected!
        console.log('Swipe right detected!');
        date.setDate(date.getDate() - 1);
        await loadPunten();
      }
      if (dx < -10) {
        // Swipe left detected!
        console.log('Swipe left detected!');
        date.setDate(date.getDate() + 1);
        await loadPunten();
      }
    },
  });


  const datePick = React.useCallback(
    (params: any) => {
      setShowDatePicker(false);
      setDate(params.date);
      loadPunten();
    },
    [setShowDatePicker, setDate]
  );

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
      console.log("Schoolware valid")
    }
    if (schoolware.valid) {
      console.log("logging in")
      schoolware.getAgenda(date).then((res) => { setData(res); setLoading(false); });

    }
  }
  var web = false
  if (Platform.OS === 'web')
    web = true

  useEffect(() => {
    loadPunten()
  }, []);

  const renderItem = ({ item }: { item: agendaDict }) => (
    <View>
      <AgendaCard vak={item.vak} title={item.title} comment={item.comment} date={item.date} room={item.room} period={item.period}></AgendaCard>
    </View>
  );
  
  return (
    
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={[styles.date,{flexDirection:'row', justifyContent:"space-between"}]}>
        <Text style= {{fontSize: 20, fontWeight: 'bold'}}>{dateString}</Text>
        <Pressable style = {{marginLeft:10}} onPress={() => setShowDatePicker(!showDatePicker)}>
                {({ pressed }) => (
                  <View>
                  <FontAwesome
                    name="calendar"
                    size={25}
                    color={Colors['dark'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                  </View>
                )}
              </Pressable>
      </View>
      {loading ? (
        // show a loading indicator
        <View >
          <Text>Loading...</Text>
          <ActivityIndicator animating={true} color={MD2Colors.blue800} size="large" style={styles.loading} />
        </View>

      ) : openSettings ? (

        <View >
          <Text>Open settings to enter credentials</Text>
        </View>

      ) : data.length === 0 ? (
        // show a message if the data is empty
        <Text>No points available</Text>
      ) : (
        // render your FlatList

        <FlatList style={web ? [styles.list] : [styles.list, { width: "90%" }]}
          data={data}
          renderItem={({ item }) => renderItem({ item })}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadPunten} />
          }
        />
      )}

    <DatePickerModal
          locale="nl"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => {setShowDatePicker(false);}}
          date={date}
          onConfirm={datePick}
          startWeekOnMonday={true}
        />

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
    marginTop: 50,
    marginBottom: 0,
  },
  loading: {
    marginTop: 20
  },
  date: {
    position: "absolute",
    top: 5,
    
  }

});
