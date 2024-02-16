import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { COLORS } from '../../theme';
import { useDispatch, useSelector } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { useEffect } from 'react';
import Toast from 'react-native-simple-toast';
import { clearNotificationApi, notificationListApi } from '../../redux/actions/loginActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import 'moment/locale/ar';
import 'moment/locale/he';
import 'moment/locale/ru';
import 'moment/locale/fr';
import { ShowErrorToast, ShowToast, getItemByLngAR } from '../../utils/common';
import { socialAcceptRejectRequest } from '../../redux/actions/socialActions';
import { UseNotificationCount } from '../../context/notificationCountProvider';

const NotificationScreen = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation()
    const { setNotificationCount } = UseNotificationCount()

    const dispatch = useDispatch()
    const authUser = useSelector(({ auth }) => auth.data);

    const [notifications, setNotifications] = useState([])
    const [isLoading, setLoading] = useState(false)
    // const route = useRoute();
    // const { params } = route;

    // Now, you can access the params object
    console.log(route?.params?.isAlret);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
      setRefreshing(true);
      getNotifications()
      global.notificationCount = 0;
      setNotificationCount(0)
    };
    useEffect(() => {
        //  console.log('i18n.language', i18n.language)
        //moment().locale('fr');
        const focusHandler = navigation.addListener('focus', () => {
            getNotifications()
            global.notificationCount = 0;
            setNotificationCount(0)
        });
        return focusHandler;
    }, [navigation]);
    useEffect(() => {
        getNotifications()
        global.notificationCount = 0;
        setNotificationCount(0)
    }, []);
    // social_user_accept_reject_request  social_user_accept_reject_request

    const getNotifications = () => {
        setLoading(true)
        dispatch(notificationListApi(authUser.token))
            .then((res) => {
                setLoading(false);
                setRefreshing(false);
                if (res.status === 200) {
                    //   console.log('notificationListApi res.data', res.data)
                    route?.params?.isAlret ?
                        setNotifications(res.data.filter(item => item.type === 5))
                        : setNotifications(res.data)
                }
                else
                    Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                setLoading(false)
                setRefreshing(false);
                console.log('error', error)
                ShowErrorToast(error)
            })
    }

    const postAcceptOrReject = (item, isAccept) => {
        console.log('item, isAccept', item, isAccept)
        setLoading(true)
        const param = {
            connection_id: item.post_connection_id,
            is_request: isAccept === false ? 3 : 2
        }
        console.log('param', param)
        dispatch(socialAcceptRejectRequest(param, authUser.token))
            .then((res) => {
                setLoading(false)
                //console.log('res.data', res.message)
                if (res.status === 200) {
                    ShowToast(res.message)
                    console.log('res.data', res.message)
                    getNotifications()
                    dispatch(getProfile(authUser.token))
                }
            }).catch((error) => {
                setLoading(false)
                // console.log('res.error', error)
            })
    }

    const clearNotifications = () => {
        dispatch(clearNotificationApi(authUser.token))
            .then((res) => {
                if (res.status === 200) {
                    getNotifications()
                }
                else
                    Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }

    const notificationItem = ({ item, index }) => {
        // console.log("item", item, )
        // const title = item ? i18n.language === 'he' ? item.title_he : i18n.language === 'ar' ? item.title_ar : item.title : ""
        // const description = item ? i18n.language === 'he' ? item.description_he : i18n.language === 'ar' ? item.description_ar : item.description : ""

        const title = getItemByLngAR(i18n.language, item, "title")
        const description = getItemByLngAR(i18n.language, item, "description")

        // console.log('title', title)
        return (<View style={[styles.commentWrapper, { marginTop: hp(1), marginBottom: hp(1) }]}>
            <TouchableOpacity onPress={() => {
                if (item.type === 3) {
                    console.log("coupon Pressed")
                    if (item.coupon_id > 0) {
                        if (authUser && authUser.user_status === 0) {
                            navigation.navigate('couponDetail', {
                                itemId: item.coupon_id,
                                item: undefined,
                            });
                        } else {
                            navigation.navigate("coupons");
                        }
                    } else {
                        navigation.navigate("coupons");
                    }
                }
                if (item.type === 1) {
                    console.log("blog Pressed")
                    console.log('item.blog_id', JSON.stringify(item))
                    if (item.blog_id > 0) {
                        navigation.navigate('blogDetail', {
                            itemId: item.blog_id,
                            item: undefined,
                        });
                    }


                }
                if (item.type === 2) {
                    console.log("feed Pressed")
                    if (item.feed_id > 0) {
                        navigation.navigate('publicFeedDetail', {
                            itemId: item.feed_id,
                            item: undefined,
                        });
                    }
                }
                if (item.type === 5) {
                    console.log("social Profile Pressed")
                    if (item.post_connection_user_id > 0) {
                        navigation.navigate('social-profile', {
                            user_id: item.post_connection_user_id,
                            item,
                            IsNotificationShow:true,
                            item:item
                        });
                    }
                }
                if (item.type === 6) {
                    console.log("social post Pressed")
                    console.log('item.user_id', item.post_id)
                    if (item.post_id > 0) {
                        navigation.navigate('social-post-detail', {
                            // itemId: item.post_connection_id,
                            itemId: item.post_id,
                            item, item
                        })
                    }
                }
                if (item.type === 8) {
                    // console.log("social post blocked by SuperAdmin")
                    // console.log('item.user_id', item.user_id)
                    // navigation.navigate('social-post-detail', {
                    //     // itemId: item.post_connection_id,
                    //     itemId: item.user_id,
                    //     item, item
                    // })
                }
                if (item.type === 9) {
                    // console.log('Join LiveStreaming item =>', item)

                    if (item.room_broadcasting_status) {
                        navigation.navigate('LiveStreaming', { data: item })
                    } else {
                        ShowToast(t("common:broadcastEnd"))
                    }

                }
            }} style={{ flex: 1, flexDirection: 'column', marginLeft: 0 }}>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 3 }}>
                    <View style={{ flex: 1 }}>
                        <Text ellipsizeMode='tail' numberOfLines={1} style={[styles.itemText, {
                            fontSize: RFValue(14), color: COLORS.text, textAlign: 'left',
                            fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
                        }]}>
                            {title && title !== 'null' ? title : item.title}
                        </Text>
                        <Text ellipsizeMode='tail' numberOfLines={2} style={[styles.itemText,
                        {
                            flex: 1, fontSize: RFValue(12), color: COLORS.textDark, textAlign: 'left',
                            marginTop: hp(0.5)
                        }]}>
                            {description && description !== 'null' ? description : item.description}
                        </Text>
                    </View>

                    {
                        item.type === 5 ? <>
                            <TouchableOpacity
                                style={[styles.actionButtonStyle, { marginLeft: 5 }]}
                                activeOpacity={.5}
                                onPress={() => {
                                    postAcceptOrReject(item, true)
                                }}
                            >
                                <Text style={[styles.itemText, styles.textBold]}
                                >{t('common:confirm')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.actionButtonStyle, { marginLeft: 5 }]}
                                activeOpacity={.5}
                                onPress={() => {
                                    postAcceptOrReject(item, false)
                                }}
                            >
                                <Text style={[styles.itemText, styles.textBold, {}]}>{t('common:delete')}</Text>
                            </TouchableOpacity>
                        </> : null
                    }

                </View>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: hp(0), justifyContent: 'flex-end' }}>
                    <View style={{ flexDirection: 'column' }}>
                        {/* <Text style={[styles.itemText, { fontSize: RFValue(12), color: COLORS.textDark, textAlign: 'left' }]}>
                            {moment(item.updated_at).format('Do MMM')}
                        </Text> */}
                        <Text style={[styles.itemText, { fontSize: RFValue(12), textAlign: 'left' }]}>
                            {moment(item.updated_at).locale(i18n.language).fromNow()}
                        </Text>
                    </View>
                </View>


            </TouchableOpacity>
        </View>)
    }



    const ListHeaderComponent = () => {
        return <View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginTop: hp(1), paddingEnd: hp(1) }}>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={.5}
                    onPress={() => {
                        // navigation.navigate('addEditCoupon');
                        clearNotifications()
                    }}
                >
                    <Text style={[styles.itemText, styles.textBold]}>  {t('common:clear_all')} </Text>
                </TouchableOpacity>
            </View>
        </View>
    }


    console.log('notifications', notifications[0])
    return (

        <View style={styles.container}>
            {notifications && notifications.length > 0 ? <ListHeaderComponent /> : null}
            <FlatList
                data={notifications}
                renderItem={notificationItem}
                initialNumToRender={30}
                keyExtractor={(item) => item.notification_id}
                contentContainerStyle={{ paddingBottom: hp(1) }}
                refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor={COLORS.primary}
                    />
                  }
            // ListHeaderComponent={ListHeaderComponent}
            />
            {
                (notifications && notifications.length <= 0 && !isLoading) ?
                    <View style={[styles.loading, { flex: 1, alignSelf: 'center' }]}>
                        <Text style={[styles.itemText, { fontSize: RFValue(14) }]}>{t("error:notification_not_found")}</Text>
                    </View> : null
            }

            {
                isLoading ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
            }
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
    },
    itemText: {
        fontSize: RFValue(13),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        marginHorizontal: wp(0)
    },
    buttonStyle: {
        // marginLeft: wp(1),
        paddingTop: hp(1),
        paddingBottom: hp(1),
        paddingHorizontal: wp(3),
        //   width: wp(18),
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: hp(1),
        borderRadius: 5,
        backgroundColor: COLORS.cardBackgroundColor,
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',

    },
    actionButtonStyle: {
        // marginLeft: wp(1),
        height: hp(4.5),
        width: wp(20),
        // paddingTop: hp(1),
        // paddingBottom: hp(1),
        // paddingLeft: wp(2),
        // paddingRight: wp(2),
        //   width: wp(18),
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default NotificationScreen;
