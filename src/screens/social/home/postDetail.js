//import liraries
import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import Post from './Post';
import { COLORS } from '../../../theme';
import { postDetails, searchPostCommentList, socialUserConnect, updatePostLike } from '../../../redux/actions/socialActions';
import { useDispatch, useSelector } from 'react-redux';
import VideoFullScreen from '../../publicFeed/videoFullscreen';
import { useNavigation } from '@react-navigation/native';
import SocialAddComment from '../socialComment/SocialAddComment';
import { ShowToast } from '../../../utils/common';
import { ScrollView } from 'react-native-gesture-handler';
import { tr } from 'rn-emoji-keyboard/lib/commonjs';
import PostDetailItem from './PostDetailItem';
import SocialCommentItem from '../socialComment/socialCommentItem';

const LIMIT = 10
// create a component
const PostDetail = ({ route }) => {
    const authUser = useSelector(({ auth }) => auth.data);
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [mute, setMute] = useState(false);
    const [selectedPost, setSelectedPost] = useState()
    // const postItem = route && route.params.item ? route.params.item : undefined

    const SocialPostsRef = useRef();
    const resetData = useRef(false);

    const [socialComments, setSocialComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [offset, seOffset] = useState(0)

    const [refresh, seRefresh] = useState(false)
    const [SocialPost, SetSocialPost] = useState(undefined)

    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalCommentVisible, setModalCommentVisible] = React.useState(false);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const pageNumberRef = useRef(0);
    const pageLimitRef = useRef(10);
    const isListReachEndRef = useRef(false);

    useEffect(() => {
        SocialPostsRef.current = true;
        return () => SocialPostsRef.current = false;
    }, []);
    useEffect(() => {
        // console.log('modalVisible || modalCommentVisible', modalVisible || modalCommentVisible)
        //  if(!modalVisible || !modalCommentVisible){
        //     SocialPostsRef.current = true;
        //  }else{
        //     SocialPostsRef.current = false;
        //  }
    }, [modalVisible, modalCommentVisible]);

    useEffect(() => {
        SocialPostsRef.current = true
        // console.log('route && route.params', route && route.params.item.user_id)
        getPostDetail()
        resetData.current = true;
        seOffset(0)
        setSocialComments([])
        pageNumberRef.current = 0
        isListReachEndRef.current = false
        fetchResult(0, 10)
    }, [route && route.params]);


    const getPostDetail = () => {
        const params = {
            post_id: route ? route.params.itemId : 0 //route ? route.params.itemId : 0
        }
        console.log('postDetails params', params)
        dispatch(postDetails(params, authUser.token))
            .then((res) => {
                console.log('res.data', res)
                // console.log('res.data.data', SocialPostsRef.current)
                if (res.status === 200) {
                    //console.log('res.data.data', res.data)
                    if (res.data) {
                        SetSocialPost(res.data)
                    } else {
                        // navigation.goBack()
                        // navigation.navigate('social-profile', {
                        //     user_id: route && route.params.item.user_id,
                        //     item: route && route.params.item
                        //   });
                    }
                    // route && route.params.item.user_id
                }
                // if (SocialPostsRef.current)
            }).catch((error) => {
                console.log('res.error >>>>', error)
            })
    }
    const getPaginationOnEndReachAction = () => {
        if (isListReachEndRef?.current == false) {
            setPaginationLoading(true);
            SocialPostsRef.current = true
            fetchResult(pageNumberRef.current, pageLimitRef.current)
        }
    }

    const fetchResult = (peqReq, limit) => {
        // let pageToReq = offset;
        // if (resetData.current) {
        //     pageToReq = 0;
        // }
        const params = {
            post_id: route ? route.params.itemId : 0,
            offset: peqReq,
            limit: limit
        }
        console.log('params', params, SocialPostsRef.current)

        if (SocialPostsRef.current)
            dispatch(searchPostCommentList(params, authUser.token))
                .then((res) => {
                    console.log('searchPostCommentList res.data', res.data)
                    // if (SocialPostsRef.current)
                    //     if (res.status === 200) {
                    //         if (resetData.current) {
                    //             setSocialComments([])
                    //             setSocialComments(res.data)
                    //             seOffset(LIMIT)
                    //             resetData.current = false;
                    //         } else {
                    //             console.log('res.data', offset + LIMIT)
                    //             if (res.data && res.data.length > 0 && socialComments.length >= LIMIT) {
                    //                 setSocialComments(socialComments.concat(res.data))
                    //                 seOffset(offset + LIMIT)
                    //             }
                    //         }
                    //     }
                    if (res.data.length > 0) {
                        setSocialComments(previousData => [...previousData, ...res?.data])
                        pageNumberRef.current = pageNumberRef.current + limit;
                    } else {
                        isListReachEndRef.current = true
                    }
                }).catch((error) => {
                    setPaginationLoading(false)
                    console.log('res.error', error)
                })
    };

    //  console.log('item.params USERR', authUser.token)
    const toggleLike = (item, index) => {
        const isLike = item.is_like == 0 ? false : true
        console.log('item.is_like', isLike, item.is_like)

        const params = {
            post_id: item.post_id,
            is_like: isLike ? 0 : 1
        }

        dispatch(updatePostLike(params, authUser.token))
            .then((res) => {
                if (SocialPostsRef.current)
                    if (res.status === 200) {
                        console.log('SocialPostsRef.current', SocialPostsRef.current, res.status)
                        const newItem = { ...SocialPost }
                        newItem.is_like = !isLike ? 1 : 0;
                        newItem.like_count = !isLike ? newItem.like_count + 1 : newItem.like_count - 1
                        SetSocialPost(newItem)
                    }
            }).catch((error) => {
                console.log('res.error', error)
            })

    };
    const toggleConnect = postItem => {
        console.log('postItem', postItem.user_id)
        const param = {
            receiver_id: postItem.user_id,
            is_request: 1
        }
        dispatch(socialUserConnect(param, authUser.token))
            .then((res) => {
                console.log('res.data', res)
                if (res.status === 200) {
                    ShowToast(res.message)
                }
            }).catch((error) => {
                console.log('res.error', error)
            })
    };

    const onComment = postItem => {
        console.log('postItem', postItem)
        SetSocialPost(SocialPost)
        setModalCommentVisible(true)
    };
    const onCommentCallBack = () => {
        SocialPost.comment_count = SocialPost.comment_count + 1
        SetSocialPost(SocialPost);
        getPostDetail()
        setSocialComments([])
        pageNumberRef.current = 0
        isListReachEndRef.current = false
        fetchResult(0, 10)
    };

    const onPress = () => {
        SocialPostsRef.current = false
        setModalVisible(!modalVisible)
    }
    const onBackPress = () => {
        SocialPostsRef.current = true
        setModalCommentVisible(false)
        setModalVisible(false)
    }
    const onStopPlayer = () => {
        SocialPostsRef.current = false
    }

    const ListHeaderComponent = useMemo(() =>
        SocialPost ? <PostDetailItem item={SocialPost} index={0}
            setMute={setMute} mute={mute} currentIndex={SocialPostsRef.current ? 0 : -1}
            toggleLike={toggleLike}
            SocialPostsRefPost={SocialPostsRef}
            toggleConnect={toggleConnect}
            resetData={resetData}
            onComment={onComment} onPress={onPress} SetViewableItem={onStopPlayer} socialComments={socialComments} /> : null

        , [SocialPost, setMute, mute, SocialPostsRef.current, toggleLike, toggleConnect,
            onComment, onPress, onStopPlayer])

    const renderItem = ({ item, index }) => {
        return (<SocialCommentItem item={item} index={index} />)
    }


    //  console.log('socialComments', socialComments)
    // console.log('modalCommentVisible && selectedPost', modalCommentVisible && SocialPost)
    return (
        <ScrollView style={styles.container} >
            <View style={{ flex: 1, width: "100%", }}>
                {/* {
                    SocialPost ? <PostDetailItem item={SocialPost} index={0}
                        setMute={setMute} mute={mute} currentIndex={SocialPostsRef.current ? 0 : -1}
                        toggleLike={toggleLike}
                        toggleConnect={toggleConnect}
                        onComment={onComment} onPress={onPress}  SetViewableItem={onStopPlayer}/> : null
                } */}
                {
                    socialComments && socialComments.length > 0 ? <FlatList
                        nestedScrollEnabled={true}
                        data={socialComments}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ paddingBottom: 10 }}
                        removeClippedSubviews={false}
                        onEndReached={getPaginationOnEndReachAction}
                        onEndReachedThreshold={0.1}
                        ListHeaderComponentStyle={{ width: "100%", }}
                        ListHeaderComponent={ListHeaderComponent}
                    /> : SocialPost ? ListHeaderComponent : null
                }
            </View>

            {
                modalVisible ? <VideoFullScreen
                    modalVisible={modalVisible} setModalVisible={onBackPress}
                    selectedImage={0}
                    itemList={[{ image: SocialPost.post }]} showDownload={true} /> : null
            }

            {
                modalCommentVisible && SocialPost ?
                    <SocialAddComment
                        modalVisible={modalCommentVisible}
                        setModalVisible={onBackPress}
                        postID={SocialPost.post_id} callBack={onCommentCallBack} /> :
                    null
            }

        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.secondary,
        //alignItems: 'center',
        //  justifyContent: 'center'
    },
});

//make this component available to the app
export default PostDetail;
