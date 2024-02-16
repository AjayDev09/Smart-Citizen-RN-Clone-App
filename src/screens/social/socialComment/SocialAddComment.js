import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  //Modal,
  Dimensions, Platform, FlatList, TextInput, KeyboardAvoidingView
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { COLORS } from "../../../theme";
import { close, send_message } from "../../../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { addPostComment, searchPostCommentList } from "../../../redux/actions/socialActions";
import { IsRightOrLeft, ShowToast } from "../../../utils/common";
import SocialCommentItem from "./socialCommentItem";

// const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height
// const deviceHeight =
//   Platform.OS === "ios"
//     ? Dimensions.get("window").height
//     : require("react-native-extra-dimensions-android").get(
//         "REAL_WINDOW_HEIGHT"
//       );

const LIMIT = 10
const SocialAddComment = ({
  modalVisible, setModalVisible,
  onCallback,
  postID,
  title = "Comments",
  callBack
}) => {

  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation();
  const authUser = useSelector(({ auth }) => auth.data);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [Comment, setComment] = useState("")

  const [socialComments, setSocialComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [offset, seOffset] = useState(0)
  const pageNumberRef = useRef(0);
  const pageLimitRef = useRef(10);
  const isListReachEndRef = useRef(false);

  const resetData = useRef(false);
  const SocialCommentRef = useRef();

  console.log('modalVisible 123', modalVisible)

  useEffect(() => {
    SocialCommentRef.current = true;
    return () => SocialCommentRef.current = false;
  }, []);

  useEffect(() => {
    resetData.current = true;
    seOffset(0)
    setSocialComments([])
    fetchResult(0, 10)
  }, [modalVisible]);

  //   useEffect(() => {
  //     const focusHandler = navigation.addListener('focus', () => {
  //         fetchResult()
  //     });
  //     return focusHandler;
  // }, [navigation]);
  const getPaginationOnEndReachAction = () => {
    if (isListReachEndRef?.current == false) {
      setPaginationLoading(true);
      fetchResult(pageNumberRef.current, pageLimitRef.current)
    }
    setLoading(false)
  }


  const fetchResult = (pageReq, limit) => {
    // let pageToReq = offset;
    // if (resetData.current) {
    //   pageToReq = 0;
    // }
    if (pageReq == 0) {
      setLoading(true)
    }
    const params = {
      post_id: postID,
      offset: pageReq,
      limit: limit
    }
    console.log('paramsFetchResult', params)

    if (SocialCommentRef.current)
      dispatch(searchPostCommentList(params, authUser.token))
        .then((res) => {
          console.log("es.data", res.data.length);
          setLoading(false)
          setPaginationLoading(false)
          if (SocialCommentRef.current)
            if (res.status === 200) {

              // if (resetData.current) {
              //   setSocialComments([])
              //   setSocialComments(res.data)
              //   seOffset(LIMIT)
              //   resetData.current = false;
              // } else {
              //   console.log('res.data', offset + LIMIT)
              //   if (res.data && res.data.length > 0 && socialComments.length >= LIMIT) {
              //     setSocialComments(socialComments.concat(res.data))
              //     seOffset(offset + LIMIT)
              //   }
              // }
              if (res.data.length > 0) {
                setSocialComments(previousData => [...previousData, ...res?.data])
                pageNumberRef.current = pageNumberRef.current + limit;
              } else {
                isListReachEndRef.current = true
              }
            }


        }).catch((error) => {
          setPaginationLoading(false)
          setLoading(false)
          console.log('res.error', error)
        })
  };

  const handleNewComment = () => {
    const params = {
      post_id: postID,
      comment: Comment,
    }
    console.log('params', params)

    if (SocialCommentRef.current)
      dispatch(addPostComment(params, authUser.token))
        .then((res) => {
          if (SocialCommentRef.current)
            if (res.status === 200) {
              ShowToast(res && res.message)
              setComment("")
              setModalVisible(!modalVisible);
              callBack()
            }
        }).catch((error) => {
          console.log('res.error', error)
        })

    //
  }


  const renderItem = ({ item, index }) => {
    return (<SocialCommentItem item={item} index={index} />)
  }
  const paginatedLoadingSpinner = () => {
    return (
      <View>
        {(paginationLoading) ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={{ margin: 15, paddingTop: 10 }}
          />
        ) : null}
      </View>
    )
  }

  const table = useMemo(() => {
    return <FlatList
      data={socialComments}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingBottom: 10 }}
      removeClippedSubviews={false}
      onEndReached={getPaginationOnEndReachAction}
      onEndReachedThreshold={0.1}
      ListFooterComponent={paginatedLoadingSpinner}
    />
  }, [socialComments])


  return (
    <Modal
      isVisible={modalVisible}
      style={styles.view}
      transparent={true}
      // swipeDirection={['up', 'left', 'right', 'down']}
      onRequestClose={() => {
      }}
    >
      <SafeAreaView style={{
        // justifyContent:'center',
        display: 'flex',
        flex: 1,
        backgroundColor: COLORS.secondary,
        flexDirection: 'column',
        paddingBottom: 10,
        maxHeight: deviceHeight
      }}>
        <View style={{
          display: 'flex', flexDirection: 'row', paddingTop: 10,
          justifyContent: 'flex-start', alignItems: 'flex-start',
          paddingBottom: 10
        }}>
          <TouchableOpacity
            style={{}}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Image
              source={close}
              style={[styles.image, {
                width: 20,
                height: 20,
                marginLeft: 10,

                tintColor: COLORS.textDark
              }]}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>{t("common:comments")}</Text>
          </View>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={5}
          style={styles.container}>
          {/* text header */}

          {/* image */}
          <View style={{ flex: 1, width: "100%" }}>
            {table}
          </View>
          <View style={{ backgroundColor: COLORS.transparent, }}>
            {/* <CustomInput
              value={searchQuery}
              setValue={(name, text) => setSearchQuery(text)}
              placeholder={t("common:comment")}
              keyboardType={'default'}
              autoFocus={true}
              customStyle={{
                borderBottomWidth: 0,
                marginLeft: (wp(1)),
                // height: 30,
                // paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                height: Platform.OS === 'ios' ? 30 : hp(6),
                paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                textAlignVertical: 'center',
              }}
            /> */}

            <View style={{ width: "100%", flexDirection: 'row', paddingHorizontal: wp(4) }}>

              <View style={[styles.msgWrapper, { marginBottom: wp(0) }]}>

                <TextInput
                  placeholder={t('common:addComment')}
                  focusable={true}
                  style={[styles.itemText, {
                    borderBottomWidth: 0, color: '#7f94c1',
                    paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                    display: 'flex', flex: 1,
                    fontSize: RFValue(14),
                    textAlign: IsRightOrLeft(i18n.language), // i18n.language === 'he' || i18n.language === 'ar' ? 'right' : 'left',
                  }]}
                  keyboardType={'default'}
                  value={Comment}
                  onChangeText={(text) => setComment(text)}
                  placeholderTextColor={"#7f94c1"}
                />


                {/* <TouchableOpacity style={styles.uploadwrapper} onPress={handleChoosePhoto}  >
                <Image
                  source={AddComment[index] ? { uri: AddComment[index].uri } : attach}
                  style={[styles.image, { height: 16, width: 16, tintColor: COLORS.primary }]}
                />
              </TouchableOpacity> */}

              </View>
              <TouchableOpacity
                style={styles.messagingbuttonContainer}
                onPress={() => handleNewComment()}
              >

                <Image
                  source={send_message}
                  style={[styles.image_small, {
                    width: wp(9),
                    height: wp(9),
                    marginLeft: 10
                  }]}
                />
              </TouchableOpacity>

            </View>
          </View>

        </KeyboardAvoidingView>
        {/* {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            } */}
      </SafeAreaView>
    </Modal>

  );
};

export default SocialAddComment;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    // backgroundColor: "lavender",
    justifyContent: "center", alignItems: "center"
  },
  textContainer: {
    // marginTop: 10,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.text,
    fontSize: RFValue(18),
  },

  bathsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  typeinnerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10
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

});