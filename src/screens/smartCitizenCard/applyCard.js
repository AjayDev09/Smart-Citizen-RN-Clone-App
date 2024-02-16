import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { COLORS } from '../../theme'
import {  useNavigation } from '@react-navigation/native'
import { ApplyCardApi } from '../../redux/actions/settingsActions'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next'
import { RFValue } from 'react-native-responsive-fontsize'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ShowErrorToast } from '../../utils/common'

const ApplySmartCitizenDebitCard = ({ onCallBack }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data

  const applyCard = () => {
    const params = {}
    dispatch(ApplyCardApi(params, authuser.token))
      .then((response) => {
        console.log("CardStatusApi res:: ", response)
        if (response.status == 200) {
          onCallBack()
          navigation.navigate("smart_CitizenDebitCard")
        }
        Toast.show(response.message, Toast.SHORT);
      }).catch((error) => {
        console.log("CardStatusApi error:: ", error)
        ShowErrorToast(error)
      })
  }


  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {t('common:dabitcardTitle1')}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: "20%" }}>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={.5}
          onPress={() => {
            applyCard()
          }}
        >
          <Text style={[styles.itemText, { fontWeight: 'bold' }]}> {t('common:applyNow')}  </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonStyle, { marginLeft: wp(5) }]}
          activeOpacity={.5}
          onPress={() => { navigation.goBack() }}
        >
          <Text style={[styles.itemText, { fontWeight: 'bold' }]}> {t('common:skip')} </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ApplySmartCitizenDebitCard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.secondary,
  },
  text: {
    fontSize: RFValue(18),
    color: COLORS.text,
    lineHeight: 25,
    marginHorizontal: 20,
    marginTop: "20%",
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
  itemText: {
    fontSize: RFValue(14),
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