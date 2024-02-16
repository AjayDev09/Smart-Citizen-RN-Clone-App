import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../theme'
import { dislike, like } from '../../constants/images'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ApplyCardApi } from '../../redux/actions/settingsActions'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next'
import { actions } from '../../redux/actions'
import { RFValue } from 'react-native-responsive-fontsize'



const ThankYou = ({ navigation1 }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data

  const submit = () => {
    const params = {}
    dispatch({
      type: actions.login.VERIFY_SUCCESS,
      payload: authuser,
    });
  }


  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: COLORS.primary, justifyContent: 'center', padding: 16, }}>
        <Text style={styles.headerTitle}>{t('common:thankyou')}</Text>
      </View>

      <Text style={styles.text}>
        {t('common:thankyou_msg')}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: "20%" }}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={.5}
          onPress={() => {
            submit()
          }}
        >
          <Text style={[styles.itemText, { fontWeight: 'bold' }]}> {t('common:ok')} </Text>
        </TouchableOpacity>


      </View>
    </View>
  )
}

export default ThankYou

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    fontSize: RFValue(20),
    color: COLORS.text,
    // fontWeight: 'bold',

    alignSelf: 'center',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
  },
  text: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontWeight: 'bold',
    lineHeight: 25,
    marginHorizontal: 20,
    marginTop: "20%",
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
  itemText: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    width: 170,
    backgroundColor: COLORS.primary,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image_small: {
    width: 20,
    height: 20,
    left: 0
  },
})