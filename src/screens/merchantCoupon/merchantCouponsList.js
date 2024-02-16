import React, { useEffect, useRef, useState, useTransition } from 'react'
import { ActivityIndicator, Alert, FlatList, Image, Platform, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-simple-toast';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

import { getAllCoupons, getCoupons, getlocationList, postAddMyCoupon, postDeleteCoupon, postSaveMyCoupon } from '../../redux/actions/couponActions';
import { COLORS } from '../../theme'
import { public_feeds, share, mac_logo, close, deleteIcon, chat, } from '../../constants/images';
import ShareComponent from '../share';
import FastImage from 'react-native-fast-image';
import { ShowErrorToast, getItemByLngAR } from '../../utils/common';
import EmptyListComponent from '../../components/EmptyListComponent';
import ReadMoreComponent from '../../components/readMore';
import { AirbnbRating } from 'react-native-ratings';

const LIMIT = 10
const MerchantCouponsList = ({ searchQuery, couponCategory, discountType, location }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);
    const coupon = useSelector(({ coupon }) => coupon);

    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const resetData = useRef(false);
    const [coupons, setCoupons] = useState([])

    const authuser = auth.data
    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            resetData.current = true;
            setOffset(0)
            setCoupons([])
            fetchResult()
            // setTimeout(() => {
            //     fetchResult()
            // }, 0);
        });
        return focusHandler;
    }, [navigation]);
    useEffect(() => {
        dispatch(getlocationList(authuser.token))
        return () => {
            setCoupons([]); // This worked for me
        };
    }, [])

    useEffect(() => {
        setLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) {
                resetData.current = true;
                setOffset(0)
                setCoupons([])
                fetchResult()
            }
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
        // setTimeout(() => {
        //     fetchResult()
        // }, 0);
    }, [searchQuery, couponCategory, discountType, location])


    const fetchResult = () => {
        setLoading(true)
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
        console.log('params fetchResult', couponCategory, params)
        dispatch(getCoupons(params, authuser.token))
            .then((res) => {
                setLoading(false)
                // setIsButtonClick(false)
                if (res.status === 200) {
                    console.log('resr fetchResult', res.data)
                    if (resetData.current) {
                        setCoupons(res.data)
                        setOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        //  console.log('res.data', res.data)
                        if (res.data && res.data.length > 0) {
                            setCoupons(coupons.concat(res.data))
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
        console.log('itema,coupon_title ', itema.coupon_title)

    };

    const onDelete = async (item, index) => {
        const params = {
            coupon_id: item.coupon_id,
        }

        Alert.alert(
            "",
            t("error:delete_coupon"),
            [
                {
                    text: t("common:yes"), onPress: () => {
                        dispatch(postDeleteCoupon(params, authuser.token))
                            .then((response) => {
                                if (response.status === 200) {
                                    const itemIndex = index
                                    let newCoupons = coupons.filter(function (value, index,) {
                                        return index !== itemIndex
                                    });
                                    setCoupons(newCoupons)
                                }
                                Toast.show(response.message, Toast.SHORT);
                            }).catch((error) => {
                                ShowErrorToast(error)
                            })

                    }
                },
                {
                    text: t("common:no"),
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                }
            ]
        );
    };


    //console.log('coupons', coupons)
    const CouponItem = ({ item, index }) => {

        // const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
        // const coupon_description = i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description
        // const term_condition = i18n.language === 'he' ? item.term_condition_he : i18n.language === 'ar' ? item.term_condition_ar : item.term_condition

        const coupon_title = getItemByLngAR(i18n.language, item, "coupon_title")
        const coupon_description = getItemByLngAR(i18n.language, item, "coupon_description")

        return (
            <TouchableOpacity
                activeOpacity={0.5} onPress={() => {
                    // navigation.navigate("couponDetail", {
                    //     itemId: item.coupon_id,
                    //     item: item,
                    // })
                }}
                style={styles.itemWrapper}>
                <FastImage style={[styles.image, {
                    marginLeft: wp(1),
                    marginVertical: hp(2)
                }]}
                    source={{
                        uri: item.business_logo ? item.business_logo : "",
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <View style={styles.itemInnerWrapper}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[styles.itemText, styles.textBold, { flex: 1, fontSize: RFValue(16), marginRight: wp(2), }]}>
                            {coupon_title !== 'null' ? coupon_title : ""}
                        </Text>
                        <TouchableOpacity style={{ alignSelf: 'center', }} onPress={() => {
                            onDelete(item, index)
                        }}                        >
                            <Image
                                source={deleteIcon}
                                style={[styles.image_small, {
                                    // width: wp(4),
                                    // height: wp(4),
                                    tintColor: COLORS.primary
                                }]}
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(16), color: COLORS.textDark, marginTop: 5, textAlign: 'left' }]}>
                        {item.coupon_code}
                    </Text>
                    {/* <Text style={[styles.itemText, { fontSize: RFValue(14), flexWrap: 'wrap', marginRight: wp(2), marginTop: 2, }]}>
                        {coupon_description}
                    </Text> */}
                    <ReadMoreComponent>
                        {coupon_description !== 'null' ? coupon_description : ""}
                    </ReadMoreComponent>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, justifyContent: 'space-between', marginRight: 5 }}>
                        <Text style={[styles.itemText, { color: COLORS.textDark, fontSize: RFValue(10), }]}>
                            {t('common:validaty') + " " + Moment(item.expiry_date).locale(i18n.language).format('Do MMM YYYY')}
                        </Text>

                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={.5}
                            onPress={() => {
                                navigation.navigate('addEditCoupon', {
                                    itemId: item.coupon_id,
                                    item: item,
                                });
                            }}
                        >
                            <Text style={[styles.itemText, styles.textBold]}>  {t('common:editBtn')} </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={.5}
                            onPress={() => {
                                navigation.navigate('couponStatistics', {
                                    itemId: item.coupon_id,
                                    item: item,
                                });
                            }}
                        >
                            <Text style={[styles.itemText, styles.textBold]}>  {t('common:statsBtn')} </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginLeft: wp(1), }} onPress={() => {
                            onShare(item)
                        }}                        >
                            <Image
                                source={share}
                                style={[styles.image_small, {
                                    tintColor: COLORS.primary
                                }]}
                            />
                        </TouchableOpacity>

                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: hp(1) }} >



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
                                size={20}
                                isDisabled={true}
                                showRating={false}
                                defaultRating={item ? item.avgRating : 0}
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                        navigation.navigate(t('navigate:megssage'), {
                            itemId: item.coupon_id,
                            item: item,
                            isMerchant: true,
                        })
                    }}>
                        <Image
                            source={chat}
                            style={[styles.image_small, {
                                width: wp(6),
                                height: wp(6),
                                tintColor: COLORS.primary
                            }]}
                        />
                    </TouchableOpacity> */}
                    </View>
                </View>

            </TouchableOpacity>
        )
    }

    const ListHeaderComponent = () => {
        return <View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginTop: hp(1), paddingEnd: hp(2) }}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={.5}
                    onPress={() => {
                        navigation.navigate('addEditCoupon');
                    }}
                >
                    <Text style={[styles.itemText, styles.textBold]}>  {t('common:addBtn')} </Text>
                </TouchableOpacity>
            </View>
        </View>
    }


    return (
        <View style={{ flex: 1 }}>


            {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {/* {
                coupon.coupons && coupon.coupons.length <= 0 ? <View style={[styles.loading, { marginLeft: "30%" }]}>
                    <Text style={[styles.itemText, { fontSize: RFValue(15) }]}>{t('error:coupons_not_found')}</Text>
                </View> : null
            } */}

            {
                (!loading && coupons.length <= 0) ?
                    <View style={{ flex: 1, }}>
                        <ListHeaderComponent />
                        <EmptyListComponent isLoading={coupon.isRequesting} data={coupons} msg={t('error:coupons_not_found')} />
                    </View>
                    : <FlatList
                        data={coupons}
                        renderItem={CouponItem}
                        keyExtractor={item => item.coupon_id}
                        contentContainerStyle={{ paddingBottom: hp(1) }}
                        initialNumToRender={6}
                        maxToRenderPerBatch={10}
                        windowSize={10}
                        removeClippedSubviews={false}
                        ListHeaderComponent={ListHeaderComponent}
                    />

            }


            {/* <EmptyListComponent isLoading={coupon.isRequesting} data={coupons} msg={t('error:coupons_not_found')} /> */}

            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare}
                shareData={shareData}
                shareMessage={shareData.coupon_title}
                token={authuser.token} shareKey={'coupon_id'} shareType={2} /> : null}
        </View>
    )
}

export default MerchantCouponsList

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
        width: wp(13),
        height: wp(13),
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
        paddingVertical: wp(1),
        paddingHorizontal: wp(1),
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
        paddingVertical: wp(2)
    },
    itemText: {
        fontSize: RFValue(11),
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
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
        marginLeft: "40%"
    }
})