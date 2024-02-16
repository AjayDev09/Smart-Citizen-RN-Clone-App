import 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import ProviderAuth from "./src/navigation";
import i18next from 'i18next';
import 'intl-pluralrules'
import { setClientToken } from './src/service/api';
import SplashScreen from 'react-native-splash-screen';
import messaging from '@react-native-firebase/messaging';
import { Alert, I18nManager, Linking, PermissionsAndroid, Platform, StatusBar } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { notificationManager } from './NotificationManager';
import { useTranslation } from 'react-i18next';
import { utils } from '@react-native-firebase/app';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { Host } from 'react-native-portalize';

export const HAS_LAUNCHED = "hasLaunched";
const ENGLISH = "en";
const HEBREW = "he";


//Save the language as AsyncStorage for other times the user will open the app
async function setAppLaunched1(en) {
  AsyncStorage.clear()
  AsyncStorage.setItem(HAS_LAUNCHED, "true");
  AsyncStorage.setItem(en ? ENGLISH : HEBREW, "true");
  if (await AsyncStorage.getItem(HEBREW)) {
    i18n.locale = "he";
    I18nManager.forceRTL(true);
  }
  else {
    i18n.locale = "en";
    I18nManager.forceRTL(false);
  }
}




const App = () => {

  const { t, i18n } = useTranslation()
  
  // async function registerAppWithFCM() {
  //   await messaging().registerDeviceForRemoteMessages();
  // }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  async function checkApplicationPermission() {
    const authorizationStatus = await messaging().requestPermission();

    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
      getFCMToken()
    } else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }
  const getFCMToken = async () => {
    // const token = await messaging().getToken();
    //console.log('FCM TOKENNNNN ===>>>> ', token)
  }

  const androidPermissions = async () => {
    const title = i18n.language === 'he' ? "שיתוף מיקום" : i18n.language === 'ar' ? "مشاركة الموقع" : "Location Permission"
    const message = i18n.language === 'he' ? "ע\"י שיתוף מיקומך ניתן למצוא קופונים בסביבתך " : i18n.language === 'ar' ? "من خلال مشاركة موقعك، يمكنك العثور على كوبونات في منطقتك" : 'Toshav Haham needs access to your location so you can find the nearest coupons.'
    const buttonNeutral = i18n.language === 'he' ? "הזכר לי מאוחר יותר" : i18n.language === 'ar' ? "ذكرني لاحقا" : "Remind Me Later"

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: title,
          message: message,
          buttonNeutral: buttonNeutral,
          buttonNegative: t("common:cancel"),
          buttonPositive: t("common:ok"),
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  // i18next.init({
  //   compatibilityJSON: 'v3'
  // }, (err, t) => { 
  //   console.log('t.', t)
  //   /* resources are loaded */ });
  const checkIfFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
      console.log('hasLaunched', hasLaunched)
      if (hasLaunched === null) {
        // setSelected(true)
        // setAppLaunched();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  useEffect(() => {
    StatusBar.setBarStyle('light-content', true);
    SplashScreen.hide();
    //registerAppWithFCM()
    //messaging().setAutoInitEnabled(true)
  }, []);


  useEffect(() => {
    checkAppLaunch()
  }, []);
  

  const checkAppLaunch = async () => {
    const isLaunch = await checkIfFirstLaunch()
    if (!isLaunch) {
      // requestUserPermissiorn()
      checkApplicationPermission()
      if (Platform.OS === 'android') {
        androidPermissions()
      }
    }
  }

  return (
    <NavigationContainer  >
       <Host>
      <ProviderAuth />
      </Host>
    </NavigationContainer>
  );
};

export default App;
