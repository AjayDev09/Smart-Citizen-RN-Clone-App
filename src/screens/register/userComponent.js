import React, { useState } from 'react';
import { Dimensions, I18nManager, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { validateEmail } from '../../utils/common';
import { RFValue } from 'react-native-responsive-fontsize';
import TermsAndConditions from '../../components/TermsAndConditions';
import TermsPopup from '../../components/TermsPopup';
import Tooltip from 'react-native-walkthrough-tooltip';


const UserComponent = ({ onCallback, isMarchant, userState, setUserState }) => {
  const { t, i18n } = useTranslation();
  const [agree, setAgree] = useState(false);
  const [isShoWTerms, setShoWTerms] = useState(false);
  const [toolTipVisible, setToolTipVisible] = useState(false);
  // const [userState, setUserState] = useState({
  //   first_name: '',
  //   last_name: '',
  //   email: '',
  //   password: '',
  //   password_confirmation: '',
  //   phone_number: '',
  //   id_number: '',
  // });

  const onChangeValue = (name, value) => {
    //  console.log(name, value);
    setUserState({ ...userState, [name]: value });
  };
  const [IsFirstNameValidate, setFirstNameValidate] = useState(false);
  const [IsLastNameValidate, setLastNameValidate] = useState(false);
  const [IsEmailValidate, setIsEmailValidate] = useState(false);
  const [IsPasswordValidate, setIsPasswordValidate] = useState(false);
  const [IsPassConfirmValidate, setPassConfirmValidate] = useState(false);
  const [IsPhoneNumValidate, setPhoneNumValidate] = useState(false);
  const [IsIdNumValidate, setIdNumValidate] = useState(false);

  const onRegister = () => {
    let user = {
      first_name: userState.first_name,
      last_name: userState.last_name,
      email: userState.email,
      password: userState.password,
      password_confirmation: userState.password_confirmation,
      phone_number: userState.phone_number,
      id_number: userState.id_number,
    };

    setFirstNameValidate(false);
    setLastNameValidate(false);
    setIsEmailValidate(false);
    setIsPasswordValidate(false);
    setPassConfirmValidate(false);
    setPhoneNumValidate(false);
    setIdNumValidate(false);

    var isError = false;

    if (!user.first_name.trim()) {
      isError = true;
      setFirstNameValidate(true);
    }
    if (!user.last_name.trim()) {
      isError = true;
      setLastNameValidate(true);
    }
    if (!validateEmail(user.email)) {
      isError = true;
      setIsEmailValidate(true);
    }
    if (!user.password.trim() || user.password.length < 6) {
      isError = true;
      setIsPasswordValidate(true);
    }
    if (!user.password_confirmation.trim() || user.password !== user.password_confirmation) {
      isError = true;
      setPassConfirmValidate(true);
    }
    // if (!user.phone_number.trim() || user.phone_number.length < 10) {
    //   isError = true;
    //   setPhoneNumValidate(true);
    // }
    // if (!user.id_number.trim()) {
    //   isError = true;
    //   setIdNumValidate(true);
    // }

    if (!isError) {
      onCallback(user);
      //console.log('Pressed', user);
    }
  };
  const checkboxHandler = () => {
    // if agree === true, it will be set to false
    // if agree === false, it will be set to true
    setAgree(!agree);
    // Don't miss the exclamation mark
  }
  // style={{height:'80%',}}
  //  console.log('agree', agree)
  const SCREEN_WIDTH = Dimensions.get('screen').width
  const widthP = (SCREEN_WIDTH * 15) / 100
  const [showTip, setTip] = useState(false);
  var color_a = '#000000';
  var color_b = '#000000';
  return (
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={100}
      style={{ display: 'flex', justifyContent: 'center' }} >
      <Text style={Styles.headerTitle}>{t('common:personalInformation')}</Text>

      <View style={{ marginLeft: wp("5%"), justifyContent: 'center' }}>
        <CustomInput
          name={'first_name'}
          value={userState.first_name}
          setValue={onChangeValue}
          placeholder={t('common:fname')}
          keyboardType={'default'}
          //  keyboardType={"birthdate-year"}
          hasError={IsFirstNameValidate}
          errorMessage={t("error:first_name")}
          customStyle={{ marginTop: 5 }}
        />
        <CustomInput
          name={'last_name'}
          value={userState.last_name}
          setValue={onChangeValue}
          placeholder={t('common:lname')}
          keyboardType={'default'}
          hasError={IsLastNameValidate}
          errorMessage={t("error:last_name")}
        />

        <CustomInput
          name={'email'}
          value={userState.email}
          setValue={onChangeValue}
          placeholder={t('common:emailAddress')}
          keyboardType={'email-address'}
          hasError={IsEmailValidate}
          errorMessage={t("error:email")}
        />

        <CustomInput
          name={'password'}
          value={userState.password}
          setValue={onChangeValue}
          placeholder={t('common:createPassword')}
          keyboardType={'default'}
          isPasswordField={true}
          hasError={IsPasswordValidate}
          errorMessage={t("error:password")}
        />

        <CustomInput
          name={'password_confirmation'}
          value={userState.password_confirmation}
          setValue={onChangeValue}
          placeholder={t('common:confirmPassword')}
          keyboardType={'default'}
          isPasswordField={true}
          hasError={IsPassConfirmValidate}
          errorMessage={t("error:password_confirmation")}
        />

        <CustomInput
          name={'phone_number'}
          value={userState.phone_number}
          setValue={onChangeValue}
          placeholder={t('common:phoneNumber') + " (" + t("error:optional") + ")"}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
        // hasError={IsPhoneNumValidate}
        // errorMessage={t("error:phone_number")}

        />
        {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <CustomInput
              name={'id_number'}
              value={userState.id_number}
              setValue={onChangeValue}
              placeholder={t('common:idNumber') + " (" + t("error:optional") + ")"} //
              keyboardType={'number-pad'}
              returnKeyType={'done'}
            // hasError={IsIdNumValidate}
            // errorMessage={t("error:id_number")}
            />
          </View>
          <Tooltip
            isVisible={toolTipVisible}
            content={<View >
              <Text style={[{ marginLeft: 5, marginTop: 0, textAlign: 'left' }]}>{t('common:idNumbermsg')}</Text>
            </View>}
            placement='top'
            onClose={() => { setToolTipVisible(false) }}
            tooltipStyle={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
            arrowStyle={{ marginLeft: I18nManager.isRTL ? Platform.OS === 'ios' ? 0 : 0 : 0 }}
            childrenWrapperStyle={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
            contentStyle={{ flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}
          // style={{alignItems:'flex-end'}}
          >
            <TouchableOpacity style={{ marginLeft: 0, }} onPress={() => setToolTipVisible(true)} >
              <Text style={[Styles.label, { marginLeft: Platform.OS === 'ios' ? 3 : 10, marginTop: 0, textAlign: 'left' }]} >
                ?
              </Text>
            </TouchableOpacity>

          </Tooltip>
        </View> */}

        <TouchableOpacity onPress={() => setShoWTerms(!isShoWTerms)} style={Styles.checkboxContainer}>
          <CheckBox
            boxType="square"
            disabled={false}
            value={agree}
            //tintColors={COLORS.primary}
            tintColors={{ true: COLORS.primary, false: COLORS.text }}
            onCheckColor={COLORS.text}
            onFillColor={COLORS.primary}
            onTintColor={COLORS.primary}
            onValueChange={setShoWTerms}
            style={Styles.checkbox}
          />
          <Text style={[Styles.label, { textDecorationLine: 'underline', textAlign: 'left', marginLeft: Platform.OS === 'ios' ? I18nManager.isRTL ? 10 : 0 : 0 }]}>{t('navigate:termsncondition')}</Text>
        </TouchableOpacity>

        {
          isShoWTerms ? <TermsPopup modalVisible={isShoWTerms} setModalVisible={setShoWTerms} agree={agree} setAgree={setAgree} /> : null
        }
      </View>
      <View style={{ marginTop: hp("3%"), marginHorizontal: '20%' }}>
        <CustomButton isDisabled={!agree} onCallback={onRegister} title={t('common:next')}
          customButtonStyle={{}} textStyle={{ fontSize: RFValue(18) }} />
      </View>
    </View>
  );
};

export default UserComponent;

const Styles = StyleSheet.create({
  headerTitle: {
    fontSize: RFValue(18),
    color: COLORS.textDark,
    // fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    marginTop: 20,
  },
  label: {
    fontSize: RFValue(16),
    color: COLORS.text,
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginTop: hp("3%"),
    alignItems: 'center'
  },
  checkbox: {
    alignSelf: 'center',
    tintColors: COLORS.primary,
    height: 20
  },
});
