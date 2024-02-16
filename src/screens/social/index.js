

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Dimensions, FlatList, Platform, TouchableOpacity, View, StyleSheet, Image, Text } from 'react-native'
import ProfileHeader from './profileHeader'
import { COLORS } from '../../theme'
import FastImage from 'react-native-fast-image'
import { isVideo } from '../../utils/common'
import { arrow_back, iconDefaultUser, iconHeadPhones, iconHome, iconPlusSocial, iconSetting, logo, search } from '../../constants/images'
import { useTranslation } from 'react-i18next'
import SocialProfile from './profile'
import SocialHome from './home'
import SocialReels from './home/Reals'
import CreatePost from './create/CreatePost'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SearchSocialUsers from './search/searchSocialUser'
import { useNavigation } from '@react-navigation/native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useDispatch, useSelector } from 'react-redux'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { Image as ImageCompressor1, Video } from 'react-native-compressor';
import CustomSocialHeader from './CustomSocialHeader'
import { postProfile } from '../../redux/actions/socialActions'
import { UserProfileData } from '../../context/UserProfileProvider'

export const itemArray = [

]

const ImageCompressor = ImageCompressor1
const VideoCompressor = Video
export {
  ImageCompressor,
  VideoCompressor
}

const Social = ({ route }) => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation()
  const [SocialSelectedTab, setSocialSelectedTab] = useState(0)
  const authUser = useSelector(({ auth }) => auth.data)

  console.log('routes.params', route.params)

  const { userProfilePic } = UserProfileData()

  const userID = route.params ? route.params.user_id : authUser.user_id

  useEffect(() => {
    if (route.params)
      setSocialSelectedTab(3)
    return () => {

    }
  }, [route.params && route.params.user_id])

  const name = t("navigate:socialHome")

  useEffect(() => {
    // navigation.setOptions({
    //   title: name,
    //   headerLeft: () => (
    //     <View style={{ display: 'flex', flexDirection: "row", alignItems: "center" }}>
    //       <TouchableOpacity
    //         style={{ width: wp(15), alignItems: 'center' }}
    //         onPress={() => {
    //           SocialSelectedTab === 0 ?
    //             navigation.goBack() : setSocialSelectedTab(0)
    //         }
    //         }
    //       >
    //         <Image
    //           source={arrow_back}
    //           //source={logo}
    //           style={[styles.image_small, {
    //             width: wp(6),
    //             height: wp(6),
    //             tintColor: COLORS.white,
    //           }]}
    //         />
    //       </TouchableOpacity>
    //       <Text style={[styles.itemText, { marginLeft: wp(1), fontSize: RFValue(18) }]}>
    //         {/* Back to Home */}
    //       </Text>
    //     </View>
    //   ),
    //   headerRight: () => (
    //     <>
    //     {
    //         userID === authUser.user_id ?
    //           <TouchableOpacity
    //             style={{ width: wp(15), alignItems: 'center' }}
    //             onPress={() => {
    //               //navigation.goBack()
    //               navigation.navigate('socialSetting')
    //             }
    //             }
    //           >
    //             <Image
    //               source={iconSetting}
    //               style={[styles.image_small, {
    //                 width: wp(6),
    //                 height: wp(6),
    //                 tintColor: COLORS.white,
    //               }]}
    //             />
    //           </TouchableOpacity> : null
    //       }
    //       <TouchableOpacity onPress={() => {
    //         navigation.navigate('coupons');
    //       }} style={{ paddingRight: wp(2), marginRight: 0 }} >
    //         <Image
    //           source={logo}
    //           style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
    //         />
    //       </TouchableOpacity>
    //     </>
    //   )
    // });
  }, []);

  const TabsItems = useMemo(() => {
    return SocialSelectedTab === 0 ? <SocialHome /> :
      SocialSelectedTab === 1 ? <SearchSocialUsers SocialSelectedTab={SocialSelectedTab}  setSocialSelectedTab={setSocialSelectedTab} /> :
        SocialSelectedTab === 2 ? <CreatePost SocialSelectedTab={SocialSelectedTab}  setSocialSelectedTab={setSocialSelectedTab} /> :
          <SocialProfile userID={userID} SocialSelectedTab={SocialSelectedTab} 
          setSocialSelectedTab={setSocialSelectedTab} />
    // <SocialReels userID={authUser.user_id}  />
  }, [SocialSelectedTab])

  const showSearch = {}


  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.secondary,
      paddingBottom: 0
    }}>

      <View style={styles.container}>
        {TabsItems}
      </View>
      <View style={styles.tabWrapper}>
        <TouchableOpacity style={styles.itemWrapper} onPress={() => {
          setSocialSelectedTab(0)
        }}>
          <FastImage style={styles.image}
            source={iconHome}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemWrapper} onPress={() => {
          setSocialSelectedTab(1)
        }}>
          <FastImage style={styles.image}
            source={search}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemWrapper} onPress={() => {
          setSocialSelectedTab(2)
        }}>
          <FastImage style={styles.image}
            source={iconPlusSocial}
            resizeMode={FastImage.resizeMode.cover}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.itemWrapper} onPress={() => {
          setSocialSelectedTab(3)
        }}>
          {userProfilePic  ? 
          <FastImage 
          style={[styles.image,{borderRadius:16}]}
          source={{uri: userProfilePic }}
          
          />
          :<FastImage style={styles.image}
            source={iconDefaultUser}
            resizeMode={FastImage.resizeMode.contain}
          />}
        </TouchableOpacity>
      </View>
    </View>


  )
}

export default Social

const tabHight = Platform.OS === 'ios' ? hp(9.5) : hp(7.5)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: windowWidth,
    maxHeight: windowHeight - tabHight, // 10.5
    position: 'relative',
    backgroundColor: COLORS.secondary,
  },
  tabWrapper: {
    height: tabHight,
    width: windowWidth,
    display: 'flex', flexDirection: 'row', paddingHorizontal: 0,
    backgroundColor: COLORS.primary,
    bottom: 0,
    justifyContent: 'flex-start', alignItems: 'center',
    paddingVertical: 0,
    paddingBottom: Platform.OS === 'ios' ? 10 : 0
  },
  itemWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  image: { width: 25, height: 25 }

})