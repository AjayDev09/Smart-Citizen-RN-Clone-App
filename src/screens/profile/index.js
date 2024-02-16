import { ActivityIndicator, Dimensions, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../theme'
import CustomInput from '../../components/customInput'
import { useTranslation } from 'react-i18next'
import DropdownComponent from '../../components/dropdownComponent'
import CustomButton from '../../components/customButton'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, loginActions, updateprofileApi } from '../../redux/actions/loginActions'
import { ShowErrorToast, getLabelField, validateEmail } from '../../utils/common'
import { ChildrenData, EducationData, maritalData, GenderData } from '../../constants/constant'
import Toast from 'react-native-simple-toast';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { arrowDown, icon_user } from '../../constants/images'
import { launchImageLibrary } from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import { UserProfileData } from '../../context/UserProfileProvider'
import LocationMultiSelectPopup from '../../components/LocationMultiSelectSearch'
import LocationPopup from '../../components/LocationSearch'


const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const Profile = () => {

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data

    const [isEditable, setEditable] = useState(false)

    const userProfile = useSelector(({ user }) => user.profile)

    const [IsFirstNameValidate, setFirstNameValidate] = useState(false);
    const [IsLastNameValidate, setLastNameValidate] = useState(false);
    const [IsEmailValidate, setIsEmailValidate] = useState(false);
    const [IsPasswordValidate, setIsPasswordValidate] = useState(false);
    const [IsPassConfirmValidate, setPassConfirmValidate] = useState(false);
    const [IsPhoneNumValidate, setPhoneNumValidate] = useState(false);
    const [IsIdNumValidate, setIdNumValidate] = useState(false);
    const [IsMaritalStatusValidate, setMaritalStatusValidate] = useState(false);
    const [IsGenderValid, setIsGenderValid] = useState(false);
    const [IsNoOfChildValidate, setNoOfChildValidate] = useState(false);
    const [IsOccupationValidate, setOccupationValidate] = useState(false);
    const [IsEduLevelValidate, setEduLevelValidate] = useState(false);
    const [IsStreetAddressValidate, setStreetAddressValidate] = useState(false);
    const [IsStreetNoValidate, setStreetNoValidate] = useState(false);
    const [IsHouseNoValidate, setHouseNoValidate] = useState(false);
    const [IsCityValidate, setCityValidate] = useState(false);
    const [IsDistrictValidate, setDistrictValidate] = useState(false);

    const [photo, setPhoto] = React.useState(null);
    const { setUserProfilePic } = UserProfileData()
    const [userState, setUserState] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        phone_number: '',
        id_number: '',
        marital_status: '',
        no_of_child: '',
        occupation: '',
        education_level: '',
        street_address_name: '',
        street_number: '',
        house_number: '',
        city: '',
        district: '',
        profile_pic: '',
        user_name: '',
        bio: '',
        link: '',
        gender: ''
    });
    const [isLoading, setLoading] = useState(false)
    const [LocationData, setLocationData] = useState([])
    const [selectedLocation, setselectedLocation] = useState('')
    const profile = useSelector(({ user }) => user.profile);
    console.log('IsGenderValid----city---', IsGenderValid);
    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            setPhoto(null);
            setEditable(false)
            getProfileDetails()
        });
        return focusHandler;
    }, [navigation]);
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    useEffect(() => {
        //console.log('userProfile', userProfile)
        const data = LocationData?.find((item) => item?.value == userProfile?.city)
        console.log('data userProfile get-------++------>', data);
        setselectedLocation(data ? data : '')
        if (userProfile) {
            setUserState({
                first_name: userProfile.first_name || '',
                last_name: userProfile.last_name || '',
                email: userProfile.email || '',
                phone_number: userProfile.phone_number || '',
                id_number: userProfile.id_number || '',
                marital_status: userProfile.marital_status || '',
                no_of_child: String(userProfile.no_of_child) || '',
                occupation: userProfile.occupation || '',
                education_level: userProfile.education_level || '',
                street_address_name: userProfile.street_address_name || '',
                street_number: userProfile.street_number || '',
                house_number: userProfile.house_number || '',
                city: userProfile.city || '',
                district: userProfile.district || '',
                profile_pic: userProfile.profile_pic || '',
                user_name: userProfile.user_name || '',
                bio: userProfile.bio || '',
                link: userProfile.link || '',
                gender: userProfile.gender || '',
            })
        }

    }, [userProfile, LocationData])

    useEffect(() => {
        getProfileDetails()
    }, [])

    const locationList = useSelector(({ coupon }) => coupon.locationList);
    useEffect(() => {
        console.log('locationList', locationList[0]);
        if (locationList)
            setLocationData(locationList.map((item, index) => {
                return { label: item.city_area, label_ar: item.city_area_ab, label_he: item.city_area_he, value: String(item.id) }
            }))
        return () => {
        }
    }, [locationList])

    const getProfileDetails = () => {
        if (authuser) {
            //    console.log('authuser.token', authuser.token)
            dispatch(getProfile(authuser.token)).then((response) => {
                //  console.log("getProfile res:: ", response.data)
            }).catch((error) => {
            })
        }
    }


    console.log('userProfile--------city----->', userProfile?.city);
    console.log('selectedLocation--------city----->', selectedLocation);
    const onChangeValue = (name, value) => {
        setUserState({ ...userState, [name]: value });
    };

    const onChangeCity = (name, value) => {
        console.log("VALUE OF Onchange-------------?", value);
        const data = LocationData?.find((item) => item?.value == value)
        console.log('data onChangeValue---++------>', data);
        setselectedLocation(data)
        setUserState({ ...userState, [name]: value });
    };
    const hasValidateAllFields = (user) => {
        var isError = false;
        if (!user.first_name.trim()) {
            isError = true;
            setFirstNameValidate(true);
        }
        if (!user.last_name.trim()) {
            isError = true;
            setLastNameValidate(true);
        }
        if (!validateEmail(user.email)) {
            isError = true;
            setIsEmailValidate(true);
        }
        if (!user?.city.trim()) {
            setCityValidate(true)
        }
        if (!user?.gender.trim()) {

            setIsGenderValid(true);
        }
        // if (!user.phone_number.toString().trim() || user.phone_number.length < 10) {
        //     isError = true;
        //     setPhoneNumValidate(true);
        // }
        // if (!user.id_number.toString().trim()) {
        //     isError = true;
        //     setIdNumValidate(true);
        // }
        // if (!user.marital_status.trim()) {
        //     isError = true;
        //     setMaritalStatusValidate(true);
        // }
        // if (!user.no_of_child.toString().trim()) {
        //     isError = true;
        //     setNoOfChildValidate(true);
        // }
        // if (!user.occupation.trim()) {
        //     isError = true;
        //     setOccupationValidate(true);
        // }
        // if (!user.education_level.trim()) {
        //     isError = true;
        //     setEduLevelValidate(true);
        // }
        // if (!user.street_address_name.trim()) {
        //     isError = true;
        //     setStreetAddressValidate(true);
        // }
        // if (!user.street_number.toString().trim()) {
        //     isError = true;
        //     setStreetNoValidate(true);
        // }
        // if (!user.house_number.toString().trim()) {
        //     isError = true;
        //     setHouseNoValidate(true);
        // }
        // if (!user.city.trim()) {
        //     isError = true;
        //     setCityValidate(true);
        // }
        // if (!user.district.trim()) {
        //     isError = true;
        //     setDistrictValidate(true);
        // }

        return isError

    }
    let ErrorFn = () => {
        setFirstNameValidate(false);
        setLastNameValidate(false);
        setIsEmailValidate(false);
        setIsPasswordValidate(false);
        setPassConfirmValidate(false);
        setPhoneNumValidate(false);
        setIdNumValidate(false);
        setMaritalStatusValidate(false);
        setIsGenderValid(false)
        setNoOfChildValidate(false);
        setOccupationValidate(false);
        setEduLevelValidate(false);
        setStreetAddressValidate(false);
        setStreetNoValidate(false);
        setHouseNoValidate(false);
        setCityValidate(false);
        setDistrictValidate(false);
    }
    const onSave = () => {
        Keyboard.dismiss()
        let request = {
            ...userState,
            user_status: authuser.user_status,
        };

        ErrorFn()
        var isError = hasValidateAllFields(request);
        console.log('isError', isError)
        if (isEditable && !isError && userState?.city != '' && userState?.gender != '') {
            setLoading(true)
            // console.log('Pressed', authuser);
            const data = new FormData();
            Object.keys(request).forEach(key => {
                if (key === 'profile_pic') {
                    if (photo) {
                        console.log('profile_pic', request[key])
                        data.append('profile_pic', {
                            name: photo.fileName,
                            type: photo.type,
                            uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
                        });
                    } else {
                        data.append(key, request[key]);
                    }
                } else {
                    data.append(key, request[key]);
                }
            });
            console.log('req profile -------data=>', data);
            dispatch(updateprofileApi(data, authuser.token))
                .then((response) => {
                    setLoading(false)
                    console.log("updateprofileApi res:: ", response)
                    if (response.status == 200) {
                        setEditable(!isEditable)
                        getProfileDetails()
                        ErrorFn()
                        setUserProfilePic(response?.data?.profile_pic)
                        Toast.show(response.message, Toast.SHORT);
                       setTimeout(() => {
                        profile?.isProfileComplete == 0 &&  navigation.navigate('coupons');
                       }, 1000);
                    } else {
                        console.log("updateprofileApi res error:: ", response)
                        Toast.show(response.message, Toast.SHORT);
                        setLoading(false)
                    }

                }).catch((error) => {
                    console.log("updateprofileApi error:: ", error)
                    ShowErrorToast(error)
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    };

    const handleChoosePhoto = () => {
        const options = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
            noData: false
        };

        launchImageLibrary(options, (response) => {
            if (response?.assets) {
                console.log("launchImageLibrary >> " + JSON.stringify(response.assets[0].uri));
                const image = response?.assets && response.assets[0];

                console.log("url send >>--------- ", image);
                // setUserState({ ...userState, business_logo: image });
                setPhoto(image);
            } else {
                // setPhoto('');
            }
        });
    };

    //console.log('photo', photo)
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
            style={styles.container}>
            <TouchableOpacity style={{
                display: 'flex', alignItems: "flex-end"
            }} onPress={() => { setEditable(!isEditable) }}  >
                <Text style={styles.text}>{isEditable ? t('common:viewBtn') : t('common:editBtn')}</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={!isEditable} style={styles.uploadwrapper} onPress={handleChoosePhoto}  >
                <Image
                    source={photo ? { uri: photo.uri } : userState.profile_pic ? { uri: userState.profile_pic } : icon_user}
                    style={photo ? styles.image : userState.profile_pic ? styles.image : styles.image_default}
                />
            </TouchableOpacity>
            <ScrollView style={{
                paddingBottom: hp(2),
                paddingHorizontal: wp(3),
            }}>
                <CustomInput
                    name={'first_name'}
                    value={userState.first_name}
                    setValue={onChangeValue}
                    placeholder={t('common:fname')}
                    keyboardType={'default'}
                    hasError={IsFirstNameValidate}
                    errorMessage={t('error:first_name')}
                    customStyle={{ marginTop: hp(1) }}
                    isEditable={isEditable}
                />
                <CustomInput
                    name={'last_name'}
                    value={userState.last_name}
                    setValue={onChangeValue}
                    placeholder={t('common:lname')}
                    keyboardType={'default'}
                    hasError={IsLastNameValidate}
                    errorMessage={t('error:last_name')}
                    customStyle={{ marginTop: 0 }}
                    isEditable={isEditable}
                />

                <CustomInput
                    name={'email'}
                    value={userState.email}
                    setValue={onChangeValue}
                    placeholder={t('common:emailAddress')}
                    keyboardType={'email-address'}
                    hasError={IsEmailValidate}
                    errorMessage={t('error:email')}
                    isEditable={isEditable}
                />

                <CustomInput
                    name={'phone_number'}
                    value={userState.phone_number}
                    setValue={onChangeValue}
                    placeholder={t('common:phoneNumber') + " (" + t("error:optional") + ")"}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsPhoneNumValidate}
                    errorMessage={t('error:phone_number')}
                    // customStyle={{ marginTop: 10 }}
                    isEditable={isEditable}
                />
                {/* <CustomInput
                    name={'id_number'}
                    value={userState.id_number}
                    setValue={onChangeValue}
                    placeholder={t('common:idNumber') +" ("+ t("error:optional")+ ")" }
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsIdNumValidate}
                    errorMessage={t('error:id_number')}
                    isEditable={isEditable}
                /> */}

                <CustomInput
                    name={'user_name'}
                    value={userState.user_name}
                    setValue={onChangeValue}
                    placeholder={t('common:user_name')}
                    keyboardType={'default'}
                    hasError={IsOccupationValidate}
                    errorMessage={t("error:user_name")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />
                <View style={{
                    marginTop: IsGenderValid ? 15 : 0
                }}>
                    <DropdownComponent
                        name={'gender'}
                        value={userState.gender}
                        setValue={onChangeValue}
                        placeholder={t('common:gender')}
                        hasError={IsGenderValid}
                        errorMessage={t('error:gender_error')}
                        data={GenderData}
                        disable={!isEditable}
                    />
                </View>


                <CustomInput
                    name={'bio'}
                    value={userState.bio}
                    setValue={onChangeValue}
                    placeholder={t('common:bio')}
                    keyboardType={'default'}
                    hasError={IsOccupationValidate}
                    errorMessage={t("error:bio")}
                    isEditable={isEditable}
                // customStyle={{ marginTop: 3 }}
                />
                <CustomInput
                    name={'link'}
                    value={userState.link}
                    setValue={onChangeValue}
                    placeholder={t('common:link')}
                    keyboardType={'default'}
                    hasError={IsOccupationValidate}
                    errorMessage={t("error:link")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />


                <DropdownComponent
                    name={'marital_status'}
                    value={userState.marital_status}
                    setValue={onChangeValue}
                    placeholder={t('common:maritalStatus')}
                    hasError={IsMaritalStatusValidate}
                    errorMessage={t('error:marital_status')}
                    data={maritalData}
                    disable={!isEditable}
                />

                <DropdownComponent
                    name={'no_of_child'}
                    value={userState.no_of_child}
                    setValue={onChangeValue}
                    placeholder={t('common:numbersofChildren')}
                    hasError={IsNoOfChildValidate}
                    errorMessage={t("error:no_of_child")}
                    data={ChildrenData}
                    disable={!isEditable}
                />
                <CustomInput
                    name={'occupation'}
                    value={userState.occupation}
                    setValue={onChangeValue}
                    placeholder={t('common:occupation')}
                    keyboardType={'default'}
                    hasError={IsOccupationValidate}
                    errorMessage={t("error:occupation")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />

                <DropdownComponent
                    name={'education_level'}
                    value={userState.education_level}
                    setValue={onChangeValue}
                    placeholder={t('common:educationLevel')}
                    hasError={IsEduLevelValidate}
                    errorMessage={t("error:education_level")}
                    data={EducationData}
                    disable={!isEditable}
                />

                <CustomInput
                    name={'street_address_name'}
                    value={userState.street_address_name}
                    setValue={onChangeValue}
                    placeholder={t('common:streetAddName')}
                    keyboardType={'default'}
                    hasError={IsStreetAddressValidate}
                    errorMessage={t("error:street_address_name")}
                    customStyle={{ marginTop: 3 }}
                    isEditable={isEditable}
                />
                <CustomInput
                    name={'street_number'}
                    value={userState.street_number}
                    setValue={onChangeValue}
                    placeholder={t('common:streetNo')}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsStreetNoValidate}
                    errorMessage={t("error:street_number")}
                    isEditable={isEditable}
                />

                <CustomInput
                    name={'house_number'}
                    value={userState.house_number}
                    setValue={onChangeValue}
                    placeholder={t('common:houseNo')}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsHouseNoValidate}
                    errorMessage={t("error:house_number")}
                    isEditable={isEditable}
                />
                {

                    isEditable ?
                        <>
                            <TouchableOpacity style={styles.CityDropView} onPress={() => {
                                setLocationModalVisible(!locationModalVisible)
                            }}>
                                <Text style={[styles.Citytext]}>
                                    {selectedLocation ? selectedLocation[getLabelField(i18n.language)] : t('common:yourlocation')}
                                </Text>
                                <View>
                                    <Image
                                        source={arrowDown}
                                        style={{ width: 12, height: 12, tintColor: COLORS.primary, left: 0, marginRight: 5 }}
                                    />
                                </View>
                            </TouchableOpacity>
                            {IsCityValidate && <Text style={{
                                fontSize: RFValue(13),
                                color: COLORS.error,
                            }}>{t("error:city")}</Text>}
                        </>
                        :
                        <View style={styles.CityDropView}>
                            <Text style={[styles.Citytext]}>
                                {selectedLocation ? selectedLocation[getLabelField(i18n.language)] : t('common:yourlocation')}
                            </Text>
                            <View>
                                <Image
                                    source={arrowDown}
                                    style={{ width: 12, height: 12, tintColor: COLORS.primary, left: 0, marginRight: 5 }}
                                />
                            </View>
                        </View>
                }

                <CustomInput
                    name={'district'}
                    value={userState.district}
                    setValue={onChangeValue}
                    placeholder={t('common:district')}
                    keyboardType={'default'}
                    hasError={IsDistrictValidate}
                    errorMessage={t("error:district")}
                    isEditable={isEditable}
                />


            </ScrollView>

            {
                locationModalVisible ?
                    <LocationPopup
                        name={'city'}
                        locationData={LocationData}
                        modalVisible={locationModalVisible}
                        setModalVisible={setLocationModalVisible}
                        onCallBack={onChangeCity} />
                    : null
            }


            {
                isLoading ? <ActivityIndicator size="large" color={COLORS.primary} /> : null
            }
            <View style={{ marginVertical: hp(1), marginHorizontal: hp(10) }}>
                <CustomButton onCallback={onSave} title={t('common:save')} />
            </View>

        </KeyboardAvoidingView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        padding: wp(1),
    },
    text: {
        fontSize: RFValue(19),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    uploadwrapper: {
        width: 90,
        borderRadius: 5,
        borderColor: COLORS.border,
        // borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
        alignSelf: 'center'
    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'cover',
        borderRadius: 35
    },
    image_default: {
        width: 70,
        height: 70,
        resizeMode: 'cover',
        tintColor: COLORS.primary,
        borderRadius: 35
    },
    CityDropView: {
        width: (SCREEN_WIDTH - widthP),
        borderColor: "#000",
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingBottom: 5
    },
    Citytext: {
        color: COLORS.white,
        fontSize: RFValue(16),
        marginLeft: 5,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    }
})