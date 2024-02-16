import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Coupons from '../screens/coupons';
import PublicFeedDetail from '../screens/publicFeed/publicFeedDetail';
import BlogDetail from '../screens/blogs/blogDetail';
import { useNavigation } from '@react-navigation/native';
import { Image, Platform, TouchableOpacity, View } from 'react-native';
import { arrow_back, iconBell, logo, menu, share } from '../constants/images';
import { COLORS } from '../theme';
import MyCoupons from '../screens/coupons/myCoupons';
import CouponDetail from '../screens/coupons/couponDetail';
import { useTranslation } from 'react-i18next';
import AddEditCoupon from '../screens/merchantCoupon/addEditCoupon';
import CouponStatistics from '../screens/merchantCoupon/couponStatistics';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReviewDetail from '../screens/coupons/reviewDetail';
import Chat from '../screens/chat/chat';
import Messaging from '../screens/chat/Messaging';
import SearchChatUsers from '../screens/chat/searchChatUser';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import BlockedChatUsers from '../screens/chat/blockedChatUsers';
import Social from '../screens/social';
import SocialSetting from '../screens/social/settings';
import Profile from '../screens/profile';
import MerchantProfile from '../screens/merchant_profile';
import SocialProfile from '../screens/social/profile';
import SocialPrivacySetting from '../screens/social/settings/SocialPrivacySetting';
import PostDetail from '../screens/social/home/postDetail';
import { UseNotificationCount } from '../context/notificationCountProvider';
import BlockedUsers from '../screens/social/blockUsers/BlockUsers';
import ConnectUsers from '../screens/social/ConnectUsers/ConnectUsers';
import LikedUsers from '../screens/social/LikedUsers/LikedUsers';
import NotificationScreen from '../screens/notifications';
import LiveStreaming from '../screens/LiveStreaming/LiveStreaming';

const Stack = createStackNavigator();

const NavigationDrawerStructure = props => {
  //Structure for the navigatin Drawer
  const profile = useSelector(({ user }) => user.profile);
  const toggleDrawer = () => {
    //Props to open/close the drawer
    profile?.isProfileComplete != 0 ? props.navigationProps.toggleDrawer():null
  };

  return (
    <TouchableOpacity
      style={{ paddingLeft: 10, paddingRight: 30, marginRight: 10 }}
      onPress={toggleDrawer}>
      {/*Donute Button Image */}
      <Image
        source={menu}
        style={{
          width: wp(7),
          height: wp(7),
          marginLeft: 5,
          tintColor: COLORS.white,
        }}
      />
    </TouchableOpacity>
  );
};

const RightIcon = ({ navigationProps, notificationCount }) => {
  const { t } = useTranslation();
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    navigationProps.toggleDrawer();
  };
  const profile = useSelector(({ user }) => user.profile);
  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={() => {
         profile?.isProfileComplete != 0 ?   navigationProps.navigate(t('navigate:notification'),{
              isALRET:true
            }) :null
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
          </TouchableOpacity>
      <TouchableOpacity onPress={() => {
      profile?.isProfileComplete != 0 ?   navigationProps.navigate('coupons'):null
        //navigationProps.goBack()
      }} style={{ paddingRight: wp(2), marginRight: 0 }} >
        <Image
          source={logo}
          style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};
const RightIconAlert = ({ navigationProps, notificationCount }) => {
  const { t } = useTranslation();
  //Structure for the navigatin Drawer
  const toggleDrawer = () => {
    //Props to open/close the drawer
    // navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {/* <TouchableOpacity onPress={() => {
            navigationProps.navigate(t('navigate:notification'),{
              isALRET:true
            });
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
          </TouchableOpacity> */}
      <TouchableOpacity onPress={() => {
        navigationProps.navigate('coupons');
        //navigationProps.goBack()
      }} style={{ paddingRight: wp(2), marginRight: 0 }} >
        <Image
          source={logo}
          style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};
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

const HomeStack = ({ props }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  // console.log('HomeStack props', props);
  const authUser = useSelector(({ auth }) => auth.data);
  const { notificationCount } = UseNotificationCount()

  return (
    <Stack.Navigator
      initialRouteName={'coupons'}
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: true,
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
          fontSize: RFValue(18),
          fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        },
      }}
    >
      <Stack.Screen
        name="coupons"
        options={{ title: t('navigate:myCoupons'), headerTitleAlign: "center", }}
        component={Coupons}
      />
          <Stack.Screen name={'LiveStreaming'} 
     options={{ headerShown: false }}
      component={LiveStreaming} 
     />
     {
        authUser && authUser?.user_status == 1 ?
        <Stack.Screen name={'merchantProfileNav'} options={{ headerTitleAlign: "center", title: t('navigate:myProfileMerchant') }} component={MerchantProfile} /> :
          <Stack.Screen name={'profileNav'} options={{ headerTitleAlign: "center", title: t('navigate:myProfile') }} component={Profile} />
      }
       <Stack.Screen name={'AlretNotification'} 
      options={{ title: t('navigate:notification'), headerTitleAlign: "center", 
      headerLeft: () => <NavigationDrawerBack navigation={navigation} />, 
      headerRight: () => <RightIconAlert navigationProps={navigation} />,
    }} 
      component={NotificationScreen} 
     />
      <Stack.Screen
        name="myCouponsClient"
        options={{ title: t('navigate:myCoupons'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={MyCoupons}
      />
      <Stack.Screen
        name="couponDetail"
        options={{ title: t('navigate:backCouponsList'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={CouponDetail}
      />
      <Stack.Screen
        name="addEditCoupon"
        options={{ title: t('navigate:addEditCoupon'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={AddEditCoupon}
      />
      <Stack.Screen
        name="publicFeedDetail"
        options={{ title: t('navigate:backPublicFeed'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={PublicFeedDetail}
      />
      <Stack.Screen
        name="blogDetail"
        options={{ title: t('navigate:backBlogs'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={BlogDetail}
      />
      <Stack.Screen
        name="couponStatistics"
        options={{ title: t('navigate:couponStatistics'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={CouponStatistics}
      />
      <Stack.Screen
        name="couponReview"
        options={{ title: t('navigate:couponReview'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={ReviewDetail}
      />
      <Stack.Screen
        name="chat"
        options={{ title: t('navigate:message'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack navigation={navigation} />, }}
        component={Chat}
      />
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
      <Stack.Screen
        name="socialScreen"
        options={{headerShown: false , title: "", headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={Social}
      />
      <Stack.Screen
        name="socialSetting"
        options={{ title: t('navigate:settingsPrivacy') , headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={SocialSetting}
      />
      <Stack.Screen
        name="profile"
        options={{ title: t('navigate:myProfile'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={Profile}
      />
      <Stack.Screen
        name="merchant-profile"
        options={{ title: t('navigate:myProfileMerchant'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={MerchantProfile}
      />

      <Stack.Screen
        name="social-profile"
        options={{headerShown: false , title: t('navigate:myProfile'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={SocialProfile}
      />
      <Stack.Screen
        name="social-account-privacy"
        options={{ title: t('navigate:accountPrivacy'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={SocialPrivacySetting}
      />
      <Stack.Screen
        name="social-post-detail"
        options={{ title: t('navigate:postDetail'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={PostDetail}
      />
      <Stack.Screen
        name="blocked-users"
        options={{headerShown: false , title: t('navigate:blockedUsers'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={BlockedUsers}
      />
      <Stack.Screen
        name="connected-users"
        options={{headerShown: false , title: t('navigate:connectedUsers'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={ConnectUsers}
      />
      <Stack.Screen
        name="liked-users"
        options={{headerShown: false , title: t('navigate:likes'), headerTitleAlign: "center", headerLeft: () => <NavigationDrawerBack />, }}
        component={LikedUsers}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
