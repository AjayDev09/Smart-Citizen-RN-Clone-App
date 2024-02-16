import { ActivityIndicator, FlatList, Image, Platform, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { COLORS } from '../../theme'
import CustomInput from '../../components/customInput';
import { attach, dislike, emoji, like, send_message, share, video_image } from '../../constants/images';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFeeds, getFeeds, postFeedComment, postFeedLike } from '../../redux/actions/feedActions';
import Toast from 'react-native-simple-toast';
import CustomVideoPlayer from '../../components/customVideoPlayer';
import VideoFullScreen from './videoFullscreen';
import EmojiPicker, { en } from 'rn-emoji-keyboard'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import ReadMoreComponent from '../../components/readMore';
import { launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import { createFileUriFromContentUri, onShare } from '../../constants/constant';
import EmptyListComponent from '../../components/EmptyListComponent';
import { useMemo } from 'react';
import { getItemByLngAR, IsRightOrLeft, isVideo, nFormatter, ShowErrorToast } from '../../utils/common';

const LIMIT = 10
const PublicFeed = ({ searchQuery = '' }) => {
    const { t, i18n } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const auth = useSelector(({ auth }) => auth);
    const feed = useSelector(({ feed }) => feed);
    // const feeds = feed.feeds
    const authuser = auth.data

    const [feeds, seFeeds] = useState([])
    const resetData = useRef(false);
    const PublicFeedRef = useRef();
    //console.log('feeds', feeds)

    const [offset, seOffset] = useState(0)
    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setselectedImage] = React.useState(0);
    const [selectedImageList, setselectedList] = React.useState([]);

    const [refresh, seRefresh] = useState(false)

    useEffect(() => {
        PublicFeedRef.current = true;
        return () => PublicFeedRef.current = false;
    }, []);

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            // getPublicFeeds()
            // fetchResult()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        //  getPublicFeeds()
        // resetData.current = true;
        // seOffset(0)
        // seFeeds([])
        // // setTimeout(() => {
        // //     console.log('searchQuery', searchQuery)
        // //     fetchResult()
        // // }, 700);
        // console.log('searchQuery', searchQuery)
        // fetchResult()

        setLoading(true)
        let delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 0) {
                resetData.current = true;
                seOffset(0)
                seFeeds([])
                fetchResult()
            }
        }, 1000)

        return () => {
            clearTimeout(delayDebounceFn)
        }
    }, [searchQuery])

    const getPublicFeeds = () => {
        const params = {
            search: searchQuery
        }
        dispatch(getAllFeeds(params, authuser.token))
            .then((res) => {
                setIsButtonClick(false)
                if (res.status === 200) { }
                else
                    Toast.show(response.message, Toast.SHORT);

            }).catch((error) => {
            })
    }

    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            search: searchQuery,
            offset: pageToReq,
            limit: LIMIT
        }
        console.log('params', params)
        if (PublicFeedRef.current)
            dispatch(getFeeds(params, authuser.token))
                .then((res) => {
                    setIsButtonClick(false)
                    setLoading(false)
                    //  console.log('res.data', res.data)
                    //seFeeds([])
                    if (PublicFeedRef.current)
                        if (res.status === 200) {
                            if (resetData.current) {
                                seFeeds([])
                                seFeeds(res.data)
                                seOffset(LIMIT)
                                resetData.current = false;
                            } else {
                                console.log('res.data', offset + LIMIT)
                                if (res.data && res.data.length > 0) {
                                    seFeeds(feeds.concat(res.data))
                                    seOffset(offset + LIMIT)
                                }

                            }
                        }
                }).catch((error) => {
                    setLoading(false)
                    console.log('res.error', error)
                })
    };




    const [isEmojiOpen, setEmojiOpen] = useState(false)
    const [emojiIndex, setEmojiIndex] = useState(0)
    const [AddComment, setAddComment] = useState([])

    const handlePick = (emojiObject, name) => {
        console.log(emojiObject)
        let newArr = [...AddComment];
        newArr[name] = (newArr[name] ? newArr[name] : '') + emojiObject.emoji
        setAddComment(newArr)
    }
    const [IsButtonClick, setIsButtonClick] = useState(false)
    const [loading, setLoading] = useState(false);
    const [photo, setPhoto] = useState(null);

    const PublicFeedItem = ({ item, index }) => {
        const onChangeValue = (name, value) => {
            let newArr = [...AddComment];
            newArr[name] = value
            setAddComment(newArr)
        };

        const postComment = async (itemId, comment, image) => {
            setLoading(true)
            const url = image ?
                Platform.OS === 'android' && image.type === 'video/mp4' ?
                    await createFileUriFromContentUri(image.uri) :
                    image.uri : ''
            const params = {
                public_feed_id: itemId,
                comment: comment ? comment : '',
                image: image
            }
            const data = new FormData();
            const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
            Object.keys(params).forEach(key => {
                if (key === 'image') {
                    if (image) {
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

            dispatch(postFeedComment(data, authuser.token))
                .then((res) => {
                    console.log('postFeedComment res', res)
                    setLoading(false)
                    if (res.status === 200) {
                        setPhoto(null);
                        setAddComment([])
                    }
                    Toast.show(res && res.message, Toast.SHORT);
                }).catch((error) => {
                    console.log('error', error)
                    setLoading(false)
                    ShowErrorToast(error)
                })
        }

        const feedLike = (isLike, itemId) => {
            const params = {
                public_feed_id: itemId,
                is_like: isLike ? 1 : 0,
            }
            dispatch(postFeedLike(params, authuser.token))
                .then((res) => {
                    //console.log('res', res)
                    setIsButtonClick(false)
                    if (res.status === 200) {
                        const itemList = [...feeds];
                        const itemFeed = itemList.find(a => a.public_feed_id === itemId);
                        itemFeed.is_like = isLike ? 1 : 0;
                        itemFeed.feed_like_count = isLike ? itemFeed.feed_like_count + 1 : itemFeed.feed_like_count - 1
                        // console.log('itemFeed', itemFeed)
                        seFeeds(itemList);
                        // seRefresh(!refresh)
                    }
                    // //Toast.show(res.message, Toast.SHORT);
                }).catch((error) => {
                    setIsButtonClick(false)
                })
        }
        const renderImagesItem = ({ item, index }, parentIndex, parentData) => {
            return (
                <>
                    {
                        index == 5 ?
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('publicFeedDetail', {
                                        itemId: parentData?.public_feed_id,
                                        item: parentData,
                                        feedLikePre: (like, item) => feedLike(like, item)
                                    });
                                }}
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}>
                                <Text style={{
                                    fontSize: RFValue(14),
                                    color: COLORS.primary,
                                    margin:5,
                                    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
                                }}>{t('common:seemore')}</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                style={{ width: 200, height: 120, marginHorizontal: 0, flexDirection: "row" }}
    
                                onPress={() => {
                                    console.log('feeds[parentIndex].images', feeds[parentIndex].images)
                                    setModalVisible(true)
                                    setselectedImage(index)
                                    setselectedList(feeds[parentIndex].images)
                                }}  >
                                {
                                    isVideo(item.image) ?
                                        <CustomVideoPlayer
                                            modalVisible={modalVisible}
                                            setModalVisible={setModalVisible}
                                            videoUrl={item?.image}
                                            itemList={feeds[parentIndex]?.images}
                                            selectedImage={index}
                                            videoHight={120}
                                            videoWidth={180} />
    
                                        // <></>
                                        :
                                        <FastImage style={{ width: 180, height: 120 }}
                                            source={{
                                                uri: item.image ? item.image : "",
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                }
                            </TouchableOpacity>
                    }
                </>
            )
        }
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

                    setPhoto(image);
                    postComment(item.public_feed_id, AddComment[index], image)
                } else {
                }
            });
        };




        // const public_feed_title = i18n.language === 'he' ? item.public_feed_title_he : i18n.language === 'ar' ? item.public_feed_title_ab : item.public_feed_title
        const content = i18n.language === 'he' ? item.content_he : i18n.language === 'ar' ? item.content_ab : item.content
        //const category_name = i18n.language === 'he' ? item.category_name_he : i18n.language === 'ar' ? item.category_name_ab : item.category_name
        // const short_content = i18n.language === 'he' ? item.short_content_he : i18n.language === 'ar' ? item.cshort_content_ab : item.short_content

        const public_feed_title = getItemByLngAR(i18n.language, item, "public_feed_title")
        const short_content = getItemByLngAR(i18n.language, item, "short_content")

        return (
            <View style={[styles.itemWrapper, { flexDirection: 'column' }]}>

                <View style={styles.itemInnerWrapper}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('publicFeedDetail', {
                            itemId: item.public_feed_id,
                            item: item,
                            feedLikePre: (like, item) => feedLike(like, item)
                        });
                    }} style={[{ flexDirection: 'column' }]}>
                        <Text style={[styles.itemText, { fontSize: RFValue(18), fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold", color: COLORS.textDark, textAlign: 'left' }]}>
                            {public_feed_title !== 'null' ? public_feed_title : ""}
                        </Text>
                        <ReadMoreComponent>
                            {short_content !== 'null' ? short_content : ""}
                        </ReadMoreComponent>

                        <View style={{ marginVertical: 10 }}>

                            <FlatList
                                horizontal={true}
                                data={item?.images?.slice(0, 6)}
                                renderItem={(childData) =>
                                    renderImagesItem(childData, index,item)}
                                keyExtractor={(item) => item.public_feed_image_id.toString()}
                                snapToEnd={true}
                                inverted={Platform.OS === 'ios' ? false : i18n.language === 'en' || i18n.language === 'ru' || i18n.language === 'fr' ? false : true}
                            // onViewableItemsChanged={onViewableItemsChanged}
                            // viewabilityConfig={{
                            //   itemVisiblePercentThreshold: 50
                            // }}
                            />

                        </View>

                    </TouchableOpacity>

                    <View style={{ flex: 1, flexDirection: 'row', marginTop: hp(1), marginRight: wp(1) }}>
                        <View style={[styles.msgWrapper, { marginBottom: wp(2) }]}>

                            <TextInput
                                placeholder={t('common:addComment')}
                                style={[styles.itemText, {
                                    borderBottomWidth: 0, color: '#7f94c1',
                                    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                                    display: 'flex', flex: 1,
                                    fontSize: RFValue(14),
                                    textAlign: IsRightOrLeft(i18n.language),
                                }]}
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

                        <View style={{ flexDirection: 'row', marginTop: hp(1) }}>
                            <TouchableOpacity style={{
                                //alignItems: 'center', justifyContent: 'center',
                                marginLeft: wp(2), marginBottom: wp(0)
                            }}
                                onPress={() => {
                                    if (AddComment.length > 0 && AddComment[index].trim() !== "") {
                                        postComment(item.public_feed_id, AddComment[index], undefined)
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


                            <TouchableOpacity style={{
                                alignItems: 'center',
                                marginLeft: wp(2),
                                marginTop: wp(0)
                            }}
                                activeOpacity={.5}
                                disabled={IsButtonClick} onPress={() => {
                                    console.log('item', item.is_like)
                                    if (item.is_like !== 1) {
                                        setIsButtonClick(true)
                                        feedLike(true, item.public_feed_id)
                                    } else if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        feedLike(false, item.public_feed_id)
                                    }
                                }}>
                                <Image
                                    source={like}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),

                                        //marginTop: hp(1),
                                        // marginBottom: 2,
                                        tintColor: item.is_like === 1 ? COLORS.primary : COLORS.white
                                    }]}
                                />
                                <Text style={[styles.textDark, { marginLeft: wp(0) }]}>
                                    {item.feed_like_count < 0 ? 0 : nFormatter(item.feed_like_count)}
                                </Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity style={{ marginLeft: wp(3), marginBottom: wp(2) }} onPress={() => {
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
                                style={{ marginLeft: wp(2), marginTop: wp(0) }}
                                onPress={() => {
                                    const lastPath = `PublicFeed/${item.public_feed_id}`
                                    //  const videoPath = item.images.length >0 ? item.images[0].image : undefined 
                                    //  console.log('item.images', videoPath )
                                    onShare(public_feed_title, lastPath)
                                }}  >
                                <Image
                                    source={share}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        // marginBottom: 5,
                                        tintColor: COLORS.primary
                                    }]}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity activeOpacity={.5}
                                disabled={IsButtonClick} onPress={() => {
                                    if (item.is_like !== 0) {
                                        setIsButtonClick(true)
                                        feedLike(false, item.public_feed_id)
                                    }
                                }}  >
                                <Image
                                    source={dislike}
                                    style={[styles.image_small, {
                                        width: wp(6),
                                        height: wp(6),
                                        marginLeft: 15,
                                        tintColor: item.is_like === 0 ? COLORS.primary : COLORS.white
                                    }]}
                                />
                                <Text style={[styles.textDark, { marginLeft: wp(5), }]}>
                                    {item.feed_unlike_count < 0 ? 0 : item.feed_unlike_count}
                                </Text>
                            </TouchableOpacity> */}

                        </View>

                    </View>



                </View>

                {
                    modalVisible ? <VideoFullScreen
                        modalVisible={modalVisible} setModalVisible={setModalVisible}
                        selectedImage={selectedImage}
                        itemList={selectedImageList} updatePosition={() => setselectedImage(0)} /> : null
                }

            </View>
        )
    }


    const visibleTodos = useMemo(
        () => {
            return (
                <EmojiPicker
                    onEmojiSelected={(emojiObject) => handlePick(emojiObject, emojiIndex)}
                    open={isEmojiOpen}
                    onClose={() => setEmojiOpen(false)}
                // translation={'en'}
                />
            )
        },
        [isEmojiOpen]
    );
    return (
        <View style={{ flex: 1 }}>
            {visibleTodos}

            <View style={{ backgroundColor: COLORS.secondary }}>
                <FlatList
                    data={feeds}
                    renderItem={PublicFeedItem}
                    keyExtractor={item => item.public_feed_id}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    removeClippedSubviews={false}
                    onEndReached={fetchResult}
                    onEndReachedThreshold={0.7}
                />
            </View>
            {
                feed.isRequesting ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {
                (loading && !feed.isRequesting) ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }

            {(!loading && !feed.isRequesting) && <EmptyListComponent isLoading={feed.isRequesting} data={feeds} msg={t('error:feed_not_found')} />}


        </View>
    )
}

export default PublicFeed

const styles = StyleSheet.create({
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
    text: {
        fontSize: RFValue(16),
        fontWeight: 'bold',
        color: COLORS.textDark
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
        fontSize: RFValue(16),
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
        //marginTop: '50%',
        alignSelf: 'center',
        bottom: 15,
    }
})