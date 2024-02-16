import { ActivityIndicator, FlatList, Image, Linking, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../theme'
import { chat, iconLocation, iconWeb, mac_logo, share } from '../../constants/images'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getCientMyCoupon } from '../../redux/actions/couponActions';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import EmptyListComponent from '../../components/EmptyListComponent';
import { ShowErrorToast, getItemByLngAR } from '../../utils/common';
import ReadMoreComponent from '../../components/readMore';
import imagePlaceHolder from '../../assets/images/image_placeholder.png'

const MyCoupons = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const authuser = useSelector(({ auth }) => auth.data);

    const [activeCouponList, setActiveCouponList] = useState([])
    const [inActiveCouponList, setInactiveCouponList] = useState([])
    const [loading, setLoading] = useState(false)

    // console.log('authuser user_id', authuser.user_id)
    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            myCouponsList()
        });
        return focusHandler;
    }, [navigation]);

    // useEffect(() => {
    //     myCouponsList()
    // }, [])



    const myCouponsList = () => {
        setLoading(true)
        dispatch(getCientMyCoupon(authuser.token))
            .then((response) => {
                setLoading(false)
                setActiveCouponList(response.active_coupon_list)
                setInactiveCouponList(response.inactive_coupon_list)
                // Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                setLoading(false)
                console.log('response error', error)
                ShowErrorToast(error)
            })
    }


    const [ActiveTab, setActiveTab] = useState(1)

    const CouponItem = ({ item, index }) => {

        // const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
        // const coupon_description = i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description

        const coupon_title = getItemByLngAR(i18n.language, item, "coupon_title")
        const coupon_description = getItemByLngAR(i18n.language, item, "coupon_description")

        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate("couponDetail", {
                    itemId: item.coupon_id,
                    item: item,
                    isShowButtons: false,
                })


            }} style={styles.itemWrapper}>
                <View style={{ flexDirection: 'column', marginLeft: 10, flex: 1, }}>
                    {/* <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(16), color: COLORS.textDark, textAlign: 'left' }]}>
                        {moment(item.created_at).format('Do MMM YYYY')}
                    </Text> */}

                    <View style={{ flexDirection: 'row', }}>
                        <FastImage style={[styles.image, {
                            width: 70,
                            height: 70,
                            marginVertical: hp(2)
                        }]}
                            source={{
                                uri: item.business_logo ? item.business_logo : "",
                                priority: FastImage.priority.normal,

                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            defaultSource={imagePlaceHolder}
                        />
                        <View style={[styles.itemInnerWrapper, { marginLeft: wp(2) }]}>
                            <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(18), textAlign: 'left' }]}>
                                {coupon_title !== 'null' ? coupon_title : ""}
                            </Text>
                            <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(18), color: COLORS.textDark, marginTop: 5, textAlign: 'left' }]}>
                                {item.coupon_code}
                            </Text>
                            {/* <Text style={[styles.itemText, { flexWrap: 'wrap', marginRight: "20%", marginTop: 5, textAlign: 'left' }]}>
                                {coupon_description}
                            </Text> */}
                            <ReadMoreComponent>
                                {coupon_description !== 'null' ? coupon_description : ""}
                            </ReadMoreComponent>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, marginTop: hp(.5) }}>
                                <Text style={[styles.itemText, {
                                    fontSize: RFValue(15), color: COLORS.textDark,
                                    marginTop: 5, textAlign: 'left'
                                }]}>
                                    {t('common:validaty') + " " + moment(item.expiry_date).locale(i18n.language).format('Do MMM YYYY')}
                                </Text>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {/* {
                                        item.location_url ?
                                            <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                                                const url = item.location_url;
                                                console.log('location_url ', url)
                                                Linking.openURL(url)
                                            }}>
                                                <Image
                                                    source={iconLocation}
                                                    style={[styles.image_small, {
                                                        tintColor: COLORS.primary
                                                    }]}
                                                />
                                            </TouchableOpacity> : null
                                    } */}

                                    <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                                        // navigation.navigate("chat", {
                                        //     itemId: item.coupon_id,
                                        //     item: item,
                                        //     isMerchant: true,
                                        // })
                                        navigation.navigate("messaging", {
                                            id: item.user_id,
                                            name: item.business_name,
                                            image: item.business_logo,
                                            item: item
                                        });
                                    }}>
                                        <Image
                                            source={chat}
                                            style={[styles.image_small, {
                                                width: wp(6),
                                                height: wp(6),
                                                tintColor: COLORS.primary
                                            }]}
                                        />
                                    </TouchableOpacity>

                                    {
                                        item.qrcode_url ? <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                                            console.log('item.qrcode_url', item.qrcode_url)
                                            const url = !item.qrcode_url.includes("http") ? 'http://' + item.qrcode_url : item.qrcode_url;
                                            console.log('url', url)
                                            Linking.openURL(url)
                                        }}                        >
                                            <Image
                                                source={iconWeb}
                                                style={[styles.image_small, {
                                                    width: wp(7.5),
                                                    height: wp(7.5),
                                                    tintColor: COLORS.primary
                                                }]}
                                            />
                                        </TouchableOpacity> : null
                                    }

                                </View>
                            </View>
                        </View>


                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    const finalCouponList = ActiveTab === 1 ? activeCouponList : inActiveCouponList


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.tabsWrapper}>
                <TouchableOpacity onPress={() => { setActiveTab(1) }}>
                    <Text style={[styles.tabText, { color: ActiveTab === 1 ? COLORS.textDark : COLORS.text }]}>{t("common:activeCoupons")}</Text>
                    {ActiveTab === 1 ? <View style={styles.dividerTab} /> : null}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveTab(2) }}>
                    <Text style={[styles.tabText, { color: ActiveTab === 2 ? COLORS.textDark : COLORS.text }]}>{t("common:inactiveCoupons")}</Text>
                    {ActiveTab === 2 ? <View style={styles.dividerTab} /> : null}
                </TouchableOpacity>
            </View>

            {(finalCouponList.length > 0 && !loading) ? <FlatList
                data={finalCouponList}
                renderItem={CouponItem}
                initialNumToRender={10}
                keyExtractor={item => item.coupon_id}
                contentContainerStyle={{ paddingBottom: 10, }}
            /> : loading ? <ActivityIndicator color={COLORS.primary} style={{ flex: 1, justifyContent: "center", alignSelf: "center" }} size={'large'} /> : null}


            {
                !loading ? <EmptyListComponent data={ActiveTab === 1 ? activeCouponList : inActiveCouponList} msg={t('error:coupons_not_found')} /> : null
            }


        </SafeAreaView>
    )
}

export default MyCoupons

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        // justifyContent: 'center'
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 50,
        paddingVertical: 15
    },
    tabText: {
        fontSize: RFValue(18),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    tabsWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 20,
    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
        marginTop: 5
    },
    dividerTab: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.textDark,
        marginTop: 5
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
    itemWrapper: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor: '#9cb2cc',
        borderRadius: 10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
    },
    itemInnerWrapper: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 0,
        paddingHorizontal: 5,
        paddingVertical: 10

    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    textBold: {
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '60%',
        marginLeft: "40%"
    }
})