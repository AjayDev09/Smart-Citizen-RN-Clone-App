import React, { useState, useEffect, useMemo } from "react";
import { View, SafeAreaView, FlatList, TouchableOpacity, Image, Platform, ActivityIndicator, TextInput, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmptyListComponent from "../../../components/EmptyListComponent";
import { COLORS } from "../../../theme";
import { RFValue } from "react-native-responsive-fontsize";
import CustomSocialHeader from "../CustomSocialHeader";
import { socialUserConnList } from "../../../redux/actions/socialActions";
import { styles } from "./ConnectUsersStyles";
import ConnectUserComponent from "./ConnectUserComponent";


const ConnectUsers = ({ route }) => {
    const { t, i18n } = useTranslation();
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setLoading] = useState(false);

    const dispatch = useDispatch()
    const resetData = useRef(false);

    const navigation = useNavigation()

    const authUser = useSelector(({ auth }) => auth.data);

    const UserID = route && route.params ? route.params.user_id : 0

    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            //	console.log('focusHandler', resetData.current)
            resetData.current = true
             fetchGroups()
        });
        return focusHandler;
    }, [navigation]);

    useEffect(() => {
        setUsers([])
        fetchGroups()
        // setTimeout(() => {
        // }, 0);
    }, [route && route.params]);

    function isEmpty(str) {
        return (!str || str.length === 0);
    }

    const fetchGroups = () => {
        const params = {
            user_id: UserID
        }
        console.log('socialUserConnList params', params)
        setLoading(true)
        dispatch(socialUserConnList(params, authUser.token)).then((res) => {
            // console.log('socialUserConnList res.data', res.data)
            setLoading(false)
            setUsers(res.data)
        }).catch((error) => {
            // console.log('error', error)
            setLoading(false)
        })
    }


    //   console.log('users', users)
    // console.log('UserID', UserID)
    return (
        <View forceInset={{ bottom: 'never' }} style={styles.chatscreen}>
            <CustomSocialHeader title={t('navigate:connectedUsers')} />
            {users.length > 0 &&
                <View style={styles.chatlistContainer}>
                    <FlatList
                        data={users}
                        renderItem={({ item, index }) => <ConnectUserComponent
                            item={item} index={index} callBack={fetchGroups} UserID={UserID} />}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: hp(15), }}
                    />
                </View>
            }
            <EmptyListComponent isLoading={isLoading} data={users} msg={t('error:users_not_found')} />
            {
                isLoading ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </View>
    );
};

export default ConnectUsers;