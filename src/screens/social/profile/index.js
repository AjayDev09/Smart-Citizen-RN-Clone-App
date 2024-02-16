//import liraries
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Platform, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProfileHeader from '../profileHeader';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { arrow_back, iconDots, iconSetting, iconVideo, logo } from '../../../constants/images';
import { COLORS } from '../../../theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { blockUserList, deletePost, postProfile, socialAcceptRejectRequest, socialUserConnect } from '../../../redux/actions/socialActions';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';
import VideoFullScreen from '../../publicFeed/videoFullscreen';
import { ShowErrorToast, ShowToast, getItemByLngAR, isVideo } from '../../../utils/common';
import CustomSocialHeader from '../CustomSocialHeader';
import CustomVideoPlayer from '../../../components/customVideoPlayer';
import EmptyListComponent from '../../../components/EmptyListComponent';
const windowWidth = Dimensions.get('window').width;

const SocialProfile = ({ userID = undefined, route, SocialSelectedTab, setSocialSelectedTab }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()

  const dispatch = useDispatch()
  const authUser = useSelector(({ auth }) => auth.data)

  const [useSocialProfile, setSocialProfile] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(undefined);
  const [loading, setLoading] = useState(false)

  const [postItem, setPostItem] = useState(route && route?.params?.item ? route?.params?.item : undefined)

  const IsNotificationShow = route?.params?.IsNotificationShow
  const [IsAccepet, setIsAccepet] = useState(IsNotificationShow)
  const item = route?.params?.item
  const Userdescription = route?.params?.userName
  const DescriptionItem =IsNotificationShow && getItemByLngAR(i18n?.language, item, "description")
  console.log('IsNotificationShow------------>', IsNotificationShow);
  console.log('item--Props------------>', item);

  // useEffect(()=>{

  //   IsNotificationShow && setIsAccepet(IsNotificationShow)
  // },[IsNotificationShow])

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getPostProfile()
    });
    return focusHandler;
  }, [navigation])

  useEffect(() => {
    setSocialProfile([])
    getPostProfile()
  }, [userID, route && route.params])


  const getPostProfile = () => {
    setLoading(true)
    // console.log('postItem 22', postItem)
    if (route && !postItem) {
      setLoading(false)
      return
    }

    console.log('userID????------', route)
    const param = {
      user_id: route ? route?.params?.user_id : authUser.user_id
    }
    console.log('postProfile param', param,)
    dispatch(postProfile(param, authUser.token))
      .then((res) => {
        console.log('res.data------->', res.data)
        if (res.status === 200) {
          setSocialProfile(res.data)
          !route.params.account_privacy && setPostItem(res?.data)
        }
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
        console.log('res.error---', error)
      })
    dispatch(blockUserList(authUser.token))
      .then((res) => {
        // console.log('res.data', res.data)
        if (res.status === 200) {
        }
        setLoading(false)
      }).catch((error) => {
        setLoading(false)
        console.log('res.error', error)
      })
  }


  const onDeleteChoose = (itemIndex, post_id) => {
    console.log('onLongPress ', itemIndex, post_id)
    if (userID !== authUser.user_id) {
      return
    }
    Alert.alert(
      t("common:delete_post"),
      t("common:delete_post_message"),
      [
        {
          text: (t("common:yes")), onPress: () => {

            //   console.log('useSocialProfile.post', useSocialProfile.post)
            const params = {
              post_id: post_id
            }
            dispatch(deletePost(params, authUser.token))
              .then((response) => {
                if (response.status === 200) {
                  // let newUseSocialpostArray = useSocialProfile.post.filter(function (value, index,) {
                  //   return index !== itemIndex
                  // });
                  // const newA = {...useSocialProfile, newUseSocialpostArray }
                  // console.log('newA', newA)
                  // setSocialProfile(newA)

                  getPostProfile()
                }
                ShowToast(response.message)
              }).catch((error) => {
                ShowErrorToast(error)
              })
          }
        },
        {
          text: (t("common:no")),
          onPress: () => console.log("Cancel Pressed"),
        },
      ]
    );
  }

  const onBackPress = () => {
    if (SocialSelectedTab === 0) {
      navigation.goBack()
    } else {
      if (setSocialSelectedTab)
        setSocialSelectedTab(0)
      else
        navigation.goBack()
    }
  }

  const renderImagesItem = ({ item, index }, parentIndex) => {
    //  console.log('item', item)
    const videoSrc = Platform.OS === 'ios' ? { uri: convertToProxyURL(item.post) } : { uri: convertToProxyURL(item.post) };
    const imageHeight = Platform.OS === 'ios' ? 25 : 18
    const paddingVideo = 6

    const onDelete = () => {
      onDeleteChoose(index, item.id)
    }

    return (
      <TouchableOpacity
        key={index}
        style={{ margin: 3 }}
        onLongPress={() => onDeleteChoose(index, item.id)}
        onPress={() => {
          // setSelectedItem(item)
          // setModalVisible(true)
          navigation.navigate('social-post-detail', {
            itemId: item.id,
            item, item
          })
        }}  >

        {
          // item.post_type === 2 ?
          isVideo(item.post) ?
            <>
              {/* <Video
                source={videoSrc}
                style={{ width: (windowWidth / 3) - paddingVideo, height: (windowWidth / 3) - paddingVideo }}
                shouldPlay
                //onLoad={onLoad}
                //onError={onError}
                //isLoading={isLoading}
                //onProgress={onProgress}
                muted={true}
                resizeMode={'cover'}
                type={Platform.OS === 'ios' ? 'mov' : 'mp4'}
                paused={false}
                allowsExternalPlayback={false} /> */}

              <CustomVideoPlayer videoUrl={item.post} selectedImage={0}
                itemList={[{ image: item.post }]} videoWidth={(windowWidth / 3) - paddingVideo}
                showDownload={true} showPlayIcon={false} onLongPress={onDelete} onPress={() => navigation.navigate('social-post-detail', {
                  itemId: item.id,
                  item, item
                })} />
            </>

            :
            <FastImage style={{ width: (windowWidth / 3) - paddingVideo, height: (windowWidth / 3) - paddingVideo }}
              source={{ uri: item.post }}
              resizeMode={FastImage.resizeMode.cover}
            />
        }


        {
          isVideo(item.post) ? <Image source={iconVideo} style={{ width: imageHeight, height: imageHeight, position: 'absolute', right: 0, margin: 5, zIndex: 1 }} />
            : null
        }

        {
          modalVisible ? <VideoFullScreen
            modalVisible={modalVisible} setModalVisible={setModalVisible}
            selectedImage={0}
            itemList={[{ image: selectedItem.post }]} showDownload={true} /> : null
        }
      </TouchableOpacity>
    )
  }

  const postAcceptOrReject = (item, isAccept) => {
    console.log('item--------, isAccept----------------', item, isAccept)
    setLoading(true)
    const param = {
      connection_id: item.post_connection_id ? item?.post_connection_id :item?.id,
      is_request: isAccept === false ? 3 : 2
    }
    console.log('AcceptReject Req--++---------->', param)
    dispatch(socialAcceptRejectRequest(param, authUser.token))
      .then((res) => {
        setLoading(false)
      console.log('res.data------------------------AcceptReject---?>', res.message)
        if (res.status === 200) {
          setIsAccepet(false)
          ShowToast(res.message)
          console.log('res.data', res.message)
           //getNotifications()
           getPostProfile()
        }
      }).catch((error) => {
        setLoading(false)
        console.log('res.error', error)
      })
  }

  const ListHeaderComponent = useMemo(() => <ProfileHeader
    useSocialProfile={useSocialProfile}
    userID={route ? route.params.user_id : authUser.user_id} postItem={postItem} onCallback={getPostProfile} />
    , [route, authUser.user_id, useSocialProfile])


  const POST_LIST = (postItem && postItem.user_id === authUser.user_id) ?
    useSocialProfile.post :
    (postItem && postItem.account_privacy === 1 && postItem.is_request !== 2) ?
      [] : useSocialProfile.post
  
  console.log('authUser.user_id----++++--->', authUser.user_id);
  console.log('postItem?.is_request !== 2-----++++-----'.postItem?.is_request !== 2 && postItem?.account_privacy !== 1 && POST_LIST?.length == 0);
  return (
    <View style={styles.container} >
      {/* <ProfileHeader /> */}

      <CustomSocialHeader
        useSocialProfile={useSocialProfile} title={t("navigate:postProfile")}
        userID={route ? route.params.user_id : authUser.user_id} showMore={true}
        onBackPress={onBackPress}
      />

      {!loading ? <View style={{ flex: 1 }}>
        {
          (IsNotificationShow && IsAccepet) ? <>
            <View
              style={{
                alignItems: "center",
              }}>
              <View style={styles.NoticationView}>
                <TouchableOpacity style={styles.CloseBtn} onPress={() => {
                  setIsAccepet(false)
                }}>

                  <Image
                    source={require('../../../assets/images/close.png')}
                    style={{
                      height: 8,
                      width: 8,
                      tintColor: '#000',
                    }}
                  />
                </TouchableOpacity>
                <Text ellipsizeMode='head' numberOfLines={2} style={[
                  {
                    fontSize: RFValue(12), color: '#fff', fontWeight: '500',
                    marginLeft: 5,
                    flex: 1,

                  }]}>
                  {item?.post_connection_id? DescriptionItem ? DescriptionItem : item?.description  : Userdescription }</Text>

                <TouchableOpacity
                  style={[styles.actionButtonStyle, { marginLeft: 10 }]}
                  activeOpacity={.5}
                  onPress={() => {
                  postAcceptOrReject(item, true)
                  }}
                >
                  <Text style={[styles.BtnText,]}
                  >{t('common:confirm')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButtonStyle, { marginLeft: 5 }]}
                  activeOpacity={.5}
                  onPress={() => {
                 postAcceptOrReject(item, false) 
                  }}
                >
                  <Text style={[styles.BtnText, {}]}>{t('common:delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </> : null
        }
        {
          !route && postItem && postItem.is_request !== 2 ? ListHeaderComponent : <FlatList
            numColumns={3}
            data={POST_LIST}
            renderItem={(childData) => renderImagesItem(childData)}
            keyExtractor={(item, index) => index}
            snapToEnd={true}
            contentContainerStyle={{ alignItems: 'flex-start', paddingBottom: 10 }}
            ListHeaderComponentStyle={{ width: "100%" }}
            ListHeaderComponent={ListHeaderComponent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          />
        }


        {
          (postItem?.is_request !== 2 && postItem?.account_privacy !== 1 && POST_LIST?.length === 0) ?
            <>
              <EmptyListComponent isLoading={loading} data={POST_LIST} msg={t('error:publicFeed_not_found')} />
            </> : null

        }
        {
          ((postItem?.account_privacy === 1 && postItem.is_request !== 2) && (postItem?.user_id !== authUser?.user_id)) ?
            <View style={[styles.loading, { flex: 1, alignSelf: 'center' }]}>
              <Text style={[styles.itemText, { fontSize: RFValue(14) }]}>{t("common:accountIsPrivate")}</Text>
            </View> : null
        }
      </View> : <ActivityIndicator size={'large'} color={COLORS.primary} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary
  },
  itemText: {
    fontSize: RFValue(16),
    color: COLORS.text,
    //textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
  actionButtonStyle: {
    // marginLeft: wp(1),
    height: hp(4),
    width: wp(15),
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
  NoticationView:{
    backgroundColor: "#9bbbdf",
    width: '100%',
    flexDirection: 'row',
    alignItems: "center",
    // justifyContent:"center",
    // borderRadius:8,
    paddingVertical: 8,
    paddingHorizontal: 5

  },
  BtnText: {
    fontSize: RFValue(12), color: '#fff', fontWeight: '400'
  },
  CloseBtn: {
    backgroundColor: COLORS.textPlaceHolder,
    padding: 5,
    borderRadius: 34,

  },
});

//make this component available to the app
export default SocialProfile;
