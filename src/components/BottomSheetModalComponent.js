import { StyleSheet, Text, View, Image,
   TouchableOpacity, SafeAreaView, ActivityIndicator,
   //Modal,
    Dimensions, Platform } from "react-native";
import React, { useState } from "react";
import CustomButton from "./customButton";
import { COLORS } from "../theme";
import ImagePicker from 'react-native-image-picker';
import { close } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";

// const deviceWidth = Dimensions.get("window").width;
// const deviceHeight =
//   Platform.OS === "ios"
//     ? Dimensions.get("window").height
//     : require("react-native-extra-dimensions-android").get(
//         "REAL_WINDOW_HEIGHT"
//       );
const BottomSheetModalComponent = ({
  modalVisible, setModalVisible,
  onCallback,
  title,
}) => {



  const [loading, setLoading] = useState(false)

  const { t, i18n } = useTranslation();
  const onImageCall = () => {
    // setLoading(true)
    handleChoosePhoto('photo')
  }
  const onVideoCall = () => {
    // setLoading(true)
    handleChoosePhoto('video')
  }

  const handleChoosePhoto = (mediaType) => {
    // const options = {
    //   mediaType: mediaType,
    //   selectionLimit: 1,
    //   includeBase64: true,
    // };
    const options = {
      //title: 'Upload Video',
      //takePhotoButtonTitle: 'Record video',
      //  chooseFromLibraryButtonTitle: 'Choose From Library',
      mediaType: mediaType,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
      },
    };
    console.log('launchImageLibrary')
    
    onCallback(mediaType)
    // ImagePicker.launchImageLibrary(options, (response) => {
    //   //  setLoading(false)
    //   if (!response.didCancel && !response.error) {
    //     const path = Platform.select({
    //       android: { "value": response.path },
    //       ios: { "value": response.uri }
    //     }).value;
    //     console.log('path', path)
    //     const param = {
    //       uri: path,
    //       fileName: mediaType,
    //       type: mediaType
    //     }
    //     onCallback(param)
    //   }


    //   // console.log('launchImageLibrary response', response)
    //   // if (response?.assets) {
    //   //   console.log("launchImageLibrary >> " + JSON.stringify(response.assets));
    //   //   const image = response?.assets && response.assets[0];
    //   //   console.log("url send >> " + response.assets[0].uri.replace('file://', ''));
    //   //   // setUserState({ ...userState, business_logo: image });
    //   //   setPhoto(image);
    //   //   postComment(image)
    //   //   // let newArr = [...AddComment];
    //   //   // newArr[index] = (newArr[index] ? newArr[index] : '') + image.uri
    //   //   // setAddComment(newArr)
    //   // } else {
    //   //   // setPhoto('');
    //   // }
    // });


  };
console.log('modalVisible 123', modalVisible)

  return (
    <Modal
      isVisible={modalVisible}
      style={styles.view}
      transparent={true}
      swipeDirection={['up', 'left', 'right', 'down']}
      // deviceWidth={deviceWidth}
      // deviceHeight={deviceHeight}
      // visible={true}
      onRequestClose={() => {
        //  setModalVisible(!modalVisible);
      }}
    >
      <SafeAreaView style={{
        // justifyContent:'center',
        width: '100%',
        backgroundColor: COLORS.secondary,
        flexDirection: 'column',
        // alignSelf: 'center'
        alignSelf: 'center',
        justifyContent: "center",  
        paddingBottom: 20
      }}>
        <TouchableOpacity
          style={{ paddingTop: 10 }}
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

        <View style={styles.container}>
          {/* text header */}
          <View style={styles.textContainer}>
            <Text style={styles.text}>{t("common:chooseLibrary")}</Text>
          </View>
          {/* image */}

          <View style={styles.details}>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.typeinnerWrapper}>
              <CustomButton isDisabled={loading} onCallback={onImageCall} title={t("common:image")} />
            </View>
            <View style={styles.typeinnerWrapper}>
              <CustomButton isDisabled={loading} onCallback={onVideoCall} title={t("common:video")} />
            </View>
          </View>

        </View>
        {/* {
                loading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            } */}
      </SafeAreaView>
    </Modal>

  );
};

export default BottomSheetModalComponent;

const styles = StyleSheet.create({
  view: {
    width: '100%',
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    // flex:1,
    // backgroundColor: "lavender",
    justifyContent: "center", alignItems: "center"
  },
  textContainer: {
    marginTop: 10,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    color:COLORS.text,
    fontSize: RFValue(15)
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

});