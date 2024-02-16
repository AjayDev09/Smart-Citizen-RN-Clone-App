import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    PixelRatio,
    ActivityIndicator,
    AppState,
} from 'react-native';
import Video from 'react-native-video';
// import VideoPlayer from 'react-native-video-controls';
import {
    iconChatBubble,
    iconDefaultUser,
    iconDots,
    iconHeart,
    iconHeartFill,
    iconMute,
    iconVolume,
    share,
} from '../../../constants/images';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { COLORS } from '../../../theme';
import { DATE_FORMATE_12, ShowToast, abbrNum, isImage, isVideo } from '../../../utils/common';
import FastImage from 'react-native-fast-image';
import MediaControls, { PLAYER_STATES } from 'react-native-media-controls';
import convertToProxyURL from 'react-native-video-cache';
import { useNavigation } from '@react-navigation/native';
import ReadMoreComponent from '../../../components/readMore';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { onShare } from '../../../constants/constant';
import VideoFullScreen from '../../publicFeed/videoFullscreen';
import ContextMenu from 'react-native-context-menu-view';
import SocialReportComponent from '../../../components/SocialReportComponent';
import { socialPostView } from '../../../redux/actions/socialActions';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const Post = ({
    item,
    index,
    mute,
    setMute,
    currentIndex,
    toggleLike,
    toggleConnect,
    onComment,
    onPress,
    SetViewableItem
}) => {
    // const { post, toggleLike, toggleFollow, onItemClicked, isFollowHidden } = props;
    const authUser = useSelector(({ auth }) => auth.data);
    const [paused, setPaused] = useState(false);
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(1);
    const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
    const [isLoading, setIsLoading] = useState(true);
    const [combineStyles, setCombineStyles] = useState({});

    const [modalVisible, setModalVisible] = useState(false);
    const [showConfirmReport, setShowConfirmReport] = useState(false);
    const [reportObject, setReportObject] = useState();
    const playerRef = useRef();

    const SocialPostsRef = useRef();
    const [isViewed, setViewed] = useState(false);

    useEffect(() => {
        setViewed(false)
        SocialPostsRef.current = true;
        return () => SocialPostsRef.current = false;
    }, [currentIndex]);

    useEffect(() => {
      let subscription=  AppState.addEventListener('change', handleAppStateChange);
        return () => {
            subscription.remove();
        }
    
      }, [])
    
      const handleAppStateChange = (nextAppState) => {
        console.log('nextAppState--------------', nextAppState)
        if (nextAppState === 'active') {
            SocialPostsRef.current = true;
            console.log('SocialPostsRef--3--',SocialPostsRef);
          }
          else if (nextAppState === 'inactive') {
            console.log('the app is inactive closed for post screen');
            SocialPostsRef.current = false;
            console.log('SocialPostsRef---mute false----',SocialPostsRef);
          }
      else if (nextAppState === 'background') {
          console.log('the app is closed for post screen');
          SocialPostsRef.current = false;
          console.log('SocialPostsRef---mute false----',SocialPostsRef);
        }
      }

    useEffect(() => {
        return () => {
            //  if(playerRef)
            //playerRef.pause();
            if (SetViewableItem) {
                SetViewableItem(-1)
            }
        }
    }, []);


    const isFollowHidden =
        item.is_request == 2
            ? true
            : item.is_request === 3
                ? false
                : authUser.user_id === item.user_id;
    //item.is_request === 0? false :

    // if (index === currentIndex) {
    //     console.log('mute', mute)
    //     console.log('post item', item)
    // }

    const onHeartClicked = () => {
        toggleLike(item, index);
    };

    const onFollowClicked = () => {
        item?.is_request != 1 &&   toggleConnect(item);
    };
    const onCommentClicked = () => {

        console.log('onCommentClicked', item.post);
        onComment(item);
    };
    const onLoad = data => {
        setDuration(Math.round(data.duration));
        setIsLoading(false);
        // console.log('data>>>>>>>>>>',
        //     PixelRatio.getPixelSizeForLayoutSize(windowHeight) / data.naturalSize.height,
        //     PixelRatio.getPixelSizeForLayoutSize(windowWidth) / data.naturalSize.width
        // )
        const combineStyles = StyleSheet.flatten([
            styles.backgroundVideo,
            {
                transform: [
                    {
                        scaleY:
                            PixelRatio.getPixelSizeForLayoutSize(windowHeight) /
                            data.naturalSize.height,
                    },
                    {
                        scaleX:
                            PixelRatio.getPixelSizeForLayoutSize(windowWidth) /
                            data.naturalSize.width,
                    },
                ],
            },
        ]);
        setCombineStyles(combineStyles);
    };
    const onPaused = newState => {
        setPaused(!paused);
        setPlayerState(newState);
    };

    const onProgress = data => {
        if (!isLoading) {
            setCurrentTime(data.currentTime);
        }
        if (data.currentTime > 3 && !isViewed) {
            setViewed(true)
            console.log('data.currentTime', data.currentTime)
            const param = {
                post_id: item.post_id,
                user_id: authUser.user_id,
                //is_request: 1
            }
            console.log('param', param)
            dispatch(socialPostView(param, authUser.token))
                .then((res) => {
                    console.log('res.data', res)
                    if (res.status === 200) {
                        //ShowToast(res.message)
                    }
                }).catch((error) => {
                    console.log('res.error', error)
                })
        }

        // socialPostView
    };

    const clickItem = () => {
        console.log('setMute(!mute)', mute);
        setMute(!mute);
        //     onItemClicked(post);
    };

    // if (index === currentIndex)
    //     console.log('item', item)


    const onCallback = (item, msg) => {
        console.log('onCallback item', item)
        console.log('reportObject', reportObject)
        setReportObject(item)
        setModalVisible(false)
        setShowConfirmReport(true)
        setTimeout(() => {
            ShowToast(msg)
        }, 1000);
    }
    const onSubmitReport = (item) => {
        setReportObject(undefined)
        setShowConfirmReport(false)
    }


    // console.log('mute', mute)
    //console.log('index === currentIndex', index,  currentIndex)
    // console.log('index === currentIndex', index === currentIndex, item.post)

    const renderPostContent = () => {
        const imageHeight = Platform.OS === 'ios' ? 25 : 18;
        const videoSrc =
            Platform.OS === 'ios'
                ? { uri: convertToProxyURL(item.post) }
                : { uri: convertToProxyURL(item.post) };
        if (!isVideo(item.post)) {
            //item.post_type === 1
            return (
                <View style={[styles.listItemBody]}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.videoOverlay}
                        onPress={() => {
                            //  setModalVisible(!modalVisible)
                            console.log('social-post-detail item', item)
                            if (onPress) {
                                onPress()
                            } else {
                                navigation.navigate('social-post-detail', {
                                    itemId: item.post_id,
                                    item, item
                                })
                            }


                        }}
                    >
                        <FastImage
                            style={[
                                styles.listItemImage,
                                {
                                    flex: 1,
                                },
                            ]}
                            source={{
                                uri: item.post ? item.post : '',
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.videoOverlay}
                        onPress={() => {
                            navigation.navigate('social-post-detail', {
                                itemId: item.user_id,
                                item, item
                            })
                        }}
                    /> */}
                </View>
            );
        }
        // if (item.post_type === 2) {
        if (isVideo(item.post)) {
            //  console.log('item post_type', item)
            if (Platform.OS === 'ios') {
                return (
                    <View style={styles.listItemBody}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.videoOverlay}
                            onPress={() => {
                                console.log('social-post-detail item', item)
                                if (onPress) {
                                    onPress()
                                } else {
                                    //SocialPostsRef.current = false;
                                    SetViewableItem(-1)
                                    navigation.navigate('social-post-detail', {
                                        itemId: item.post_id,
                                        item, item
                                    })
                                }
                            }}
                        >
                            <Video
                                playerRef={playerRef}
                                source={videoSrc}
                                style={styles.videoElement}
                                // shouldPlay
                                onLoad={onLoad}
                                //onError={onError}
                                isLoading={isLoading}
                                onProgress={onProgress}
                                muted={SocialPostsRef.current ? mute : true}
                                resizeMode={'cover'}
                                paused={index === currentIndex ? false : true}
                            // allowsExternalPlayback={false}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={clickItem}
                            style={[
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                    width: wp(9),
                                    height: wp(9),
                                    backgroundColor: '#696969',
                                    borderRadius: 45,
                                    marginRight: 5,
                                    bottom: 10,
                                    right: 10,
                                    opacity: 0.7,
                                    position: 'absolute',
                                },
                            ]}
                        >
                            <Image
                                source={mute ? iconMute : iconVolume}
                                height={imageHeight}
                                width={imageHeight}
                                style={{
                                    height: imageHeight,
                                    width: imageHeight,
                                    tintColor: '#FFF',
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <View style={styles.listItemBody}>
                        {/* <VideoPlayer
                            autoplay
                            repeat
                            paused={index === currentIndex ? false : true}
                            muted={mute}
                            showOnStart={false}
                            style={styles.videoElement}
                            source={{ uri: item.post }}
                            volume={mute ? 0 : 1}
                        /> */}
                        <TouchableOpacity
                            style={styles.videoOverlay}
                            onPress={() => {
                                // setModalVisible(!modalVisible)
                                if (onPress) {
                                    onPress()
                                } else {
                                    navigation.navigate('social-post-detail', {
                                        itemId: item.post_id,
                                        item, item
                                    })
                                }
                            }}
                        >
                            <Video
                                playerRef={playerRef}
                                source={videoSrc}
                                style={styles.videoElement}
                                //shouldPlay
                                onLoad={onLoad}
                                //onError={onError}
                                isLoading={isLoading}
                                onProgress={onProgress}
                                muted={mute}
                                resizeMode={'cover'}
                                paused={index === currentIndex ? false : true}
                                allowsExternalPlayback={false}
                            />
                        </TouchableOpacity>
                        {isLoading ? (
                            <View style={[styles.loading, { position: 'absolute' }]}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        ) : null}

                        <TouchableOpacity
                            onPress={clickItem}
                            style={[
                                {
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 30,
                                    width: wp(9),
                                    height: wp(9),
                                    backgroundColor: '#696969',
                                    borderRadius: 45,
                                    marginRight: 5,
                                    bottom: 10,
                                    right: 10,
                                    opacity: 0.7,
                                    position: 'absolute',
                                },
                            ]}
                        >
                            <Image
                                source={mute ? iconMute : iconVolume}
                                height={imageHeight}
                                width={imageHeight}
                                style={{ height: imageHeight, width: imageHeight }}
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.videoOverlay}
                            // onPress={() => {
                            //     navigation.navigate('social-post-detail', {
                            //         itemId: item.post_id,
                            //         item, item
                            //     })
                            // }}
                        /> */}
                    </View>
                );
            }
        }
        return <></>;
    };
    // console.log('renderPostContent item', item.is_like)
    return (
        <View
            style={styles.listItem}
        //onPress={clickItem}
        >
            <View style={styles.listItemHeader}>
                <View
                    style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        onPress={() => {
                            SetViewableItem(-1)
                            navigation.navigate('social-profile', {
                                user_id: item.user_id,
                                item: item,
                            });
                        }}
                    >
                        <View style={styles.listItemAuthorAvatarContainer}>
                            <FastImage
                                style={styles.listItemAuthorAvatar}
                                source={item.profile_pic ? {
                                    uri: item.profile_pic ? item.profile_pic : '',
                                    priority: FastImage.priority.normal,
                                } : iconDefaultUser}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </View>
                        <Text style={[styles.listItemAuthorName, { textAlign: 'left' }]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    {!isFollowHidden && (
                        <>
                            <View style={styles.listItemDot}></View>
                            <TouchableOpacity onPress={onFollowClicked}>
                                <Text style={[styles.listItemFollow, { textAlign: 'left' }]}>
                                    {item?.is_request == 2 ? "": item?.is_request == 1 ? t("common:requested") : t("common:connect")}
                                </Text>
                            </TouchableOpacity>

                        </>
                    )}
                    {
                        authUser.user_id === item.user_id ? null : <ContextMenu
                            actions={[{ title: t("common:report") },]} // { title: "Report" }
                            dropdownMenuMode={true}
                            onPress={(e) => {

                                setModalVisible(true)
                            }}
                        >
                            <FastImage
                                style={[styles.image_small, {
                                    width: wp(6),
                                    height: wp(6),
                                    marginLeft: wp(1),
                                }]}
                                source={iconDots}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                        </ContextMenu>
                    }

                </View>
            </View>

            {renderPostContent()}

            <View style={[styles.listItemHeader, { padding: 0 }]}>
                <View style={{ flex: 1 }}>
                    <View style={[styles.listItemFooter, {}]}>
                        <TouchableOpacity onPress={onHeartClicked}>
                            <Image
                                style={[
                                    styles.listItemFooterImage,
                                    styles.gap,
                                    { tintColor: item.is_like ? 'red' : COLORS.primary },
                                ]}
                                source={item.is_like ? iconHeartFill : iconHeart}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onCommentClicked}>
                            <Image
                                style={[
                                    styles.listItemFooterImage,
                                    styles.gap2,
                                    { tintColor: COLORS.primary },
                                ]}
                                source={iconChatBubble}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                const lastPath = `SocialPost/${item.post_id}`;
                                console.log('lastPath', lastPath)
                                onShare(item.description ? item.description.length > 20 ? item.description.slice(0, 20) +"..." : item.description : item.name , lastPath);
                            }}
                        >
                            <Image
                                style={[
                                    styles.listItemFooterImage,
                                    { tintColor: COLORS.primary },
                                ]}
                                source={share}
                            />
                        </TouchableOpacity>
                        {
                            isVideo(item.post) ? <Text
                                style={[
                                    styles.listItemFollow,
                                    {
                                        minWidth: Platform.OS === 'ios' ? 40 : 30,
                                        textAlign: 'center',
                                        marginLeft: 5,
                                    },
                                ]}
                            >{`${item.view_count ? abbrNum(item.view_count, 2) : ''} ${item.view_count > 1 ? t("common:views") : item.view_count > 0 ? t("common:view") : ``}`}</Text>
                                : null
                        }


                    </View>
                    <View
                        style={[
                            styles.listItemFooter,
                            { paddingTop: 0, paddingBottom: 0, justifyContent: 'flex-start' },
                        ]}
                    >
                        <Text
                            onPress={() => {
                                navigation.navigate("liked-users", {
                                    post_id: item.post_id,
                                })
                            }
                            }
                            style={[
                                styles.listItemFollow,
                                {
                                    minWidth: Platform.OS === 'ios' ? 40 : 50,
                                    textAlign: 'center',
                                },
                            ]}
                        >{`${item.like_count} `}</Text>
                        <Text
                            style={[
                                styles.listItemFollow,
                                {
                                    minWidth: Platform.OS === 'ios' ? 40 : 30,
                                    textAlign: 'center',
                                    marginLeft: 12,
                                },
                            ]}
                        >{`${item.comment_count ? item.comment_count : 0} `}</Text>
                    </View>
                    <View style={[styles.listItemFooter, {
                        paddingTop: 5,
                        paddingLeft: onPress ? 10 : 16,
                        width: onPress ? Dimensions.get("window").width : "100%",
                        alignItems: 'flex-start'
                    }]}>
                        {
                            onPress && item.description ? <Text style={[styles.listItemFollow, { color: COLORS.text, marginHorizontal: 10 }]}>
                                {item.description ? item.description : ''}
                            </Text> : item.description ? (
                                <ReadMoreComponent>{item.description}</ReadMoreComponent>
                            ) : null
                        }


                    </View>
                </View>

                <View
                    style={{
                        //position: 'absolute',
                        paddingTop: 5,
                        marginRight: 10,
                        display: 'flex',
                        alignSelf: 'flex-start',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        //    backgroundColor:"#000"
                    }}
                >
                    <Text
                        style={[
                            styles.ctime,
                            {
                                alignSelf: 'center',
                                color: COLORS.text,
                                marginBottom: 0,
                                fontWeight: '400',
                            },
                        ]}
                    >
                        {moment(item.created_at).format(DATE_FORMATE_12)}
                    </Text>
                </View>
            </View>

            {
                modalVisible ? <SocialReportComponent
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    onCallback={onCallback} data={item} /> : null
            }


        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        // borderBottomWidth: 1,
        // borderBottomColor: '#D3D3D3',
        // paddingBottom: 0
    },
    listItemHeader: {
        alignItems: 'center',
        flexDirection: 'row',
        padding: 8,
    },
    listItemAuthorAvatarContainer: {
        alignItems: 'center',
        borderRadius: 48 / 2,
        borderWidth: 0,
        borderColor: COLORS.white,
        display: 'flex',
        height: 45,
        justifyContent: 'center',
        marginRight: 12,
        width: 40,
    },
    listItemAuthorAvatar: {
        borderRadius: 38 / 2,
        height: 38,
        width: 38,
    },
    listItemAuthorName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 12,
        color: COLORS.text,
        flex: 1,
    },
    listItemDot: {
        backgroundColor: '#000',
        borderRadius: 4 / 2,
        height: 4,
        marginRight: 12,
        marginTop: 2,
        width: 4,
    },
    listItemFollow: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    listItemBody: {
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',

        //  maxHeight: windowWidth,
        //minWidth :windowWidth
    },
    listItemImage: {
        width: windowWidth,
        //aspectRatio: 1,
        // flex: 1,
    },
    videoElement: {
        // height: 300,
        flex: 1,
        width: windowWidth - 0,
    },
    videoOverlay: {
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent',
        right: 0,
        top: 0,
    },
    listItemFooter: {
        paddingTop: 8,
        paddingLeft: 16,
        flexDirection: 'row',
        backgroundColor: COLORS.secondary,
        alignItems: 'center',
    },
    listItemFooterImage: {
        width: 28,
        height: 28,
        marginHorizontal: 10,
        //  tintColor: COLORS.primary
    },
    gap: {
        marginRight: 12,
    },
    gap2: {
        marginRight: 8,
    },
    mediaControls: {
        width: '98%',
        height: '100%',
        // aspectRatio: 16 / 9,
        // aspectRatio: width/height,
        flex: 1,
        alignSelf:
            Platform.OS === 'android'
                ? windowHeight < 800
                    ? 'center'
                    : 'flex-start'
                : 'center',
    },
    backgroundVideo: {
        //   height: '90%',
        // width: '100%',
        aspectRatio: 1,
        //aspectRatio: width/height,
        width: '90%',
        // aspectRatio: 16 / 9,
    },
});

export default Post;
