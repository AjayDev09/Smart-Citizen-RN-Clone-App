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
  Image,
  ImageBackground,
  Keyboard
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';


import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import CustomInput from '../../components/customInput';
import { useTranslation } from 'react-i18next';
import RegisterType from '../../components/registerType';
import { forgotApi, login, loginActions, loginApi, resetPasswordApi } from '../../redux/actions/loginActions';
//import Icon from 'react-native-vector-icons/FontAwesome5';
import messaging, { getMessaging } from '@react-native-firebase/messaging';
//import RecordScreen from 'react-native-record-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { close, loginBg, logoLight, icon_logo_bg } from '../../constants/images';
import { actions } from '../../redux/actions';
import { ShowErrorToast } from '../../utils/common';



//import { login } from "./../../actions/auth";
const ResetPassword = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [deviceToken, setDeviceToken] = useState('');

  const [IsCodeValidate, setCodeValidate] = useState(false);
  const [IsPasswordValidate, setIsPasswordValidate] = useState(false);
  const [IsPassConfirmValidate, setPassConfirmValidate] = useState(false);
  const dispatch = useDispatch();
  const [userType, setUserType] = useState('user');
  const [location, setLocation] = useState(false);

  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data

  //console.log('auth.isRequesting', auth.isRequesting)

  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  useEffect(() => {
    console.log('Login screen user', authuser)
    // RecordScreen.startRecording().catch(error => console.error(error));
    if (Platform.OS == 'android') {
      StatusBar.setBarStyle('light-content', true);
      StatusBar.setBackgroundColor(COLORS.primary);
    }
    dispatch({
      type: actions.login.FORGOT_PASSWORD_SUCCESS,
    });
  }, []);


  const onReset = () => {
    // console.log('location', location.coords)
    let user = {
      password: password,
      password_confirmation: passwordConfirmation,
      token: code,
      language_code: i18n.language
    };
    // console.log('Pressed', user);
    setCodeValidate(false);
    setIsPasswordValidate(false);
    setPassConfirmValidate(false);

    var isError = false;

    if (!code.trim()) {
      isError = true;
      setCodeValidate(true);
    }

    if (!password.trim() || password.length < 6) {
      isError = true;
      setIsPasswordValidate(true);
    }
    if (!passwordConfirmation.trim() || password !== passwordConfirmation) {
      isError = true;
      setPassConfirmValidate(true);
    }

    if (!isError) {
      console.log('Pressed', user);
      dispatch(resetPasswordApi(user))
        .then((response) => {
          if (response.status == 200) {
            navigation.replace("login");
          } else {
            console.log("resetPasswordApi res error:::", response)
          }
          Toast.show(response.message, Toast.SHORT);

        })
        .catch((error) => {
          console.log("resetPasswordApi error:::", error)
          ShowErrorToast(error)
        });
    }
  };

  const updateCode = (name, value) => {
    setCode(value);
  };
  const updatePassword = (name, value) => {
    setPassword(value);
  };
  const updatePasswordConfirm = (name, value) => {
    setPasswordConfirmation(value);
  };




  return (
    <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ flex: 1, }} style={{ backgroundColor: COLORS.secondary }}>
      {/* <View style={Styles.behind}>
        <Image source={icon_logo_bg} style={Styles.image} />
      </View> */}

      <View
        //source={icon_logo_bg}
        style={[Styles.container, { alignItems: 'center' }]}
      >
        <Text style={Styles.headerTitle}>{t('navigate:resetPassword')}</Text>

        <CustomInput
          name={'oneTimePassword'}
          value={code}
          setValue={updateCode}
          placeholder={t('common:OneTimePassword')}
          keyboardType={'default'}
          //   isPasswordField={true}
          hasError={IsCodeValidate}
          errorMessage={t("error:oneTimePassword")}
          customStyle={{ marginTop: 20 }}
        />

        <CustomInput
          name={'password'}
          value={password}
          setValue={updatePassword}
          placeholder={t('common:newPassword')}
          keyboardType={'default'}
          isPasswordField={true}
          hasError={IsPasswordValidate}
          errorMessage={t("error:password")}
        //customStyle={{ marginTop: 20 }}
        />
        <CustomInput
          name={'password_confirmation'}
          value={passwordConfirmation}
          setValue={updatePasswordConfirm}
          placeholder={t('common:confirmPassword')}
          keyboardType={'default'}
          isPasswordField={true}
          hasError={IsPassConfirmValidate}
          errorMessage={t("error:password_confirmation")}
        />


        {/* <View style={{ marginTop: 20 }}>
          <RegisterType
            userType={userType}
            setUserType={setUserType}
            isSign={true}
          />
        </View> */}


        <View style={{ marginTop: 60, marginHorizontal: '20%', width: '50%' }}>
          <CustomButton isDisabled={auth.isRequesting} onCallback={onReset} title={t('navigate:resetPassword')} />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 30 }}>
          <Text style={[Styles.defaultTxt,]}>
            <Text
              style={{ color: COLORS.textDark, textDecorationLine: 'underline' }}
              onPress={() => {
                Keyboard.dismiss()
                navigation.navigate('login');
              }}
            >
              {t('navigate:signin')}{' '}
            </Text>
          </Text>
        </View>
        {
          auth.isRequesting ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
        }
      </View>
    </ScrollView>
  );
};
export default ResetPassword;
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

