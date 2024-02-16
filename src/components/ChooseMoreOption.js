import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  Dimensions, Platform,  
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../theme";
import { close, deleteIcon, iconCopy, } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ShowErrorToast, ShowToast } from "../utils/common";
import Clipboard from "@react-native-community/clipboard";

const SCREEN_WIDTH = Dimensions.get('screen').width


const ChooseMoreOptionComponent = ({
  modalMoreOptionVisible,
  setModalMoreOptionVisible,
  onCallback,
  title,
  receiverID,
  message=""
}) => {

  //const loading = false
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const authUser = useSelector(({ auth }) => auth.data);

  const { t, i18n } = useTranslation();


  const copyToClipboard = () => { 
    //if (copyText) { 
        Clipboard.setString(message); 

        // Display a success message 
        if (Platform.OS === 'android') { 
            ShowToast("Text copied to clipboard!")
        } else if (Platform.OS === 'ios') { 
            ShowToast("Text copied to clipboard!")
        } 
        setModalMoreOptionVisible(!modalMoreOptionVisible)
       // setCopied(true); 
   // } 
}; 


  return (
    <Modal
      isVisible={modalMoreOptionVisible}
      style={styles.view}
      transparent={true}
      swipeDirection={['up', 'left', 'right', 'down']}
      onDismiss={() =>
        setModalMoreOptionVisible(!modalMoreOptionVisible)
      }
      // deviceWidth={deviceWidth}
      // deviceHeight={deviceHeight}
      // visible={true}
      onBackdropPress={() => {
        setModalMoreOptionVisible(!modalMoreOptionVisible);
      }}
    // onRequestClose={() => {
    //     setModalMoreOptionVisible(!modalMoreOptionVisible);
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
              setModalMoreOptionVisible(!modalMoreOptionVisible);
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
          {/* <Text
            style={[styles.text, {
              fontSize: RFValue(16),
              marginLeft: Platform.OS === 'ios' ? '43%' : '50%',
              position: 'absolute',
              textAlign:'left'
            }]}
          >
            {t("common:select")}
          </Text> */}
        </View>
        <View style={{ height: 1, backgroundColor: "#f3f3f3", width: "auto", marginTop: 10 }} />
        <View style={[styles.container]}>
          <View style={[styles.details, { marginTop: 10 }]}>
          </View>
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              //  handleChooseFromMore("photo")
              copyToClipboard()
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
                    source={iconCopy}
                    style={[styles.image, {
                      width: 20,
                      height: 20,
                      tintColor: COLORS.textDark
                    }]}
                  />
                </View>
              </TouchableOpacity>

              <View style={{ marginLeft: 10, flexDirection: 'column', width: "85%" }}>
                <View style={{ marginLeft: 10, paddingBottom: 6, flex: 1, justifyContent: 'center', flexDirection: 'column' }}>
                  <Text
                    style={[styles.buttonText, { fontWeight: 'bold' }]}
                  >
                    {t("common:Copy")}
                  </Text>
                  {/* <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                    {t("common:copy")}
                  </Text> */}
                </View>
                {/* <View style={{
                  display: 'flex',   height: 1,
                  backgroundColor: '#000', width: "auto"
                }} /> */}
              </View>

            </View>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: "#f3f3f3", width: "auto", marginVertical: 8 }} />
          <TouchableOpacity style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            onPress={() => {
              onCallback()
              //  handleChooseFromMore("video")
            }}>
            <View style={[styles.typeinnerWrapper, {
              alignItems: 'center',
              justifyContent: 'center',
            }]}>
              <View
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
                    source={deleteIcon}
                    style={[styles.image, {
                      width: 20,
                      height: 20,
                      tintColor: "red"
                    }]}
                  />
                </View>
              </View>

              <View style={{ marginLeft: 10, flexDirection: 'column', width: "85%", justifyContent: 'center' }}>
                <View style={{ marginLeft: 10, marginBottom: 6, flexDirection: 'column' }}>
                  <Text
                    style={[styles.buttonText, { fontWeight: 'bold', color:"red" }]}
                  >
                    {t("common:delete")}
                  </Text>
                  {/* <Text
                    style={[styles.buttonText, { fontSize: RFValue(14), marginTop: 2 }]}
                  >
                     
                  </Text> */}
                </View>
                {/* <Text style={{
                  display: 'flex',  height: 1,
                  backgroundColor: '#000', width: "auto"
                }} /> */}
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

export default ChooseMoreOptionComponent;

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