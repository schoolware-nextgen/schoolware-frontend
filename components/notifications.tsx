import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Ask for permission to send notifications
const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Please grant notification permissions');
    return false;
  }
  return true;
};

// Send a notification
export const sendNotification = async () => {
    console.log('Sending notification');
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    console.log('Permission not granted');
    return;}
  console.log('notification permision OK');
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nieuw Punt',
      body: 'This is a reminder to check the app.',
      data: { someData: 'goes here' },
    },
    trigger: null, // trigger immediately
  });
};