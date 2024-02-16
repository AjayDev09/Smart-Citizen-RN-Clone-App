import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  //Modal,
  Dimensions, Platform, I18nManager, TextInput
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./customButton";
import { COLORS } from "../theme";
import { close } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { socialPostReport, socialUserReport } from "../redux/actions/socialActions";
import { ShowErrorToast, ShowToast } from "../utils/common";
import { REPORT_DATA_en, REPORT_DATA_ar, REPORT_DATA_he, REPORT_DATA_fr, REPORT_DATA_ru } from "../constants/constant";
import { ScrollView } from "react-native-gesture-handler";
import CustomInput from "./customInput";




const SocialUserReportComponent = ({
  modalVisible, setModalVisible,
  onCallback,
  data,
}) => {
  const authUser = useSelector(({ auth }) => auth.data);
  const [loading, setLoading] = useState(false)
  const [Report, setReport] = useState(false)
  const dispatch = useDispatch()
  const [comment, setComment] = useState('');

  const { t, i18n } = useTranslation();

  // console.log('data', data.post_id)

  const reportData = i18n.language === 'he' ? REPORT_DATA_he :
    i18n.language === 'ar' ? REPORT_DATA_ar :
      i18n.language === 'fr' ? REPORT_DATA_fr :
        i18n.language === 'ru' ? REPORT_DATA_ru : REPORT_DATA_en


  const onChangeSearch = (name, value) => {
    setComment(value)
  }

  const handleSubmit = () => {
    const params = {
      report_user_id: data.user_id,
      report: Report,
      comment: comment
    }
    console.log('data', data.user_id)
    console.log('params', params)
    setLoading(true)
    dispatch(socialUserReport(params, authUser.token))
      .then((res) => {
        setLoading(false)
        if (res.status === 200) {
          // ShowToast(res.message)
          onCallback(res)
        }
      }).catch((error) => {
        console.log('error', error)
        setLoading(false)
        ShowErrorToast(error)
      })

  };

  return (
    <Modal
      isVisible={modalVisible}
      style={styles.view}
      transparent={true}
      //swipeDirection={['up', 'left', 'right', 'down']}
      // deviceWidth={deviceWidth}
      // deviceHeight={deviceHeight}
      // visible={true}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
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
            <Text style={styles.text}>{t("common:report")}</Text>
          </View>
          <View style={styles.details}>
          </View>
          <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{ flexGrow: 1, height: "80%" }}>
            {
              Report ? <View style={{ flexDirection: 'column', display: 'flex', height: "50%" }}>
                <View style={[{
                  flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                  alignItems: 'flex-end',
                  borderColor: COLORS.border,
                  borderWidth: 1,
                }]}>
                  <TextInput
                    style={[styles.input, {
                      color: "white", // This does not work
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                      borderBottomWidth: 0,
                      marginLeft: (wp(1)),
                      paddingVertical: Platform.OS === 'ios' ? 0 : 0,
                      textAlignVertical: 'center',
                    }]}
                    maxLength={150}
                    value={comment}
                    onChangeText={(text) => onChangeSearch("", text)}
                    placeholder={t("common:addComment")}
                    keyboardType={'default'}
                    cursorColor={COLORS.text}
                    placeholderTextColor={COLORS.textPlaceHolder}
                    activeUnderlineColor={COLORS.border}
                    multiline={true}
                    numberOfLines={3}
                  />
                </View>
              </View>
                :
                <View style={{}}>

                  {
                    reportData.map((item, index) => {
                      return <TouchableOpacity key={index}
                        style={{ paddingTop: 0 }}
                        onPress={() => {
                          setReport(item)
                        }}>
                        <Text style={[styles.text, {
                          textAlign: 'left', marginVertical: 5,
                          fontSize: RFValue(15)
                        }]}>{item}</Text>
                      </TouchableOpacity>
                    })
                  }

                </View>
            }




            {
              Report ?
                <View style={{
                  alignItems: 'center', justifyContent: 'center', display: 'flex', flex: 1,
                }}>
                  <TouchableOpacity style={[styles.buttonStyle,
                  { backgroundColor: COLORS.primary }]}
                    //activeOpacity = { .5 } 
                    onPress={() => { handleSubmit() }} >
                    <Text style={styles.itemText}> {t("common:report")} </Text>
                  </TouchableOpacity>
                </View> :
                null
            }



          </ScrollView>


        </View>
      </SafeAreaView>
    </Modal>

  );
};

export default SocialUserReportComponent;

const styles = StyleSheet.create({
  view: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    // flex:1,
    // backgroundColor: "lavender",
    justifyContent: "center",
    paddingHorizontal: 20
  },
  textContainer: {
    marginTop: 10,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
    color: COLORS.text,
    fontSize: RFValue(18)
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
  itemText: {
    fontSize: RFValue(16),
    color: COLORS.text,
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
  },
  buttonStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    width: 170,
    backgroundColor: COLORS.primary,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    //  width: '100%',
    fontSize: RFValue(18),
    color: COLORS.text,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: "transparent",
    textAlign: 'left',
    fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
  },
});