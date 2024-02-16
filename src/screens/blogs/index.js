import { ActivityIndicator, Alert, FlatList, Image, Platform, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../theme'
import { dislike, emoji, like, send_message, share, upload, attach } from '../../constants/images';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBlogs, getBlogs, postBlogComment, postBlogLike, postBlogReport } from '../../redux/actions/blogActions';
import Toast from 'react-native-simple-toast';
import ShareComponent from '../share';
import EmojiPicker from 'rn-emoji-keyboard';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ReadMoreComponent from '../../components/readMore';
import { launchImageLibrary } from 'react-native-image-picker';
import { createFileUriFromContentUri, onShare } from '../../constants/constant';
import { ShareApi } from '../../redux/actions/settingsActions';
import { getItemByLngAR, IsRightOrLeft, nFormatter, ShowErrorToast } from '../../utils/common';
import EmptyListComponent from '../../components/EmptyListComponent';


const LIMIT = 10
const Blogs = ({ searchQuery = '', couponCategory }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);
    const blog = useSelector(({ blog }) => blog);
    //const blogs = blog.blogs
    const authuser = auth.data

    const [listLoading, setListLoading] = useState(true)
    const [blogs, seBlogs] = useState([])

    const [AddComment, setAddComment] = useState([])
    const [isEmojiOpen, setEmojiOpen] = useState(false)
    const [emojiIndex, setEmojiIndex] = useState(0)

    const [showShare, setShowShare] = useState(false)
    const [shareData, setShareData] = useState(undefined)

    const resetData = useRef(false);

    const [offset, setOffset] = useState(0)

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            // fetchResult()
            //getBlogs()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        //getBlogs()
        // resetData.current = true;
        // setOffset(0)
        // seBlogs([])
        // setTimeout(() => {
        //     fetchResult()
        // }, 700);

        setListLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) {
                resetData.current = true;
                setOffset(0)
                seBlogs([])
                fetchResult()
            }
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
    }, [searchQuery, couponCategory])

    const getBlogs1 = () => {
        const params = {
            search: searchQuery,
            category_id: couponCategory
        }
        console.log('getBlogs params', params)
        dispatch(getAllBlogs(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                if (res.status === 200) {
                }
                else
                    Toast.show(response.message, Toast.SHORT);

            }).catch((error) => {
                ShowErrorToast(error)
            })
    }

    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            search: searchQuery,
            category_id: couponCategory.toString(),
            offset: pageToReq,
            limit: LIMIT
        }
        console.log('params', params)
        setListLoading(true)
        dispatch(getBlogs(params, authuser.token))
            .then((res) => {
                setListLoading(false)
                setIsButtonClick(false)
                if (res.status === 200) {
                    // console.log('resr getBlogs', res.data)
                    if (resetData.current) {
                        seBlogs(res.data)
                        setOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        console.log('res.data', offset + LIMIT)
                        if (res.data && res.data.length > 0) {
                            seBlogs(blogs.concat(res.data))
                            setOffset(offset + LIMIT)
                        }
                    }

                }
            }).catch((error) => {
                setListLoading(false)
                setIsButtonClick(false)
                console.log('res.error', error)
            })
    };

    const onCloseShare = () => {
        setShowShare(false)
    };


    const onShare1 = async (blog) => {
        // itema.blog_title
        try {
            const msg = `Please install this app \n${Platform.OS === 'ios' ?
                `toshavhaham://blogDetail/${blog.blog_id}`
                : `https://toshavhaham/blogDetail/${blog.blog_id}`}`

            const result = await Share.share({
                title: blog.blog_title,
                message: msg,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
                // shareAPI(2)
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const shareAPI = (shareBy) => {
        const shareType = 0
        const params = {
            value: shareData["blog_id"],
            type: shareType,
            share_by: shareBy
        }
        console.log('shareAPI params', params)
        dispatch(ShareApi(params, token))
            .then((response) => {
                hideModel()
                //   console.log('shareAPI response', response)
                //Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
            })
    }

    const handlePick = (emojiObject, name) => {
        console.log(emojiObject)
        let newArr = [...AddComment];
        newArr[name] = (newArr[name] ? newArr[name] : '') + emojiObject.emoji
        setAddComment(newArr)
    }
    const [IsButtonClick, setIsButtonClick] = useState(false)
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const BlogsItem = ({ item, index }) => {


        const onChangeValue = (name, value) => {
            let newArr = [...AddComment];
            newArr[name] = value
            setAddComment(newArr)
        };


        const postComment = async (itemId, comment, image) => {

            const url = image ?
                Platform.OS === 'android' && image.type === 'video/mp4' ?
                    await createFileUriFromContentUri(image.uri) :
                    image.uri : ''
            const params = {
                blog_id: itemId,
                comment: comment ? comment : '',
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
            setLoading(true)
            dispatch(postBlogComment(data, authuser.token))
                .then((res) => {
                    setLoading(false)
                    if (res.status === 200) {
                        setAddComment([])
                    }
                    Toast.show(res && res.message, Toast.SHORT);
                }).catch((error) => {
                    console.log('error', error)
                    setLoading(false)
                })
        }

        const blogLike = (isLike, itemId) => {
            const params = {
                blog_id: itemId,
                is_like: isLike ? 1 : 0,
            }
            dispatch(postBlogLike(params, authuser.token))
                .then((res) => {
                    setIsButtonClick(false)
                    if (res.status === 200) {
                        // getBlogs()
                        const itemList = [...blogs];
                        const itemBlog = itemList.find(a => a.blog_id === itemId);
                        itemBlog.is_like = isLike ? 1 : 0;
                        itemBlog.blog_like_count = isLike ? itemBlog.blog_like_count + 1 : itemBlog.blog_like_count - 1
                        // console.log('itemBlog', itemBlog)
                        seBlogs(itemList);
                    }
                    // Toast.show(res.message, Toast.SHORT);
                }).catch((error) => {
                    setIsButtonClick(false)
                })
        }


        // const blog_title = i18n.language === 'he' ? item.blog_title_he : i18n.language === 'ar' ? item.blog_title_ab : item.blog_title
        const blog_content = i18n.language === 'he' ? item.blog_content_he : i18n.language === 'ar' ? item.blog_content_ab : item.blog_content
        //  const category_name = i18n.language === 'he' ? item.category_name_he : i18n.language === 'ar' ? item.category_name_ab : item.category_name
        // const short_content = i18n.language === 'he' ? item.short_content_he : i18n.language === 'ar' ? item.short_content_ab : item.short_content


        const blog_title = getItemByLngAR(i18n.language, item, "blog_title")
        const category_name = getItemByLngAR(i18n.language, item, "category_name")
        const short_content = getItemByLngAR(i18n.language, item, "short_content")

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
                    console.log("launchImageLibrary >> " + JSON.stringify(response));
                    const image = response?.assets && response.assets[0];
                    setPhoto(image);
                    postComment(item.blog_id, AddComment[index], image)
                } else {
                }
            });
        };

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


        return (
            <View style={[styles.itemWrapper, { flexDirection: 'column' }]}>
                <View style={styles.itemInnerWrapper}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('blogDetail', {
                            itemId: item.blog_id,
                            item: item,
                            blogLikePrev: (isLike, itemId) => blogLike(isLike, itemId)

                        });
                    }} style={[{ flexDirection: 'column' }]}>
                        <Text style={[styles.itemText, { fontSize: RFValue(18), color: COLORS.textDark, textAlign: 'left', fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold" }]}>
                            {blog_title !== 'null' ? blog_title : ""}
                        </Text>
                        <View style={{ flexDirection: 'row' }}>

                            <ReadMoreComponent>
                                {short_content !== 'null' ? short_content : ""}
                            </ReadMoreComponent>

                        </View>

                        <View style={{ marginTop: hp("1%"), marginBottom: hp(1) }}>
                            <Text style={[styles.itemText, { fontSize: RFValue(14), color: COLORS.textDark, textAlign: 'left', fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold" }]}>
                                {t('common:category') + " : " + (category_name ? category_name : "")}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.itemText, { flex: 1, flexDirection: 'row', marginTop: hp(1), marginRight: wp("2%") }]}>
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
                                value={AddComment[index] || ''}
                                onChangeText={(text) => onChangeValue(index, text)}
                                placeholderTextColor={"#7f94c1"}
                            />

                            <TouchableOpacity style={styles.uploadwrapper} onPress={handleChoosePhoto}  >
                                <Image
                                    source={AddComment[index] ? { uri: AddComment[index].uri } : attach}
                                    style={[styles.image, { height: 16, width: 16, tintColor: COLORS.primary }]}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{
                            // alignItems: 'center', justifyContent: 'center',
                            marginLeft: wp("2%")
                        }} onPress={() => {
                            if (AddComment.length > 0 && AddComment[index].trim() !== "") {
                                // console.log('send_message', AddComment[index])
                                postComment(item.blog_id, AddComment[index], undefined)
                            }

                        }}  >
                            <Image
                                source={send_message}
                                style={[styles.image_small, {
                                    width: wp(8),
                                    height: wp(8),
                                }]}
                            />
                        </TouchableOpacity>


                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: hp(0) }}>
                            <TouchableOpacity style={{ alignItems: 'center' }} activeOpacity={.5}
                                disabled={IsButtonClick} onPress={() => {
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        blogLike(true, item.blog_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        blogLike(false, item.blog_id)
                                    }
                                }}  >
                                <Image
                                    source={like}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        marginLeft: wp(2),
                                        // marginTop: hp(0),
                                        tintColor: item.is_like === 1 ? COLORS.primary : COLORS.white
                                    }]}
                                />
                                <Text style={[styles.textDark, {}]}>
                                    {item.blog_like_count < 0 ? 0 : nFormatter(item.blog_like_count)}
                                </Text>
                            </TouchableOpacity>

                            {/* 
                            <TouchableOpacity style={{ marginLeft: wp(3), marginBottom: hp(0) }} onPress={() => {
                                setEmojiOpen(true)
                                setEmojiIndex(index)
                            }}  >
                                <Image
                                    source={emoji}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        tintColor: COLORS.primary
                                    }]}
                                />
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                style={{ alignItems: 'center', justifyContent: 'center', marginLeft: wp("2%") }}
                                onPress={() => {
                                    const lastPath = `Blog/${item.blog_id}`
                                    onShare(blog_title, lastPath)
                                }}  >
                                <Image
                                    source={share}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        marginBottom: hp(1.5),
                                        tintColor: COLORS.primary
                                    }]}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={.5}
                            disabled={IsButtonClick} onPress={() => {
                                if (item.is_like !== 0) {
                                    setIsButtonClick(true)
                                    blogLike(false, item.blog_id)
                                }
                            }}  >
                            <Image
                                source={dislike}
                                style={[styles.image_small, {
                                    width: wp(6),
                                    height: wp(6),
                                    marginTop: hp(1),
                                    marginLeft: wp(3),
                                    tintColor: item.is_like === 0 ? COLORS.primary : COLORS.white
                                }]}
                            />
                            <Text style={[styles.textDark, { marginLeft: wp(5), }]}>
                                {item.blog_unlike_count < 0 ? 0 : item.blog_unlike_count}
                            </Text>
                        </TouchableOpacity> */}

                            {/* <TouchableOpacity style={{ flex: 1, alignItems: 'flex-end', marginEnd: wp("8%") }}
                         onPress={() => { onReportBlog(item.blog_id) }}  >
                            <Text style={[styles.itemText, { fontSize: RFValue(14), color: COLORS.textDark }]}>
                                {t('common:report')}
                            </Text>
                        </TouchableOpacity> */}
                        </View>
                    </View>
                    {/* <TouchableOpacity style={styles.uploadwrapper} onPress={() => {
                        // setModalVisible(true)
                        // setselectedImage(index)
                    }}  >
                        <Image
                            source={AddComment[index] && AddComment[index] ? { uri: AddComment[index] } : ""}
                            style={[{
                                width: 40,
                                height: 40
                            }]}
                        />
                    </TouchableOpacity> */}


                </View>

            </View>
        )
    }

    // console.log('blogs', blogs)
    return (
        <View style={{ flex: 1 }}>
            <EmojiPicker onEmojiSelected={(emojiObject) => handlePick(emojiObject, emojiIndex)} open={isEmojiOpen} onClose={() => setEmojiOpen(false)} />
            <View style={{ backgroundColor: COLORS.secondary }}>
                <FlatList
                    data={blogs}
                    renderItem={BlogsItem}
                    keyExtractor={item => item.blog_id}
                    contentContainerStyle={{ paddingBottom: 10, }}
                    //  onEndReachedThreshold={0.01}
                    removeClippedSubviews={false}
                    onEndReached={fetchResult}
                    onEndReachedThreshold={0.7}
                />
            </View>
            {
                listLoading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {/* <ListFooterComponent data={blogs} msg={t('error:blogs_not_found')} /> */}

            <EmptyListComponent isLoading={listLoading} data={blogs} msg={t('error:blogs_not_found')} />
            {/* {
                blogs && blogs.length <= 0 ? <View style={[styles.loading, { marginLeft: "30%" }]}>
                    <Text style={[styles.itemText, { fontSize: RFValue(16) }]}>{t('error:blogs_not_found')}</Text>
                </View> : null
            } */}

            {showShare ? <ShareComponent showShare={showShare} onCloseShare={onCloseShare} shareData={shareData} shareMessage={shareData.blog_title}
                token={authuser.token} shareKey={'blog_id'} shareType={0} /> : null}
        </View>
    )
}

export default Blogs

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 2,
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
        fontSize: 16,
        color: COLORS.text,
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
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 35,
        backgroundColor: "#b7c8db",
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: '50%',
        alignSelf: 'center',
        bottom: 15
    }
})