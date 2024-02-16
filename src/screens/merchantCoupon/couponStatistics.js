import { I18nManager, Image, Platform, Share, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import Toast from 'react-native-simple-toast';
import DatePicker from 'react-native-date-picker'
import moment from 'moment';
import PieChart from 'react-native-pie-chart';


import { COLORS } from '../../theme'
import { calendar, mac_logo, share } from '../../constants/images'
import { getStatisticsCoupon, postAddMyCoupon, postSaveMyCoupon } from '../../redux/actions/couponActions';
import { RFValue } from 'react-native-responsive-fontsize';
import { DATE_, ShowErrorToast, getItemByLngAR } from '../../utils/common';


const CouponStatistics = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { itemId, item } = route.params;
    const [openCreate, setOpenCreate] = useState(false)
    const [openExpiry, setOpenExpiry] = useState(false)
    const [series, setSeries] = useState([])
    const [couponStatistics, setCouponStastics] = useState()
    const authuser = useSelector(({ auth }) => auth.data);

    const widthAndHeight = 200
    // var series = []
    const sliceColor = [COLORS.white, COLORS.primary, '#FFEB3B'] // , '#4CAF50', '#FF9800'
    const textTitle = [t('common:totalShare'), t('common:couponsAddedBy'), t('common:couponsUsedBy')] //, '#4CAF50', '#FF9800'

    const [couponState, setCouponState] = useState({
        create_date: "",
        expiry_date: "",//moment().format(DATE_)
    })

    useEffect(() => {
        statisticsCoupon(itemId)
    }, [itemId])

    useEffect(() => {
        if (couponStatistics) {
            const total = couponStatistics.total_share + couponStatistics.total_added_by + couponStatistics.total_used_by
            if (total > 0)
                setSeries([couponStatistics.total_share, couponStatistics.total_added_by, couponStatistics.total_used_by])
        }
    }, [couponStatistics])


    const statisticsCoupon = (coupon_id) => {
        const params = {
            coupon_id: coupon_id
        }
        dispatch(getStatisticsCoupon(params, authuser.token))
            .then((response) => {
                if (response.status === 200) {
                    setCouponStastics(response.data)
                } else {
                    Toast.show(response.message, Toast.SHORT);
                }
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }
    const saveMyCoupons = (coupon_id) => {
        const params = {
            coupon_id: coupon_id
        }
        dispatch(postSaveMyCoupon(params, authuser.token))
            .then((response) => {
                Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }


    // const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
    //  const coupon_description = i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description
    //  const term_condition = i18n.language === 'he' ? item.term_condition_he : i18n.language === 'ar' ? item.term_condition_ar : item.term_condition

    const coupon_title = item ? getItemByLngAR(i18n.language, item, "coupon_title") : ""
    const coupon_description = item ? getItemByLngAR(i18n.language, item, "coupon_description") : ""

    const terms = item ? getItemByLngAR(i18n.language, item, "term_condition") : "undefined"
    const term_condition = item ? terms !== "undefined" ? [terms] : "" : ""


   // console.log('item 123', series)

    let index = 0
    return (
        <ScrollView style={{ flex: 1, backgroundColor: COLORS.secondary, }}>
            <View style={styles.container}>
                <View style={{ marginLeft: 20, }}>
                    <View style={{ flexDirection: 'column', paddingRight: 10 }}>
                        <Text style={[styles.itemText, { fontSize: RFValue(21), textAlign: 'left' }]}>
                            {coupon_title}
                        </Text>
                        {/* {
                            term_condition.length > 0 ? term_condition.map((item, index) => {
                                return (<Text key={index} style={[styles.text,
                                { fontSize: RFValue(20), textAlign: 'left', marginTop: Platform.OS === 'ios' ? 10 : 8 }]}>
                                    {item}
                                </Text>)
                            }) : null
                        } */}
                        {
                            term_condition && term_condition !== undefined ? term_condition.length > 0 ? term_condition.map((item, index) => {
                                return (<Text key={index} style={[styles.itemText, { fontSize: RFValue(16), marginBottom: hp(1) }]}>
                                    {" " + item}
                                </Text>)
                            }) : null : null
                        }
                    </View>
                    <View style={{ marginTop: Platform.OS === 'ios' ? 30 : 20, }}>
                        <Text style={[styles.itemText, { fontSize: RFValue(21), textAlign: 'left' }]}>
                            {item.coupon_code + ""}
                        </Text>
                        <Text style={[styles.text, { fontSize: RFValue(18), textAlign: 'left', marginTop: Platform.OS === 'ios' ? 5 : 0 }]}>
                            {t('common:validaty') + " " + Moment(item.expiry_date).locale(i18n.language).format('Do MMM YYYY')}
                        </Text>
                    </View>

                </View>

                <View style={{ alignItems: 'flex-start', marginLeft: 20, marginTop: Platform.OS === 'ios' ? 10 : 8 }}>

                    <Text style={[styles.itemText, { fontSize: RFValue(18), marginTop: Platform.OS === 'ios' ? 20 : 20 }]}>

                        {" " + t('common:couponsAddedBy') + " : " + (couponStatistics ? couponStatistics.total_added_by : 0) + " "}

                    </Text>

                    <Text style={[styles.itemText, { fontSize: RFValue(18), marginTop: Platform.OS === 'ios' ? 20 : 10 }]}>
                        {t('common:couponsUsedBy') + " : " + (couponStatistics ? couponStatistics.total_used_by : 0)}
                    </Text>

                    <Text style={[styles.itemText, { fontSize: RFValue(18), marginTop: Platform.OS === 'ios' ? 20 : 10 }]}>
                        {t('common:totalShare') + " : " + (couponStatistics ? couponStatistics.total_share : 0)}
                    </Text>
                    <View style={{ flexDirection: 'row', marginTop: Platform.OS === 'ios' ? 20 : 10 }}>
                        <Text style={[styles.itemText, { fontSize: RFValue(18) }]}>
                            {t('common:whatsapp') + " : " + (couponStatistics ? couponStatistics.total_whatsapp : 0)}
                        </Text>
                        <Text style={[styles.itemText, { fontSize: RFValue(18), marginLeft: 30 }]}>
                            {t('common:email') + " : " + (couponStatistics ? couponStatistics.total_email : 0)}
                        </Text>

                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', marginTop: 10, marginRight: 10 }}>
                        {
                            sliceColor.map((item) => {
                                index += 1
                                return <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                                    <View key={item} style={[styles.squareShapeView, { backgroundColor: item }]} />
                                    <Text style={[styles.itemText, { flex: 1, fontSize: RFValue(15), marginLeft: 10 }]}>
                                        {textTitle[index - 1]}
                                    </Text>
                                </View>
                            })
                        }
                    </View>

                    <View style={{
                        width: '100%',
                        marginTop: 20,
                        alignItems: 'center', flexDirection: 'row', flex: 1, justifyContent: 'center'
                    }}>

                        {
                            couponStatistics && couponStatistics.total_share > 0 && series.length > 0 ?
                                <PieChart
                                    widthAndHeight={widthAndHeight}
                                    series={series}
                                    sliceColor={sliceColor}
                                    doughnut={false}
                                    coverRadius={0.45}
                                    coverFill={COLORS.secondary}
                                /> : null
                        }

                    </View>

                </View>



                <DatePicker
                    modal
                    open={openCreate}
                    mode={'date'}
                    date={moment().toDate()}
                    onConfirm={(date) => {
                        console.log('date', date)
                        setOpenCreate(false)
                        setCouponState({ ...couponState, create_date: moment(date).format(DATE_) })
                    }}
                    onCancel={() => {
                        setOpenCreate(false)
                    }}
                />
                <DatePicker
                    modal
                    open={openExpiry}
                    mode={'date'}
                    date={couponState.expiry_date !== '' ? moment(couponState.expiry_date).toDate() : moment().toDate()}
                    onConfirm={(date) => {
                        console.log('date', date)
                        setOpenExpiry(false)
                        setCouponState({ ...couponState, expiry_date: moment(date).format(DATE_) })
                    }}
                    onCancel={() => {
                        setOpenExpiry(false)
                    }}
                />
            </View>
        </ScrollView>
    )
}

export default CouponStatistics

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        paddingVertical: 20,
    },

    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
    text: {
        fontSize: RFValue(18),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    image: {
        width: 50,
        height: 50,
        left: 0
    },
    image_small: {
        width: 20,
        height: 20,
        tintColor: COLORS.text,
        left: 0
    },
    itemText: {
        fontSize: RFValue(18),
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    fontBold: {
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    buttonStyle: {
        paddingTop: hp("1%"),
        paddingBottom: hp("1%"),
        width: wp("28%"),
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
        flex: 1
    },

    validateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp("5%"),
        borderColor: COLORS.white,
        borderBottomWidth: 2,
        borderTopWidth: 2,
    },
    input: {
        flex: 1,
        fontSize: RFValue(18),
        color: COLORS.text,
        paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        backgroundColor: "transparent",
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
    },
    squareShapeView: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        marginLeft: wp(2)
    },
})