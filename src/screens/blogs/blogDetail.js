import {
    FlatList, Image, SafeAreaView,
    StyleSheet, Text, TouchableOpacity, View, Platform, TextInput, ActivityIndicator, Alert, Share, Dimensions
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { COLORS } from '../../theme'
import { attach, dislike, emoji, iconDefaultUser, like, send_message, share, } from '../../constants/images'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { getBlogCommentList, getBlogComments, postBlogComment, postBlogCommentLike, postBlogDetails, postBlogLike } from '../../redux/actions/blogActions'
import { useDispatch, useSelector } from 'react-redux'
import Toast from 'react-native-simple-toast';
import HTMLView from 'react-native-htmlview';
import { DATE_FORMATE_24, IsRightOrLeft, drawImageScaled, getItemByLngAR, isPDF, isVideo, nFormatter } from '../../utils/common'
import ShareComponent from '../share'
import EmojiPicker from 'rn-emoji-keyboard'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ReadMoreComponent from '../../components/readMore'
import moment from 'moment'
import { createFileUriFromContentUri, htmlStylesheet, onShare } from '../../constants/constant'
import VideoFullScreen from '../publicFeed/videoFullscreen'
import { launchImageLibrary } from 'react-native-image-picker'
import CustomVideoPlayer from '../../components/customVideoPlayer'
import FastImage from 'react-native-fast-image'
import { removeCommentApi } from '../../redux/actions/settingsActions'
import { publicFeedReport } from '../../redux/actions/feedActions'
import EmptyListComponent from '../../components/EmptyListComponent'
import { useRef } from 'react'
import CustomPDFView from '../../components/customPDFView'

const { height, width } = Dimensions.get('window');
const LIMIT = 10
const BlogDetail = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const { itemId, blogLikePrev } = route.params;

    const [blogComments, setblogComments] = useState([])
    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)

    const [IsButtonClick, setIsButtonClick] = useState(false)

    const [loading, setLoading] = useState(false);
    const [load, setLoad] = useState(false)

    const [blogItem, setBlogitem] = useState([])
    const [refresh, setRefresh] = useState(false)
    const item = blogItem


    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data

    const resetData = useRef(false);
    const [offset, setOffset] = useState(0)

    useEffect(() => {
        // fetchResult()
        // getBlogDetail()
    }, [itemId])




    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // resetData.current = true;
            fetchResult()
            // getAllComents()
            getBlogDetail(true)
        });
        return unsubscribe;
    }, [navigation]);


    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            blog_id: itemId,
            offset: pageToReq,
            limit: LIMIT
        }

        dispatch(getBlogComments(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                if (res.status === 200) {
                    console.log('resr getBlogs', res.data)
                    if (resetData.current) {
                        setblogComments(res?.data)
                        setOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        console.log('res.data', offset + LIMIT)
                        if (res?.data && res?.data?.length > 0) {
                            setblogComments(blogComments.concat(res?.data))
                            setOffset(offset + LIMIT)
                        }
                    }

                }
            }).catch((error) => {
                setIsButtonClick(false)
                console.log('res.error', error)
            })
    };

    const getBlogDetail = (load = false) => {
        if (load) {
            setLoad(true)
        }
        const params = {
            blog_id: itemId
        }
        dispatch(postBlogDetails(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                if (res.status === 200) {

                    setBlogitem(res.data)
                }
                setLoad(false)
            }).catch((error) => {
                setLoad(false)
            })
    }


    const onCloseShare = () => {
        setShowShare(false)
    };



    const [photo, setPhoto] = useState(null);


    const renderImagesItem = ({ item, index }) => {
        const itemWidth = (width - 40) / 2;
        return (
            <TouchableOpacity style={{
                maxWidth: itemWidth,
                // height: item.image.toString().endsWith("mp4") ||
                //     item.image.toString().endsWith("mov") ? 130 : 130,
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
                                itemList={blogItem?.images} videoWidth={itemWidth} />
                        </View>
                        :
                        <FastImage
                            style={{ width: itemWidth, height: 130, }}
                            source={{
                                uri: item?.image ? item?.image : "",
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />

                }



            </TouchableOpacity>)
    }


    const BlogHeader = () => {
        const [isEmojiOpen, setEmojiOpen] = useState(false)
        const [AddComment, setAddComment] = React.useState("")


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
                    const image = response?.assets && response.assets[0];
                    console.log('image', image)
                    setPhoto(image);
                    postComment(image)
                } else {
                }
            });
        };
        const postComment = async (image) => {
            const url = image ?
                Platform.OS === 'android' && image.type === 'video/mp4' ?
                    await createFileUriFromContentUri(image.uri) :
                    image.uri : ''
            const params = {
                blog_id: itemId,
                comment: AddComment,
                image: image
            }
            const data = new FormData();
            const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
            Object.keys(params).forEach(key => {
                if (key === 'image') {
                    console.log('key1231212', image)
                    if (image) {

                        data.append('image', {
                            name: fileName,
                            type: image.type,
                            uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : url,
                        });
                        console.log('image Data', data)
                    } else {
                        data.append(key, params[key]);
                    }
                } else {
                    data.append(key, params[key]);
                }
            });
            console.log('data', JSON.stringify(data))
            setLoading(true)
            dispatch(postBlogComment(data, authuser.token))
                .then((res) => {
                    setLoading(false)
                    if (res.status === 200) {
                        setAddComment("")
                        resetData.current = true
                        fetchResult()
                    }
                    Toast.show(res?.message, Toast.SHORT)
                }).catch((error) => {
                    setLoading(false)
                    console.log('error.data', error)
                })
        }
        const onChangeValue = (name, value) => {
            setAddComment(value)
        };
        const handlePick = (emojiObject) => {
            console.log(emojiObject)
            let newArr = '';
            newArr = AddComment + emojiObject.emoji
            setAddComment(newArr)
        }


        const blogLike = (isLike, itemId) => {
            if (blogLikePrev) {
                blogLikePrev(isLike, itemId)
                // const count = item.blog_like_count

                const count = isLike ? item.blog_like_count + 1 : item.blog_like_count - 1
                item.is_like = isLike ? 1 : 0
                item.blog_like_count = count
                setRefresh(!refresh)


                setIsButtonClick(false)
            } else {
                const params = {
                    blog_id: itemId,
                    is_like: isLike ? 1 : 0,
                }
                dispatch(postBlogLike(params, authuser.token))
                    .then((res) => {
                        if (res.status === 200) {
                            fetchResult()
                            getBlogDetail()
                        }
                        setIsButtonClick(false)
                        //Toast.show(res.message, Toast.SHORT);
                    }).catch((error) => {
                        setIsButtonClick(false)
                    })

            }
        }

        const onReportBlog = (itemId) => {
            const params = {
                blog_id: itemId,
                report: "",
            }

            Alert.alert(
                t("common:report"),
                t("common:reportMessage"),
                [
                    {
                        text: (t("common:cancel")),
                        onPress: () => console.log("Cancel Pressed"),
                        // style: "cancel"
                    },
                    {
                        text: (t("common:report")), onPress: () => {
                            setTimeout(() => {
                                dispatch(postBlogReport(params, authuser.token))
                                    .then((res) => {
                                        if (res.status === 200) {
                                            navigation.goBack()
                                        }
                                    }, 150);
                            }, 150);

                        }
                    }
                ]
            );
        }

        const renderNode = useCallback((node, index, siblings, parent, defaultRenderer) => {
            if (node.name == 'img') {
                const { src, style } = node.attribs;
                //  const imageHeight = height || 300;
                const a = node.attribs;
                var height = 150, width = 150;
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
                    <View key={index} style={style}>
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
                // console.log('node.name pdf', a.href)
                const imageH = height
                const imageW = width
                if (isPDF(a.href)) {
                    return (
                        <View key={index} style={[style, { paddingTop: hp(1), height: 300 }]}>
                            <CustomPDFView docUrl={a.href} />
                        </View>
                    );
                }
                // else if (isVideo(a.href)) {
                //     console.log('isVideo a.href', a.href)
                //     return (<TouchableOpacity key={index} style={{ height: 130 }}>
                //         <CustomVideoPlayer videoUrl={a.href} selectedImage={index}
                //                         itemList={[a.href]} videoHight={50} videoWidth={70} />
                //     </TouchableOpacity>)
                // }
            } else {

            }
        }, [])



        // const blog_title = item ? i18n.language === 'he' ? item.blog_title_he : i18n.language === 'ar' ? item.blog_title_ab : item.blog_title : ''
        // const blog_content = item ? i18n.language === 'he' ? item.blog_content_he : i18n.language === 'ar' ? item.blog_content_ab : item.blog_content : ''
        // const category_name = item ? i18n.language === 'he' ? item.category_name_he : i18n.language === 'ar' ? item.category_name_ab : item.category_name : ''

        const blog_title = getItemByLngAR(i18n.language, item, "blog_title")
        const category_name = getItemByLngAR(i18n.language, item, "category_name")
        const blog_content = getItemByLngAR(i18n.language, item, "blog_content")


        const onViewRef = React.useRef((viewableItems) => {
            if (viewableItems?.changed[0]?.index || viewableItems?.changed[0]?.index == 0) {
            }
        });
        const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });
        //  console.log('blog  item', item.images)
        return (
            <View style={[styles.itemWrapper, { flexDirection: 'column' }]}>

                <View style={styles.itemInnerWrapper}>
                    <Text style={[styles.itemText, { fontSize: RFValue(18), fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", color: COLORS.textDark }]}>
                        {blog_title !== 'null' ? blog_title : ""}
                    </Text>
                    <Text style={[styles.itemText, { fontSize: RFValue(12), marginTop: hp(1), fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", color: COLORS.textDark }]}>
                        {t('common:category') + " : " + (category_name ? category_name : "")}
                    </Text>
                    <Text style={[styles.itemText, {
                        fontSize: RFValue(13), color: COLORS.textDark,
                        textAlign: 'left', marginRight: wp(3), marginTop: hp(1)
                    }]}>
                        {moment(item.updated_at).locale(i18n.language).format(DATE_FORMATE_24)}
                    </Text>
                    <View style={{ marginTop: hp(1) }}>
                        {
                            blog_content && blog_content !== 'null' ? <HTMLView
                                value={blog_content.replace(/\r?\n|\r/g, '')}
                                stylesheet={htmlStylesheet}
                                renderNode={renderNode}
                            /> : null
                        }
                    </View>
                    <View style={{
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
                            keyExtractor={(item, index) => index.toString()}
                        // snapToEnd={true}
                        // inverted={Platform.OS === 'ios' ? false : i18n.language === 'en' || i18n.language === 'ru' || i18n.language === 'fr' ? false : true}
                        />
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: hp(1) }}>
                        <View style={styles.msgWrapper}>
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
                        </View>


                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: hp(1) }}>
                            <TouchableOpacity style={{ marginLeft: wp(2) }}
                                onPress={() => {
                                    if (AddComment.trim() !== "") {
                                        postComment(undefined)
                                    }
                                }}  >
                                <FastImage
                                    source={send_message}
                                    style={[styles.image_small, {
                                        width: 30,
                                        height: 30,
                                    }]}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        blogLike(true, item.blog_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        blogLike(false, item.blog_id)
                                    }
                                }}  >
                                <FastImage
                                    source={like}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        marginLeft: wp(2),
                                        // marginTop: hp(1),
                                        // marginBottom: hp(1),
                                        // tintColor: item.is_like === 1 ? COLORS.primary : COLORS.white
                                    }]}
                                    tintColor={item.is_like === 1 ? COLORS.primary : COLORS.white}
                                />
                                <Text style={[styles.textDark, { marginLeft: 10, }]}>
                                    {item.blog_like_count < 0 ? 0 : nFormatter(item.blog_like_count)}
                                </Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ marginBottom: 5 }} onPress={() => {
                                setEmojiOpen(true)
                            }}  >
                                <Image
                                    source={emoji}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        marginLeft: wp(3),
                                        // marginTop: hp(1),
                                        // marginBottom: hp(2),
                                        tintColor: COLORS.primary
                                    }]}
                                />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{ // alignItems: 'center', justifyContent: 'center',
                                    marginLeft: wp(2)
                                }}
                                onPress={() => {
                                    const lastPath = `Blog/${item.blog_id}`
                                    onShare(blog_title, lastPath)
                                    // onShare(item) 
                                }}  >
                                <FastImage
                                    source={share}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                    }]}
                                    tintColor={COLORS.primary}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={.5}
                            disabled={IsButtonClick} style={{ alignItems: 'center', }} onPress={() => {
                                if (item.is_like !== 0) {
                                    setIsButtonClick(true)
                                    blogLike(false, item.blog_id)
                                }
                            }}  >
                            <Image
                                source={dislike}
                                style={[styles.image_small, {
                                    marginLeft: wp(3),
                                    marginTop: hp(1),
                                    marginBottom: hp(1),
                                    tintColor: item.is_like === 0 ? COLORS.primary : COLORS.white
                                }]}
                            />
                            <Text style={[styles.textDark, { marginLeft: 10, }]}>
                                {item.blog_unlike_count < 0 ? 0 : item.blog_unlike_count}
                            </Text>
                        </TouchableOpacity> */}


                            {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginEnd: "12%" }} onPress={() => {onReportBlog(item.blog_id) }}  >
                            <Text style={[styles.itemText, { fontSize: RFValue(14), color: COLORS.textDark }]}>
                                {t('common:report')}
                            </Text>
                        </TouchableOpacity> */}
                        </View>
                    </View>



                </View>

                <EmojiPicker onEmojiSelected={(emojiObject) => handlePick(emojiObject)} open={isEmojiOpen} onClose={() => setEmojiOpen(false)} />
            </View>
        )
    }

    const ListHeaderComponent = () => {
        console.log("item", item);

        return <View style={{}}>
            {/* <BlogHeader /> */}
            {item ? <BlogHeader /> : null}
            <View style={styles.divider} />
            <View style={{ flexDirection: 'column', paddingBottom: 10 }}>
                <Text style={[styles.itemText, { marginLeft: wp(4), fontSize: RFValue(18), color: COLORS.textDark, fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold" }]}>
                    {t("common:recentComments")}
                </Text>
            </View>
        </View>
    }
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setselectedImage] = React.useState(0);
    const blogCommentItem = ({ item, index }) => {

        const postCommentLike = (isLike, comment_id) => {

            // const blogPostComment = blogComments.map((item, index) => console.log(item))
            const params = {
                blog_id: itemId,
                is_like: isLike ? 1 : 0,
                blog_comment_id: comment_id
            }
            console.log('AddCommentLike', params)
            dispatch(postBlogCommentLike(params, authuser.token))
                .then((res) => {
                    setIsButtonClick(false)
                    if (res.status === 200) {
                        // resetData.current = true
                        // fetchResult()
                        // getBlogDetail()
                        const itemList = [...blogComments];
                        const itemBlog = itemList.find(a => a.blog_comment_id === comment_id);
                        itemBlog.is_like = isLike ? 1 : 0;
                        itemBlog.comment_like_count = isLike ? itemBlog.comment_like_count + 1 : itemBlog.comment_like_count - 1
                        // console.log('itemBlog', itemBlog)
                        setblogComments(itemList);
                        setRefresh(!refresh)
                    }
                }).catch((error) => {
                    setIsButtonClick(false)
                })
        }

        const onReportComment = (comment_id) => {



            const params = {
                blog_comment_id: comment_id,
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
                                            const blog = blogComments.filter((item) => item?.blog_comment_id != comment_id)
                                            setblogComments(blog)
                                            // resetData.current = true
                                            Toast.show(res.message, Toast.SHORT)
                                            // fetchResult()
                                        }
                                    }, 150);
                            }, 150);
                        }
                    },
                    {
                        text: (t("common:no")),
                        onPress: () => console.log("Cancel Pressed"),
                    },
                ]
            );
        }


        return (<View style={[styles.commentWrapper, { marginTop: 10, marginBottom: 5, paddingBottom: 15, flexDirection: 'column' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column', marginLeft: wp(1) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.uploadwrapper}   >
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
                                <View style={{ width: 70, height: 50, marginTop: hp(1) }}>
                                    <CustomVideoPlayer videoUrl={item.image} selectedImage={index}
                                        itemList={blogComments} videoHight={50} videoWidth={70} />
                                </View> :
                                item.image && item.image !== 'null' && item.image !== 'undefined' ?
                                    <TouchableOpacity style={{ marginTop: hp(1) }} onPress={() => {
                                        setModalVisible(true)
                                        setselectedImage(index)
                                    }}  >
                                        <FastImage style={{ width: 70, height: 50 }}
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
                                    onReportComment(item.blog_comment_id)
                                }}  >
                                <Text style={[styles.itemText, { fontSize: RFValue(16), color: COLORS.textDark }]}>
                                    {t('common:report')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} style={{ alignItems: 'center' }} onPress={() => {
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        postCommentLike(true, item.blog_comment_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        postCommentLike(false, item.blog_comment_id)
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
                                        postCommentLike(false, item.blog_comment_id)
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

    return (
        <SafeAreaView style={styles.container}>
            {!load ? <FlatList
                data={blogComments}
                renderItem={blogCommentItem}
                keyExtractor={(item, index) => index.toString()}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={<EmptyListComponent data={blogComments} msg={t('error:recent_comment_not_found')} />}
                initialNumToRender={10}
                contentContainerStyle={{ paddingBottom: hp(1) }}
                removeClippedSubviews={false}
                onEndReached={fetchResult}
                onEndReachedThreshold={0.7}
            /> :
                <ActivityIndicator style={{ alignSelf: "center", flex: 1, justifyContent: "center" }} size="large" color={COLORS.primary} />
            }
            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare} shareData={shareData}
                shareMessage={shareData.blog_title}
                token={authuser.token} shareKey={'blog_id'} shareType={0} /> : null}

            {
                modalVisible ? <VideoFullScreen
                    modalVisible={modalVisible} setModalVisible={setModalVisible}
                    selectedImage={selectedImage}
                    itemList={blogComments} updatePosition={() => setselectedImage(0)} /> : null
            }
            {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </SafeAreaView>
    )
}

export default BlogDetail

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
        backgroundColor: '#9cb2cc',
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
        fontSize: RFValue(14),
        color: COLORS.text,
        textAlign: 'left',
        // fontWeight:'bold',
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
        height: 40,
        //  width: '70%',
        flex: 1,
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
        marginLeft: wp(2),
        marginRight: wp(2),
        borderRadius: 35,
        backgroundColor: "#9bbbdf",
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '120%',
        marginLeft: "40%",
    }
})