import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { sendNotification } from './notifications';
import { getSchoolware, pointsDict } from './schoolware';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Define a background task
TaskManager.defineTask('background-fetch-task', async () => {
  try {
    console.log('BACKGROUND: Task running');
    // Here you can perform your periodic logic
    var savedPunten = await AsyncStorage.getItem('backgroundPunten');

    var prevPunten: pointsDict[] = []

    if(savedPunten === null){
        console.log("BACKGROUND: no previous punten")
    } else {
        prevPunten = JSON.parse(savedPunten);
        console.log(`BACKGROUND: previous punten: ${prevPunten}`)
    }

    const schoolware = await getSchoolware();
    if (schoolware.valid) {
        console.log("BACKGROUND: logging in")
          schoolware.getPunten().then((res) => {
            if(res !== prevPunten){
                console.log("BACKGROUND: new punten")

                const newPoints = res.filter(element => !prevPunten.includes(element));
                console.log(`BACKGROUND: new points: ${newPoints}`)

                prevPunten = res;
                AsyncStorage.setItem('backgroundPunten', JSON.stringify(prevPunten));
            }
          });
      }


    await sendNotification();
    

    // Return BackgroundFetch.Result.NewData if new data was fetched,
    // otherwise return BackgroundFetch.Result.NoData
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.log(error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Register the background fetch task
export const registerBackgroundFetch = async () => {
  return BackgroundFetch.registerTaskAsync('background-fetch-task', {
    minimumInterval: 1 * 60, // 10 minutes
    stopOnTerminate: true, // continue even after app is closed
    startOnBoot: true, // start when device is rebooted
  });
};

const checkIfNotificationIsNeeded = async () => {
    // Example logic: check some local state or API
    const conditionMet = true; // Replace with your logic
    return conditionMet;
  };
