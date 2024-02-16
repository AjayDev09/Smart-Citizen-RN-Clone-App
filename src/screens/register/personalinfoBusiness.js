import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import DropdownComponent from '../../components/dropdownComponent';
import { upload } from '../../constants/images';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { launchImageLibrary } from 'react-native-image-picker';
import { AMPM, businessActivity, businessSector, } from '../../constants/constant';
import { RFValue } from 'react-native-responsive-fontsize';



const PersonalInfoBusiness = ({ onCallback, onBack, userState, setUserState }) => {
  const { t } = useTranslation();

  const [photo, setPhoto] = React.useState(null);

  const onChangeValue = (name, value) => {
    setUserState({ ...userState, [name]: value });
  };


  const [IsBusinessActivity, setBusinessActivity] = useState(false);
  const [IsBusinessSector, setBusinessSector] = useState(false);
  const [IsEstablishmentYear, setEstablishmentYear] = useState(false);
  const [IsBusinessLogo, setBusinessLogo] = useState(false);
  const [IsBusinessHours, setBusinessHours] = useState(false);

  const onRegister = () => {
    const horsfrom = userState.from + userState.fromAMPM
    const horsto = userState.to + userState.toAMPM

    let user = {
      business_activity: userState.business_activity,
      business_sector: userState.business_sector,
      establishment_year: userState.establishment_year,
      business_logo: userState.business_logo,
      business_hours: horsfrom + " to " + horsto,
    };

    setBusinessActivity(false)
    setBusinessSector(false)
    setEstablishmentYear(false)
    setBusinessLogo(false)
    setBusinessHours(false)

    var isError = false;

    if (!user.business_activity.trim()) {
      isError = true;
      setBusinessActivity(true);
    }
    if (!user.business_sector.trim()) {
      isError = true;
      setBusinessSector(true);
    }
    if (!user.establishment_year.trim()) {
      isError = true;
      setEstablishmentYear(true);
    }

    if (!isError) {
      console.log('Pressed', user);
      onCallback(user);
    }
  };

  const handleChoosePhoto = () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      noData: false,
    };

    launchImageLibrary(options, response => {
      if (response?.assets) {
        const image = response?.assets && response.assets[0];

        // const uri = Platform.OS === 'ios' ? image.replace('file://', '') : image

        
        setUserState({ ...userState, business_logo: image });
        // setPhoto(uri);
      } else {
        // setPhoto('');
      }
    });
  };

  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          //  paddingBottom: 50,
        }}
      >
        <Text style={styles.headerTitle}>{t('common:moreInfoBusiness')}</Text>
      </View>

      <DropdownComponent
        name={'business_activity'}
        value={userState.business_activity}
        setValue={onChangeValue}
        placeholder={t('common:businessActivity')}
        data={businessActivity}
        hasError={IsBusinessActivity}
        errorMessage={t("error:business_activity")}
      />

      <DropdownComponent
        name={'business_sector'}
        value={userState.business_sector}
        setValue={onChangeValue}
        placeholder={t('common:businessSector')}
        data={businessSector}
        hasError={IsBusinessSector}
        errorMessage={t("error:businessSector")}
      />
      <CustomInput
        name={'establishment_year'}
        value={userState.establishment_year}
        setValue={onChangeValue}
        placeholder={t('common:establishmentYear')}
        keyboardType={'numeric'}
        returnKeyType={'done'}
        hasError={IsEstablishmentYear}
        errorMessage={t("error:establishment_year")}
      //customStyle={{ marginTop: hp(1) }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(3),
        }}
      >
        <Text style={styles.text}>{t('common:addBusinessLogo')}</Text>
        <TouchableOpacity
          style={styles.uploadwrapper}
          onPress={handleChoosePhoto}
        >
          <Image source={userState.business_logo ? { uri: userState.business_logo.uri } : upload}
            style={styles.image} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: hp(3),
        }}
      >
        <Text style={[styles.text, { flex: 1, textAlign: 'left' }]}>
          {t('common:businessHours')}
        </Text>

        <View style={{ flexDirection: 'column', alignItems: 'center' }} >
          <View style={{ flexDirection: 'row', alignItems: 'center', height: hp(7) }}>
            <TextInput
              style={[styles.input, {
                //marginTop: Platform.OS === 'ios' ? 12 : -5,
                paddingBottom: 2,
                height: hp(6)
              }]}
              value={userState.from}
              onChangeText={text => {
                const format = /[0-9]/;
                if (text && text === '' || format.test(text)) {
                  onChangeValue('from', text)
                } else {
                  onChangeValue('from', "")
                }

              }}
              placeholder={t('common:from')}
              cursorColor={COLORS.text}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              placeholderTextColor={COLORS.textPlaceHolder}
              activeUnderlineColor={COLORS.border}
              maxLength={2}
            />
            <View style={{
              width: Platform.OS === 'ios' ? hp(11) : hp(11),
              marginLeft: wp(3)
            }}>
              <DropdownComponent
                name={'fromAMPM'}
                value={userState.fromAMPM}
                setValue={onChangeValue}
                // placeholder={t('common:AM')}
                data={AMPM}
                style={{ width: hp(11), height: hp(7) }}
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: hp(1), height: hp(7) }}>
            <TextInput
              style={[styles.input, {
                //marginTop: Platform.OS === 'ios' ? 12 : hp(1),
                paddingBottom: 2,
                height: hp(6)
              }]}
              value={userState.to}
              onChangeText={text => {
                const format = /[0-9]/;
                if (text && text === '' || format.test(text)) {
                  onChangeValue('to', text)
                } else {
                  onChangeValue('to', text)
                }
              }}
              placeholder={t('common:to')}
              cursorColor={COLORS.text}
              keyboardType={'numeric'}
              returnKeyType={'done'}
              maxLength={2}
              placeholderTextColor={COLORS.textPlaceHolder}
              activeUnderlineColor={COLORS.border}
            />
            <View style={{
              width: Platform.OS === 'ios' ? hp(11) : hp(11),
              marginLeft: wp(3),
            }}>
              <DropdownComponent
                name={'toAMPM'}
                value={userState.toAMPM}
                setValue={onChangeValue}
                // placeholder={t('common:AM')}
                data={AMPM}
                style={{ width: hp(11), height: hp(7) }}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={{
        marginTop: hp("5%"), marginHorizontal: '10%',
        flexDirection: 'row', justifyContent: 'space-around'
      }}>
        <CustomButton onCallback={() => onBack(1)} title={t('common:back')}
          textStyle={{ fontSize: RFValue(18) }} />
        <CustomButton
          onCallback={onRegister}
          title={t('common:next')}
          textStyle={{ fontSize: RFValue(18),   }}
        />
      </View>
    </View>
  );
};

export default PersonalInfoBusiness;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: RFValue(18),
    color: COLORS.textDark,
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'MyriadPro-Bold' : 'Myriad-Pro-Bold',
  },
  text: {
    fontSize: RFValue(18),
    color: COLORS.text,
    marginTop: 20,
    // fontFamily: "adoif",
    fontFamily:
      Platform.OS === 'ios' ? 'MyriadPro-Regular' : 'Myriad-Pro-Regular',
  },
  uploadwrapper: {
    borderRadius: 5,
    borderColor: COLORS.border,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  input: {
    width: 50,
    fontSize: RFValue(16),
    color: COLORS.text,
    borderColor: COLORS.border,
    borderWidth: 0,
    borderBottomWidth: 1,
    //paddingBottom: 2,
    // paddingVertical:5,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'ios' ? 'MyriadPro-Regular' : 'Myriad-Pro-Regular',
  },
});
