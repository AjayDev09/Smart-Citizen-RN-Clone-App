import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, I18nManager } from 'react-native';
import React, { useState } from 'react';
import CheckBox from '@react-native-community/checkbox';

import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { validateEmail } from '../../utils/common';
import { RFValue } from 'react-native-responsive-fontsize';
import TermsPopup from '../../components/TermsPopup';

const BusinessInfoComponent = ({ onCallback, userState, setUserState }) => {
  const { t } = useTranslation();

  const [agree, setAgree] = useState(false);
  const [isShoWTerms, setShoWTerms] = useState(false);

  const onChangeValue = (name, value) => {
    //  console.log(name, value);
    setUserState({ ...userState, [name]: value });
  };

  const [IsBusinessNameValidate, setBusinessNameValidate] = useState(false);
  const [IsRegistrationNumberValidate, setRegistrationNumberValidate] = useState(false);
  const [IsEmailValidate, setEmailValidate] = useState(false);
  const [IsPasswordValidate, setPasswordValidate] = useState(false);
  const [IsPassConfirmValidate, setPassConfirmValidate] = useState(false);
  const [IsPhoneNumValidate, setPhoneNumValidate] = useState(false);
  const [IsWebsiteValidate, setWebsiteValidate] = useState(false);

  const onRegister = () => {
    let user = {
      business_name: userState.business_name,
      registration_number: userState.registration_number,
      email: userState.email,
      phone_number: userState.phone_number,
      password: userState.password,
      password_confirmation: userState.password_confirmation,
      website: userState.website,
    };
    setBusinessNameValidate(false);
    setRegistrationNumberValidate(false);
    setEmailValidate(false);
    setPasswordValidate(false);
    setPassConfirmValidate(false);
    setPhoneNumValidate(false);
    setWebsiteValidate(false);

    var isError = false;

    if (!user.business_name.trim()) {
      isError = true;
      setBusinessNameValidate(true);
    }
    if (!user.registration_number.trim()) {
      isError = true;
      setRegistrationNumberValidate(true);
    }
    if (!validateEmail(user.email)) {
      isError = true;
      setEmailValidate(true);
    }
    if (!user.password.trim() || user.password.length < 6) {
      isError = true;
      setPasswordValidate(true);
    }
    if (!user.password_confirmation.trim() || user.password !== user.password_confirmation) {
      isError = true;
      setPassConfirmValidate(true);
    }
    // if (!user.phone_number.trim() || user.phone_number.length < 10) {
    //   isError = true;
    //   setPhoneNumValidate(true);
    // }
    if (!user.website.trim()) {
      isError = true;
      setWebsiteValidate(true);
    }

    if (!isError) {
      onCallback(user);
      //console.log('Pressed', user);
    }
  };

  return (
    <SafeAreaView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={100}
      style={{ display: 'flex', justifyContent: 'center' }}
    >

      <Text style={Styles.headerTitle}>{t('common:businessInformation')}</Text>

      <View style={{ marginLeft: wp("5%"), }}>

        <CustomInput
          name={'business_name'}
          value={userState.business_name}
          setValue={onChangeValue}
          placeholder={t('common:businessName')}
          keyboardType={'default'}
          hasError={IsBusinessNameValidate}
          errorMessage={t("error:business_name")}
          customStyle={{ marginTop: 10 }}
        />
        <CustomInput
          name={'registration_number'}
          value={userState.registration_number}
          setValue={onChangeValue}
          placeholder={t('common:regNo')}
          keyboardType={'number-pad'}
          hasError={IsRegistrationNumberValidate}
          errorMessage={t('error:registration_number')}
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

        <CustomInput
          name={'website'}
          value={userState.website}
          setValue={onChangeValue}
          placeholder={t('common:website')}
          keyboardType={'default'}
          hasError={IsWebsiteValidate}
          errorMessage={t("error:website")}
        />

        <TouchableOpacity onPress={() => setShoWTerms(!isShoWTerms)} style={Styles.checkboxContainer}>
          <CheckBox
            boxType="square"
            disabled={false}
            value={agree}
            //tintColors={COLORS.text}
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
        <CustomButton isDisabled={!agree} onCallback={onRegister} title={t('common:next')} textStyle={{ fontSize: RFValue(18) }} />
      </View>
    </SafeAreaView>
  );
};

export default BusinessInfoComponent;

const Styles = StyleSheet.create({
  headerTitle: {
    fontSize: RFValue(18),
    color: COLORS.textDark,
    //  fontWeight: 'bold',
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
    height: 20
  },
});
