import {
  StyleSheet, Text, View, Image,
  TouchableOpacity, SafeAreaView, ActivityIndicator,
  //Modal,
  Dimensions, Platform
} from "react-native";
import React, { useState } from "react";
import CustomButton from "./customButton";
import { COLORS } from "../theme";
import { close } from "../constants/images";
import { RFValue } from "react-native-responsive-fontsize";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { socialPostReport } from "../redux/actions/socialActions";
import { ShowErrorToast, ShowToast } from "../utils/common";
import { REPORT_DATA_en, REPORT_DATA_ar, REPORT_DATA_he, REPORT_DATA_fr, REPORT_DATA_ru } from "../constants/constant";




const SocialReportComponent = ({
  modalVisible, setModalVisible,
  onCallback,
  data,
}) => {
  const authUser = useSelector(({ auth }) => auth.data);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const { t, i18n } = useTranslation();

  // console.log('data', data.post_id)

  const reportData = i18n.language === 'he' ? REPORT_DATA_he :
    i18n.language === 'ar' ? REPORT_DATA_ar :
      i18n.language === 'fr' ? REPORT_DATA_fr :
        i18n.language === 'ru' ? REPORT_DATA_ru : REPORT_DATA_en

  const handleSubmit = (reportText) => {
    const params = {
      post_id: data.post_id,
      report: reportText
    }
    setLoading(true)
    dispatch(socialPostReport(params, authUser.token))
      .then((res) => {
        setLoading(false)
        if (res.status === 200) {
          onCallback(params, res.message)
          // ShowToast(res.message)
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
      // swipeDirection={['up', 'left', 'right', 'down']}
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
          <View style={{ flexDirection: 'column' }}>
            {
              reportData.map((item, index) => {
                return <TouchableOpacity key={index}
                  style={{ paddingTop: 10 }}
                  onPress={() => {
                    handleSubmit(item)
                  }}>
                  <Text style={[styles.text, {
                    textAlign: 'left', marginVertical: 5,
                    fontSize: RFValue(15)
                  }]}>{item}</Text>
                </TouchableOpacity>
              })
            }
          </View>

        </View>
      </SafeAreaView>
    </Modal>

  );
};

export default SocialReportComponent;

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

});