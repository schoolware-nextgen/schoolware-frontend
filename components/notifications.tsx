import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;
  console.log("setting up push notifications")

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
  console.log("checking permission")

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    console.log("requesting permissions");
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.error("Failed to get push token for push notification!")
    alert("Failed to get push token for push notification!");
    return;
  }
  console.log(finalStatus)
  console.log("getting token")
  try{
  token = await Notifications.getExpoPushTokenAsync({ projectId: "443bfd29-d1ae-4341-bcd1-b8332137f17e"})
  }catch (e){
    console.log(e)
    console.log("failed to get token")
    alert('Failed to get push token for push notification!')
  }
    

  console.log("got token")
  console.log("push token: ", token);
  alert(`push token: ${token}`);

  return token;
}


// Send a notification
export const sendNotification = async (message: string) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Nieuwe Punten',
      body: message,
    },
    trigger: null, // trigger immediately
  });
  console.log('Sending notification');

};