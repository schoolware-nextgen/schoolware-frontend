import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { sendPushNotification } from './notifications';
import { getSchoolware, pointsDict } from './schoolware';
import AsyncStorage from '@react-native-async-storage/async-storage';
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


// Define a background task
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

// Register the background fetch task
export const registerBackgroundFetch = async () => {
  console.log("BACKGROUND: registering background fetch")
  let response = await BackgroundFetch.registerTaskAsync('background-fetch-task', {
    minimumInterval: 1 * 60, // 10 minutes
    stopOnTerminate: false, // continue even after app is closed
    startOnBoot: true, // start when device is rebooted
  });
  console.log("BACKGROUND: ", response)
  return response
};

