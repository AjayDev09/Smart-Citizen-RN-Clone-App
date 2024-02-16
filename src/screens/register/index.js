import { ActivityIndicator, Dimensions, Keyboard, PermissionsAndroid, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import RegisterType from '../../components/registerType';
import Toast from 'react-native-simple-toast';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import UserComponent from './userComponent';
import ContactDetails from './ContactDetails';
import PersonalInfo from './personalinfo';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BusinessInfoComponent from './businessInformation';
import PersonalInfoBusiness from './personalinfoBusiness';
import { useDispatch, useSelector } from 'react-redux';
import { registerApi } from '../../redux/actions/loginActions';
import MerchantContactDetails from './merchantContactDetail';
import messaging from '@react-native-firebase/messaging';
import { ShowErrorToast } from '../../utils/common';
const SCREEN_HEIGHT = Dimensions.get('screen').height


const Register = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()
  const auth = useSelector(({ auth }) => auth);


  const [userType, setUserType] = useState('user');
  const [isFirstStep, setFirstStep] = useState(1);
  const [deviceToken, setDeviceToken] = useState('');
  const [location, setLocation] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  const [userState, setUserState] = useState({
    user_status: 0,
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone_number: '',
    id_number: '',
    marital_status: '',
    no_of_child: '',
    occupation: '',
    education_level: '',
    street_address_name: '',
    street_number: '',
    house_number: '',
    city: '',
    district: '',


  })
  const [merchantState, setmerchantState] = useState({
    user_status: 1,
    business_name: '',
    registration_number: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
    website: '',
    business_activity: '',
    business_sector: '',
    establishment_year: '',
    business_logo: '',
    from: '',
    to: '',
    fromAMPM: 'AM',
    toAMPM: 'PM',
    marital_status: '',
    street_address_name: '',
    street_number: '',
    district: '',

  })

  useEffect(() => {
    //   console.log("register userState:: ", userState)
    console.log("register language_code::--------- ", i18n.language)
  }, [userState])


  useEffect(() => {
    if (Platform.OS === 'android') {
      getLocation()
    }
    getToken()
  }, []);
  const getToken = async () => {
    if (Platform.OS === 'android')
      await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    setDeviceToken(token)
    //  console.log('messaging token', token)
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
        return true;
      } else {
        console.log('Location permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  const getLocation = () => {
    const result = androidPermissions();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            setLocation(position);
          },
          error => {
            // See error code charts below.
            setLocation(false);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
      }
    });
    // console.log(location);
  };


  const onFirstStep = (firstStepData) => {
    setUserState({ ...userState, ...firstStepData })
    setFirstStep(2);
  };

  const onSecondStep = (secondStepData) => {
    setUserState({ ...userState, ...secondStepData })
    setFirstStep(3);

  };

  const onRegister = (thirdStepData) => {
    if (!isDisabled) {
      Keyboard.dismiss()
      const request = {
        ...userState, ...thirdStepData,
        device_type: Platform.OS === 'ios' ? 'IOS' : 'Android',
        device_token: deviceToken,
        latitude: location.coords ? location.coords.latitude : 0,
        longitude: location.coords ? location.coords.longitude : 0,
        language_code: i18n.language
      }
      console.log('request', request)
      setDisabled(true)
      dispatch(registerApi(request))
        .then((response) => {
          setDisabled(false)
          Toast.show(response.message, Toast.SHORT);
          if (response.status == 200) {
            navigation.navigate('otpView');
            setFirstStep(1);
          } else {
            setUserState({ ...userState, ...thirdStepData })
          }
        }).catch((error) => {
          setDisabled(false)
          setUserState({ ...userState, ...thirdStepData })
          ShowErrorToast(error)
        })
    }
  };

  const onFirstStepMerchant = (firstStepData) => {
    setmerchantState({ ...merchantState, ...firstStepData })
    setFirstStep(2);
  };
  const onSecondStepMerchant = (secondStepData) => {
    setmerchantState({ ...merchantState, ...secondStepData })
    setFirstStep(3);
  };


  const onBack = (step) => {
    setFirstStep(step);
  };

  const onRegisterMerchant = (thirdStepData) => {
    if (!isDisabled) {
      Keyboard.dismiss()
      const request = {
        ...merchantState, ...thirdStepData,
        device_type: Platform.OS === 'ios' ? 'IOS' : 'Android',
        device_token: deviceToken,
        latitude: location.coords ? location.coords.latitude : 0,
        longitude: location.coords ? location.coords.longitude : 0,
        language_code: i18n.language
      }
      const data = new FormData();

      Object.keys(request).forEach(key => {
        if (key === 'business_logo' && request[key].fileName) {
          //  console.log('request[key].fileName', request[key].fileName)
          data.append('business_logo', {
            name: request[key].fileName,
            type: 'multipart/form-data',
            uri: Platform.OS === 'ios' ? request[key].uri.replace('file://', '') : request[key].uri,
          });
        } else {
          data.append(key, request[key]);
        }
      });
      console.log('request registerApi', data)
      setDisabled(true)
      dispatch(registerApi(data))
        .then((response) => {
          setDisabled(false)
          console.log("onRegisterMerchant register res:: ", response)
          Toast.show(response.message, Toast.SHORT);
          if (response.status == 200) {
            navigation.navigate('otpView');
            setFirstStep(1);
          } else {
            setUserState({ ...userState, ...thirdStepData })
          }
        }).catch((error) => {
          setDisabled(false)
          console.log("onRegisterMerchant error.data:: ", error)
          setUserState({ ...userState, ...thirdStepData })
          ShowErrorToast(error)
        })
    }
  };


  return (
    <SafeAreaView
      keyboardShouldPersistTaps={"handled"}
      style={{ backgroundColor: COLORS.secondary, paddingTop: hp("3%"), flex: 1 }}>
      <ScrollView nestedScrollEnabled={true} style={{ width: "100%", }}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        <View style={[Styles.container, {
          flex: 1, width: '100%',
          height: SCREEN_HEIGHT - hp("0%"),
          alignItems: 'center',
        }]}>

          {isFirstStep === 1 ? (
            <View style={{ width: '100%', marginLeft: wp("9%") }} >
              <RegisterType
                userType={userType}
                setUserType={setUserType}
                isSign={false}
              />
            </View>
          ) : null}

          {isFirstStep === 1 ? (
            userType === 'user' ? (
              <View style={{}} >
                <UserComponent onCallback={onRegister} userState={userState} setUserState={setUserState} />
              </View>
            ) : (
              <View style={{ marginLeft: wp("0%") }} >
                <BusinessInfoComponent onCallback={onRegisterMerchant} userState={merchantState} setUserState={setmerchantState} />
              </View>
            )
          ) : null}

          <View style={{ marginTop: 10 }}>
            {isFirstStep === 2 ? (
              userType === 'user' ? (
                <PersonalInfo onCallback={onSecondStep} onBack={onBack} userState={userState} setUserState={setUserState} />
              ) : (
                <PersonalInfoBusiness onCallback={onSecondStepMerchant} onBack={onBack} userState={merchantState} setUserState={setmerchantState} />
              )
            ) : null}
          </View>

          <View style={{ marginTop: 10 }}>
            {isFirstStep === 3 ? (
              userType === 'user' ? (
                <ContactDetails onCallback={onRegister} onBack={onBack} userState={userState} setUserState={setUserState} />
              ) : (
                <MerchantContactDetails onCallback={onRegisterMerchant} onBack={onBack} userState={merchantState} setUserState={setmerchantState} />
              )
            ) : null}
          </View>


          <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10, marginBottom: 10 }}>
            <Text style={[Styles.defaultTxt]}>
              {t('common:alreadyHaveAccount')}{' '}
              <Text
                style={{ color: COLORS.textDark, textDecorationLine: 'underline' }}
                onPress={() => {
                  navigation.navigate('login');
                }}
              >
                {t('navigate:signin')}{' '}
              </Text>
            </Text>
          </View>
        </View>
        {
          auth.isRequesting ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default Register;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },

  defaultTxt: {
    fontSize: 16,
    color: COLORS.text,
    //fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
  },
});
