import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../theme';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect } from 'react';

const RegisterType = ({ userType, setUserType, isSign = true }) => {
  const { t, i18n } = useTranslation();
  const title = isSign ? t('common:signInAs') : t('common:registerAs');


  useEffect(() => {
    console.log('isSign', i18n.language === 'ru' ? 0 : 20)
    console.log('i18n.language === ', i18n.language === 'ru')
    return () => {
    }
  }, [isSign])


  const mainFlexDirection = i18n.language === 'ru' ? isSign ? 'column' : 'row' : 'row'


  return (
    <View style={[Styles.typeWrapper, { flexDirection: mainFlexDirection }]}>
      <Text style={[Styles.headerTitle, {
        color: isSign ? COLORS.text : COLORS.textDark,
        marginEnd: i18n.language === 'ru' ? 5 : 10,
        marginRight: i18n.language === 'ru' ? 0 : 20
      }]}>
        {title}</Text>
      <View style={{
        display: 'flex', flexDirection: 'row',
        marginTop: i18n.language === 'ru' ? isSign ? 5 : 0 : 0
      }}>
        <View style={Styles.typeinnerWrapper}>
          <TouchableOpacity
            style={Styles.rbStyle}
            onPress={() => {
              setUserType("merchant")
            }}>
            {userType === "merchant" && <View style={Styles.selected} />}
          </TouchableOpacity>
          <Text style={Styles.typeText}>{t('common:merchant')}</Text>
        </View>
        <View style={Styles.typeinnerWrapper}>

          <TouchableOpacity
            style={Styles.rbStyle}
            onPress={() => {
              setUserType("user")
            }}>
            {userType === "user" && <View style={Styles.selected} />}
          </TouchableOpacity>
          <Text style={Styles.typeText}>{t('common:user')}</Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterType;

const Styles = StyleSheet.create({
  typeWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // alignItems: 'center',

  },
  headerTitle: {
    fontSize: RFValue(18),
    color: COLORS.text,
    // fontWeight: 'bold',
    marginRight: 0,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
  typeinnerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 0
  },
  typeText: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  rbStyle: {
    height: 25,
    width: 25,
    borderRadius: 110,
    borderWidth: 2,
    marginHorizontal: 5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    width: 16,
    height: 16,
    borderRadius: 55,
    backgroundColor: COLORS.primary,
  },
});
