
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Image, Platform, SafeAreaView } from 'react-native'
import { TouchableOpacity, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { COLORS } from '../theme'
import { arrow_back, iconDefaultUser, logo } from '../constants/images'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import { useHeaderHeight } from '@react-navigation/elements';

const CustomChatHeader = ({ profiePhoto, title, goToSocialProfile }) => {
    const navigation = useNavigation()

    const headerHeight = useHeaderHeight();
    // console.log('headerHeight', headerHeight)

    return (
        <SafeAreaView style={{
            height: Platform.OS === 'ios' ? 110 : 65,
            backgroundColor: COLORS.primary,
            display: 'flex', flexDirection: "row", alignItems: "center",
            // backgroundColor:"#000",
            paddingBottom: 10,
        }}>
            <TouchableOpacity
                style={{
                    marginTop: 15, alignItems: 'flex-end', marginLeft: wp(3),
                    // backgroundColor:"#000",
                }}
                onPress={() => navigation.goBack() //navigate('Home')
                }
            >
                <Image
                    source={arrow_back}
                    style={[styles.image_small, {
                        width: wp(6),
                        height: wp(6),
                        // 
                        marginRight: wp(4),
                        tintColor: COLORS.white,
                    }]}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={goToSocialProfile} style={{ marginTop: 5 }}>
                {
                    profiePhoto ? <FastImage
                        style={[styles.image_small, {
                            width: wp(10),
                            height: wp(10),
                            borderRadius: wp(10) / 2,
                            marginLeft: wp(2),
                            marginRight: wp(2),
                            tintColor: COLORS.white,
                        }]}
                        source={{
                            uri: profiePhoto ? profiePhoto : "",
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    /> : <FastImage
                        style={[styles.image_small, {
                            width: wp(10),
                            height: wp(10),
                            borderRadius: wp(10) / 2,
                            marginLeft: wp(2),
                            marginRight: wp(2),
                            tintColor: COLORS.white,
                        }]}
                        source={iconDefaultUser}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                }

            </TouchableOpacity>
            <TouchableOpacity onPress={goToSocialProfile}
                style={{ flex: 1, marginTop: 5, marginRight: 10, marginLeft: 10 }} >
                <Text style={[styles.cmessage, {
                    textAlign: 'left', color: 'white',
                }]}>{title}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                navigation.navigate('coupons');
            }} style={{ paddingRight: wp(2), marginRight: 0, marginTop: 15 }} >
                <Image
                    source={logo}
                    style={{ width: wp(6), height: wp(6), marginLeft: 5 }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default React.memo(CustomChatHeader)


export const styles = StyleSheet.create({

    cmessage: {
        fontSize: RFValue(16),
        opacity: 1,
    },

});