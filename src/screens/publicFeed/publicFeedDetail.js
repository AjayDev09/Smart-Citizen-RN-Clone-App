import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Share, TextInput, useWindowDimensions, ActivityIndicator, Alert, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../theme'
import CustomInput from '../../components/customInput'
import { attach, dislike, emoji, iconDefaultUser, like, send_message, share, video_image } from '../../constants/images'
import { useNavigation } from '@react-navigation/native'
import { ImageBackground } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { getPublicFeedCommentList, getPublicFeedComments, postFeedComment, postFeedCommentLike, postFeedDetails, postFeedLike, publicFeedReport } from '../../redux/actions/feedActions'
import Toast from 'react-native-simple-toast';
import HTMLView from 'react-native-htmlview';
import ShareComponent from '../share'
import { DATE_FORMATE_24, IsRightOrLeft, drawImageScaled, getItemByLngAR, isVideo, nFormatter } from '../../utils/common'
import CustomVideoPlayer from '../../components/customVideoPlayer'
import VideoFullScreen from './videoFullscreen'
import EmojiPicker from 'rn-emoji-keyboard'
import Orientation from 'react-native-orientation-locker'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ReadMoreComponent from '../../components/readMore'
import moment from 'moment'
import { createFileUriFromContentUri, htmlStylesheet, onShare } from '../../constants/constant'
import { launchImageLibrary } from 'react-native-image-picker'
import CustomUpload from '../../components/customUpload'
import FastImage from 'react-native-fast-image'
import { removeCommentApi, ReportApi } from '../../redux/actions/settingsActions'
import ReportPopup from '../../components/ReportPopup'
import EmptyListComponent from '../../components/EmptyListComponent'
import CustomPDFView from '../../components/customPDFView'

const { height, width } = Dimensions.get('window');


const LIMIT = 10
const PublicFeedDetail = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { itemId, articleDeepLinkId, feedLikePre } = route.params;
    //const offset = 0

    const resetData = useRef(false);
    const PublicFeedDetailRef = useRef();
    const [offset, seOffset] = useState(0)
    const [feedComments, setFeedComments] = useState([])
    const [publicFeed, sePublicFeed] = useState()

    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)
    const [IsButtonClick, setIsButtonClick] = useState(false)

    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const item = publicFeed

    // console.log('publicFeed.images', publicFeed.images)

    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data

    useEffect(() => {
        if (articleDeepLinkId) {
            // console.log('articleDeepLinkId', articleDeepLinkId)
        }
        // console.log('articleDeepLinkId', articleDeepLinkId)
    }, [])


    useEffect(() => {
        Orientation.lockToPortrait()
        Orientation.unlockAllOrientations();


        getFeedDetail(true)
        //  getAllComents()
    }, [itemId])

    useEffect(() => {
        PublicFeedDetailRef.current = true;
        return () => PublicFeedDetailRef.current = false;
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Screen was focused
            // Do something
            resetData.current = true;
            fetchResult()
            return;
        });

        return unsubscribe;
    }, [navigation]);

    const getAllComents = () => {
        const params = {
            public_feed_id: itemId,
            offset: offset,
            limit: LIMIT
        }
        setLoading(true)
        dispatch(getPublicFeedCommentList(params, authuser.token))
            .then((res) => {
                setLoading(false)
                setIsButtonClick(false)
                if (res.status === 200) {
                    console.log('res.data', res.data)
                    setFeedComments(res.data)
                }
            }).catch((error) => {
                setLoading(false)
            })
    }

    const fetchResult0 = () => {
        const params = {
            public_feed_id: itemId,
            offset: offset,
            limit: LIMIT
        }
        dispatch(getPublicFeedComments(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                if (res.status === 200) {
                    setFeedComments(feedComments.concat(res.data))
                    seOffset(offset + LIMIT)
                }
            }).catch((error) => {
            })
    };

    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            public_feed_id: itemId,
            offset: pageToReq,
            limit: LIMIT
        }
        console.log('params', params)
        if (PublicFeedDetailRef.current)
            dispatch(getPublicFeedComments(params, authuser.token))
                .then((res) => {
                    setIsButtonClick(false)
                    console.log('res.data', res.data)
                    if (PublicFeedDetailRef.current)
                        if (res.status === 200) {
                            if (resetData.current) {
                                setFeedComments(res.data)
                                seOffset(LIMIT)
                                resetData.current = false;
                            } else {
                                console.log('res.data', offset + LIMIT)
                                if (res.data && res.data.length > 0) {
                                    setFeedComments(feedComments.concat(res.data))
                                    seOffset(offset + LIMIT)
                                }

                            }
                        }
                }).catch((error) => {
                    console.log('res.error', error)
                })
    };

    const getFeedDetail = (load = false) => {
        if (load) {
            setLoad(true)
        }
        const params = {
            public_feed_id: itemId
        }
        //  setLoading(true)
        dispatch(postFeedDetails(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                console.log("res.data", res.data);
                if (res.status === 200) {
                    sePublicFeed(res.data)
                }
                setLoad(false)
            }).catch((error) => {
                setLoad(false)
            })
    }
    const onCloseShare = () => {
        setShowShare(false)
    };


    function renderNode(node, index, siblings, parent, defaultRenderer) {

        var height = 150, width = 150;
        if (node.name == 'img') {
            const a = node.attribs;
            const { src, style } = node.attribs;
            if (style) {
                for (let index = 0; index < style.split(';').length; index++) {
                    const element = style.split(';')[index];
                    const keyName = element.split(':')[0]
                    const value = element.split(':')[1]
                    if (keyName.trim() == 'width') {
                        width = value.replace("px", "")
                    }
                    if (keyName.trim() == 'height') {
                        height = value.replace("px", "")
                    }
                }
            }
            const imageH = height
            const imageW = width
            return (
                <View key={index} style={[style, { paddingTop: hp(1) }]}>
                    <FastImage
                        style={drawImageScaled(imageW, imageH)}
                        source={{
                            uri: a.src,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            );
        }
        if (node.name == 'a') {
            const { src, style } = node.attribs;
            const a = node.attribs;
            console.log('node.name pdf', a.href)

            const imageH = height
            const imageW = width
            return (
                <View key={index} style={[style, { paddingTop: hp(1), height: 300 }]}>
                    {/* <FastImage
                        style={drawImageScaled(imageW, imageH)}
                        source={{
                            uri: a.href,
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    /> */}

                    <CustomPDFView docUrl={a.href} />
                </View>
            );
        } else {

        }
        //console.log('node.name', node.name)
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalCommentVisible, setModalCommentVisible] = React.useState(false);
    const [modalReportVisible, setModalReportVisible] = React.useState(false);
    const [selectedReportItem, setSelectedReportItem] = React.useState(undefined);
    const [selectedImage, setselectedImage] = React.useState(0);
    const [isCommentImage, setCommentImage] = React.useState(false);

    const [photo, setPhoto] = useState(null);



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
                        <View style={{ height: 130 }}>
                            <CustomVideoPlayer videoUrl={item.image} selectedImage={index}
                                itemList={publicFeed.images} videoWidth={itemWidth} />
                        </View>
                        :
                        <FastImage
                            style={{ width: itemWidth, height: 130, }}
                            source={{
                                uri: item.image ? item.image : "",
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                }



            </TouchableOpacity>)
    }

    const PublicFeedHeader = () => {
        const [isEmojiOpen, setEmojiOpen] = useState(false)
        const [AddComment, setAddComment] = React.useState("")
        const handlePick = (emojiObject) => {
            console.log(emojiObject)
            let newArr = '';
            newArr = AddComment + emojiObject.emoji
            setAddComment(newArr)
        }

        const onChangeValue = (name, value) => {
            setAddComment(value)
        };

        const handleChoosePhoto = () => {
            const options = {
                maxWidth: 2000,
                maxHeight: 2000,
                selectionLimit: 1,
                mediaType: 'mixed',
                includeBase64: false,
                noData: false,
                saveToPhotos: true
            };

            launchImageLibrary(options, (response) => {
                if (response?.assets) {
                    console.log("launchImageLibrary >> " + JSON.stringify(response.assets[0].uri));
                    const image = response?.assets && response.assets[0];

                    console.log("url send >> " + response.assets[0].uri.replace('file://', ''));
                    // setUserState({ ...userState, business_logo: image });
                    setPhoto(image);
                    postComment(image)
                    // let newArr = [...AddComment];
                    // newArr[index] = (newArr[index] ? newArr[index] : '') + image.uri
                    // setAddComment(newArr)
                } else {
                    // setPhoto('');
                }
            });
        };
        const postComment = async (image) => {
            // const url = image ? getOriginalFilePath(image.uri, image.fileName) : ''
            // const url = image ? image.uri : ''
            const url = image ?
                Platform.OS === 'android' && image.type === 'video/mp4' ?
                    await createFileUriFromContentUri(image.uri) :
                    image.uri : ''
            // const params = {
            //     public_feed_id: itemId,
            //     comment: AddComment
            // }
            const params = {
                public_feed_id: itemId,
                comment: AddComment,
                image: image
            }
            const data = new FormData();
            const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
            Object.keys(params).forEach(key => {
                if (key === 'image') {
                    if (image) {
                        console.log('image', params[key])
                        data.append('image', {
                            name: fileName,
                            type: image.type,
                            uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : url,
                        });
                    } else {
                        data.append(key, params[key]);
                    }
                } else {
                    data.append(key, params[key]);
                }
            });
            console.log('data', JSON.stringify(data))
            setLoading(true)
            dispatch(postFeedComment(data, authuser.token))
                .then((res) => {
                    setLoading(false)
                    if (res.status === 200) {
                        // setAddComment("")
                        resetData.current = true
                        PublicFeedDetailRef.current = true
                        fetchResult()
                        // getFeedDetail()
                    }
                    Toast.show(res.message, Toast.SHORT)
                }).catch((error) => {
                    console.log('error', error)
                    setLoading(false)
                })
        }


        const feedLike = (isLike, itemId) => {
            console.log("item.feed_like_count", item.feed_like_count);
            if (feedLikePre) {
                feedLikePre(isLike, itemId)
                const count = isLike ? item.feed_like_count + 1 : item.feed_like_count - 1
                item.is_like = isLike ? 1 : 0
                item.feed_like_count = count
                setRefresh(!refresh)
                setIsButtonClick(false)
            } else {

                item.is_like = isLike ? 1 : 0
                const params = {
                    public_feed_id: itemId,
                    is_like: isLike ? 1 : 0,
                }

                //   console.log('postBlogLike', params)
                dispatch(postFeedLike(params, authuser.token))
                    .then((res) => {
                        if (res.status === 200) {
                            //  getBlogs()
                            setIsButtonClick(false)
                            item.is_like = isLike ? 1 : 0
                            fetchResult()
                            getFeedDetail()
                        }
                        //  Toast.show(res.message, Toast.SHORT);
                        // console.log('AddComment res', res)
                    }).catch((error) => {
                        setIsButtonClick(false)
                        //  console.log('AddComment error', error.data && error.data.message)
                    })
            }
        }
        const onReportPublicFeed = (params) => {
            Alert.alert(
                t("common:report"),
                t("common:reportMessage"),
                [
                    {
                        text: (t("common:yes")), onPress: () => {
                            setTimeout(() => {
                                dispatch(publicFeedReport(params, authuser.token))
                                    .then((res) => {
                                        if (res.status === 200) {
                                            Toast.show(res.message, Toast.SHORT);
                                            navigation.goBack()
                                        }
                                    }, 150);
                            }, 150);

                        }
                    },
                    {
                        text: (t("common:no")),
                        onPress: () => console.log("Cancel Pressed"),
                        // style: "cancel"
                    },
                ]
            );
        }

        // const public_feed_title = item ? i18n.language === 'he' ? item.public_feed_title_he : i18n.language === 'ar' ? item.public_feed_title_ab : item.public_feed_title : ""
        // const content = item ? i18n.language === 'he' ? item.content_he : i18n.language === 'ar' ? item.content_ab : item.content : ''


        const public_feed_title = getItemByLngAR(i18n.language, item, "public_feed_title")
        const content = getItemByLngAR(i18n.language, item, "content")

        const window = useWindowDimensions();
        const getItemLayout = (data, index) => ({
            length: window.width,
            offset: window.width * index,
            index,
        });

        const onViewRef = React.useRef((viewableItems) => {
            if (viewableItems?.changed[0]?.index || viewableItems?.changed[0]?.index == 0) {
                //updatePosition(viewableItems.changed[0].index);
            }
        });
        const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

        return (
            <View style={[styles.itemWrapper, { flexDirection: 'column' }]}>

                <View style={styles.itemInnerWrapper}>
                    <Text style={[styles.itemText, { fontSize: RFValue(18), fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", color: COLORS.textDark }]}>
                        {public_feed_title !== 'null' ? public_feed_title : ""}
                    </Text>
                    <Text style={[styles.itemText, {
                        fontSize: RFValue(13), color: COLORS.textDark,
                        textAlign: 'left', marginRight: wp(3), marginTop: hp(1)
                    }]}>
                        {item ? moment(item.updated_at).locale(i18n.language).format(DATE_FORMATE_24) : ''}
                    </Text>
                    <View style={{ marginTop: hp(1) }}>
                        {
                            content && content !== 'null' ? <HTMLView
                                value={content.replace(/\r?\n|\r/g, '')}
                                stylesheet={htmlStylesheet}
                                renderNode={renderNode}
                            /> : null
                        }
                    </View>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flex: 1,
                        marginTop: hp(0), marginBottom: hp(0), paddingHorizontal: wp(0)
                    }}>
                        <FlatList
                            style={{ margin: 0 }}
                            columnWrapperStyle={{
                                flex: 1,
                                justifyContent: "space-between",
                                // backgroundColor: '#000'
                            }}  // space them out evenly
                            numColumns={2}
                            data={item.images}
                            initialNumToRender={6}
                            onViewableItemsChanged={onViewRef.current}
                            viewabilityConfig={viewConfigRef.current}
                            // getItemLayout={getItemLayout}
                            renderItem={renderImagesItem}
                            keyExtractor={(item) => item.public_feed_image_id}
                        // snapToEnd={true}
                        // inverted={Platform.OS === 'ios' ? false : i18n.language === 'en' ? false : true}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', marginTop: Platform.OS === 'ios' ? hp(5) : hp(3), alignItems: 'center', }}>
                        <View style={[styles.msgWrapper, { flex: 1 }]}>
                            <TextInput
                                placeholder={t('common:addComment')}
                                style={{
                                    borderBottomWidth: 0, color: '#7f94c1', paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                                    display: 'flex', flex: 1,
                                    textAlign: IsRightOrLeft(i18n.language),
                                    fontSize: RFValue(14),
                                }}
                                keyboardType={'default'}
                                value={AddComment || ''}
                                onChangeText={(text) => onChangeValue("", text)}
                                placeholderTextColor={"#7f94c1"}
                            />
                            <TouchableOpacity style={styles.uploadwrapper} onPress={handleChoosePhoto}  >
                                <FastImage
                                    source={AddComment ? { uri: AddComment.uri } : attach}
                                    style={[styles.image, {
                                        height: 16, width: 16,
                                        // tintColor: COLORS.primary 
                                    }]}
                                    tintColor={COLORS.primary}
                                />
                            </TouchableOpacity>

                            {/* <CustomUpload AddComment={AddComment}  postComment={postComment}  /> */}
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: hp(1) }}>
                            <TouchableOpacity style={{ marginLeft: wp(2) }} //alignItems: 'center', justifyContent: 'center',
                                onPress={() => {
                                    if (AddComment.trim() !== "") {
                                        postComment(undefined)
                                    }
                                }}  >
                                <FastImage
                                    source={send_message}
                                    style={[styles.image_small, {
                                        width: wp(8),
                                        height: wp(8),
                                    }]}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        feedLike(true, item.public_feed_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        feedLike(false, item.public_feed_id)
                                    }
                                }}  >
                                <FastImage
                                    source={like}
                                    style={[styles.image_small, {
                                        marginLeft: wp(2),
                                        width: wp(6),
                                        height: wp(6),
                                        // marginBottom: wp(1),
                                        // tintColor: item.is_like === 1 ? COLORS.primary : COLORS.white
                                    }]}
                                    tintColor={item.is_like === 1 ? COLORS.primary : COLORS.white}
                                />
                                <Text style={[styles.textDark, { marginLeft: wp(3), }]}>
                                    {item.feed_like_count < 0 ? 0 : nFormatter(item.feed_like_count)}
                                </Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ marginLeft: wp(3), marginBottom: wp(1) }} onPress={() => {
                                setEmojiOpen(true)
                            }}>
                                <Image
                                    source={emoji}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                    }]}
                                />
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                style={{ // alignItems: 'center', justifyContent: 'center',
                                    marginLeft: wp(2)
                                }}
                                onPress={() => {
                                    const lastPath = `PublicFeed/${item.public_feed_id}`
                                    onShare(public_feed_title, lastPath)
                                    //onShare(item) 
                                }}  >
                                <FastImage
                                    source={share}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        // tintColor: COLORS.primary
                                    }]}
                                    tintColor={COLORS.primary}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={.5}
                        disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                            if (item.is_like !== 0) {
                                setIsButtonClick(true)
                                feedLike(false, item.public_feed_id)
                            }
                        }}>
                        <Image
                            source={dislike}
                            style={[styles.image_small, {

                                marginLeft: wp(3),
                                tintColor: item.is_like === 0 ? COLORS.primary : COLORS.white
                            }]}
                        />
                        <Text style={[styles.textDark, { marginLeft: wp(3), }]}>
                            {item.feed_unlike_count}
                        </Text>
                    </TouchableOpacity> */}


                            {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginEnd: "12%" }} onPress={() => {
                        //   const params = {
                        //     public_feed_id: item.public_feed_id,
                        //     report: "",
                        // }
                        //  setSelectedReportItem(params)
                        //  setModalReportVisible(true)
                        onReportPublicFeed(item.public_feed_id) 
                        }}  >
                        <Text style={[styles.itemText, { fontSize: RFValue(16), color: COLORS.textDark }]}>
                            {t('common:report')}
                        </Text>
                    </TouchableOpacity> */}
                        </View>
                    </View>


                </View>

                {
                    modalVisible && publicFeed.images ? <VideoFullScreen
                        modalVisible={modalVisible} setModalVisible={setModalVisible}
                        selectedImage={selectedImage}
                        itemList={publicFeed.images} updatePosition={() => {
                            setselectedImage(0)
                        }} /> : null
                }

                {
                    modalCommentVisible && isCommentImage ? <VideoFullScreen
                        modalVisible={modalCommentVisible} setModalVisible={setModalCommentVisible}
                        selectedImage={selectedImage}
                        itemList={feedComments} updatePosition={() => {
                            setselectedImage(0)
                        }} /> : null
                }
                {
                    modalReportVisible ? <ReportPopup
                        modalVisible={modalReportVisible} setModalVisible={setModalReportVisible}
                        onCallBack={onReportPublicFeed} onCallBackComment={onReportComment} params={selectedReportItem} /> : null
                }

                <EmojiPicker onEmojiSelected={(emojiObject) => handlePick(emojiObject)} open={isEmojiOpen} onClose={() => setEmojiOpen(false)} />
            </View>
        )
    }
    const onReportComment = (comment_id) => {

        const params = {
            public_feed_comment_id: comment_id,
            is_remove_comment: 1
        }
        Alert.alert(
            t("common:report"),
            t("common:reportMessage"),
            [
                {
                    text: (t("common:yes")), onPress: () => {
                        setTimeout(() => {
                            dispatch(removeCommentApi(params, authuser.token))
                                .then((res) => {
                                    if (res.status === 200) {
                                        const feed = feedComments.filter((item) => item?.public_feed_comment_id !== comment_id)
                                        setFeedComments(feed)
                                        console.log("pressed");
                                        Toast.show(res.message, Toast.SHORT)
                                        // resetData.current = true
                                        // PublicFeedDetailRef.current = true
                                        // fetchResult()
                                        // getFeedDetail()
                                    }
                                }, 150);
                        }, 150);

                    }
                },
                {
                    text: (t("common:no")),
                    onPress: () => console.log("Cancel Pressed"),
                    // style: "cancel"
                },
            ]
        );
    }


    const recentCommentItem = ({ item, index }) => {
        const postCommentLike = (isLike, comment_id) => {
            const params = {
                public_feed_id: itemId,
                is_like: isLike ? 1 : 0,
                public_feed_comment_id: comment_id
            }
            dispatch(postFeedCommentLike(params, authuser.token))
                .then((res) => {
                    setIsButtonClick(false)
                    console.log('AddComment res', res)
                    if (res.status === 200) {
                        // resetData.current = true
                        // PublicFeedDetailRef.current = true
                        // fetchResult()
                        const itemList = [...feedComments];
                        const itemBlog = itemList.find(a => a.public_feed_comment_id === comment_id);
                        itemBlog.is_like = isLike ? 1 : 0;
                        itemBlog.comment_like_count = isLike ? itemBlog.comment_like_count + 1 : itemBlog.comment_like_count - 1
                        // console.log('itemBlog', itemBlog)
                        setFeedComments(itemList);
                    }
                }).catch((error) => {
                    setIsButtonClick(false)
                    //  console.log('AddComment error', error.data && error.data.message)
                })
        }

        return (<View style={[styles.commentWrapper, { marginTop: 10, marginBottom: 5, paddingBottom: 15, flexDirection: 'column' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: wp(1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.uploadwrapper}   >
                            {/* <FastImage style={{
                                height: 30, width: 30,
                                borderRadius: item.profile_pic ? 45 : 0,
                                marginRight: wp(2)
                            }}
                                source={{
                                    uri: item.profile_pic ? item.profile_pic : "",
                                    //headers: { Authorization: 'someAuthToken' },
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            /> */}
                            {
                                item.profile_pic ? <FastImage style={{
                                    height: 30, width: 30,
                                    borderRadius: item.profile_pic ? 45 : 0,
                                    marginRight: wp(2)
                                }}
                                    source={{
                                        uri: item.profile_pic ? item.profile_pic : "",
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                /> : <FastImage style={[styles.image_small, {
                                    height: 30,
                                    width: 30,
                                    borderRadius: 0,
                                    marginTop: 0,
                                    padding: 0,
                                    marginRight: wp(2)
                                }]}
                                    source={iconDefaultUser}
                                    //onError={iconDefaultUser}
                                    resizeMode={FastImage.resizeMode.contain}
                                />
                            }
                        </TouchableOpacity>

                        <Text style={[styles.itemText, { flex: 1, fontSize: RFValue(18), color: COLORS.primary, textAlign: 'left' }]}>
                            {item.name}
                        </Text>

                        <Text style={[styles.itemText, {
                            fontSize: RFValue(13), color: COLORS.textDark,

                            textAlign: 'left', marginRight: wp(3)
                        }]}>
                            {moment(item.updated_at).locale(i18n.language).format(DATE_FORMATE_24)}
                        </Text>

                    </View>
                    {item.comment && item.comment !== 'undefined' ?
                        <ReadMoreComponent customStyle={{
                            marginLeft: wp(10)
                        }}>
                            {item.comment}
                        </ReadMoreComponent> : null}

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginLeft: wp(10) }}>
                        {
                            item.image && item.image !== 'null' && item.image !== 'undefined' && isVideo(item.image) ?
                                <View style={{ width: 70, height: 50, marginTop: hp(0) }}>
                                    <CustomVideoPlayer videoUrl={item.image} selectedImage={index}
                                        itemList={feedComments} videoHight={50} videoWidth={70} />
                                </View> :
                                item.image && item.image !== 'null' && item.image !== 'undefined' ?
                                    <TouchableOpacity style={{ marginTop: hp(1) }} onPress={() => {
                                        setModalCommentVisible(true)
                                        setCommentImage(true)
                                        setselectedImage(index)
                                    }}  >
                                        <FastImage
                                            style={{ width: 70, height: 50 }}
                                            source={{
                                                uri: item.image ? item.image : "",
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </TouchableOpacity> : <View />
                        }
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end', alignSelf: 'flex-end', marginRight: 10, marginTop: 5 }}>
                            <TouchableOpacity style={{ alignItems: 'flex-end', marginEnd: 10 }}
                                onPress={() => {
                                    onReportComment(item.public_feed_comment_id)
                                }}  >
                                <Text style={[styles.itemText, { fontSize: RFValue(16), color: COLORS.textDark }]}>
                                    {t('common:report')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        postCommentLike(true, item.public_feed_comment_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        postCommentLike(false, item.public_feed_comment_id)
                                    }
                                }}  >
                                <Text style={[styles.textDark, { marginBottom: 5 }]}>
                                    {item.comment_like_count < 0 ? 0 : nFormatter(item.comment_like_count)}
                                </Text>
                                <Image
                                    source={like}
                                    style={[styles.image_small, {
                                        marginLeft: 5,
                                        tintColor: item.is_like === 1 ? COLORS.primary : COLORS.white
                                    }]}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                                    if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        postCommentLike(false, item.public_feed_comment_id)
                                    }
                                }}  >
                                <Text style={[styles.textDark, { marginBottom: 5 }]}>
                                    {item.comment_unlike_count < 0 ? 0 : item.comment_unlike_count}
                                </Text>
                                <Image
                                    source={dislike}
                                    style={[styles.image_small, {
                                        marginLeft: 5,
                                        tintColor: item.is_like === 0 ? COLORS.primary : COLORS.white
                                    }]}
                                />
                            </TouchableOpacity> */}
                        </View>

                    </View>

                </View>

            </View>
        </View>)
    }

    const ListHeaderComponent = () => {
        return <View>
            {item ? <PublicFeedHeader /> : null}
            <View style={styles.divider} />

            <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                <Text style={[styles.itemText, { marginLeft: 15, fontSize: RFValue(21), color: COLORS.textDark, fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold" }]}>
                    {t("common:recentComments")}
                </Text>
            </View>
        </View>
    }


    return (
        <SafeAreaView style={styles.container}>
            {!load ?
                <FlatList
                    data={feedComments}
                    renderItem={recentCommentItem}
                    initialNumToRender={10}
                    keyExtractor={(item) => item.public_feed_comment_id}
                    ListHeaderComponent={ListHeaderComponent}
                    ListFooterComponent={<EmptyListComponent data={feedComments} msg={t('error:recent_comment_not_found')} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                // onEndReached={fetchResult}
                // onEndReachedThreshold={0.7}
                /> : <View style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            }
            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare}
                shareData={shareData}
                shareMessage={shareData.public_feed_title}
                token={authuser.token} shareKey={'public_feed_id'} shareType={1} /> : null}

            {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </SafeAreaView>
    )
}

export default PublicFeedDetail


const stylesheet = StyleSheet.create({
    h1: {
        fontSize: RFValue(22),
        textAlign: 'left',
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
    },
    h2: {
        fontSize: RFValue(18),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        textAlign: 'left',
    },
    p: {
        fontSize: RFValue(12),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        textAlign: 'left',
    },
    ul: {
        fontSize: RFValue(12),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        textAlign: 'left',
    },
    strong: {
        fontSize: RFValue(12),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        textAlign: 'left',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
    },
    divider: {
        width: '100%',
        height: 2,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: COLORS.white,
    },
    image: {
        width: 50,
        height: 50,
        tintColor: COLORS.text,
        left: 0
    },
    image_small: {
        width: 20,
        height: 20,
        left: 0
    },
    itemWrapper: {
        flexDirection: 'row',
        paddingVertical: 5,
        paddingVertical: 5,
        paddingHorizontal: 5,
        alignItems: 'center',
        backgroundColor:  COLORS.cardBackgroundColor,
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 10
    },
    itemInnerWrapper: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 5,
        padding: 10,
        width: '100%',
        justifyContent: 'space-around'
    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
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
    commentWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 35,
        backgroundColor: "#9bbbdf",
    },
})