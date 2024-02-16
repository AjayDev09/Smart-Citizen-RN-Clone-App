//import liraries
import React, {  useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../../../theme';
import { arrowDown, arrow_back, iconBlock, iconLock, iconNext, iconSetting } from '../../../constants/images';
import { RFValue } from 'react-native-responsive-fontsize';
import { RotateOutDownRight } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { postProfile } from '../../../redux/actions/socialActions';

// create a component
const SocialSetting = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const authUser = useSelector(({ auth }) => auth.data)
    const [useSocialProfile, setSocialProfile] = useState()

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
          getPostProfile()
        });
        return focusHandler;
      }, [navigation])

        const getPostProfile = () => {
            const param = {
                user_id: authUser.user_id
            }
            console.log('postProfile param', param)
            dispatch(postProfile(param, authUser.token))
              .then((res) => {
               // console.log('res.data', res.data)
                if (res.status === 200) {
                  setSocialProfile(res.data)
                }
              }).catch((error) => {
                console.log('res.error', error)
              })
    }
    
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={()=> {
                navigation.navigate("social-account-privacy")
                
            }} style={styles.childContainer}>
                <View style={styles.leftContainer}>
                    <Image
                        source={iconLock}
                        style={[styles.image_small]}
                    />
                    <Text style={[styles.itemText, { fontSize: RFValue(16), fontWeight: '500' }]}>
                        {t("common:account_privacy")}
                    </Text>

                </View>
                <View style={styles.rightContainer}>
                    <Image
                        source={iconNext}
                        style={[styles.image_small]}
                    />
                    <Text style={[styles.itemText,]}>
                        {useSocialProfile && useSocialProfile.account_privacy === 0 ? t("common:public"): t("common:private") } 
                    </Text>
                </View>

            </TouchableOpacity>
            <TouchableOpacity  onPress={()=> navigation.navigate("blocked-users")}
            style={styles.childContainer}>
                <View style={styles.leftContainer}>
                    <Image
                        source={iconBlock}
                        style={[styles.image_small]}
                    />
                    <Text style={[styles.itemText, { fontSize: RFValue(16), fontWeight: '500' }]}>
                        {t("common:blocked_users")}
                    </Text>

                </View>
                <View style={styles.rightContainer}>
                    <Image
                        source={iconNext}
                        style={[styles.image_small]}
                    />
                    <Text style={[styles.itemText,]}>
                        {useSocialProfile && useSocialProfile.block_user_count}
                    </Text>
                </View>

            </TouchableOpacity>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    childContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: hp(3),
        paddingHorizontal: wp(3)
    },
    leftContainer: {
        flex: 1, display: 'flex',
        justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center'
    },
    rightContainer: {
        flex: 1, display: 'flex',
        flexDirection: 'row-reverse', alignItems: 'center'
    },
    image_small: {
        width: wp(6),
        height: wp(6),
    },
    itemText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        //textAlign: 'left',
        marginLeft: wp(2),
        marginRight: wp(1),
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
});

//make this component available to the app
export default SocialSetting;
