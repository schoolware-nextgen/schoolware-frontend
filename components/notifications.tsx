import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {  Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "Constants.easConfig.projectId", // you can hard code project id if you dont want to use expo Constants
        })
      ).data;
      console.log(token);

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