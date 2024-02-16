import React from 'react'
import { Alert, Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { iconDefaultUser, iconShaBat, iconVerifiedAccount, iconVerify } from '../../../constants/images';
import { COLORS } from '../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '../../../components/customButton';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { postProfile, socialAcceptRejectRequest, socialUserConnect } from '../../../redux/actions/socialActions';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShowToast } from '../../../utils/common';
import { onShare } from '../../../constants/constant';
import ReadMoreComponent from '../../../components/readMore';
import ImageViewerPopup from '../../../components/ImageViewer';

const ProfileHeader = ({ userID = undefined, useSocialProfile, postItem, onCallback }) => {
    //const offset = 0
    const { t, i18n } = useTranslation();
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const [ShowImage, setShowImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState()
    const [ReqView, setReqView] = useState(false)
    const [ReqConnect, setReqConnect] = useState(false)


    const authUser = useSelector(({ auth }) => auth.data)

    const user = useSelector(({ user }) => user.profile)
    //user.observers_shabbat

    //const [useSocialProfile, setSocialProfile] = useState([])

    //  console.log('ProfileHeader postItem', postItem)
    useEffect(() => {
        return () => {
        }
    }, [useSocialProfile])

     console.log('useSocialProfile--------00---->', useSocialProfile)


    const onConnect = () => {
        console.log('postItem', postItem)
        if (postItem){
            toggleConnect(postItem)
        }
    
    }

    const toggleConnect = postItem => {
        console.log('postItem', postItem)
        if (useSocialProfile && useSocialProfile.is_request === 2) {
			Alert.alert(
				t("common:disconnect_user"),
				t("common:disconnect_user_message"),
				[
					{
						text: (t("common:cancel")),
						onPress: () => console.log("Cancel Pressed"),
					},
					{
						text: (t("common:ok")), onPress: () => {
							socialUserConnectApi(postItem)
						}
					}
				]
			);
		}else{
			socialUserConnectApi(postItem)
		}
        
    };
    const socialUserConnectApi =(postItem)=>{
        const param = {
            receiver_id: postItem.user_id ? postItem.user_id : userID ? userID : postItem?.id,
            is_request: useSocialProfile && useSocialProfile.is_request === 2 ? 4 : 1
        }
        console.log('param', param, authUser.token)
        dispatch(socialUserConnect(param, authUser.token))
            .then((res) => {
                console.log('res.data', res)
                if (res.status === 200) {
                    // onCallback()
                    setReqConnect(false)
                    setReqView(true)
                    ShowToast(res.message)
                    useSocialProfile && useSocialProfile.is_request === 2 &&  navigation.goBack()
                }
            }).catch((error) => {
                console.log('res.error', error)
            })
    }
    const goToEditProfile = () => {
        authUser && authUser.user_status === 1 ?
            navigation.navigate("merchant-profile") : navigation.navigate("profile")
    }
    const CancelRequsted = () => {
        const param = {
            receiver_id: postItem.user_id ? postItem.user_id : userID ? userID : postItem?.id,
            is_request: 3
        }
        console.log('CancelRequsted params----->', param, authUser.token)
        dispatch(socialUserConnect(param, authUser.token))
            .then((res) => {
                console.log('res.data---------CancelRequsted--->', res)
                if (res.status === 200) {
                    setReqView(false);
                    setReqConnect(true)
                    ShowToast(res.message)
                }
            }).catch((error) => {
                console.log('res.error', error)
            })
    }

    // post_user_profile

    //    console.log('useSocialProfile ????', useSocialProfile.images)
    //connected-users
    console.log('userID', userID)
    const str = useSocialProfile.name ? String(useSocialProfile.name).split(" ") : "";
    return (
        <View style={{ paddingBottom: 10, backgroundColor: COLORS.secondary }}>
            <View style={{ flexDirection: "row" }}>
      
                <Text style={[styles.itemText, {
                    marginLeft: wp("6%"),
                    marginTop: wp(5), fontSize: RFValue(20),
                    color: COLORS.white, fontWeight: '600', textAlign: 'left'
                }]}>
                    {useSocialProfile.user_name ? useSocialProfile.user_name : str ? str[0] : ""} 
                </Text>
                {useSocialProfile.is_verified ? <Image 
                    source={iconVerify}
                    style={{
                        width:wp(6),
                        height:wp(6),
                        alignSelf:'flex-end',
                        marginHorizontal: wp("1%"),
                        marginTop: wp(5),
                    }}
                    />: null  }
            </View>
            <View style={styles.container}>
                <View style={{
                    flex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    paddingLeft: wp(2)
                }}>
                    <View style={{
                        flex: 1, display: 'flex', flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between', alignItems: 'center'

                    }}>
                        <TouchableOpacity onPress={() => {
                            setShowImage(true)
                            setSelectedImage(useSocialProfile && useSocialProfile.profile_pic ? useSocialProfile.profile_pic : undefined)
                        }}>
                            {/* <Image
                                style={[styles.IconImage, {
                                    position: 'absolute',
                                    top: 0, right: -10,
                                }]} width={18}
                                source={iconVerifiedAccount}
                            /> */}

                            <FastImage style={[styles.image_small, { alignSelf: 'flex-start' }]}
                                source={useSocialProfile && useSocialProfile.profile_pic ?
                                    { uri: useSocialProfile.profile_pic } : iconDefaultUser}
                                resizeMode={FastImage.resizeMode.cover}
                            />



                        </TouchableOpacity>

                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[styles.itemValue,]}>
                                {useSocialProfile.total_post}
                            </Text>
                            <Text style={styles.itemText}              >
                                {t("common:posts")}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            console.log('useSocialProfile', useSocialProfile.user_id)
                            navigation.navigate("connected-users", {
                                user_id: useSocialProfile?.user_id,
                            });
                        }}
                            style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <Text style={[styles.itemValue,]}>
                                {useSocialProfile.total_connection}
                            </Text>
                            <Text style={styles.itemText}              >
                                {t("common:connects")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Image
                                style={[styles.IconImage, {
                                    position: 'absolute',
                                    alignSelf: 'flex-end', zIndex: 1,
                                    tintColor: "sds",bottom: -6, right: -10,
                                }]}
                                width={18}
                                source={iconShaBat}
                            /> */}

                    {useSocialProfile.observers_shabbat === 1 ? <Text style={[styles.itemText, {
                        marginTop: 5, fontSize: RFValue(18), alignSelf: 'flex-start', marginLeft: Platform.OS === 'ios' ? wp(2) : 15
                    }]}>
                        {t("common:shabBat")}
                    </Text> : null}
                    <Text style={[styles.itemText, {
                        marginTop: hp(1), fontSize: RFValue(18), alignSelf: 'flex-start'
                    }]}>
                        {useSocialProfile.name}
                    </Text>
                </View>
                {/* <View style={{
                    flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start',
                    justifyContent: 'space-between', paddingHorizontal: wp(5), marginTop: hp(1),

                }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={[styles.itemValue,]}>
                            {useSocialProfile.total_post}
                        </Text>
                        <Text style={styles.itemText}              >
                            Posts
                        </Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                        <Text style={[styles.itemValue,]}>
                            {useSocialProfile.total_connection}
                        </Text>
                        <Text style={styles.itemText}              >
                            Connects
                        </Text>
                    </View>
                </View> */}
            </View>

            <View style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                paddingLeft: 20,
                marginTop: -3,
                marginBottom: hp(2)
            }}>
                {/* <Text style={[styles.itemText, {
                    marginTop: hp(0), fontSize: RFValue(14), maxWidth: wp('50%'),
                    lineHeight: 20, textAlign: 'left'
                }]}>
                    {useSocialProfile.bio}
                </Text> */}
                {useSocialProfile?.bio &&
                    <View style={{ width: useSocialProfile?.user_status == 1 ? wp('90%') : wp('90%'), }}>
                        <ReadMoreComponent numberOfLines={3} customStyle={{
                            lineHeight: 20
                        }}>{useSocialProfile.bio}</ReadMoreComponent>
                    </View>
                }

                {useSocialProfile?.user_status == 1 &&
                    <View style={{ width: wp('90%'), flexDirection: "row", alignItems: 'center', marginTop: 5 }}>
                        <View style={{
                            // lineHeight: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            width: wp('45%'),

                        }}>
                            {
                                useSocialProfile.district ? <>
                                    <Image
                                        style={[styles.IconImage, {
                                        }]}
                                        source={require('../../../assets/images/map.png')}
                                    />
                                    <Text
                                        onPress={() => {
                                            if (useSocialProfile.location_url)
                                                Linking.openURL(useSocialProfile.location_url)
                                        }}
                                        numberOfLines={1} style={[styles.IconText,
                                            //{ color:'blue'}
                                        ]}>{useSocialProfile.district}</Text>
                                </> : null
                            }

                        </View>

                        {useSocialProfile?.business_hours &&
                            <View
                                style={{
                                    // lineHeight: 20,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 5,
                                    marginLeft: wp(5)
                                }}>
                                <Image
                                    style={[styles.IconImage, {
                                        height: 20,
                                        width: 20,
                                        tintColor: COLORS.primary
                                    }]}
                                    source={require('../../../assets/images/time.png')}
                                />
                                <Text style={styles.IconText}>
                                    {useSocialProfile.business_hours}
                                </Text>
                            </View>
                        }

                    </View>}

                {
                    (useSocialProfile?.user_status == 1 && useSocialProfile?.link) && <View

                        style={{
                            // lineHeight: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: 5
                        }}>
                        <Image
                            style={styles.IconImage}
                            source={require('../../../assets/images/hyperlink.png')}
                        />
                        <Text style={[styles.IconText, {
                            color: 'blue'
                        }]}
                            onPress={() => Linking.openURL(useSocialProfile.link)}>
                            {useSocialProfile.link}
                        </Text>
                    </View>
                }
            </View>
            <View style={{
                display: 'flex',
                flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
                marginTop: hp(1)
            }}>
                {
                    authUser.user_id === userID ? <CustomButton
                        customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                        isSmall textStyle={{ fontSize: 10 }}
                        isDisabled={false}
                        onCallback={goToEditProfile}
                        title={t('common:edit_profile')} /> :

                        useSocialProfile && useSocialProfile.is_request === 2 ?
                        
                            <>
                                <CustomButton
                                    customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                                    isSmall textStyle={{ fontSize: 10 }}
                                    isDisabled={false}
                                    onCallback={onConnect}
                                    title={t('common:disconnect')} />
                                <CustomButton
                                    customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                                    isSmall
                                    textStyle={{ fontSize: 12 }}
                                    isDisabled={false}
                                    onCallback={(item) => {
                                        if (useSocialProfile)
                                            navigation.navigate("messaging", {
                                                id: useSocialProfile.user_id,
                                                name: useSocialProfile.name,
                                                image: useSocialProfile.profile_pic,
                                                item: useSocialProfile
                                            });

                                    }} title={t('common:message')} />
                            </> : 
                           ( useSocialProfile?.is_request === 1 || ReqView) && !ReqConnect ?
                            <CustomButton

                            customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                            isSmall textStyle={{ fontSize: 10 }}
                            isDisabled={false}
                            onCallback={()=>{
                                Alert.alert(
                                    t("common:cancelRequsted"),
                                    t("common:cancelRequsted_message"),
                                    [
                                        {
                                            text: (t("common:cancel")),
                                            onPress: () => console.log("Cancel Pressed"),
                                        },
                                        {
                                            text: (t("common:ok")), onPress: () => {
                                                CancelRequsted()
                                            }
                                        }
                                    ]
                                );
                            }}
                            title={t('common:requested')} />
                            :
                           <CustomButton

                                customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                                isSmall textStyle={{ fontSize: 10 }}
                                isDisabled={false}
                                onCallback={onConnect}
                                title={t('common:connect')} />
                }


                <CustomButton
                    customButtonStyle={{ borderRadius: 10, paddingVertical: 12, flex: 1, marginHorizontal: 10 }}
                    isSmall textStyle={{ fontSize: 12 }}
                    isDisabled={false}
                    onCallback={() => {
                        const lastPath = `SocialUserProfile/${userID}`
                        onShare("", lastPath)
                    }} title={t('common:share')} />

                {/* <CustomButton customButtonStyle={{borderRadius: 10, paddingVertical:12}} isSmall isDisabled={false} onCallback={() => { }} title={t('Edit Profile')} /> */}
            </View>

            {
                ShowImage ? <ImageViewerPopup
                    setModalVisible={setShowImage}
                    modalVisible={ShowImage}
                    item={{ image: selectedImage }} /> : null
            }


        </View>
    )
}

export default ProfileHeader


const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: wp("3%"),
        paddingTop: hp("2%"),
        paddingBottom: hp("1%"),
        //   backgroundColor:"#000"
    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        //textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    itemValue: {
        fontSize: RFValue(18),
        color: COLORS.text,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    image_small: {
        height: wp(20),
        width: wp(20),
        borderRadius: wp(20) / 2,

    },
    IconText: {
        fontSize: RFValue(14),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        marginLeft: 10
    },
    IconImage: {
        height: 22,
        width: 15,
        tintColor: COLORS.primary
    }
});