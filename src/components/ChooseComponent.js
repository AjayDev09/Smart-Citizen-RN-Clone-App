import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  Dimensions, Platform, PermissionsAndroid
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./customButton";
import { COLORS } from "../theme";
import { close, iconDocs, iconGalleryNew, iconHeadPhones } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { uploadMedia } from "../redux/actions/chatActions";
import { ShowErrorToast, isVideo, isVideoByType } from "../utils/common";
import Toast from 'react-native-simple-toast';
import { launchCamera } from "react-native-image-picker";
import { createFileUriFromContentUri } from "../constants/constant";

const SCREEN_WIDTH = Dimensions.get('screen').width


const ChooseCameraComponent = ({
  modalCameraOptionVisible,
  setModalCameraOptionVisible,
  onCallback,
  title,
  receiverID,
}) => {

  //const loading = false
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const authuser = useSelector(({ auth }) => auth.data);

  const { t, i18n } = useTranslation();


  const handleChooseFromCamera = async (type) => {
    const isGranted = await requestCameraPermission()
    if (isGranted) {
      const options = {
        maxWidth: 2000,
        maxHeight: 2000,
        selectionLimit: 1,
        mediaType: type,
        includeBase64: false,
        noData: false,
        saveToPhotos: true
      };
      console.log('launchCamera image', options)
      launchCamera(options, (response) => {
        if (response?.assets) {
          const image = response?.assets && response.assets[0];
          console.log('launchCamera image', image)
          // setPhoto(image);
          // postComment(image)
          messagepostmediaFile(image)
        } else {
          console.log('response', response)
        }
      });
    } else {
      Toast.show("App needs access to your camera", Toast.SHORT);
    }

  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios')
      return true
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        return true
      } else {
        console.log("Camera permission denied");
        return false
      }
    } catch (err) {
      console.warn(err);
      return false
    }
  };


  const messagepostmediaFile = async (image) => {
    console.log('Image data camera log----',image);
    const url = image ?
      Platform.OS === 'android' && image.type === 'video/mp4' ?
        image.uri :
        image.uri : ''
    const params = {
      receiverId: receiverID,
      image: image
    }
    const data = new FormData();
    const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
    Object.keys(params).forEach(key => {
      if (key === 'image') {
        if (image) {
          data.append('media', {
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
    console.log('data', data)
    dispatch(uploadMedia(data, authuser.token))
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            console.log('uploadMedia res', res.data)
            setLoading(false)
            const urlPath = res.data.url
            console.log('urlPath', urlPath)
            if (image.type === 'video/mp4') {
            }
            setModalCameraOptionVisible(false);
            isVideoByType(image.type) ? onCallback(urlPath ,image?.duration ,image?.fileSize):onCallback(urlPath)
            Toast.show(res && res.message, Toast.SHORT);
          }, 1000);
        }
      }).catch((error) => {
        console.log('error', error)
        setLoading(false)
        ShowErrorToast(error)
      })
  }


  return (
    <Modal
      isVisible={modalCameraOptionVisible}
      style={styles.view}
      transparent={true}
      swipeDirection={['up', 'left', 'right', 'down']}
      // deviceWidth={deviceWidth}
      // deviceHeight={deviceHeight}
      // visible={true}
      onBackdropPress={() => {
        setModalCameraOptionVisible(!modalCameraOptionVisible);
      }}
    // onRequestClose={() => {
    //     setModalCameraOptionVisible(!modalCameraOptionVisible);
    // }}
    >
      <SafeAreaView style={{
        // justifyContent:'center',
        width: SCREEN_WIDTH,
        backgroundColor: COLORS.white,
        flexDirection: 'column',
        // alignSelf: 'center'
        alignSelf: 'center',
        justifyContent: "center",
        paddingBottom: 20
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' , marginTop: 5}}>
          <TouchableOpacity
            style={{ paddingTop: 5 }}
            onPress={() => {
              setModalCameraOptionVisible(!modalCameraOptionVisible);
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
          <Text
            style={[styles.text, {
              fontSize: RFValue(16),
              marginLeft: Platform.OS === 'ios' ? '43%' : '50%',
              position: 'absolute',
              textAlign:'left'
            }]}
          >
            {t("common:select")}
          </Text>
        </View>
        <View style={{height:1, backgroundColor: "#f3f3f3", width:"auto", marginTop: 10}} />
        <View style={[styles.container]}>
          {/* text header */}
          {/* <View style={styles.textContainer}>
            <Text style={styles.text}>{t("common:chooseLibrary")}</Text>
          </View> */}
          {/* image */}

          <View style={[styles.details,{ marginTop: 10}]}>
          </View>
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              handleChooseFromCamera("photo")
            }}>
            <View style={[styles.typeinnerWrapper, {
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
              <TouchableOpacity
                style={{
                  paddingTop: 0, display: 'flex', flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{
                  flexDirection: 'column',
                  display: 'flex',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: '#D8D8D8',
                  borderRadius: 10,
                  alignItems: 'center'
                }}>
                  <Image
                    source={iconGalleryNew}
                    style={[styles.image, {
                      width: 20,
                      height: 20,
                      tintColor: COLORS.textDark
                    }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ marginLeft: 10, flexDirection: 'column', width: "85%" }}>
                <View style={{ marginLeft: 10, marginBottom: 6, flexDirection: 'column' }}>
                  <Text
                    style={[styles.buttonText, { fontWeight: 'bold' }]}
                  >
                    {t("common:photos")}
                  </Text>
                  <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:sharePhotos")}
                  </Text>
                </View>
                <View style={{
                  display: 'flex', flex: 1, height: 1,
                  backgroundColor: '#000', width: "auto"
                }} />
              </View>

            </View>
          </TouchableOpacity>
           <View style={{height:1, backgroundColor: "#f3f3f3", width:"auto", marginVertical: 8}} />
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              handleChooseFromCamera("video")
            }}>
            <View style={[styles.typeinnerWrapper, {
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
              <TouchableOpacity
                style={{
                  paddingTop: 0, display: 'flex', flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View style={{
                  flexDirection: 'column',
                  display: 'flex',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: '#D8D8D8',
                  borderRadius: 10,
                  alignItems: 'center'
                }}>
                  <Image
                    source={iconGalleryNew}
                    style={[styles.image, {
                      width: 20,
                      height: 20,
                      tintColor: COLORS.textDark
                    }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ marginLeft: 10, flexDirection: 'column', width: "85%" }}>
                <View style={{ marginLeft: 10, marginBottom: 6, flexDirection: 'column' }}>
                  <Text
                    style={[styles.buttonText, { fontWeight: 'bold' }]}
                  >
                    {t("common:videos")}
                  </Text>
                  <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:shareVideos")}
                  </Text>
                </View>
                <Text style={{
                  display: 'flex', flex: 1, height: 1,
                  backgroundColor: '#000', width: "auto"
                }} />
              </View>
              {
                loading ? <View style={[styles.loading]}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
              }
            </View>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </Modal>

  );
};

export default ChooseCameraComponent;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    // flex:1,
    // backgroundColor: "lavender",
    justifyContent: "center",
    paddingBottom: 20
    //alignItems: "center"
  },
  textContainer: {
    marginTop: 10,
  },
  text: {
    fontWeight: "bold",
    color: COLORS.textDark,
    fontSize: RFValue(15)
  },
  buttonText: {
    fontWeight: "500",
    color: COLORS.textDark,
    fontSize: RFValue(16),
    textAlign:'left'
  },

  bathsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  details: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  typeinnerWrapper: {
    flexDirection: 'row',
    marginLeft: 10
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