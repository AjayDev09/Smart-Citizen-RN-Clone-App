//import liraries
import { useNavigation } from '@react-navigation/native';
import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Platform, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import Post from './Post';
import { getSocialPostList, socialUserConnect, updatePostLike } from '../../../redux/actions/socialActions';
import { useTranslation } from 'react-i18next';
import SocialAddComment from '../socialComment/SocialAddComment';
import { ShowToast } from '../../../utils/common';
import { COLORS } from '../../../theme';
import CustomSocialHeader from '../CustomSocialHeader';

const { height, width } = Dimensions.get('window');

const TOP_BOTTOM_MARGIN = 120
const LIMIT = 10
// create a component
const SocialHome = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [mute, setMute] = useState(false);
  const [ViewableItem, SetViewableItem] = useState(0)
  const [socialPosts, SetSocialPosts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedPost, setSelectedPost] = useState()
  const [loading, setLoading] = useState(false);


  const authUser = useSelector(({ auth }) => auth.data);

  const [offset, seOffset] = useState(0)
  const resetData = useRef(false);

  const SocialPostsRef = useRef();
      // console.log('List socialPosts ----',socialPosts);
  useEffect(() => {
    SocialPostsRef.current = true;
    return () => SocialPostsRef.current = false;
  }, []);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const currentVisibleIndex = useRef()

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      fetchResult()
    });
    return focusHandler;
  }, [navigation]);

  useEffect(() => {
    resetData.current = true;
    seOffset(0)
    SetSocialPosts([])
    fetchResult()
  }, [])

  const fetchResult = () => {
    let pageToReq = offset;
    if (resetData.current) {
      pageToReq = 0;
    }
    const params = {
      offset: pageToReq,
      limit: LIMIT
    }
    if (SocialPostsRef.current) {
      setLoading(true)
      //  console.log('params', params,  authUser.token)
      dispatch(getSocialPostList(params, authUser.token))
        .then((res) => {
          setLoading(false)
          setRefreshing(false);
          if (SocialPostsRef.current)
            if (res.status === 200) {
              if (resetData.current) {
                SetSocialPosts([])
                SetSocialPosts(res.data)
                seOffset(LIMIT)
                resetData.current = false;
              } else {
                console.log('res.data', offset + LIMIT)
                if (res.data && res.data.length > 0) {
                  SetSocialPosts(socialPosts.concat(res.data))
                  seOffset(offset + LIMIT)
                }

              }
            }
        }).catch((error) => {
          setLoading(false)
          setRefreshing(false);
          // console.log('res.error', error)
        })
    }
  };

  const _onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
    currentVisibleIndex.current == viewableItems.length > 0 && viewableItems[0].index
    SetViewableItem(viewableItems.length > 0 && viewableItems[0].index || 0);
  }, [currentVisibleIndex.current], socialPosts);


  const onCommentCallBack = () => {
    const itemList = [...socialPosts];
    const itemPost = itemList.find(a => a.post_id === selectedPost.post_id);
    itemPost.comment_count = itemPost.comment_count + 1
    SetSocialPosts(itemList);
  };

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
            const itemList = [...socialPosts];
            const itemPost = itemList.find(a => a.post_id === item.post_id);
            itemPost.is_like = !isLike ? 1 : 0;
            itemPost.like_count = !isLike ? itemPost.like_count + 1 : itemPost.like_count - 1
            SetSocialPosts(itemList);
          }
      }).catch((error) => {
        console.log('res.error', error)
      })

  };
  const toggleConnect = postItem => {
    console.log('postItem', postItem)
    const param = {
      receiver_id: postItem.user_id,
      is_request: 1
    }
    // console.log('param', param)
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
    setSelectedPost(postItem)
    setModalVisible(true)
  };

  const keyExtractor = (item) => `${item.post_id}`;


  const renderItems = ({ item, index }) => {
    const post = item;
    // if (isGrid) {
    //   return <ProfilePost post={post} onItemClicked={onItemClicked} />;
    // }
    // console.log('renderItems index', item.index)
    return <Post item={post} index={index}
      setMute={setMute} mute={mute} currentIndex={ViewableItem}
      toggleLike={toggleLike}
      toggleConnect={toggleConnect}
      onComment={onComment}
      SetViewableItem={SetViewableItem} />;
  };
  const name = t("navigate:socialHome")

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    resetData.current = true;
    fetchResult()
    // setTimeout(() => setRefreshing(false), 1500);
  };
  return (
    <View style={styles.container}>
      <CustomSocialHeader title={name} chatshow={true} />
      {
        socialPosts.length > 0 ? <FlatList
          showsVerticalScrollIndicator={false}
          data={socialPosts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItems}
          // getItemLayout={(_data, index) => ({
          //     length: height,
          //     offset: width * index,
          //     index,
          //   })}
          //initialScrollIndex={ViewableItem}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={_onViewableItemsChanged}
          onEndReached={fetchResult}
          onEndReachedThreshold={0.7}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        /> : null
      }
      {
        modalVisible && selectedPost ?
          <SocialAddComment
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            postID={selectedPost.post_id} callBack={onCommentCallBack} /> :
          null
      }

      {
        loading ? <View style={[styles.loading]}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View> : null
      }
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },
  listItemBody: {
    flex: 1,
    minHeight: 320
  },
  videoElement: {
    flex: 1
  },
  videoOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    backgroundColor: 'transparent',
    right: 0,
    top: 0,
  },
  loading: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: '50%',
    alignSelf: 'center',
    bottom: 15,
  }
});

//make this component available to the app
export default SocialHome;
