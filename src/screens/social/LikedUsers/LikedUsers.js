import React, { useState, useEffect, useMemo } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../../components/EmptyListComponent";
import { COLORS } from "../../../theme";
import CustomSocialHeader from "../CustomSocialHeader";
import { socialPostLikeList, socialUserConnList } from "../../../redux/actions/socialActions";
import { styles } from "./LikedUsersStyles";
import LikedUserComponent from "./LikedUserComponent";

const LIMIT = 10
const LikedUsers = ({ route }) => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const resetData = useRef(false);
    const [offset, seOffset] = useState(0)

    const navigation = useNavigation()

    const authUser = useSelector(({ auth }) => auth.data);

    const postID = route && route.params ? route.params.post_id : 0

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            //	console.log('focusHandler', resetData.current)
            resetData.current = true
            fetchResult()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        setUsers([])
        setTimeout(() => {
            fetchResult()
        }, 0);
    }, [route && route.params]);

    function isEmpty(str) {
        return (!str || str.length === 0);
    }

    const fetchResult = () => {
        let pageToReq = offset;
        if (resetData.current) {
            pageToReq = 0;
        }
        const params = {
            post_id: postID,
            offset: pageToReq,
            limit: LIMIT
        }
        console.log('params', params)
        setLoading(true)
        //if (SocialCommentRef.current)
        dispatch(socialPostLikeList(params, authUser.token))
            .then((res) => {
                setLoading(false)
                //  if (SocialCommentRef.current)
                if (res.status === 200) {
                    if (resetData.current) {
                        setUsers([])
                        setUsers(res.data)
                        seOffset(LIMIT)
                        resetData.current = false;
                    } else {
                        console.log('res.data', offset + LIMIT)
                        if (res.data && res.data.length > 0 && users.length >= LIMIT) {
                            setUsers(users.concat(res.data))
                            seOffset(offset + LIMIT)
                        }
                    }
                }
            }).catch((error) => {
                setLoading(false)
                console.log('res.error', error)
            })
    };

console.log('users', users)
    //   console.log('users', users)
    // console.log('UserID', UserID)
    return (
        <View forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
            <CustomSocialHeader title={t('navigate:likes')} />
            <View style={styles.chatlistContainer}>
                <FlatList
                    data={users}
                    renderItem={({ item, index }) => <LikedUserComponent
                        item={item} index={index} callBack={fetchResult} UserID={0} />}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    onEndReached={fetchResult}
                    onEndReachedThreshold={0.7}
                />
            </View>
            <EmptyListComponent isLoading={isLoading} data={users} msg={t('error:users_not_found')} />
            {
                isLoading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </View>
    );
};

export default LikedUsers;