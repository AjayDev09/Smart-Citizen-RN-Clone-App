import { ActivityIndicator, BackHandler, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { ApplyCardApi, CancelCardApi, CardStatusApi } from '../../redux/actions/settingsActions'
import ApplySmartCitizenDebitCard from './applyCard'
import Toast from 'react-native-simple-toast';
import { useTranslation } from 'react-i18next'
import { RFValue } from 'react-native-responsive-fontsize'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ShowErrorToast } from '../../utils/common'

const SmartCitizenDebitCard = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [cardDetail, setCardDetail] = useState(null)

  const auth = useSelector(({ auth }) => auth);
  const authuser = auth.data
  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getCardDetails(true)
    });
    return focusHandler;
  }, [navigation]);


  useEffect(() => {
    getCardDetails(true)
  }, [])

  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(false)

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getCardDetails()
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 2000);
  }, []);

  const getCardDetails = (load = false) => {
    if (load) {
      setLoading(true)
    }
    dispatch(CardStatusApi(authuser.token))
      .then((response) => {
        setRefreshing(false);
        setLoading(false)
        if (response.status == 200) {
          console.log('response', response)
          setCardDetail(response.data)
        }
      }).catch((error) => {
        setLoading(false)
        setRefreshing(false);
        console.log("CardStatusApi error:: ", error)
      })
  }

  const applyCard = () => {
    const params = {}
    dispatch(ApplyCardApi(params, authuser.token))
      .then((response) => {
        if (response.status == 200) {
          getCardDetails()
        }
        Toast.show(response.message, Toast.SHORT);
      }).catch((error) => {
        console.log("CardStatusApi error:: ", error)
        ShowErrorToast(error)
      })
  }

  const cancelCard = () => {
    if (cardDetail) {

      const params = {
        card_id: cardDetail.id
      }
      dispatch(CancelCardApi(params, authuser.token))
        .then((response) => {
          console.log('response', response)
          if (response.status == 200) {
            getCardDetails()
          }
          Toast.show(response.message, Toast.SHORT);
        }).catch((error) => {
          console.log("CardStatusApi error:: ", error)
          ShowErrorToast(error)
        })
    }
  }


  const CardScreen = () => {
    console.log('cardDetail', cardDetail)
    return (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <Text style={styles.text}>{t('common:dabitcardTitle')}
          </Text>

          <View style={{ marginVertical: hp(6) }}>
            <Text style={[styles.itemText, {
              fontSize: RFValue(16), color: COLORS.textDark,
              marginHorizontal: 20,
            }]}>
              {t('common:status')}   : {cardDetail.status}
            </Text>
          </View>

          <View style={{
            flexDirection: 'row', alignItems: 'center',
            marginHorizontal: "5%", justifyContent: 'center',
            marginTop: "15%"
          }}>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={.5}
              onPress={() => {
                applyCard()
              }}
            >
              <Text style={[styles.itemText]}> {t('common:applyAgain')} </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonStyle, { marginLeft: wp(5) }]}
              activeOpacity={.5}
              onPress={() => { cancelCard() }}
            >
              <Text style={[styles.itemText]}> {t('common:cancelApplication')} </Text>
            </TouchableOpacity>
          </View>
        </View></ScrollView>
    )

  }


  return (
    <View style={styles.container}>
      {
        (cardDetail && cardDetail.status !== 'Pending' && !loading) ?
          <CardScreen /> : !loading ? <ApplySmartCitizenDebitCard onCallBack={getCardDetails} /> : <ActivityIndicator size={'large'} style={{ alignSelf: "center", justifyContent: "center", flex: 1 }} color={COLORS.primary} />
      }
    </View>
  )
}

export default SmartCitizenDebitCard

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
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    // minWidth: 120,
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