import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  Dimensions, Platform
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./customButton";
import { COLORS } from "../theme";
import { close, iconDocs, iconGalleryNew, iconHeadPhones } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isCancel,
  isInProgress,
  types,
} from 'react-native-document-picker'
import { useDispatch, useSelector } from "react-redux";
import { uploadMedia } from "../redux/actions/chatActions";
import { ShowErrorToast, isAudio, isVideoByType } from "../utils/common";
import Toast from 'react-native-simple-toast';
import { launchImageLibrary } from 'react-native-image-picker';
import { createFileUriFromContentUri } from "../constants/constant";
import SoundPlayer from "react-native-sound-player";

const SCREEN_WIDTH = Dimensions.get('screen').width


const ChooseFileComponent = ({
  modalVisible, setModalVisible,
  onCallback,
  title,
  receiverID,
  //setLoading,
}) => {

  //const loading = false
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const authuser = useSelector(({ auth }) => auth.data);

  const { t, i18n } = useTranslation();

  const audioType = [types.audio]
  const galleryType = [types.images, types.video]
  const documentType = [types.pdf, types.doc, types.xlsx, types.xls, types.docx]


  
	const getDuration = async (item) => {
		SoundPlayer.loadUrl(item)
		const info = await SoundPlayer.getInfo()
		return info.duration
	}

  const handleChoosePhoto = (mediaType) => {
    if (galleryType === mediaType) {
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
        console.log('response mediatype-------------1',response);
        if (response?.assets) {
          const image = response?.assets && response.assets[0];
          const duration =response?.assets[0]?.duration
          const fileSize =response?.assets[0]?.fileSize
          console.log('isVideoByType(image.type)', isVideoByType(image.type))
          isVideoByType(image.type)  ? postImageVideo(image,duration,fileSize): postImageVideo(image,'0',fileSize)
        } else {
        }
      });
      return
    }

    DocumentPicker.pick({
      copyTo: 'cachesDirectory',
      allowMultiSelection: false,
      type: mediaType,
      //type: [types.audio, types.images, types.video, types.pdf, types.doc, types.xlsx, types.xls, types.docx],
    })
      .then((response) => {
        const file = response && response[0];
        console.log('response Audio and file--------2',response);
        console.log('setResult', file)
        messagePostFile(file)
      })
      .catch((response) => { console.log('handleError', response) })


  };

  const postImageVideo = async (image,duration,fileSize) => {
    setLoading(true)
    const url = image ?
      Platform.OS === 'android' && image.type === 'video/mp4' ?
        await createFileUriFromContentUri(image.uri) :
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
    dispatch(uploadMedia(data, authuser.token))
      .then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            console.log('uploadMedia res ----1----image/video', res.data)
            setLoading(false)
            const urlPath = res.data.url
            console.log('urlPath', urlPath)
            setModalVisible(false);
            isVideoByType(image.type)?  onCallback(urlPath,duration,fileSize) :  onCallback(urlPath)
            Toast.show(res && res.message, Toast.SHORT);
          }, 1000);
        }
      }).catch((error) => {
        console.log('error', error)
        setLoading(false)
        ShowErrorToast(error)
      })
  }

  const messagePostFile = async (image) => {
    console.log('image--------00---',image);
    let PdfInKb=image?.size? Number(image?.size) / 1024 : '00'
    const params = {
      receiverId: receiverID,
      image: image
    }
    const data = new FormData();
    Object.keys(params).forEach(key => {
      if (key === 'image') {
        if (image) {
          data.append('media', image);
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
          setModalVisible(false);
          setTimeout(async() => {
            console.log('uploadMedia res----2 ----audio---', res.data)
            setLoading(false)
            const urlPath = res.data.url
            console.log('urlPath', urlPath)
            // let duration='0'
       
          if(isAudio(urlPath)){
            const duration= await getDuration(urlPath);
            onCallback(urlPath,duration)
          }else{
            onCallback(urlPath,'00',PdfInKb.toFixed(1))
          }

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
      isVisible={modalVisible}
      style={styles.view}
      transparent={true}
      swipeDirection={['up', 'left', 'right', 'down']}
      // deviceWidth={deviceWidth}
      // deviceHeight={deviceHeight}
      // visible={true}
      onBackdropPress={() => {
        setModalVisible(!modalVisible);
      }}
    // onRequestClose={() => {
    //     setModalVisible(!modalVisible);
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <TouchableOpacity
            style={{ paddingTop: 5 }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Image
              source={close}
              style={[styles.image, {
                width: 20,
                height: 20,
                padding:2,
                marginLeft: 10,

                tintColor: COLORS.textDark
              }]}
            />
          </TouchableOpacity>
          <Text
            style={[styles.text, { fontSize: RFValue(16), marginLeft: '40%', position: 'absolute', textAlign: 'left' }]}
          >
            {t("common:selectFile")}
          </Text>
        </View>
        <View style={{height:1, backgroundColor: "#f3f3f3", width:"auto", marginTop: 10}} />
        <View style={styles.container}>
          {/* text header */}
          {/* <View style={styles.textContainer}>
            <Text style={styles.text}>{t("common:chooseLibrary")}</Text>
          </View> */}
          {/* image */}

          <View style={[styles.details,{ marginTop: 10}]}>
          </View>
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              handleChoosePhoto(galleryType)
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
                    {t("common:media")}
                  </Text>
                  <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:shareMedia")}
                  </Text>
                </View>
                <View style={{ display: 'flex', flex: 1, height: 1, backgroundColor: '#000', width: "auto" }} />
              </View>

            </View>
            {/* <View style={styles.typeinnerWrapper}>
              <CustomButton
                isSmall={true}
                isDisabled={loading}
                onCallback={() => handleChoosePhoto(galleryType)}
                title={t("common:gallery")} />
            </View>
            <View style={styles.typeinnerWrapper}>
              <CustomButton
                isSmall={true}
                isDisabled={loading}
                onCallback={() => handleChoosePhoto(audioType)}
                title={t("common:audio")} />
            </View> */}
          </TouchableOpacity>
            <View style={{height:1, backgroundColor: "#f3f3f3", width:"auto", marginVertical: 8}} />
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              handleChoosePhoto(audioType)
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
                onPress={() => {
                }}>
                <View style={{
                  flexDirection: 'column',
                  display: 'flex',
                  width: 35,
                  width: 'auto',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: '#D8D8D8',
                  borderRadius: 10,
                  alignItems: 'center'
                }}>
                  <Image
                    source={iconHeadPhones}
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
                    {t("common:audio")}
                  </Text>
                  <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:shareAudios")}
                  </Text>
                </View>
                <View style={{ display: 'flex', flex: 1, height: 1, backgroundColor: '#000', width: "auto" }} />
              </View>

            </View>
          </TouchableOpacity>
          <View style={{height:1, backgroundColor: "#f3f3f3", width:"auto", marginVertical: 8}} />
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 0 }}
            onPress={() => {
              handleChoosePhoto(documentType)
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
                onPress={() => {
                }}>
                <View style={{
                  flexDirection: 'column',
                  display: 'flex',
                  width: 35,
                  width: 'auto',
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  backgroundColor: '#D8D8D8',
                  borderRadius: 10,
                  alignItems: 'center'
                }}>
                  <Image
                    source={iconDocs}
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
                    {t("common:file")}
                  </Text>
                  <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:shareFile")}
                  </Text>
                </View>
                <View style={{ display: 'flex', flex: 1, height: 1, backgroundColor: '#000', width: "auto" }} />
              </View>

            </View>
          </TouchableOpacity>
          {
            loading ? <View style={[styles.loading]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View> : null
          }
        </View>
      </SafeAreaView>
    </Modal>

  );
};

export default ChooseFileComponent;

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
    textAlign: 'left'
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