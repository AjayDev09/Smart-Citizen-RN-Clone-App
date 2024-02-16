import { Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { styles } from "../../chat/utils/chatStyles";
import { COLORS } from '../../../theme';
import { iconDefaultUser } from '../../../constants/images';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import ReadMoreComponent from '../../../components/readMore';
import { DATE_FORMATE_24 } from '../../../utils/common';

const SocialCommentItem = ({ item, index }) => {
  const { t, i18n } = useTranslation();
  return (
    <TouchableOpacity key={index} style={[styles.cchat, {
      backgroundColor: COLORS.transparent
    }]}  >
      <View style={[styles.crightContainer, { flexDirection: "row", paddingVertical: 5, }]}>
        {item.profile_pic ? <FastImage style={[styles.image_small, {
          marginTop: 5,
        }]}
          source={{
            uri: item.profile_pic ? item.profile_pic : "",
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        /> : <FastImage style={[styles.image_small, {
          marginTop: 5,

        }]}
          source={iconDefaultUser}
          //onError={iconDefaultUser}
          resizeMode={FastImage.resizeMode.contain}
        />}

        <View style={{
          flex: 1,
          flexDirection: "column",

        }}>
          <View style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-between' }}>
            <Text style={[styles.cusername, { maxWidth: "80%" }]}>{item.name}</Text>
          </View>
          <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
            {/* <Text style={[styles.cmessage, { color: COLORS.text, width: "100%", textAlign: 'left', }]}>
              {item?.comment ? item.comment : ""}
            </Text> */}
            <ReadMoreComponent numberOfLines={3} customStyle={[styles.cmessage, {
              color: COLORS.text,
              lineHeight: 20
            }]}>{item?.comment ? item.comment : ""}</ReadMoreComponent>
          </View>
          <View style={{ alignSelf: 'flex-end', marginTop: 2 }}>
            <Text style={[styles.ctime, {
              alignSelf: 'center',
              marginBottom: 5,
              color: COLORS.textPlaceHolder, fontSize: RFValue(12),
            }]}>
              {moment(item.updated_at).locale(i18n.language).format(DATE_FORMATE_24)}
            </Text>
          </View>
        </View>
      </View>

    </TouchableOpacity>
  )
}

export default SocialCommentItem

const styles0 = StyleSheet.create({})