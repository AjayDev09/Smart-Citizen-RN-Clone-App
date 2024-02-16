
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../theme'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { getCouponReviews, getCoupons } from '../../redux/actions/couponActions'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next'
import FastImage from 'react-native-fast-image'
import { AirbnbRating, Rating } from 'react-native-ratings'
import moment from 'moment'
import EmptyListComponent from '../../components/EmptyListComponent'
import { REVIEW_LABEL } from '../../constants/constant'
import { getLabelField } from '../../utils/common'

const LIMIT = 10

const ReviewDetail = ({ route }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);

    const { itemId, } = route.params;

    const [isLoading, setLoading] = useState(false)
    const [offset, setOffset] = useState(0)
    const resetData = useRef(false);
    const [couponReviews, setCouponReviews] = useState([])

    const authuser = auth.data

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            resetData.current = true
            fetchResult()
        });
        return focusHandler;
    }, [navigation]);

    console.log('ReviewDetail itemId', itemId)

    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            coupon_id: itemId,
            offset: pageToReq,
            limit: LIMIT
        }
        setLoading(true)
        dispatch(getCouponReviews(params, authuser.token))
            .then((res) => {
                setLoading(false)
                if (res.status === 200) {
                    if (resetData.current) {
                        setCouponReviews(res.data)
                        setOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        if (res.data && res.data.length > 0) {
                            setCouponReviews(couponReviews.concat(res.data))
                            setOffset(offset + LIMIT)
                        }
                    }

                }
            }).catch((error) => {
                console.log('res.error', error)
                setLoading(false)
            })
    };


    console.log('couponReviews', couponReviews)


    const ReviewItem = ({ item }) => {
        const count = item.rating

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                }}
                style={styles.itemWrapper}>
                <View style={styles.itemInnerWrapper}>

                    <View style={{
                        display: 'flex', flexDirection: 'row', alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <View style={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center',
                        }}>

                            <AirbnbRating
                                // type={'custom'}
                                starContainerStyle={{
                                    alignSelf: "flex-start",
                                }}
                                size={20}
                                isDisabled={true}
                                showRating={false}
                                defaultRating={item.rating}
                            />

                            <Text style={[styles.itemText, { fontSize: RFValue(18), marginLeft: wp(2) }]}>
                                {count > 0 ? REVIEW_LABEL.find((product) => product.value === count)[getLabelField(i18n.language)] : ""}
                            </Text>
                        </View>
                        <Text style={[styles.itemText, { fontSize: RFValue(12), textAlign: 'left' }]}>
                            {moment(item.updated_at).locale(i18n.language).fromNow()}
                        </Text>
                    </View>
                    <Text style={[styles.itemText,
                    { fontSize: RFValue(17), color: COLORS.textDark, marginTop: 5, textAlign: 'left' }]}>
                        {item.review}
                    </Text>
                </View>

                <Text style={[styles.itemText, styles.textBold, { fontSize: RFValue(18), }]}>
                    {item.name}
                </Text>

            </TouchableOpacity>
        )

    }


    return (
        <View style={styles.container}>


            <FlatList
                data={couponReviews}
                renderItem={ReviewItem}
                initialNumToRender={10}
                // onEndReachedThreshold={0.5}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingBottom: hp(1), flexGrow: 1 }}
                removeClippedSubviews={false}
                ListEmptyComponent={() => <EmptyListComponent isLoading={isLoading} data={couponReviews} msg={t('error:review_not_found')} />}
            // onEndReached={fetchResult}
            // onEndReachedThreshold={0.7}
            />
            {/* <EmptyListComponent isLoading={isLoading} data={couponReviews} msg={t('error:review_not_found')} /> */}
        </View>
    )
}

export default ReviewDetail

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
    itemWrapper: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        // alignItems: 'center',
        backgroundColor: '#9cb2cc',
        borderRadius: 10,
        marginLeft: wp(1),
        marginRight: wp(1),
        marginTop: wp(2),
        paddingBottom: hp(1),
        paddingLeft: wp(2),
        paddingRight: wp(2)
    },
    itemInnerWrapper: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 0,
        //   paddingHorizontal: wp(2),
        paddingVertical: hp(1)
    },
    itemText: {
        fontSize: RFValue(12),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
})