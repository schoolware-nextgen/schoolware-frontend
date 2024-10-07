import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/components/useColorScheme';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3LightTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { registerForPushNotificationsAsync, sendPushNotification } from '@/components/notifications';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';
import { Button, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { registerBackgroundFetch } from '@/components/backgroundCheck';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { getSchoolware, pointsDict } from '@/components/schoolware';

import * as FileSystem from 'expo-file-system';

const getUniqueElements = (arr1: pointsDict[], arr2: pointsDict[]): pointsDict[] => {
  return arr1.filter(item1 => 
      !arr2.some(item2 => 
          item1.vak === item2.vak &&
          item1.title === item2.title &&
          item1.comment === item2.comment &&
          item1.scoreFloat === item2.scoreFloat &&
          item1.scoreTotal === item2.scoreTotal &&
          item1.dw === item2.dw &&
          item1.type === item2.type
      )
  );
};

TaskManager.defineTask('background-fetch-task', async () => {
  let log = "";
  try {
    console.log('BACKGROUND: Task running');
    log += "BACKGROUND: Task running\n";
    // Here you can perform your periodic logic
    var savedPunten = await AsyncStorage.getItem('backgroundPunten');
    var expoPushToken = await AsyncStorage.getItem('notificationtoken');
    if(expoPushToken === null){
      expoPushToken = "a";
    }

    var prevPunten: pointsDict[] = []

    if(savedPunten === null){
        console.log("BACKGROUND: no previous punten")
        log += "BACKGROUND: no previous punten\n";
    } else {
        prevPunten = JSON.parse(savedPunten);
        //console.log(`BACKGROUND: previous punten: ${prevPunten}`)
    }

    const schoolware = await getSchoolware();
    if (schoolware.valid) {
        console.log("BACKGROUND: logging in")
        log += "BACKGROUND: logging in\n";
          schoolware.getPunten().then(async (res) => {
            console.log("BACKGROUND: old: ", prevPunten.length)
            console.log("BACKGROUND: new: ", res.length)
            const newPoints = getUniqueElements(res, prevPunten);
            if(newPoints.length >= 1){
                console.log("BACKGROUND: new punten")
                log += "BACKGROUND: new punten\n";
                //console.log(`BACKGROUND: new points: ${newPoints}`)
                await AsyncStorage.setItem('backgroundPunten', JSON.stringify(res));
                let notification = ""
                newPoints.forEach((point: pointsDict) => {
                    notification += `${point.vak} ${point.title}: ${point.scoreFloat*point.scoreTotal}/${point.scoreTotal}\n`
                });
                await sendPushNotification(expoPushToken, notification);
                log += "send notification\n";
            } 
          });
      }

  
    // Return BackgroundFetch.Result.NewData if new data was fetched,
    // otherwise return BackgroundFetch.Result.NoData
    console.log("BACKGROUND: writing log")
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/SchoolwareFrontendLog.txt', log, { encoding:'utf8' });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log(error);
    log += `BACKGROUND: ${error}\n`;
    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/SchoolwareFrontendLog.txt', log, { encoding:'utf8' });
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});






// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);



  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  var [expoPushToken, setExpoPushToken] = React.useState("");

  async function setupnotifications() {
    const notifications = await AsyncStorage.getItem('notifications');
    if (notifications === 'true') {
      console.log("setting up notifications")
      registerForPushNotificationsAsync()
        .then(async token => {
          if (token !== undefined) {
            await AsyncStorage.setItem('notificationtoken', token);
            registerBackgroundFetch();
          }
        })
        
    } else {
      console.log("notifications not enabled")
    }
  }

  async function loadNotificationToken() {
    const expoPushToken = await AsyncStorage.getItem('notificationtoken');
    if (expoPushToken !== null) {
      setExpoPushToken(expoPushToken)
    }
  }

  useEffect(() => {
    if(Platform.OS === 'android') {
    setupnotifications()
    loadNotificationToken()
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={MD3DarkTheme}>
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeProvider>
        <Toast
          position='bottom'
          bottomOffset={50}
        />
        
      </PaperProvider>
    </GestureHandlerRootView>


  );
}

