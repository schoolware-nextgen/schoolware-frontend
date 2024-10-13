import { StyleSheet, FlatList, RefreshControl, View, Platform, PanResponder, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AgendaCard from '@/components/AgendaCard';
import { agendaDict, getSchoolware } from '@/components/schoolware';
import { useColorScheme } from '@/components/useColorScheme.web';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Button, MD2Colors, Paragraph, Text } from 'react-native-paper';
import dayjs from 'dayjs'
import { DatePickerModal } from 'react-native-paper-dates';
import { nl, registerTranslation } from 'react-native-paper-dates'
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
registerTranslation('nl', nl)


export default function puntenScreen() {
  const router = useRouter();

  const colorScheme = useColorScheme();
  const [data, setData] = useState<agendaDict[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSettings, setopenSettings] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [firstRun, setfirstRun] = useState<boolean>(false);

  var dateString = dayjs(date).format('dddd DD-MM');


  /*const panResponder = PanResponder.create({
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
        await loadAgenda();
      }
      if (dx < -10) {
        // Swipe left detected!
        console.log('Swipe left detected!');

      }
    },
  });*/
  const handleGesture = async (event: { nativeEvent: { translationX: any; translationY: any; state: any; }; }) => {

    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.END) {
      if (Math.abs(translationX) > Math.abs(translationY)) {
      if (translationX < -50) {
        // Left swipe detected
        console.log('Swiped Left');
        date.setDate(date.getDate() + 1);
        await loadAgenda();

      } else if (translationX > 50) {
        // Right swipe detected
        console.log('Swiped Right');
        date.setDate(date.getDate() - 1);
        await loadAgenda();
      }
    }
    }
  };
  const checkFirstRun = async () => {
    console.log("checkfirst run")
    const firstRunResult = await AsyncStorage.getItem('firstRun');
    console.log(firstRunResult)
    if(firstRunResult == "false" && firstRunResult != null){
      setfirstRun(false);

    } else {
      console.log("first run")
      setfirstRun(true);
    }
  }


  const datePick = async (params: { date: any; }) => {
    console.log("date picker: ", params.date)
    var date = params.date;
    date.setHours(12);
    setDate(date);
    setShowDatePicker(false);
  };


  const loadAgenda = async () => {
    setLoading(true);
    const schoolware = await getSchoolware();
    if (!schoolware.valid) {
      console.log('schoolware invalid')
      Toast.show({
        type: 'info',
        text1: 'No saved info found, please go to settings',
      });

      
      setLoading(false)
      setopenSettings(true)

    } else {
      
    }
    if (schoolware.valid) {
      
      //console.log("date to schoolware: ", date)
      schoolware.getAgenda(date).then((res) => { setData(res); setLoading(false); });

    }
  }

  const accept = async () => {
    AsyncStorage.setItem('firstRun', "false");
    setfirstRun(false);
    setLoading(false);
    setopenSettings(true);
  }

  var web = false
  if (Platform.OS === 'web')
    web = true

  useEffect(() => {

    loadAgenda();
  }, [date]);
  
  useEffect(() => {
    checkFirstRun();
    if(!firstRun){
      //loadAgenda()
    }
    
  }, []);

  const renderItem = ({ item }: { item: agendaDict }) => (
    <View>
      <AgendaCard vak={item.vak} title={item.title} comment={item.comment} date={item.date} room={item.room} period={item.period}></AgendaCard>
    </View>
  );
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler 
        onGestureEvent={handleGesture} 
        onHandlerStateChange={handleGesture}
        activeOffsetX={[-10, 10]} // To allow small horizontal scrolls to not interfere with vertical scroll
        activeOffsetY={[-50, 50]}  // To allow vertical scroll without interference
      >
    <View style={styles.container} >
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
      { firstRun ? 
        (
          <View >
             <Text style={styles.welcome}>welkom bij schoolware frontend</Text>
             <Paragraph style={styles.welcome}>deze app is gemaakt als alternatieve frontend voor schoolware</Paragraph>
             
             <Paragraph style={styles.welcome}>LET OP: de app stuurt alle gegeven (gebruikersnaam, wachtwoord...) door naar de backend server</Paragraph>
             <Paragraph style={styles.welcome}>de standaard server is door mij gehost, dus zou ik alle je gegevens kunnen stelen en moet je erop vertrouwen dat ik het niet ga doen</Paragraph>
             <Paragraph style={styles.welcome}>als je me niet vertrouwt, kan je de backend zelf hosten, deze is te vinden op mijn github</Paragraph>

             <Paragraph style={styles.welcome}>gemaakt door Maarten</Paragraph>
             <Paragraph style={styles.welcome}>voor vragen kan je me bereiken op maarten@mail.mb-server.com: link...</Paragraph>
             <Paragraph style={[styles.welcome,{fontSize: 20, fontWeight: 'bold'}]}>SchoolwareFrontend heeft geen enkel verband met wisa of schoolware</Paragraph>
             
             <Button icon="check" mode="contained" onPress={accept} style={{marginTop: 15,margin: "auto"}}>
                accepteren
            </Button>
           </View>
        )


      :  loading ? (
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
        <Text>No agenda available</Text>
      ) : (
        // render your FlatList

        <FlatList style={web ? [styles.list] : [styles.list, { width: "90%" }]}
          data={data}
          renderItem={({ item }) => renderItem({ item })}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadAgenda} />
          }
        />
      )}

    <DatePickerModal
          locale="nl"
          mode="single"
          visible={showDatePicker}
          onDismiss={() => {setShowDatePicker(false);}}
          date={date}
          onConfirm={async (params) => {await datePick(params)}}
          startWeekOnMonday={true}
        />

    </View>
    </PanGestureHandler>
    </GestureHandlerRootView>

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
    
  },
  welcome:{
    fontSize: 20,
    textAlign: "center"
  }

});
