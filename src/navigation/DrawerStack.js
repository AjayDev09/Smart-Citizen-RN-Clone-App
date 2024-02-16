import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './HomeStack';
import CustomDrawer from './CustomDrawer';
import Login from '../screens/login';
import { HOME, LOGIN } from '../constants';
import { COLORS } from '../theme';
import {
  Alert,
  AppState,
  Button,
  Dimensions,
  Image,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { getHeaderTitle } from '@react-navigation/elements';

import { useTranslation } from 'react-i18next';
import SmartCitizenDebitCard from '../screens/smartCitizenCard';
import { useNavigation } from '@react-navigation/native';
import { arrow_back, logo, menu, iconBell } from '../constants/images';
import { createStackNavigator } from '@react-navigation/stack';
import ApplySmartCitizenDebitCard from '../screens/smartCitizenCard/applyCard';
import Profile from '../screens/profile';
import Settings from '../screens/settings';
import MyCoupons from '../screens/coupons/myCoupons';
import { useDispatch, useSelector } from 'react-redux';
import { loginActions } from '../redux/actions/loginActions';
import TermsCondition from '../screens/terms';
import MerchantProfile from '../screens/merchant_profile';
import AboutSmartCitizen from '../screens/about';
import NotificationScreen from '../screens/notifications';
import CouponDetail from '../screens/coupons/couponDetail';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Chat from '../screens/chat/chat';
import Messaging from '../screens/chat/Messaging';
import socket from '../screens/chat/utils/socket';
import SearchChatUsers from '../screens/chat/searchChatUser';
import { UseChatCount } from '../context/chatCountProvider';
import BlockedChatUsers from '../screens/chat/blockedChatUsers';
import { UseNotificationCount } from '../context/notificationCountProvider';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function HomeNav() {
  return <HomeStack />;
}


function SmartCitizenDebitCardNav({ navigation }) {
  const { t } = useTranslation();
  const navigationBack = useNavigation();
  const { notificationCount } = UseNotificationCount()

  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //   fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(16),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",

    },
  }


  return <>
    <Stack.Navigator
      initialRouteName={'smart_CitizenDebitCard'}
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={'smart_CitizenDebitCard'} options={{
        headerTitleAlign: "center",
        title: t('navigate:smartCitizenDebitCard'),
      }}
        component={SmartCitizenDebitCard} />

      <Stack.Screen
        name="applyCard"
        options={{
          headerTitleAlign: "center",
          title: 'Apply Toshav Haham',
          headerTitleAlign: "center",
        }}
        component={ApplySmartCitizenDebitCard}
      />


    </Stack.Navigator>
  </>;
}

const NavigationDrawerBack = ({ navigation }) => {
  const navigationBack = useNavigation();
  return (
    <TouchableOpacity style={{ paddingLeft: wp(1), marginRight: wp(1) }} onPress={() => navigationBack.goBack()}>
      <Image
        source={arrow_back}
        style={{
          width: wp(6),
          height: wp(6),
          marginLeft: wp(1),
          tintColor: COLORS.white,
        }}
      />
    </TouchableOpacity>
  );
};
function MyProfileNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()

  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //   fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",

    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen
        name="myCouponsClient"
        options={{ title: t('navigate:myCoupons'), headerTitleAlign: "center", }}
        component={MyCoupons}
      />
      <Stack.Screen
        name="couponDetail"
        options={{
          title: t('navigate:backCouponsList'), headerTitleAlign: "center",
          headerLeft: () => <NavigationDrawerBack />,
        }}
        component={CouponDetail}
      />

      <Stack.Screen
        name="chat"
        options={{ title: t('navigate:message'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={Chat}
      />
      <Stack.Screen
        name="messaging"
        options={{ headerShown: false, title: t('navigate:messaging'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={Messaging}
      />
    </Stack.Navigator>
  </>;
}

function ProfileNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //  fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={'profile'} options={{ headerTitleAlign: "center", title: t('navigate:myProfile') }} component={Profile} />
    </Stack.Navigator>
  </>;
}
function MerchantProfileNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //  fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={'merchant-profile'} options={{ headerTitleAlign: "center", title: t('navigate:myProfileMerchant') }} component={MerchantProfile} />
    </Stack.Navigator>
  </>;
}


function SettingsNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={"settings"} options={{ headerTitleAlign: "center", title: t('navigate:settings') }} component={Settings} />
    </Stack.Navigator>
  </>;
}


function NotificationNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} showNotification={false} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={t('navigate:notificationnav')} 
      options={{ title: t('navigate:notification'), headerTitleAlign: "center", }} 
      component={NotificationScreen} 
     />

    </Stack.Navigator>
  </>;
}

function ChatNav({ navigation }) {
  const { t } = useTranslation();
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation}  BackBtn={true}/>
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(18),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={t('navigate:messages')}
        options={{ title: t('navigate:messages'), headerTitleAlign: "center", }}
        component={Chat} />
      <Stack.Screen
        name="messaging"
        options={{ headerShown: false, title: t('navigate:messaging'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={Messaging}
      />
      <Stack.Screen
        name="searchChatUsers"
        options={{ title: t('navigate:searchChatUsers'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={SearchChatUsers}
      />
      <Stack.Screen
        name="blockedChatUsers"
        options={{ title: t('navigate:blockedChatUsers'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={BlockedChatUsers}
      />
    </Stack.Navigator>
  </>;
}

function Helpnav({ navigation }) {
  const { t } = useTranslation();
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      //fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={t('navigate:Settings')} options={{ headerTitleAlign: "center", }} component={Settings} />
    </Stack.Navigator>
  </>;
}

function TermsConditionNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      // fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(17),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={"terms"} options={{ headerTitleAlign: "center", title: t('navigate:termsncondition') }} component={TermsCondition} />
    </Stack.Navigator>
  </>;
}

function AboutSmartCitizenNav({ navigation }) {
  const { t } = useTranslation();
  const { notificationCount } = UseNotificationCount()
  const SCREENOPTIONS = {
    headerShown: true, headerBackTitleVisible: true,
    headerLeft: () => (
      <NavigationDrawerStructure navigationProps={navigation} />
    ),
    headerRight: () => (
      <RightIcon navigationProps={navigation} notificationCount={notificationCount} />
    ),
    headerStyle: {
      backgroundColor: COLORS.primary, //Set Header color
    },
    headerTintColor: '#fff', //Set Header text color
    headerTitleStyle: {
      // fontWeight: 'bold', //Set Header text style
      fontSize: RFValue(16),
      fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
  }

  return <>
    <Stack.Navigator
      screenOptions={SCREENOPTIONS}
    >
      <Stack.Screen name={"aboutSmartCitizenApp"} options={{ headerTitleAlign: "center", title: t('navigate:aboutSmartCitizenApp') }} component={AboutSmartCitizen} />
    </Stack.Navigator>
  </>;
}

const NavigationDrawerStructure = ({ navigationProps ,BackBtn=false}) => {
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    navigationProps.toggleDrawer();
  };

  return (
  <>
  {BackBtn == false?
     <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 30, marginRight: 10 }} onPress={toggleDrawer}>
     {/*Donute Button Image */}
     <Image
       source={menu}
       style={{ width: wp(6), height: wp(6), marginLeft: 5, tintColor: COLORS.white }}
     />
   </TouchableOpacity>:
    <TouchableOpacity style={{ paddingLeft: 10, paddingRight: 30, marginRight: 10 }} onPress={()=>{
      navigationProps.goBack()
    }}>
    {/*Donute Button Image */}
    <Image
      source={arrow_back}
      style={{ width: wp(6), height: wp(6), marginLeft: 5, tintColor: COLORS.white }}
    />
  </TouchableOpacity>
  }
  </>
  );
};

const RightIcon = ({ navigationProps, notificationCount, showNotification = true }) => {
  const { t } = useTranslation();
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    navigationProps.toggleDrawer();
  };
  
  return (
    <View style={{ flexDirection: 'row' }}>
      {
        showNotification?  <TouchableOpacity onPress={() => {
          navigationProps.navigate(t('navigate:notification'));
        }} style={{ paddingRight: wp(2), marginRight: 0 }} >
          <Image
            source={iconBell}
            style={{
              width: wp(6), height: wp(6), marginLeft: 5,
              tintColor: COLORS.white
            }}
          />
          {
            notificationCount > 0 ? <View style={{
              height: 10, width: 10,
              backgroundColor: "red", borderRadius: 45,
              position: 'absolute', right: wp(2)
            }} /> : null
          }
        </TouchableOpacity> : null
      }

      <TouchableOpacity onPress={() => {
       navigationProps.navigate('coupons');
        // navigation.goBack()
      }} style={{ paddingRight: wp(2), marginRight: 0 }} >
        <Image
          source={logo}
          style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
        />
      </TouchableOpacity>


    </View>
  );
};






const DrawerStack = () => {
  const dimensions = useWindowDimensions();
  const navigation = useNavigation()
  const { notificationCount, setNotificationCount } = UseNotificationCount()
  const { chatMessageCount, setChatMessageCount } = UseChatCount()


  const { t } = useTranslation();
  const isLargeScreen = Dimensions.width >= 768;

  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data


  useEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor(COLORS.primary);
    }

    const data = {
      userid: authuser.user_id,
      usertype: authuser.user_status === 0 ? "user" : "merchant"
    }

    // global.user_id = authuser.user_id;
    // global.user_type = authuser.user_status === 0 ? "user" : "merchant";
    console.log('userConnected data', socket.id, data)
    socket.emit("userConnected", data)
  }, []);

  // useEffect(() => {
  //   getSoket(authuser.user_id, authuser.user_status === 0 ? "user" : "merchant")
  //   return () => {
  //   }
  // }, [])

  useEffect(() => {
    const subscription =  AppState.addEventListener('change', handleAppStateChange);
    // socket.on('connect_error', (err) => {
    //   socket.disconnect()
    //   console.log('socket.on error123', err)
    // });
    return () => {
      subscription.remove();
    }

  }, [])

  const handleAppStateChange = (nextAppState) => {
    console.log('nextAppState', nextAppState)
    const data = {
      userid: authuser.user_id,
      usertype: authuser.user_status === 0 ? "user" : "merchant"
    }
    if (nextAppState === 'active') {
      // socket.disconnect()
      socket.connect()
      socket.emit("userConnected", data)
    } else if (nextAppState === 'background') {
      console.log('the app is closed');
      socket.disconnect()
    }
  }


  useEffect(() => {
    // console.log('drawer on')
    socket.on("receive_message", messageListener);
    return () => {
      //   console.log('drawer off')
      socket.off('receive_message', messageListener);
    };
  }, [socket, chatMessageCount]);

  const messageListener = (roomChats) => {
    //console.log('roomChats chatMessageCount', chatMessageCount)
    if (authuser.user_id === roomChats.receiverId) {
      setChatMessageCount(chatMessageCount + 1)
    }
  };





  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        // headerStyle: {
        //   height: 80, // Specify the height of your custom header
        //   backgroundColor: COLORS.primary,
        // },

        drawerType: isLargeScreen ? 'permanent' : 'front',
        drawerStyle: isLargeScreen ? null : { width: 270 },
        overlayColor: 'transparent',
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          //fontWeight: 'bold'
          fontSize: RFValue(16),
          fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
          alignContent: 'center'
        },
        drawerItemStyle: { height: Platform.OS === 'ios' ? hp(7) : hp(7), justifyContent: 'center' },
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.text,
        drawerInactiveTintColor: COLORS.textDark,
        drawerLabelStyle: {
          // fontFamily: 'Roboto-Medium',
          fontSize: RFValue(13),
          //  fontWeight: 'bold'
          textAlign: 'left',
          fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        },
      }}

      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name={t('navigate:home')} options={{
        title: t('navigate:home'),
        drawerItemStyle: {}
      }} component={HomeNav} />

      {
        authuser && authuser.user_status === 0 ? <Drawer.Screen
          name={t('navigate:myCouponsClient')}
          options={{ title: t('navigate:myCoupons'), headerTitleAlign: "center", }}
          component={MyProfileNav}
        /> : null
      }

      {
        authuser && authuser.user_status === 1 ?
          <Drawer.Screen name={t('navigate:myProfileMerchant')} options={{ title: t('navigate:myProfileMerchant') }} component={MerchantProfileNav} /> :
          <Drawer.Screen name={t('navigate:myProfile')} options={{ title: t('navigate:myProfile'), }} component={ProfileNav} />
      }


      <Drawer.Screen name={t('navigate:smartCitizenDebitCard')} options={{ title: t('navigate:smartCitizenDebitCard') }} component={SmartCitizenDebitCardNav} />
      <Drawer.Screen name={t('navigate:settings')} options={{ title: t('navigate:settings') }} component={SettingsNav} />
      <Drawer.Screen name={t('navigate:aboutSmartCitizenApp')} options={{ title: t('navigate:aboutSmartCitizenApp') }} component={AboutSmartCitizenNav} />
      <Drawer.Screen name={t('navigate:notification')} options={{ title: t('navigate:notification') }} component={NotificationNav} />
      {/* <Drawer.Screen name={t('navigate:help')} options={{ title: t('navigate:help') }} component={SettingsNav} /> */}
      <Drawer.Screen name={t('navigate:termsncondition')} options={{ title: t('navigate:termsncondition') }} component={TermsConditionNav} />
      <Drawer.Screen name={t('navigate:messages1')} options={{
        title: t('navigate:messages'),
        drawerItemStyle: { height: 0 }
      }} component={ChatNav} />

    </Drawer.Navigator>
  );
};

export default DrawerStack;
