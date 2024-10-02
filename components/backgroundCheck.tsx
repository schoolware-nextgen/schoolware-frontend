import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { sendNotification } from './notifications';
import { getSchoolware, pointsDict } from './schoolware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
          schoolware.getPunten().then(async (res) => {
            console.log("BACKGROUND: old: ", prevPunten.length)
            console.log("BACKGROUND: new: ", res.length)
            const newPoints = getUniqueElements(res, prevPunten);
            if(newPoints.length >= 1){
                console.log("BACKGROUND: new punten")
                console.log(`BACKGROUND: new points: ${newPoints}`)
                await AsyncStorage.setItem('backgroundPunten', JSON.stringify(res));
                let notification = ""
                newPoints.forEach((point: pointsDict) => {
                    notification += `${point.vak} ${point.title}: ${point.scoreFloat*point.scoreTotal}/${point.scoreTotal}\n`
                });
                await sendNotification(notification);
            } 
          });
      }

    

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
    stopOnTerminate: false, // continue even after app is closed
    startOnBoot: true, // start when device is rebooted
  });
};

const checkIfNotificationIsNeeded = async () => {
    // Example logic: check some local state or API
    const conditionMet = true; // Replace with your logic
    return conditionMet;
  };
