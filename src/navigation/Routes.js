import React, {useContext, useState, useEffect} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import AuthStack from './AuthStack';
import DrawerStack from './DrawerStack';
import {useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {Alert, BackHandler, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import database, {firebase} from '@react-native-firebase/database';
import RNExitApp from 'react-native-exit-app';
import {UseNotificationCount} from '../context/notificationCountProvider';

export default function Routes() {
  const auth = useSelector(({auth}) => auth);
  //  const auth = state.auth
  const authuser = auth.data;
  const navigation = useNavigation();
  const {t} = useTranslation();
  const reference = database();

  const databaseForDefaultApp = firebase.database();
  const [databaseObject, setdatabaseObject] = useState();
  const {notificationCount, setNotificationCount} = UseNotificationCount();

  useEffect(() => {
    setNotificationCount(global.notificationCount || 0);
    databaseForDefaultApp.ref('/store').once('value', snapshot => {
      setdatabaseObject(snapshot.val());
      // console.log(snapshot);
    });
    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('12Message handled in the background!', remoteMessage);
      //  handleNotificationNav(remoteMessage)
    });
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('12A message handled in the onMessage!', remoteMessage);
      console.log('12A message data', remoteMessage.data);
      //Alert.alert('12A new FCM message  !', JSON.stringify(remoteMessage));
      handleNotificationNav(remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      //handleNotificationNav(remoteMessage)
      //navigation.navigate('notification');

      if (remoteMessage.data && remoteMessage.data.type === 'message') {
        goToChatScreen(remoteMessage);
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          handleNotificationNav(remoteMessage);
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        //setLoading(false);
      });

    //  {notificationManager}
    return unsubscribe;
  }, []);

  useEffect(() => {
    // console.log('auth.loggedIn', auth.loggedIn, authuser.email)
    // messaging()
    // .getInitialNotification()
    // .then(remoteMessage => {
    //   if (remoteMessage) {
    //     console.log(
    //       'Notification caused app to open from quit state:',
    //       remoteMessage.notification,
    //     );
    //    // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
    //   }
    //  // setLoading(false);
    // });

    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   Alert.alert('123 A new FCM message  !', JSON.stringify(remoteMessage));
    // });

    // return unsubscribe
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage,
      );
      //  navigation.navigate('notification');

      if (remoteMessage.data && remoteMessage.data.type === 'message') {
        goToChatScreen(remoteMessage);
      }
    });

    if (auth.loggedIn) {
      //  console.log('Routes authuser', authuser.user_id)
      global.user_id = authuser.user_id;
      global.user_type = authuser.user_status === 0 ? 'user' : 'merchant';
      console.log('global.user_type', authuser.user_id, global.user_id);
    }
  }, [auth.loggedIn]);

  useEffect(() => {
    // Get the deep link used to open the app
    const getUrl = async () => {
      const universalLink = await Linking.getInitialURL();
      //handle universal link
      console.log('Routes universalLink', universalLink);

      if (universalLink === null) {
        return;
      }

      console.log(universalLink.substring(universalLink.lastIndexOf('/') + 1));
      const itemId = universalLink.substring(
        universalLink.lastIndexOf('/') + 1,
      );
      if (
        universalLink.includes('publicFeed') ||
        universalLink.includes('PublicFeed')
      ) {
        navigation.navigate('publicFeedDetail', {
          itemId: itemId,
          item: undefined,
        });
      } else if (
        universalLink.includes('blog') ||
        universalLink.includes('Blog')
      ) {
        navigation.navigate('blogDetail', {
          itemId: itemId,
          item: undefined,
        });
      } else if (
        universalLink.includes('coupons') ||
        universalLink.includes('Coupons')
      ) {
        navigation.navigate('couponDetail', {
          itemId: itemId,
          item: undefined,
        });
      } else if (
        universalLink.includes('SocialPost') ||
        universalLink.includes('SocialPost')
      ) {
        console.log('social-post-detail', itemId);
        navigation.navigate('social-post-detail', {
          itemId: itemId,
          item: undefined,
        });
      } else if (
        universalLink.includes('SocialUserProfile') ||
        universalLink.includes('SocialUserProfile')
      ) {
        navigation.navigate('social-profile', {
          user_id: itemId,
          item: undefined,
        });
      }
      else if (
        universalLink.includes('LiveStreamingViewer')
      ) {
        navigation.navigate('LiveStreaming', {
          data: {roomId: itemId},
        });
      }
    };

    getUrl();
  }, []);

  const handleDynamicLink = link => {
    // Handle dynamic link inside your own application
    console.log('link.url', link.url);
    const universalLink = link.url;
    const itemId = universalLink.substring(universalLink.lastIndexOf('/') + 1);
    if (
      universalLink.includes('publicFeed') ||
      universalLink.includes('PublicFeed')
    ) {
      navigation.navigate('publicFeedDetail', {
        itemId: itemId,
        item: undefined,
      });
    } else if (
      universalLink.includes('blog') ||
      universalLink.includes('Blog')
    ) {
      navigation.navigate('blogDetail', {
        itemId: itemId,
        item: undefined,
      });
    } else if (
      universalLink.includes('coupons') ||
      universalLink.includes('Coupons')
    ) {
      navigation.navigate('couponDetail', {
        itemId: itemId,
        item: undefined,
      });
    } else if (
      universalLink.includes('SocialPost') ||
      universalLink.includes('SocialPost')
    ) {
      console.log('social-post-detail', itemId);
      navigation.navigate('social-post-detail', {
        itemId: itemId,
        item: undefined,
      });
    } else if (
      universalLink.includes('SocialUserProfile') ||
      universalLink.includes('SocialUserProfile')
    ) {
      navigation.navigate('social-profile', {
        user_id: itemId,
        item: undefined,
      });
    }
     else if (
      universalLink.includes('LiveStreamingViewer')
    ) {
      navigation.navigate('LiveStreaming', {
        data: {roomId: itemId},
      });
    }
  };
 
  useEffect(() => {
    console.log('auth.loggedIn handleDynamicLink');
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    onMaintenance();
  }, [databaseObject && databaseObject.is_under_maintenance]);

  const handleNotificationNav = remoteMessage => {
    console.log('handleNotificationNav remoteMessage', remoteMessage);
    console.log('remoteMessage.data.type', remoteMessage.data.type);
    console.log('setNotificationCount', setNotificationCount);
    global.notificationCount = global.notificationCount + 1;
    setNotificationCount(notificationCount + 1);

    if (
      remoteMessage.data &&
      (remoteMessage.data.type === 'coupon' ||
        remoteMessage.data.type === 'blog' ||
        remoteMessage.data.type === 'public_feed' ||
        remoteMessage.data.type === 'social_connection_post')
    ) {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: t('common:viewBtn'),
            onPress: () => {
              goToMainScreens(remoteMessage);
            },
          },
          {
            text: t('common:cancel'),
            onPress: () => console.log('Cancle Pressed'),
          },
        ],
      );
    } else if (remoteMessage.data && remoteMessage.data.type === 'message') {
      console.log('data ', remoteMessage.data);

      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: t('common:viewBtn'),
            onPress: () => {
              //navigation.navigate(t('navigate:messages'));
              goToChatScreen(remoteMessage);
              // const data = remoteMessage.data
              // const senderId = data.senderId
              // const senderName = data.name
              // const senderProfilePic = data.profile_pic

              // navigation.navigate("messaging", {
              //   id: senderId,
              //   name: senderName,
              //   image: senderProfilePic
              // });
              console.log('viewBtn Pressed');
            },
          },
          {
            text: t('common:cancel'),
            onPress: () => console.log('Cancle Pressed'),
          },
        ],
      );
    } else if (
      remoteMessage.data &&
      remoteMessage.data.type === 'broadcasting'
    ) {
      console.log('data ', remoteMessage.data.rooms);

      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: t('common:viewBtn'),
            onPress: () => {
              // goToChatScreen(remoteMessage);
              navigation.navigate('LiveStreaming', {
                data: {roomId: remoteMessage.data.roomId},
              });
              console.log('viewBtn Pressed');
            },
          },
          {
            text: t('common:cancel'),
            onPress: () => console.log('Cancle Pressed'),
          },
        ],
      );
    } else {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: t('common:cancel'),
            onPress: () => console.log('Cancle Pressed'),
          },
        ],
      );
    }
  };

  const goToMainScreens = remoteMessage => {
    console.log('remoteMessage.data--------------------------///-->',remoteMessage);
    if (remoteMessage.data && remoteMessage.data.type === 'coupon') {
      console.log('coupon Pressed');
      //navigation.navigate("coupons");
      if (authuser && authuser.user_status === 0) {
        navigation.navigate('couponDetail', {
          itemId: remoteMessage.data.id,
          item: undefined,
        });
      } else {
        navigation.navigate('coupons');
      }
    }
    if (remoteMessage.data && remoteMessage.data.type === 'blog') {
      console.log('blog Pressed');
      navigation.navigate('blogDetail', {
        itemId: remoteMessage.data.id,
        item: undefined,
      });
    }
    if (remoteMessage.data && remoteMessage.data.type === 'public_feed') {
      console.log('feed Pressed');
      navigation.navigate('publicFeedDetail', {
        itemId: remoteMessage.data.id,
        item: undefined,
      });
    }
    if (
      remoteMessage.data &&
      remoteMessage.data.type === 'social_connection_post'
    ) {
      console.log('social_connection_post Pressed');
      // navigation.navigate('publicFeedDetail', {
      //   itemId: remoteMessage.data.id,
      //   item: undefined,
      // });
      // navigation.navigate("socialScreen");
      navigation.navigate('social-profile', {
        user_id: remoteMessage.data.id,
        item:remoteMessage.data,
        IsNotificationShow:false,
        userName:remoteMessage?.notification.body
      });
    }
    if (remoteMessage.data && remoteMessage.data.type === 'user_block') {
      console.log('user_block Pressed');
      // navigation.navigate('publicFeedDetail', {
      //   itemId: remoteMessage.data.id,
      //   item: undefined,
      // });
    }
  };

  // const goToChatScreen = remoteMessage => {
  //   console.log('data ', remoteMessage.data);
  //   const data = remoteMessage.data;
  //   const senderId = data.senderId;
  //   const senderName = data.name;
  //   const senderProfilePic = data.profile_pic;

  //   navigation.navigate('messaging', {
  //     id: senderId,
  //     name: senderName,
  //     image: senderProfilePic,
  //     item: data,
  //   });
  // };
  const goToChatScreen = remoteMessage => {
    console.log('data ', remoteMessage.data);
    const data = remoteMessage.data;
    const senderId = data.senderId;
    const senderName = remoteMessage.notification.title || data.name;
    const senderProfilePic = data.profile_pic;

    navigation.navigate('messaging', {
      id: senderId,
      name: senderName,
      image: senderProfilePic,
      item: data,
    });
  }

  //  console.log('databaseObject', databaseObject && databaseObject.is_under_maintenance)
  const onMaintenance = () => {
    if (databaseObject && databaseObject.is_under_maintenance === true) {
      Alert.alert(
        '', // t("common:logout"),
        t('common:under_maintenance'), //t("common:under_maintenance"),
        [
          {
            text: t('common:ok'),
            onPress: () => {
              console.log('common:ok');
              RNExitApp.exitApp();
            },
          },
        ],
      );
    }
  };

  return <>{auth.loggedIn ? <DrawerStack /> : <AuthStack />}</>;
}
