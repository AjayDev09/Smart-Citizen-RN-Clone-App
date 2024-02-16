import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Alert, Text, TouchableOpacity, View } from "react-native"
import FastImage from "react-native-fast-image"
import { useDispatch } from "react-redux";
import { postDeleteCoupon } from "../../redux/actions/couponActions";
import { ShowErrorToast } from "../../utils/common";
import Toast from "react-native-simple-toast";


//console.log('coupons', coupons)
const CouponItem = ({ item, index }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);


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
                },
            ]
        );
    };


    const coupon_title = i18n.language === 'he' ? item.coupon_title_he : i18n.language === 'ar' ? item.coupon_title_ar : item.coupon_title
    const coupon_description = i18n.language === 'he' ? item.coupon_description_he : i18n.language === 'ar' ? item.coupon_description_ar : item.coupon_description
    const term_condition = i18n.language === 'he' ? item.term_condition_he : i18n.language === 'ar' ? item.term_condition_ar : item.term_condition

    return (
        <TouchableOpacity onPress={() => {
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
                        {coupon_title}
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
                    {coupon_description}
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


export default CouponItem