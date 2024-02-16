import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
  Pressable,
  PermissionsAndroid,
  Image,
  ImageBackground,
  I18nManager,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';


import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import CustomInput from '../../components/customInput';
import { useTranslation } from 'react-i18next';
import RegisterType from '../../components/registerType';
import { login, loginActions, loginApi, socialLogin } from '../../redux/actions/loginActions';
//import Icon from 'react-native-vector-icons/FontAwesome5';
import messaging, { getMessaging } from '@react-native-firebase/messaging';
//import RecordScreen from 'react-native-record-screen';
import Geolocation from 'react-native-geolocation-service';
import { RFValue } from 'react-native-responsive-fontsize';
import { close, loginBg, logoLight, icon_logo_bg, appleLogo, googleLogo, eyeoffIcon, appleLogoWhite } from '../../constants/images';
import { ShowErrorToast } from '../../utils/common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { HAS_LAUNCHED } from '../../../App';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { appleAuth, appleAuthAndroid } from '@invertase/react-native-apple-authentication';
import jwt_decode from "jwt-decode";


const Login = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deviceToken, setDeviceToken] = useState('');

  const [IsEmailValidate, setIsEmailValidate] = useState(false);
  const [IsPasswordValidate, setIsPasswordValidate] = useState(false);
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('');
  const [location, setLocation] = useState(false);

  const auth = useSelector(({ auth }) => auth);
  const authState = auth
  const authuser = authState.data

  //console.log('authState.isRequesting', authState.isRequesting)

  //GoogleSignin.configure();

  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const getToken = async () => {
    //await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    setDeviceToken(token)
    //console.log('messaging token', token)
  }

  const checkIsFirst = async () => {
    const isLaunch = await checkIfFirstLaunch()
    if (!isLaunch) {
      getLocation()
    }
    getToken()
  }

  useEffect(() => {
    checkIsFirst()

    console.log('Login screen user', authuser)
    // RecordScreen.startRecording().catch(error => console.error(error));
    if (Platform.OS == 'android') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor(COLORS.primary);
    }

  }, []);

  async function fetchData() {
    return appleAuth.onCredentialRevoked(async () => {
      console.log('If this function executes, User Credentials have been Revoked');
      appleAuth.Operation.LOGOUT
    })
  }

  useEffect(() => {
    // console.log('appleAuthAndroid.isSupported', appleAuth.isSupported, appleAuthAndroid.isSupported)
    if (appleAuth.isSupported)
      fetchData();
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    // return appleAuth.onCredentialRevoked(async () => {
    //   console.warn('If this function executes, User Credentials have been Revoked');
    //   appleAuth.Operation.LOGOUT
    // });
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.



  const [selected, setSelected] = useState(false);
  useEffect(() => {
    console.log('selected', selected)
    verifyHasLaunched()
  }, []);

  const checkIfFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED);
      console.log('hasLaunched', hasLaunched)
      if (hasLaunched === null) {
        setSelected(true)
        setAppLaunched();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  const setAppLaunched = async () => {
    await AsyncStorage.setItem(HAS_LAUNCHED, 'true');
  }

  const verifyHasLaunched = async () => {
    try {
      const isLunch = await checkIfFirstLaunch()
      console.log('i18n.language', isLunch, I18nManager.isRTL, i18n.language)
      if (isLunch && !I18nManager.isRTL) {
        I18nManager.forceRTL(i18n.language !== 'en');
        setTimeout(() => { RNRestart.Restart(); }, 150);
      }

    } catch (err) {

    }
  };

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

  const getLocation = () => {


    if (Platform.OS === "ios") {
      // your code using Geolocation and asking for authorisation with
      getCurrentLocation()
    } else {
      const result = androidPermissions();
      result.then(res => {
        console.log('res', res)
        if (res) {
          getCurrentLocation()
        }
      });
    }


    console.log(location);
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      //console.log('status123r', status)
    }
    //requestAuthorization(authorizationLevel)
    Geolocation.getCurrentPosition(
      position => {
        // console.log("Geolocation ::::", position);
        setLocation(position);
      },
      error => {
        // See error code charts below.
        console.log("eror " + error.code, error.message);
        setLocation(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }
  const onLogin = () => {
    Keyboard.dismiss()
    // console.log('location', location.coords)
    if (userType === "") {
      Toast.show(t("error:user_type"), Toast.SHORT);
      return
    }

    let user = {
      user_status: userType === 'user' ? 0 : 1,
      device_type: Platform.OS === 'ios' ? 'IOS' : 'Android',
      device_token: deviceToken,
      latitude: location.coords ? location.coords.latitude : 0,
      longitude: location.coords ? location.coords.longitude : 0,
      email: username,
      password: password,
      language_code: i18n.language
    };
    console.log('Pressed', user);
    setIsEmailValidate(false);
    setIsPasswordValidate(false);

    var isError = false;

    if (!validateEmail(username)) {
      isError = true;
      setIsEmailValidate(true);
      //return
    }
    if (password === '' || password == undefined) {
      isError = true;
      setIsPasswordValidate(true);
    }
    //navigation.navigate('thankyou');
    // dispatch({
    //   type: loginActions.LOGIN_SUCCESS,
    //   // payload: JSON.stringify(JSON.parse(response).data),
    // });
    if (!isError) {
      console.log('Pressed', user);
      dispatch(loginApi(user))
        .then((response) => {
          if (response.status == 200) {
            if (response.data.is_verified_mobile_no === 0)
              navigation.replace("otpView");
          } else {
            console.log("login res error:::", response)
          }
          Toast.show(response && response.message, Toast.SHORT);

        })
        .catch((error) => {
          console.log("login error:::", error.data)
          ShowErrorToast(error)
        });
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  const onGoogleLogin = () => {
    if (userType === "") {
      Toast.show(t("error:user_type"), Toast.SHORT);
      return
    }


    GoogleSignin.configure({
      androidClientId: '681461997237-3777sbl8g2ov22l6tmhe65pf7sod7r05.apps.googleusercontent.com',
      iosClientId: '874633988498-3tlvav20vufbip2896d7gbhv4mjf94bc.apps.googleusercontent.com',
    });
    GoogleSignin.hasPlayServices().then((hasPlayService) => {
      if (hasPlayService) {
        GoogleSignin.signIn().then(async (userInfo) => {
          console.log("GoogleSignin >>>" + JSON.stringify(userInfo))
          const first_name = userInfo.user.name.split(' ')[0]
          const last_name = userInfo.user.name.split(' ')[1]
          let user = {
            login_type: 'google',
            id: userInfo.user.id,
            user_status: userType === 'user' ? 0 : 1,
            device_type: Platform.OS === 'ios' ? 'IOS' : 'Android',
            device_token: deviceToken,
            email: userInfo.user.email,
            first_name: first_name,
            last_name: last_name,
            language_code: i18n.language
          };
          console.log('user', user)

          dispatch(socialLogin(user))
            .then((response) => {
              console.log('response', response)
              if (response.status == 200) {
                // if (response.data.is_verified_mobile_no === 0)
                //   navigation.replace("otpView");
              } else {
                console.log("login res error:::", response)
              }
              Toast.show(response.message, Toast.SHORT);

            })
            .catch((error) => {
              console.log("login error:::", error)
              if (error)
                ShowErrorToast(error)
            });
          signOut()
        }).catch((e) => {
          console.log("ERROR IS: " + JSON.stringify(e));
        })
      }
    }).catch((e) => {
      console.log("ERROR IS: " + JSON.stringify(e));
    })

    //onGoogleButtonPress().then(() => console.log('Signed in with Google!'))
  }


  const onAppleButtonPress = async () => {

    if (userType === "") {
      Toast.show(t("error:user_type"), Toast.SHORT);
      return
    }
    if (Platform.OS == 'android') {
      try {
        // Initialize the module
        appleAuthAndroid.configure({
          clientId: "com.smartcitizen",
          redirectUri: "https://smart-citizen-df2b4.firebaseapp.com/__/auth/handler",
          scope: appleAuthAndroid.Scope.ALL,
          responseType: appleAuthAndroid.ResponseType.ALL,
        });
        const response = await appleAuthAndroid.signIn();
        if (response) {
          const code = response.code; // Present if selected ResponseType.ALL / ResponseType.CODE
          const id_token = response.id_token; // Present if selected ResponseType.ALL / ResponseType.ID_TOKEN
          const user = response.user; // Present when user first logs in using appleId
          const state = response.state; // A copy of the state value that was passed to the initial request.
          console.log("appleAuthAndroid response ===>>> ", response);
          console.log("Got authe code", code);
          console.log("Got id_token", id_token);
          console.log("Got user", user);
          console.log("Got state", state);
          // this.socialLoginAPICall('apple', response, response?.email)
        }
      } catch (error) {
        if (error && error.message) {
          switch (error.message) {
            case appleAuthAndroid.Error.NOT_CONFIGURED:
              console.log("appleAuthAndroid not configured yet.");
              break;
            case appleAuthAndroid.Error.SIGNIN_FAILED:
              console.log("Apple signin failed.");
              break;
            case appleAuthAndroid.Error.SIGNIN_CANCELLED:
              console.log("User cancelled Apple signin.");
              break;
            default:
              break;
          }
        }
      }


    } else {

      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });




      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identify token returned');
      }

      console.log('appleAuthRequestResponse ==>>> ', appleAuthRequestResponse)

      // Create a Firebase credential from the response
      const { identityToken } = appleAuthRequestResponse;
      var decoded = jwt_decode(identityToken);


      console.log("decoded >>++", decoded.sub, decoded.email);

      const first_name = appleAuthRequestResponse.fullName.givenName
      const last_name = appleAuthRequestResponse.fullName.familyName
      let user = {
        login_type: 'apple',
        id: decoded.sub,
        user_status: userType === 'user' ? 0 : 1,
        device_type: Platform.OS === 'ios' ? 'IOS' : 'Android',
        device_token: deviceToken,
        email: decoded.email,
        first_name: first_name,
        last_name: last_name,
        language_code: i18n.language
      };
      console.log('user', user)

      dispatch(socialLogin(user))
        .then((response) => {
          // console.log('socialLogin response', response)
          if (response.status == 200) {
            // if (response.data.is_verified_mobile_no === 0)
            //   navigation.replace("otpView");
          } else {
            console.log("socialLogin res error:::", response)
          }
          Toast.show(response.message, Toast.SHORT);

        })
        .catch((error) => {
          console.log("socialLogin error:::", error.data.message)
          ShowErrorToast(error)
        });









      // const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      // console.log('appleCredential', appleCredential)
      // Sign the user in with the credential
      //   let uDATA = await auth().signInWithCredential(appleCredential);
      //  // console.log('uDATA ==>>>> ', JSON.stringify(uDATA))
      //   uDATA.authorizationCode = appleAuthRequestResponse.authorizationCode

      // console.log('authorizationCode ==>>>> ', uDATA.additionalUserInfo)
      //this.socialLoginAPICall('apple', uDATA, uDATA.additionalUserInfo.profile.email)
      // alert('You\'re logged in with ' + uDATA.additionalUserInfo.profile.email)
    }

  }


  const updateUsername = (name, value) => {
    setUsername(value);
  };
  const updatePassword = (name, value) => {
    setPassword(value);
  };




  return (
    <ScrollView
      keyboardShouldPersistTaps={"handled"}
      bounces={false}
      contentContainerStyle={{ flexGrow: 1, }} style={{ backgroundColor: COLORS.secondary }}>
      <View style={Styles.behind}>
        <Image source={icon_logo_bg} style={Styles.image} />
      </View>

      <View
        //source={icon_logo_bg}
        style={[Styles.container, { alignItems: 'center' }]}
      >
        <Text style={Styles.headerTitle}>{t('common:signIn')}</Text>

        <CustomInput
          value={username}
          setValue={updateUsername}
          placeholder={t('common:email')}
          keyboardType={'email-address'}
          hasError={IsEmailValidate}
          errorMessage={t("error:email")}
          customStyle={{ marginTop: 20 }}
        />


        <CustomInput
          value={password}
          setValue={updatePassword}
          placeholder={t('common:password')}
          keyboardType={'default'}
          isPasswordField={true}
          hasError={IsPasswordValidate}
          errorMessage={t("error:password")}
          customStyle={{ marginTop: 20 }}
        />


        <View style={{ marginTop: 20 }}>
          <RegisterType
            userType={userType}
            setUserType={setUserType}
            isSign={true}
          />
        </View>


        <View style={{ marginTop: 60, marginHorizontal: '20%', width: '60%' }}>
          <CustomButton isDisabled={authState.isRequesting} onCallback={onLogin} title={t('common:signIn')} />
          <View style={{ marginTop: 10 }} />
          <Text
            style={[{
              fontSize: RFValue(16),
              color: COLORS.text,
              textAlign: 'center',
              backgroundColor: "transparent",
              fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
              marginTop: hp(2)
            }]}
          >
            {t('common:or')}
          </Text>

          {/* <View style={{ marginTop: 10 }} /> */}

          <Text
            style={[{
              fontSize: RFValue(16),
              color: COLORS.text,
              textAlign: 'center',
              backgroundColor: "transparent",
              fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
              marginVertical: hp(2)
            }]}
          >
            {t('common:loginwith')}
          </Text>
          <View style={{ marginTop: 0 }} />


          <View style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'center', paddingVertical: hp(2), backgroundColor: ""
          }} >
            {
              Platform.OS === 'ios' ? <TouchableOpacity
                activeOpacity={.5}
                onPress={() => onAppleButtonPress()}
                disabled={authState.isRequesting}
                style={[{
                  borderRadius: 45,
                  //   paddingVertical: hp(2),
                  alignItems: 'center',
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',

                }]}>
                <Image
                  source={appleLogo}
                  style={[{
                    width: 40,
                    height: 40,
                    //  tintColor: COLORS.primary,
                  }]}
                />
              </TouchableOpacity> : null
            }

            <TouchableOpacity
              activeOpacity={.5}
              onPress={() => onGoogleLogin()}
              disabled={authState.isRequesting}
              style={[{
                borderRadius: 45,
                // paddingVertical: hp(2),
                alignItems: 'center',
                opacity: 1,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: 20
              }]}>
              <Image
                source={googleLogo}
                style={[{
                  width: 38,
                  height: 38,
                  //  tintColor: COLORS.primary,
                }]}
              />
            </TouchableOpacity>

          </View>

          {/* <CustomButton isDisabled={authState.isRequesting} onCallback={onGoogleLogin} title={t('common:signInWithGoogle')} /> */}

          {
            Platform.OS !== 'ios' ? <>
              <View style={{ marginTop: 10 }} />
              {/* <TouchableOpacity
                activeOpacity={.5}
                onPress={() => onAppleButtonPress()}
                //disabled={isDisabled}
                style={[{  //flex:1,
                  backgroundColor: COLORS.black,
                  //opacity: isDisabled ? .5: 1 ,
                  borderRadius: 45,
                  paddingVertical: hp(2),
                  alignItems: 'center',
                  opacity: 1, display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center'
                }]}>
                <Image
                  source={eyeoffIcon}
                  style={[{
                    width: 20,
                    height: 20,
                    tintColor: COLORS.primary,
                    marginEnd: 10
                  }]}
                />
                <Text
                  style={[{
                    fontSize: RFValue(16),
                    color: COLORS.text,
                    // paddingVertical: hp(1),
                    textAlign: 'center',
                    backgroundColor: "transparent",
                    // fontWeight: 'bold',
                    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
                  }]}
                >
                  {t('common:signInWithApple')}
                </Text>
              </TouchableOpacity> */}
              {/* <CustomButton isDisabled={authState.isRequesting} onCallback={onAppleButtonPress} title={t('common:signInWithApple')} /> */}
            </> : null
          }


          <View style={{ display: 'flex', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>


            {/* <TouchableOpacity onPress={() => onGoogleLogin()}>
              <Image source={googleLogo} style={{
                width: wp(13),
                height: wp(13),
              }} />
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={onAppleButtonPress}>
              <Image source={appleLogo} style={{
                width: wp(15),
                height: wp(15),
              }} />
            </TouchableOpacity> */}
          </View>

        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
          <Text style={[Styles.defaultTxt,]}>
            <Text
              style={{ color: COLORS.textDark, textDecorationLine: 'underline' }}
              onPress={() => {
                navigation.navigate('forgotPassword');
              }}
            >
              {t('navigate:forgotPassword')}{' '}
            </Text>
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
          <Text style={[Styles.defaultTxt,]}>

            {t('common:donHaveAccount')}{' '}
            <Text
              style={{ color: COLORS.textDark, textDecorationLine: 'underline' }}
              onPress={() => {
                navigation.navigate('register');
                //   recordVideo()
              }}
            >
              {t('navigate:register')}{' '}
            </Text>
          </Text>
        </View>
        {
          authState.isRequesting ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
        }
      </View>
    </ScrollView>
  );
};
export default Login;
const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    backfaceVisibility: 'hidden'
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: hp(0),
    width: '100%',
    height: '100%'
  },
  image: {
    width: wp(40),
    height: wp(40),
    opacity: 0.2,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: RFValue(21),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
  },
  input: {
    width: 360,
    fontSize: RFValue(16),
    borderWidth: 1,
    borderColor: COLORS.primaryColor,
    paddingVertical: 10,
    marginVertical: 10,
    borderBottomWidth: 1.0,
    borderColor: COLORS.border,
    borderWidth: 0,
    borderBottomWidth: 2,
  },
  defaultTxt: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
  },

});


