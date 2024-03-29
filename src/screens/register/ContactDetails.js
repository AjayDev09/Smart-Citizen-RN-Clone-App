import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';

const ContactDetails = ({ onCallback, onBack , userState, setUserState}) => {
  const { t } = useTranslation();
  const auth = useSelector((state) => state.auth);

  const onChangeValue = (name, value) => {
    setUserState({ ...userState, [name]: value });
  };

  const [IsStreetAddressValidate, setStreetAddressValidate] = useState(false);
  const [IsStreetNoValidate, setStreetNoValidate] = useState(false);
  const [IsHouseNoValidate, setHouseNoValidate] = useState(false);
  const [IsCityValidate, setCityValidate] = useState(false);
  const [IsDistrictValidate, setDistrictValidate] = useState(false);

  const onRegister = () => {
    let user = {
      street_address_name: userState.street_address_name,
      street_number: userState.street_number,
      house_number: userState.house_number,
      city: userState.city,
      district: userState.district,
    };
    setStreetAddressValidate(false);
    setStreetNoValidate(false);
    setHouseNoValidate(false);
    setCityValidate(false);
    setDistrictValidate(false);

    var isError = false;

    if (!user.street_address_name.trim()) {
      isError = true;
      setStreetAddressValidate(true);
    }
    if (!user.street_number.trim()) {
      isError = true;
      setStreetNoValidate(true);
    }
    if (!user.house_number.trim()) {
      isError = true;
      setHouseNoValidate(true);
    }
    if (!user.city.trim()) {
      isError = true;
      setCityValidate(true);
    }
    if (!user.district.trim()) {
      isError = true;
      setDistrictValidate(true);
    }
    if (!isError) {
      onCallback(user);
    }
  };

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      //width: 350,
      justifyContent: 'center',
    }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',

        }}
      >
        <Text style={Styles.headerTitle}>{t('common:contactDetails')}</Text>
      </View>

      <CustomInput
        name={'street_address_name'}
        value={userState.street_address_name}
        setValue={onChangeValue}
        placeholder={t('common:streetAddName')}
        keyboardType={'default'}
        hasError={IsStreetAddressValidate}
        errorMessage={t('error:street_address_name')}
        customStyle={{ marginTop: hp("6%") }}
      />
      <CustomInput
        name={'street_number'}
        value={userState.street_number}
        setValue={onChangeValue}
        placeholder={t('common:streetNo')}
        keyboardType={'number-pad'}
        returnKeyType={'done'}
        hasError={IsStreetNoValidate}
        errorMessage={t('error:street_number')}
      />

      <CustomInput
        name={'house_number'}
        value={userState.house_number}
        setValue={onChangeValue}
        placeholder={t('common:houseNo')}
        keyboardType={'number-pad'}
        returnKeyType={'done'}
        hasError={IsHouseNoValidate}
        errorMessage={t('error:house_number')}
      />

      <CustomInput
        name={'city'}
        value={userState.city}
        setValue={onChangeValue}
        placeholder={t('common:city')}
        keyboardType={'default'}
        hasError={IsCityValidate}
        errorMessage={t('error:city')}
      />
      <CustomInput
        name={'district'}
        value={userState.district}
        setValue={onChangeValue}
        placeholder={t('common:district')}
        keyboardType={'default'}
        hasError={IsDistrictValidate}
        errorMessage={t('error:district')}
      />

      <View style={{ marginTop: 40, marginHorizontal: '5%', marginBottom: 15, flexDirection: 'row', justifyContent: 'space-around' }}>
        <CustomButton onCallback={() => onBack(2)} title={t('common:back')} textStyle={{ fontSize: RFValue(18), width: "100%" }} />
        <CustomButton isDisabled={auth.isRequesting} onCallback={onRegister} title={t('common:register')} textStyle={{ fontSize: RFValue(18), width: "100%" }} />
      </View>
    </View>
  );
};

export default ContactDetails;

const Styles = StyleSheet.create({
  headerTitle: {
    fontSize: RFValue(18),
    color: COLORS.textDark,
    //  fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    marginTop: 20,
  },
});
