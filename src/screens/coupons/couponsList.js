import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { ActivityIndicator, FlatList, Image, Linking, Platform, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";


import { couponActions, getAllCoupons, getCoupons, postAddMyCoupon, postSaveMyCoupon } from '../../redux/actions/couponActions';
import { COLORS } from '../../theme'
import { public_feeds, share, mac_logo, iconLocation, iconWeb, chat, } from '../../constants/images';
import ShareComponent from '../share';
import FastImage from 'react-native-fast-image';
import EmptyListComponent from '../../components/EmptyListComponent';
import { ShowErrorToast, getItemByLngAR, isImage } from '../../utils/common';
import ReadMoreComponent from '../../components/readMore';
import { AirbnbRating } from 'react-native-ratings';

const LIMIT = 10
const CouponsList = ({ searchQuery = '', couponCategory, discountType, location }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);
    const coupon = useSelector(({ coupon }) => coupon);


    const [loading, setLoading] = useState(true)
    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)

    const [offset, setOffset] = useState(0)
    const resetData = useRef(false);
    const [coupons, seCoupons] = useState([])

    const authuser = auth.data

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            // setTimeout(() => {
            //     fetchResult()
            // }, 0);
        });
        return focusHandler;
    }, [navigation]);


    useEffect(() => {
        //getCoupons1()
        // resetData.current = true;
        // setOffset(0)
        // seCoupons([])
        // setTimeout(() => {
        //     fetchResult()
        // }, 0);
        // return () => {

        // }


        setLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) {
                resetData.current = true;
                setOffset(0)
                seCoupons([])
                fetchResult()
            }
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
    }, [searchQuery, couponCategory, discountType, location])

    const fetchResult = () => {

        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            search: searchQuery,
            category_id: couponCategory ? couponCategory.toString() : [].toString(),
            discount_type: discountType,
            location_id: location.toString(),
            offset: pageToReq,
            limit: LIMIT
        }
        setLoading(true)
        dispatch(getCoupons(params, authuser.token))
            .then((res) => {
                setLoading(false)
                // setIsButtonClick(false)
                if (res.status === 200) {
                    if (resetData.current) {
                        seCoupons(res.data)
                        setOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        //  console.log('res.data', res.data)
                        if (res.data && res.data.length > 0) {
                            seCoupons(coupons.concat(res.data))
                            setOffset(offset + LIMIT)
                        }
                    }

                }
            }).catch((error) => {
                setLoading(false)
                // setIsButtonClick(false)
                console.log('res.error', error)
            })
    };




    const onCloseShare = () => {
        setShowShare(false)
    };

    const onShare = async (itema) => {
        setShareData(itema)
        setShowShare(true)
    };

    const addMyCoupons = (coupon_id) => {
        const params = {
            coupon_id: coupon_id
        }
        dispatch(postAddMyCoupon(params, authuser.token))
            .then((response) => {
                Toast.show(response.message, Toast.SHORT);
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


    const CouponItem = ({ item }) => {
        //  console.log('item', item.image)

        const imageFilter = item.image.find(({ image }) => isImage(image))
        //   console.log('imageFilter', imageFilter)

        // const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
        // const coupon_description = i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description
        const term_condition = i18n.language === 'he' ? item.term_condition_he : i18n.language === 'ar' ? item.term_condition_ar : item.term_condition

        const coupon_title = getItemByLngAR(i18n.language, item, "coupon_title")
        const coupon_description = getItemByLngAR(i18n.language, item, "coupon_description")

        return (
            <TouchableOpacity onPress={() => {
                navigation.navigate("couponDetail", {
                    itemId: item.coupon_id,
                    item: item,
                })
            }}
                style={styles.itemWrapper}>
                <FastImage style={[styles.image, {
                    marginLeft: wp(1),
                    marginVertical: hp(2)
                }]}
                    source={{
                        uri: imageFilter ? imageFilter.image : item.business_logo ? item.business_logo : "",
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.itemInnerWrapper}>
                    <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(18), }]}>
                        {coupon_title !== 'null' ? coupon_title : ""}
                    </Text>
                    <Text style={[styles.itemText, styles.textBold,
                    { fontSize: RFValue(17), color: COLORS.textDark, marginTop: 5, textAlign: 'left' }]}>
                        {item.coupon_code}
                    </Text>
                    {/* <Text style={[styles.itemText,
                    { fontSize: RFValue(15), flexWrap: 'wrap', marginRight: wp(1), marginTop: 2, }]}>
                        {coupon_description}
                    </Text> */}

                    <ReadMoreComponent>
                        {coupon_description !== 'null' ? coupon_description : ""}
                    </ReadMoreComponent>

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginTop: 3,
                        justifyContent: 'space-between', marginRight: wp(1)
                    }}>
                        <Text style={[styles.itemText, { color: COLORS.textDark, }]}>
                            {t('common:validaty') + " " + Moment(item.expiry_date).locale(i18n.language).format('Do MMM YYYY')}
                        </Text>



                    </View >
                    {/* <AirbnbRating
                        starContainerStyle={{
                            alignSelf: "flex-start",
                            //  backgroundColor: "green"
                        }}
                        size={20}
                        isDisabled={true}
                        showRating={false}
                        defaultRating={item.avgRating}
                    /> */}

                    <View style={{
                        flexDirection: 'row', alignItems: 'center', marginTop: 3,
                        justifyContent: 'space-between', marginRight: wp(1)
                    }}>

                        <TouchableOpacity onPress={() => {
                            navigation.navigate("couponReview", {
                                itemId: item.coupon_id,
                                item: item,
                            })
                        }}>
                            <AirbnbRating
                                starContainerStyle={{
                                    alignSelf: "flex-start",
                                    //  backgroundColor: "green"
                                }}
                                size={18}
                                isDisabled={true}
                                showRating={false}
                                defaultRating={item ? item.avgRating : 0}
                            />
                        </TouchableOpacity>



                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                            <TouchableOpacity style={{ marginRight: wp(1), }} onPress={() => {
                                console.log('item.business_name', item.business_name)
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
                            <TouchableOpacity
                                style={styles.buttonStyle}
                                activeOpacity={.5}
                                onPress={() => {
                                    addMyCoupons(item.coupon_id)
                                }}
                            >
                                <Text style={[styles.itemText, styles.textBold]}>  {t('common:addBtn') + " +"} </Text>
                            </TouchableOpacity>

                            {
                                item && item.qrcode_url ? <TouchableOpacity style={{
                                    marginLeft: wp(1),
                                }} onPress={() => {
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
                                            tintColor: COLORS.primary,
                                        }]}
                                    />
                                </TouchableOpacity> : null

                            }

                        </View>
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    //console.log('coupon.coupons', coupon.coupons)
    return (
        <View style={{ flex: 1 }}>
            <View style={{ backgroundColor: COLORS.secondary }}>
                <FlatList
                    data={coupons}
                    renderItem={CouponItem}
                    initialNumToRender={10}
                    // onEndReachedThreshold={0.5}
                    keyExtractor={item => item.coupon_id}
                    contentContainerStyle={{ paddingBottom: hp(1) }}
                    removeClippedSubviews={false}
                    onEndReached={fetchResult}
                    onEndReachedThreshold={0.7}
                />
            </View>
            {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {
                !loading && coupons.length <= 0 ?
                    <EmptyListComponent isLoading={coupon.isRequesting} data={coupons} msg={t('error:coupons_not_found')} />
                    : null

            }


            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare}
                shareData={shareData}
                shareMessage={shareData.coupon_title}
                token={authuser.token} shareKey={'coupon_id'} shareType={2} /> : null}

        </View>
    )
}

export default CouponsList

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
    text: {
        fontSize: RFValue(14),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        color: COLORS.textDark
    },
    image: {
        width: wp(20),
        height: wp(20),
        left: 0
    },
    image_small: {
        width: wp(5),
        height: wp(5),
        tintColor: COLORS.text,
        left: 0
    },
    itemWrapper: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingHorizontal: 5,
        // alignItems: 'center',
        backgroundColor: '#9cb2cc',
        borderRadius: 10,
        marginLeft: wp(1),
        marginRight: wp(1),
        marginTop: wp(2),
    },
    itemInnerWrapper: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 0,
        paddingHorizontal: wp(2),
        paddingVertical: hp(1)
    },
    itemText: {
        fontSize: RFValue(12),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    buttonStyle: {
        marginLeft: wp(1),
        paddingTop: hp(1),
        paddingBottom: hp(1),
        width: wp(18),
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBold: {
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        //marginTop: '50%',
        alignSelf: 'center',
        bottom: 15,
    }
})