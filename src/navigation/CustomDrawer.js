import React, { useContext } from 'react';
import { Image, ImageBackground, StyleSheet, Text, View, Dimensions, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../theme';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { loginActions, logoutApi } from '../redux/actions/loginActions';
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ShowErrorToast } from '../utils/common';
import { UseChatCount } from '../context/chatCountProvider';
import socket from "../screens/chat/utils/socket";

const CustomDrawer = (props) => {
  const { t, i18n } = useTranslation();
  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data
  const userProfile = useSelector(({ user }) => user.profile)
  const dispatch = useDispatch()





  const { chatMessageCount, setChatMessageCount } = UseChatCount()

  useEffect(() => {
    //console.log('CustomDrawer authuser', authuser.email)

    return () => {
    };
  }, [userProfile, chatMessageCount])





  // useEffect(() => {
  //   socket.on("receive_message", (roomChats) => {
  //     if (authuser.user_id === roomChats.receiverId) {
  //       setChatMessageCount(chatMessageCount + 1)
  //     }
  //   });
  // }, [socket, chatMessageCount]);

  const onLogout = () => {
    Alert.alert(
      t("common:logout"),
      t("common:logout_message"),
      [
        {
          text: (t("common:yes")), onPress: () => {
            console.log('common:ok',)
            setTimeout(() => {
              dispatch(logoutApi(authuser.token))
                .then((res) => {
                  dispatch({
                    type: loginActions.LOGOUT,
                    // payload: JSON.stringify(JSON.parse(response).data),
                  });
                }, 150)
                .catch((error) => {
                  ShowErrorToast(error)
                })

              // dispatch(logoutApi(authuser.token))
              //   .then((res) => {
              //     console.log('res', res)
              //     dispatch({
              //       type: loginActions.LOGOUT,
              //       // payload: JSON.stringify(JSON.parse(response).data),
              //     });
              //   }).catch((error) => {
              //     console.log('error', error)
              //     ShowErrorToast(error)
              //   })

            }, 150);
            // setTimeout(() => {
            // }).catch((error) => {
            // }) 
          }
        },
        {
          text: (t("common:no")),
          onPress: () => console.log("Cancel Pressed"),
          // style: "cancel"
        }
      ]
    );
  }

  const { state } = props
  const { routes, index } = state;
  const focusedRoute = routes[index].name; // this is the active route
  // console.log('focusedRoute', focusedRoute)

  const isChatScreen = focusedRoute === t('navigate:messages1')


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff', padding: 0 }}>
        <ImageBackground
          style={{
            margin: wp(2), backgroundColor: COLORS.primary, height: hp(10), alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{
            fontSize: RFValue(20),
            color: '#FFF',
            textAlign: 'center',
            padding: 8,
            fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
          }}>
            {
              userProfile ? authuser.user_status === 0 ? userProfile.first_name + " " + userProfile.last_name : userProfile.business_name :
                authuser.user_status === 0 ? authuser.first_name + " " + authuser.last_name : authuser.business_name}
          </Text>
        </ImageBackground>

        <DrawerItemList   {...props} />

        {/* <TouchableOpacity onPress={() => {
          props.navigation.navigate(t('navigate:messages1'))
        }} style={[styles.customItem, { backgroundColor: isChatScreen ? COLORS.primary : "#fff" }]}>
          <Text
            style={[styles.text, { color: isChatScreen ? COLORS.text : COLORS.textDark }]}
          >
            {t('navigate:messages')}
          </Text>
          <Text
            style={[styles.text, { color: isChatScreen ? COLORS.text : COLORS.textDark }]}
          >
            {chatMessageCount > 0 ? chatMessageCount : ""}
          </Text>
        </TouchableOpacity> */}

        {/* <DrawerItems
        {...props}
        getLabel={scene => <SliderItem scene={scene} {...props} />}
        renderIcon={() => {}}
        style={styles.drawerItemsContainer}
      /> */}


        <DrawerItem labelStyle={styles.text} label={t("common:logout")} onPress={onLogout} />

        {/* 
        <DrawerItem
          label="Help"
          labelStyle={styles.text}
          style={{}}
          onPress={() => {
            props.navigation.navigate(t('navigate:login'));
          }}
        /> */}
      </DrawerContentScrollView>

    </View>
  )
}

export default CustomDrawer


const styles = StyleSheet.create({
  text: {
    color: COLORS.textDark,
    fontSize: RFValue(13),
    padding: 0,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
  },
  customItem: {
    height: Platform.OS === 'ios' ? hp(7) : hp(7),
    paddingHorizontal: 8,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2
  },
})