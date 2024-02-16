import { Alert, Dimensions, FlatList, Image, Linking, Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import Toast from 'react-native-simple-toast';

import { COLORS } from '../../theme'
import { iconLocation, iconWeb, mac_logo, rating, share } from '../../constants/images'
import { couponDetails, getStatisticsCoupon, postAddMyCoupon, postReviewRatingCoupon, postSaveMyCoupon } from '../../redux/actions/couponActions';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from 'react-native-fast-image';
import { ShowErrorToast, getItemByLngAR, isVideo } from '../../utils/common';
import ReadMoreComponent from '../../components/readMore';
import ReviewRatingPopup from './reviewRativeModel';
import CustomVideoPlayer from '../../components/customVideoPlayer';
import VideoFullScreen from '../publicFeed/videoFullscreen';
import { AirbnbRating } from 'react-native-ratings';
import { onShare } from '../../constants/constant';
import ShareComponent from '../share';
import imagePlaceHolder from '../../assets/images/image_placeholder.png'


const { height, width } = Dimensions.get('window');

const CouponDetail = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { itemId, isShowButtons = true, } = route.params;

    const [showRatingpopup, setshowRatingpopup] = useState(false)

    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)


    // console.log('itemId', itemId)

    const authuser = useSelector(({ auth }) => auth.data);
    const categories = useSelector(({ coupon }) => coupon.couponsCategory);
    const couponsCategory = categories && categories.coupons ? categories.coupons : [];

    const [Coupon, setCoupon] = useState()

    const item = Coupon


    useEffect(() => {
        getCouponDetail()
    }, [itemId])

    const getCouponDetail = () => {
        const params = {
            coupon_id: itemId
        }
        dispatch(couponDetails(params, authuser.token))
            .then((res) => {
                //  console.log('couponDetails res', res)
                if (res.status === 200) {
                    setCoupon(res.data)
                }
            }).catch((error) => {
            })
    }

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


    const onRatingCallBack = async (params) => {
        params.coupon_id = item ? item.coupon_id : ""
        // console.log('onRatingCallBack params', params)
        dispatch(postReviewRatingCoupon(params, authuser.token))
            .then((response) => {
                console.log('response', response)
                getCouponDetail()
                Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }

    const onCloseShare = () => {
        setShowShare(false)
    };

    const onShare = async (itema) => {
        setShareData(itema)
        setShowShare(true)
    };


    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setselectedImage] = React.useState(0);
    const renderImagesItem = ({ item, index }) => {
        const itemWidth = (width - 40) / 2;
        return (
            <TouchableOpacity style={{
                maxWidth: itemWidth,
                height: isVideo(item.image) ? 130 : 130,
                marginTop: 5,
                marginLeft: 0,
                marginHorizontal: 5
            }} onPress={() => {
                setModalVisible(true)
                setselectedImage(index)
            }}  >
                {
                    isVideo(item.image) || item.image.toString().endsWith("pdf") ?
                        <View style={{ height: 100 }}>
                            <CustomVideoPlayer videoUrl={item.image} selectedImage={index}
                                itemList={Coupon.image} videoWidth={itemWidth} videoHight={100} />
                        </View>
                        :
                        <FastImage
                            style={{ width: itemWidth, height: 100, }}
                            source={{
                                uri: item.image ? item.image : "",
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                            defaultSource={imagePlaceHolder}
                        />

                }
            </TouchableOpacity>)
    }

    const onViewRef = React.useRef((viewableItems) => {
        if (viewableItems?.changed[0]?.index || viewableItems?.changed[0]?.index == 0) {
            //updatePosition(viewableItems.changed[0].index);
        }
    });
    const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

    // const coupon_title = item ? i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title : ""
    // const coupon_description = item ? i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description : ""
    // const term_condition = item ? i18n.language === 'he' ? item.term_condition_he : i18n.language === 'ar' ? item.term_condition_ar : item.term_condition : ""

    const coupon_title = item ? getItemByLngAR(i18n.language, item, "coupon_title") : ""
    const coupon_description = item ? getItemByLngAR(i18n.language, item, "coupon_description") : ""

    const terms = item ? getItemByLngAR(i18n.language, item, "term_condition") : "undefined"
    const term_condition = item ? terms !== "undefined" ? [terms] : "" : ""

    const category_id = item ? item.category_id : ""

    const itemCategory = couponsCategory.find(a => a.category_id === category_id);
    const category = itemCategory ? i18n.language === 'he' ? itemCategory.category_name_he : i18n.language === 'ar' ? itemCategory.category_name_ab : itemCategory.category_name : ""
    const discount_amount = item ? item.discount_amount ? Number(item.discount_amount) : 0 : 0
    console.log('term_condition', term_condition)
    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps={"handled"} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>


                <View style={{ flexDirection: 'row', marginLeft: 20, alignItems: 'center' }}>
                    <FastImage style={[styles.image, {
                        width: 100,
                        height: 100,
                    }]}
                        source={{
                            uri: item ? item.business_logo ? item.business_logo : "" : '',
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                        defaultSource={imagePlaceHolder}
                    />
                    <View style={{ flex: 1, flexDirection: 'column', marginLeft: 20, paddingRight: 10 }}>
                        <Text style={[styles.itemText, { fontSize: RFValue(18), textAlign: 'left' }]}>
                            {coupon_title}
                        </Text>

                        <Text style={[styles.itemText, { fontSize: RFValue(22), marginTop: hp(1), textAlign: 'left' }]}>
                            {item ? item.discount_type === 'Flat' ? "₪" + discount_amount : discount_amount + "%" : ""}
                        </Text>

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

                        {/* <Text style={[styles.itemText, { fontSize: RFValue(15), marginTop: hp(.5), textAlign: 'left' }]}>
                        {coupon_description}
                    </Text> */}
                        <ReadMoreComponent>
                            {coupon_description}
                        </ReadMoreComponent>

                        <Text style={[styles.itemText, {
                            fontSize: RFValue(12), marginTop: hp(1),
                            color: COLORS.textDark, textAlign: 'left'
                        }]}>
                            {t('common:category') + " : " + (category ? category : "")}
                        </Text>
                    </View>
                </View>

                <View style={styles.validateWrapper}>
                    <View style={{ width: '50%', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={[styles.text, styles.fontBold, { fontSize: RFValue(15) }]}>
                            {item ? t('common:coupon_code') + " : " + item.coupon_code + "" : ""}
                        </Text>
                    </View>
                    <View style={{ height: "100%", width: 2, backgroundColor: COLORS.white }} />
                    <View style={{ width: '50%', alignItems: 'center', marginVertical: 10 }}>
                        <Text style={[styles.text, styles.fontBold, { fontSize: RFValue(15) }]}>
                            {item ? t('common:validaty') + " " + Moment(item.expiry_date).locale(i18n.language).format('Do MMM YYYY') : ""}
                        </Text>
                    </View>
                </View>

                {/* <View style={{ width: '100%', alignItems: 'center', marginVertical: hp("4%"), }}>
                    <Text style={[styles.itemText, { fontSize: RFValue(22) }]}>
                        {item ? t('common:coupon_code') + " : " + item.coupon_code + "" : ""}
                    </Text>
                </View> */}

                <View style={{ marginTop: 20, paddingHorizontal: 10 }} >
                    {
                        item && item.image && item.image.length > 0 ?
                            <FlatList
                                horizontal={true}
                                data={item.image}
                                renderItem={renderImagesItem}
                                keyExtractor={(item, index) => index}
                                snapToEnd={true}
                                inverted={Platform.OS === 'ios' ? false : i18n.language === 'en' || i18n.language === 'ru' || i18n.language === 'fr' ? false : true}
                            /> : null
                    }
                </View>

                <View style={{ alignItems: 'flex-start', marginLeft: wp(5), marginVertical: hp(1), }}>
                    <Text style={[styles.text, { fontSize: RFValue(18), fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", }]}>
                        {t("navigate:termsncondition") + ":"}
                    </Text>
                </View>


                <View style={{
                    flexDirection: 'column', alignItems: 'flex-start',
                    marginLeft: 20, marginTop: hp(1), marginRight: 20
                }}>
                    {
                        term_condition && term_condition !== undefined ? term_condition.length > 0 ? term_condition.map((item, index) => {
                            return (<Text key={index} style={[styles.itemText, { fontSize: RFValue(16), marginBottom: hp(1) }]}>
                                {" " + item}
                            </Text>)
                        }) : null : null
                    }

                </View>
                <View style={{
                    flexDirection: 'row', alignItems: 'center', marginTop: hp(1),
                    justifyContent: 'space-between', marginHorizontal: wp(10)
                }}>

                    <TouchableOpacity style={{ marginLeft: wp(0), }} onPress={() => {
                        setshowRatingpopup(!showRatingpopup)
                    }}>
                        <Image
                            source={rating}
                            style={[styles.image_small, {
                                tintColor: COLORS.primary
                            }]}
                        />
                    </TouchableOpacity>

                    {
                        <TouchableOpacity style={{ marginLeft: wp(0), padding: wp(0) }} onPress={() => {
                            if (item && item.location_url) {
                                const url = item.location_url;
                                console.log('location_url ', url)
                                Linking.openURL(url)
                            } else {
                            
                                Alert.alert('', t('common:locationNotFound'), [
                                    // {
                                    //   text:t('common:cancel'),
                                    //   onPress: () => console.log('Cancel Pressed'),
                                    //   style: 'cancel',
                                    // },
                                    {text: t('common:ok'), onPress: () => {
                                        // RNExitApp.exitApp();
                                    }},
                                  ]);
                            }
                        }}>
                            <Image
                                source={iconLocation}
                                style={[styles.image_small, {
                                    height: wp(7.5),
                                    width: wp(7.5),
                                    tintColor: COLORS.primary
                                }]}
                            />
                        </TouchableOpacity>
                    }

                    {
                        item && item.qrcode_url ? <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                            console.log('item.qrcode_url', item.qrcode_url)
                            const url = !item.qrcode_url.includes("http") ? 'http://' + item.qrcode_url : item.qrcode_url;
                            console.log('url', url)
                            Linking.openURL(url)
                        }}                        >
                            <Image
                                source={iconWeb}
                                style={[styles.image_small, {
                                    tintColor: COLORS.primary,
                                }]}
                            />
                        </TouchableOpacity> : <TouchableOpacity style={{ marginLeft: wp(0), }} />

                    }

                    <TouchableOpacity style={{ marginLeft: wp(2), }} onPress={() => {
                        onShare(item)
                    }}                        >
                        <Image
                            source={share}
                            style={[styles.image_small, {
                                width: wp(6),
                                height: wp(6),
                                tintColor: COLORS.primary
                            }]}
                        />
                    </TouchableOpacity>


                </View>


                <ReviewRatingPopup
                    modalVisible={showRatingpopup}
                    setModalVisible={setshowRatingpopup}
                    onCallBack={onRatingCallBack}
                    params={{}} />

                {
                    item && item.image && modalVisible ? <VideoFullScreen
                        modalVisible={modalVisible} setModalVisible={setModalVisible}
                        selectedImage={selectedImage}
                        itemList={item.image}
                        updatePosition={() => {
                            setselectedImage(0)
                        }} /> : null
                }

            </ScrollView>
            {
                isShowButtons ? (<View style={{
                    display: 'flex', flexDirection: 'row', alignItems: 'center',
                    marginBottom: 10,
                    marginTop: 20,
                    paddingHorizontal: wp(10)
                }}>
                    <TouchableOpacity
                        style={[styles.buttonStyle, { marginEnd: wp(10) }]}
                        activeOpacity={.5}
                        onPress={() => {
                            addMyCoupons(item.coupon_id)
                        }}
                    >
                        <Text style={[styles.itemText, { fontSize: RFValue(13) }]}> {t("common:addBtn")} </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                        style={[styles.buttonStyle, { marginStart: RFValue(13), marginEnd: wp("5%") }]}
                        activeOpacity={.5}
                        onPress={() => {
                            saveMyCoupons(item.coupon_id)
                        }}
                    >
                        <Text style={[styles.itemText, { fontSize: RFValue(13) }]}>  {t("common:saveBtn")}  </Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        style={[styles.buttonStyle, { paddingLeft: 5, paddingRight: 5, alignContent: 'center' }]}
                        activeOpacity={.5}
                        onPress={() => {
                            navigation.navigate("myCouponsClient")
                        }}
                    >
                        <Text style={[styles.itemText, { fontSize: RFValue(13), }]}> {t("common:my_coupons")}  </Text>
                    </TouchableOpacity>
                </View>) : null
            }

            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare}
                shareData={shareData}
                shareMessage={shareData.coupon_title}
                token={authuser.token} shareKey={'coupon_id'} shareType={2} /> : null}
        </View>
    )
}

export default CouponDetail

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
        fontSize: RFValue(17),
        // fontWeight: 'bold',
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    image: {
        width: 50,
        height: 50,
        left: 0
    },
    image_small: {
        width: wp(8),
        height: wp(8),
        tintColor: COLORS.text,
        left: 0
    },
    itemText: {
        fontSize: RFValue(18),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",

    },
    fontBold: {
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    buttonStyle: {
        //marginLeft: wp(1),
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
})