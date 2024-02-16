import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Keyboard, KeyboardAvoidingView, Linking, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { COLORS } from '../../theme'
import {
    coupons, public_feeds, blogs, filter, search, like, dislike, emoji, send_message,
    messenger, menu, chat, logo, icon_user, iconBell, iconAlret
} from '../../constants/images'
import CustomInput from '../../components/customInput'
import CouponsList from './couponsList'
import PublicFeed from '../publicFeed'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Blogs from '../blogs'
import Filters from '../filters'
import { useTranslation } from 'react-i18next'
import { getAllCoupons, getCouponCategoryList, getlocationList } from '../../redux/actions/couponActions'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast';
import MerchantCouponsList from '../merchantCoupon/merchantCouponsList'
import { getProfile, notificationListApi } from '../../redux/actions/loginActions'
import Orientation from 'react-native-orientation-locker'
import { RFValue } from "react-native-responsive-fontsize";
import { nFormatter, ShowErrorToast } from '../../utils/common'
import moment from 'moment'
import { chatGroupApi } from '../../redux/actions/chatActions'
import { UseChatCount } from '../../context/chatCountProvider'
import Messaging from '../chat/Messaging'
import Chat from '../chat/chat'
import socket from '../chat/utils/socket'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import Social from '../social'
import { UseNotificationCount } from '../../context/notificationCountProvider'
import { UserProfileData } from '../../context/UserProfileProvider'
import { postProfile } from '../../redux/actions/socialActions'


const Coupons = ({ route }) => {
    const { chatMessageCount, setChatMessageCount } = UseChatCount()
    const { notificationCount, } = UseNotificationCount()
    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilter, setShowFilter] = useState(false)
    const [selectedtab, setSelectedtab] = useState(0)
    const initialData = route?.params?.initialData
    const [couponCategory, setCouponCategory] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [location, setLocation] = useState("")
    const [locationCity, setLocationCity] = useState("")
    const authuser = useSelector(({ auth }) => auth.data);
    const categories = useSelector(({ coupon }) => coupon.couponsCategory);
    const profile = useSelector(({ user }) => user.profile);
            console.log('profile----------->', profile)

            const POPUpForProfile=()=>{
                if(profile?.isProfileComplete == 0){
                    Alert.alert(
                         t("common:profileComplete"),
                         t("common:profileComplete_msg"),
                        [
                            {
                                text: (t("common:ok")), onPress: () => {
                                    authuser?.user_status == 1 ? navigation.replace('merchantProfileNav')   :navigation.replace('profileNav')
                                }
                            }
                        ]
                    );
                }
            }


    useEffect(()=>{
        POPUpForProfile()
    },[navigation,profile?.isProfileComplete])   
    const { setUserProfilePic } = UserProfileData()

    const couponsCategory = categories && categories.coupons ? categories.coupons : [];
    const blogsCategory = categories && categories.blogs ? categories.blogs : [];
    const locationList = useSelector(({ coupon }) => coupon.locationList);

    const title = selectedtab == 1 ? t("common:coupons") : selectedtab === 2 ? t("common:publicFeeds") : selectedtab === 3 ? t("common:blogs") : selectedtab === 0 ? t("navigate:chat") : ""
    useEffect(() => {
        Orientation.lockToPortrait();
        navigation.setOptions({ title: title });
        setCouponCategory([])
        setDiscountType('')
        setLocation([])
        moment().locale(i18n.language)
        //console.log('first ',couponCategory, discountType , location  )
    }, [selectedtab])
    let Notification = useRef(null)
    const [notifications, setNotifications] = useState([])
    const [isLoading, setLoading] = useState(false)
    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            fetchGroups();
            getPostProfile()
        });
        return focusHandler;
    }, [navigation]);
    useEffect(() => {
    }, [chatMessageCount]);
    // console.log('initialData-----+++',   initialData);

    const getNotifications = () => {
        setLoading(true)
        dispatch(notificationListApi(authuser.token))
            .then((res) => {

                if (res.status === 200) {
                    setLoading(false)
                    //   console.log('notificationListApi res.data', res.data)
                    setNotifications(res?.data.filter(item => item.type === 5).length)
                }
                else
                    Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                // setLoading(false)
                console.log('error', error)
                ShowErrorToast(error)
            })
    }

    // console.log('notifications length---', notifications?.length);
    useEffect(() => {
        navigation.setOptions({
            //title: "",
            headerLeft: () => (
                <TouchableOpacity style={{
                    paddingLeft: 10, paddingRight: 30, marginRight: 10
                }} onPress={() => navigation.toggleDrawer()}>
                    {/*Donute Button Image */}
                    <Image
                        source={menu}
                        style={{ width: wp(6), height: wp(6), marginLeft: 5, tintColor: COLORS.white }}
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <>
                    {
                        selectedtab === 0 ? <TouchableOpacity style={{ paddingLeft: 10, marginRight: 10 }}  >
                            <ChatAction />
                        </TouchableOpacity> : <View style={{ display: 'flex', flexDirection: 'row' }}>
                            {/*           
                    <TouchableOpacity onPress={() => {
                               navigation.navigate('AlretNotification',{
                                isAlret:true
                            });
                            }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                                <Image
                                    source={require('../../assets/images/alret.png')}
                                    style={{
                                        width: wp(6), height: wp(6), marginLeft: 5,
                                        tintColor: '#FF0000'
                                    }}
                                />
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => {
                                navigation.navigate(t('navigate:notification'), {
                                    isAlret: false
                                });
                            }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                                <Image
                                    source={iconBell}
                                    style={{
                                        width: wp(6), height: wp(6), marginLeft: 5,
                                        tintColor: COLORS.white
                                    }}
                                />
                                {
                                    notificationCount > 0 ? <View style={{
                                        height: 10, width: 10,
                                        backgroundColor: "red", borderRadius: 45,
                                        position: 'absolute', right: wp(2)
                                    }} /> : null
                                }

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('coupons');
                                //navigationProps.goBack()
                            }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                                <Image
                                    source={logo}
                                    style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
                                />
                            </TouchableOpacity>

                        </View>
                    }
                </>
            ),
        });
    }, [navigation, selectedtab]);

    useEffect(() => {
        socket.connect()
    }, [])

    const getPostProfile = () => {
        const param = {
          user_id:  authuser.user_id
        }
        dispatch(postProfile(param, authuser.token))
          .then((res) => {
            console.log('res postProfile------->', res?.data.profile_pic)
            if (res.status === 200) {
              setUserProfilePic(res?.data.profile_pic)
            }
           
          }).catch((error) => {
            setUserProfilePic('')
            console.log('res.error', error)
          })
     
      }

    const ChatAction = () => {
        return (
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>


                {/* <TouchableOpacity onPress={() => {
                               navigation.navigate('AlretNotification',{
                                isAlret:true
                            });
                            }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                                <Image
                                    source={require('../../assets/images/alret.png')}
                                    style={{
                                        width: wp(6), height: wp(6), marginLeft: 5,
                                        tintColor: '#FF0000'
                                    }}
                                />
                            </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => {
                    navigation.navigate('LiveStreaming');
                }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                    <Image
                        source={require('../../assets/images/alret.png')}
                        style={{
                            width: wp(6), height: wp(6), marginLeft: 5,
                            tintColor: '#FF0000'
                        }}
                    />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => {
                    navigation.navigate(t('navigate:notification'), {
                        isAlret: false
                    });
                }} style={{ paddingRight: wp(2), marginRight: 0 }} >
                    <Image
                        source={iconBell}
                        style={{
                            width: wp(6), height: wp(6), marginLeft: 5,
                            tintColor: COLORS.white
                        }}
                    />
                    {
                        notificationCount > 0 ? <View style={{
                            height: 10, width: 10,
                            backgroundColor: "#FF0000", borderRadius: 45,
                            position: 'absolute', right: wp(2)
                        }} /> : null
                    }

                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        borderWidth: 1,
                        borderColor: 'rgba(0,0,0,0.2)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: wp(6),
                        height: wp(6),
                        backgroundColor: COLORS.primary,
                        borderRadius: 100,
                    }}
                    onPress={() => {
                        navigation.navigate("searchChatUsers");
                    }}
                >

                    <Image
                        source={chat}
                        style={[{
                            width: 25,
                            height: 25,
                            tintColor: "#fff"
                        }]}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    const fetchGroups = () => {
        //  console.log('authuser.token', authuser.token)
        dispatch(chatGroupApi(authuser.token)).then((res) => {
            const data = res.data
            // console.log('dispatch chatGroupApi res', data)
            let count = 0
            // console.log('count', count)
            data.forEach(message => {
                if (authuser.user_id === message.receiverId) {
                    count += message.receiver_unread_msg_count
                    // console.log('message', message)
                    // console.log('authuser.user_id', authuser.user_id)
                    // console.log('message.receiverId', message.receiverId)
                    // console.log('message.senderId', message.senderId)
                    // console.log('message.receiver_unread_msg_count', message.receiver_unread_msg_count)
                }
            });
            // console.log('after count', count)
            // console.log('chatMessageCount + count', count)
            setChatMessageCount(count)

        }).catch((error) => {
            console.log('chatGroupApi', error)
        })
    }

    useEffect(() => {
        // console.log('coupon on')
        socket.on("receive_message", messageListener);

        return () => {
            //  console.log('coupon off')
            socket.off('receive_message', messageListener);
        };
    }, [socket, chatMessageCount]);

    const messageListener = (roomChats) => {
        console.log(' coupons roomChats chatMessageCount', chatMessageCount)
        if (authuser.user_id === roomChats.receiverId) {
            setChatMessageCount(chatMessageCount + 1)
        }
    };



    useEffect(() => {
        //  console.log('coupon CALLED 123',)
        Orientation.lockToPortrait();
        dispatch(getlocationList(authuser.token))
        dispatch(getCouponCategoryList(authuser.token))
            .then((response) => {
                //  Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                console.log('getCouponCategoryList.data', error)
                ShowErrorToast(error)
            })
        getProfileDetails();

    }, [])

    const getProfileDetails = () => {
        if (authuser) {
            dispatch(getProfile(authuser.token))
        }
    }
    const onChangeSearch = (name, value) => setSearchQuery(value);
    const onChangeTab = (value) => {
        Keyboard.dismiss()
        setSearchQuery("")
        setSelectedtab(value)
    };

    const onShowFilters = () => {
        setShowFilter(true)
    }
    const onCloseFilters = () => { setShowFilter(false) }
    const onCouponCallBack = (items) => {
        console.log('selectedFilters', items)
        setCouponCategory(items.category_id)
        setDiscountType(items.discount_type)
        setLocation(items.location_id)
        setShowFilter(false)

        var item = locationList && locationList.find((item, index) => item.id == items.location_id)
        const city_area = item ? i18n.language === 'he' ? item.city_area_he : i18n.language === 'ar' ? item.city_area_ab : item.city_area : ''
        //console.log('location.location_id >>', city_area)
        setLocationCity(city_area)
    }
    const onBlogCallBack = (items) => {
        console.log('selectedFilters', items)
        setCouponCategory(items.category_id)
        setShowFilter(false)
    }

    const TabHeader = () => {
        return (
            <View style={styles.headerWrapper}>
                <View style={{
                    height: wp(12), width: wp(12),
                }}>
                    <TouchableOpacity style={{
                        height: wp(12), width: wp(12),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: selectedtab === 0 ? COLORS.textDark : COLORS.text,
                        borderRadius: wp(12) / 2, borderWidth: 1.2
                    }} onPress={() => { onChangeTab(0) }}  >
                        <Image
                            source={messenger}
                            style={[styles.image, { height: wp(7), width: wp(7), tintColor: selectedtab === 0 ? COLORS.textDark : COLORS.text, }]}
                        />
                    </TouchableOpacity>
                    {
                        chatMessageCount > 0 ? <TouchableOpacity
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                height: wp(6), width: wp(6),
                                position: 'absolute', alignSelf: 'flex-end',
                                top: -8,
                                right: -8,


                                backgroundColor: COLORS.white,
                                alignItems: 'center',
                                borderRadius: wp(6) / 2,
                            }}
                        >
                            <Text style={[styles.text, {
                                //  height: wp(4), width: wp(4),
                                textAlign: 'center',
                                color: COLORS.primary,
                                fontSize: RFValue(12),

                            }]}>
                                {chatMessageCount}
                            </Text>
                        </TouchableOpacity> : null
                    }

                </View>
                <TouchableOpacity style={{
                    height: wp(12), width: wp(12),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: selectedtab === 4 ? COLORS.textDark : COLORS.text,
                    borderRadius: wp(12) / 2, borderWidth: 1.2
                }} onPress={() => {
                    //onChangeTab(4)
                    navigation.navigate("socialScreen",);
                }}  >
                    <Image
                        source={icon_user}
                        style={[styles.image, {
                            height: wp(8), width: wp(8),
                            tintColor: selectedtab === 4 ? COLORS.textDark : COLORS.text
                        }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{ backgroundColor: "" }} onPress={() => { onChangeTab(1) }}  >
                    <Image
                        source={coupons}
                        style={[styles.image, { tintColor: selectedtab === 1 ? COLORS.textDark : COLORS.text }]}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { onChangeTab(2) }}  >
                    <Image
                        source={public_feeds}
                        style={[styles.image, { tintColor: selectedtab === 2 ? COLORS.textDark : COLORS.text }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { onChangeTab(3) }}  >
                    <Image
                        source={blogs}
                        style={[styles.image, { tintColor: selectedtab === 3 ? COLORS.textDark : COLORS.text }]}
                    />
                </TouchableOpacity>


            </View>
        )
    }

    // console.log('selectedtab', selectedtab)

    const memoHeader = useMemo(() => <TabHeader />, [selectedtab, chatMessageCount]);


    const near_area = i18n.language === 'he' ? "בסביבה" : i18n.language === 'ar' ? "بالقرب من" : " Near "
    // const city = locationCity ? near_area + locationCity : ""
    //  const city = locationCity ? "Showing Coupons based on applied filters" : t("common:couponsMsg")
    const withFilterCoupons = i18n.language === 'he' ? "הצגת קופונים עם סינון" : i18n.language === 'ar' ? "إظهار الكوبونات بناءً على الفلاتر المطبقة" : "Showing Coupons based on applied filters "
    const withFilterBlogs = i18n.language === 'he' ? "מציג בלוגים המבוססים על מסננים שהוחלו" : i18n.language === 'ar' ? "إظهار المدونات على أساس عوامل التصفية المطبقة" : "Showing Blogs based on applied filters"

    const city = couponCategory.length > 0 || location.length > 0 || discountType !== "" ? withFilterCoupons : t("common:couponsMsg")
    const blogCategory = couponCategory.length > 0 ? withFilterBlogs : t("common:blogsMsg")

    const searchTxt = selectedtab === 0 ? t("common:search") : selectedtab === 1 ? t("common:search") + " " + t("common:coupons") :
        selectedtab === 2 ? t("common:search") + " " + t("common:publicFeeds") : selectedtab === 3 ? t("common:search") + " " + t("common:blogs") : ""
    const searchMsg = selectedtab === 1 ? city : selectedtab === 3 ? blogCategory : ""


    const InputWidth = selectedtab === 0 ? Dimensions.get('screen').width - wp(32) : Dimensions.get('screen').width - wp(20)
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={-300}
            style={styles.container}>
            {memoHeader}

            <View style={styles.divider} />
            {
                selectedtab != 4 ? // selectedtab != 0 &&
                    <View style={{ flexDirection: 'column', marginBottom: selectedtab === 2 || selectedtab === 0 ? hp(0) : hp(2) }}>
                        {
                            selectedtab === 2 || selectedtab === 0 ? <View style={{ paddingVertical: hp(1), }} /> :
                                <View style={styles.filterWrapper}>
                                    <Text style={[styles.text, { fontSize: RFValue(16), marginRight: wp(2) }]}>
                                        {searchMsg}
                                    </Text>
                                    <TouchableOpacity onPress={() => { onShowFilters() }}  >
                                        <Image
                                            source={filter}
                                            style={styles.image_small}
                                        />
                                    </TouchableOpacity>
                                </View>
                        }

                        {/* <View style={{ display: 'flex', flexDirection: "row" }} > */}
                        <View style={[styles.searchWrapper,]}>
                            {/* {flex:1} */}
                            <Image
                                source={search}
                                style={styles.image_small}
                            />
                            <CustomInput
                                value={searchQuery}
                                setValue={onChangeSearch}
                                placeholder={searchTxt}
                                keyboardType={'default'}
                                customStyle={{
                                    //width: InputWidth,
                                    borderBottomWidth: 0,
                                    marginLeft: wp(1),
                                    // height: 30,
                                    // paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                                    height: Platform.OS === 'ios' ? 30 : hp(6),
                                    paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                                    textAlignVertical: 'center',
                                    // backgroundColor:"#000"
                                }}
                            />

                            {/* </View> */}

                            {/* {
                                selectedtab === 0 ? <View style={[styles.filterWrapper, { marginLeft: wp(1) }]}>
                                    <Text style={[styles.text, { fontSize: RFValue(16), marginRight: wp(0) }]}>
                                        {searchMsg}
                                    </Text>
                                    <TouchableOpacity onPress={() => { onShowFilters() }}  >
                                        <Image
                                            source={filter}
                                            style={styles.image_small}
                                        />
                                    </TouchableOpacity>
                                </View> : null
                            } */}

                        </View>
                    </View> : null
            }


            {
                selectedtab === 0 ? <Chat isHomeScreen={true} searchQuery={searchQuery} chatMessageCount={chatMessageCount} /> : null
            }

            {
                selectedtab === 2 || selectedtab === 0 || selectedtab === 4 ? <View /> : <View style={styles.divider} />
            }

            {
                selectedtab === 1 ? authuser.user_status === 0 ?
                    <CouponsList searchQuery={searchQuery} discountType={discountType}
                        couponCategory={couponCategory} location={location} />
                    :
                    <MerchantCouponsList searchQuery={searchQuery} discountType={discountType}
                        couponCategory={couponCategory} location={location} />
                    : null
            }

            {
                selectedtab === 2 ? <PublicFeed searchQuery={searchQuery} /> : null
            }
            {
                selectedtab === 3 ? <Blogs searchQuery={searchQuery} couponCategory={couponCategory} /> : null
            }


            <Filters
                isCouponScreen={selectedtab === 1}
                couponsCategoryList={couponsCategory}
                blogsCategoryList={blogsCategory}
                onCloseFilters={onCloseFilters}
                onCouponCallBack={onCouponCallBack}
                onBlogCallBack={onBlogCallBack}
                showFilter={showFilter}
                isChatScreen={selectedtab === 0} />
        </KeyboardAvoidingView>
    )
}

export default Coupons

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: wp(7),
        paddingVertical: 15
    },
    filterWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: wp(6),
        marginRight: wp(8),
        paddingVertical: hp(2),
        alignItems: 'center',
    },
    searchWrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 15,
        alignItems: 'center',
        borderRadius: 35,
        borderWidth: 3,
        borderColor: COLORS.white
    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
    text: {
        fontSize: 16,
        // fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
        color: COLORS.textDark
    },
    image: {
        width: wp(12),
        height: wp(12),
        tintColor: COLORS.text,
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
        alignItems: 'center',
        backgroundColor:  COLORS.cardBackgroundColor,
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 10
    },
    itemInnerWrapper: {
        flexDirection: 'column',
        marginLeft: 5,
        padding: 10,
        width: '100%',
        justifyContent: 'space-around'
    },
    itemText: {
        fontSize: 16,
        color: COLORS.text
    },
    buttonStyle: {
        marginLeft: 5,
        paddingTop: 7,
        paddingBottom: 7,
        width: 80,
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },

    msgWrapper: {
        height: 45,
        width: '70%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 35,
        backgroundColor: "#b7c8db",
    },
})