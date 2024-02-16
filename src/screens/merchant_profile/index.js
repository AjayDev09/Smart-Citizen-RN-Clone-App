import { ActivityIndicator, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLORS } from '../../theme'
import CustomInput from '../../components/customInput'
import { useTranslation } from 'react-i18next'
import DropdownComponent from '../../components/dropdownComponent'
import CustomButton from '../../components/customButton'
import { useDispatch, useSelector } from 'react-redux'
import { getProfile, loginActions, updateprofileApi } from '../../redux/actions/loginActions'
import { ShowErrorToast, getLabelField, validateEmail } from '../../utils/common'
import Toast from 'react-native-simple-toast';
import { launchImageLibrary } from 'react-native-image-picker'
import { arrowDown, upload } from '../../constants/images'
import { AMPM, GenderData, businessActivity, businessSector, maritalData } from '../../constants/constant'
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'
import LocationPopup from '../../components/LocationSearch'

const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const MerchantProfile = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useDispatch()

    const navigation = useNavigation()

    const auth = useSelector(({ auth }) => auth);
    const authuser = auth.data
    //console.log('MerchantProfile user', authuser) 

    const [isEditable, setEditable] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const userProfile = useSelector(({ user }) => user.profile)
    const locationList = useSelector(({ coupon }) => coupon.locationList);
    //console.log('MerchantProfile', userProfile)
    const profile = useSelector(({ user }) => user.profile);
    const [photo, setPhoto] = React.useState(null);
    const [userState, setUserState] = useState({
        business_name: '',
        registration_number: '',
        email: '',
        phone_number: '',
        website: '',
        location_url: '',
        marital_status: '',
        business_activity: '',
        business_sector: '',
        establishment_year: '',
        business_logo: '',
        business_hours: '',
        street_address_name: '',
        street_number: '',
        district: '',
        from: '',
        to: '',
        fromAMPM: 'AM',
        toAMPM: 'PM',
        user_name: '',
        bio: '',
        link: '',
        gender: '',
        city:''
    });

    const [IsBusinessNameValidate, setBusinessNameValidate] = useState(false);
    const [IsRegistrationNumberValidate, setRegistrationNumberValidate] = useState(false);
    const [IsEmailValidate, setIsEmailValidate] = useState(false);
    const [IsPhoneNumberValidate, setPhoneNumberValidate] = useState(false);
    const [IsWebsiteValidate, setWebsiteValidate] = useState(false);
    const [IsLocationUrlValidate, setLocationUrlValidate] = useState(false);
    const [IsMaritalStatusValidate, setMaritalStatusValidate] = useState(false);
    const [IsBusinessActivityValidate, setBusinessActivityValidate] = useState(false);
    const [IsBusinessSectorValidate, setBusinessSectorValidate] = useState(false);
    const [IsEstablishmentYearValidate, setEstablishmentYearValidate] = useState(false);
    const [IsBusinessLogoValidate, setBusinessLogoValidate] = useState(false);
    const [IsBusinessHoursValidate, setBusinessHoursValidate] = useState(false);
    const [IsStreetAddressValidate, setStreetAddressValidate] = useState(false);
    const [IsStreetNumberValidate, setStreetNumberValidate] = useState(false);
    const [IsDistrictValidate, setDistrictValidate] = useState(false);
    const [IsCityValidate, setCityValidate] = useState(false);
    const [locationModalVisible, setLocationModalVisible] = useState(false)
    const [LocationData, setLocationData] = useState([])
    const [selectedLocation, setselectedLocation] = useState('')
    const [IsGenderValid, setIsGenderValid] = useState(false);
    console.log('selectedLocation----city---', selectedLocation);
    useEffect(() => {
        const focusHandler = navigation.addListener('focus', () => {
            setPhoto(null);
            setEditable(false)
            getProfileDetails()
        });
        return focusHandler;
    }, [navigation]);
    useEffect(() => {
        console.log('locationList', locationList[0]);
        if (locationList)
            setLocationData(locationList.map((item, index) => {
                return { label: item.city_area, label_ar: item.city_area_ab, label_he: item.city_area_he, value: String(item.id) }
            }))
        return () => {
        }
    }, [locationList])
    useEffect(() => {
        if (userProfile) {
            const data = LocationData?.find((item) => item?.value == userProfile?.city)
            console.log('data userProfile get-------++------>', data);
            setselectedLocation(data ? data : '')
            setUserState({
                ...userState,
                business_name: userProfile.business_name,
                registration_number: userProfile.registration_number,
                email: userProfile.email,
                phone_number: userProfile.phone_number,
                website: userProfile.website,
                location_url: userProfile.location_url,
                //  marital_status: userProfile.marital_status,
                business_activity: userProfile.business_activity,
                business_sector: userProfile.business_sector,
                establishment_year: userProfile.establishment_year,
                business_logo: userProfile.business_logo,
                business_hours: userProfile.business_hours,
                street_address_name: userProfile.street_address_name,
                street_number: userProfile.street_number,
                district: userProfile.district,
                user_name: userProfile.user_name || '',
                bio: userProfile.bio || '',
                link: userProfile.link || '',
                gender: userProfile.gender || '',
            })
        }

    }, [userProfile, LocationData])


    // useEffect(() => {
    //     // console.log('getProfileDetails')
    //     getProfileDetails()
    // }, [])

    const getProfileDetails = () => {
        // if (userProfile) {
        //console.log('authuser.token', authuser.token)
        dispatch(getProfile(authuser.token)).then((res) => {
            //console.log('getProfile', res)
        }).catch((error) => {
            console.log('getProfile', error)
        })
        //}

    }
    const onChangeValue = (name, value) => {
        //  console.log(name, value);
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

        if (!user.business_name.trim()) {
            isError = true;
            setBusinessNameValidate(true);
        }
        if (!user.registration_number.trim()) {
            isError = true;
            setRegistrationNumberValidate(true);
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
        // if (!user.phone_number.toString().trim()) {
        //     isError = true;
        //     setPhoneNumberValidate(true);
        // }
        if (!user.website.toString().trim()) {
            isError = true;
            setWebsiteValidate(true);
        }
        // if (!user.location_url.toString().trim()) {
        //     isError = true;
        //     setLocationUrlValidate(true);
        // }

        // if (!user.marital_status.trim()) {
        //     isError = true;
        //     setMaritalStatusValidate(true);
        // }
        // if (!user.business_activity.trim()) {
        //     isError = true;
        //     setBusinessActivityValidate(true);
        // }
        // if (!user.business_sector.trim()) {
        //     isError = true;
        //     setBusinessSectorValidate(true);
        // }
        // if (!user.establishment_year.toString().trim()) {
        //     isError = true;
        //     setEstablishmentYearValidate(true);
        // }
        // if (user.business_logo && !user.business_logo.trim()) {
        //     isError = true;
        //     setBusinessLogoValidate(true);
        // }
        // if (!user.business_hours.trim()) {
        //     isError = true;
        //     setBusinessHoursValidate(false);
        // }
        // if (!user.street_address_name.trim()) {
        //     isError = true;
        //     setStreetAddressValidate(true);
        // }
        // if (!user.street_number.toString().trim()) {
        //     isError = true;
        //     setStreetNumberValidate(true);
        // }
        // if (!user.district.trim()) {
        //     isError = true;
        //     setDistrictValidate(true);
        // }

        return isError

    }

    let ErrorFn = () => {
        setBusinessNameValidate(false);
        setRegistrationNumberValidate(false);
        setIsEmailValidate(false);
        setPhoneNumberValidate(false);
        setWebsiteValidate(false)
        setLocationUrlValidate(false)
        setMaritalStatusValidate(false);
        setBusinessActivityValidate(false);
        setBusinessSectorValidate(false);
        setEstablishmentYearValidate(false);
        setBusinessLogoValidate(false);
        setBusinessHoursValidate(false);
        setStreetAddressValidate(false);
        setStreetNumberValidate(false);
        setDistrictValidate(false);
        setIsGenderValid(false)
    }

    const onSave = () => {
        const horsfrom = userState.from + userState.fromAMPM
        const horsto = userState.to + userState.toAMPM

        let request = {
            ...userState,
            user_status: authuser.user_status,
        };

        if (userState.from !== '') {
            request.business_hours = horsfrom + " to " + horsto
        }
        
        ErrorFn()
        var isError = hasValidateAllFields(request);
        //&& userState?.gender != ''
        if (isEditable && !isError && userState?.city != '') {
            setLoading(true)
            const data = new FormData();

            Object.keys(request).forEach(key => {
                if (key === 'business_logo') {
                    if (photo) {
                        console.log('business_logo', request[key])
                        data.append('business_logo', {
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
            console.log('updateprofileApi data', data);
            dispatch(updateprofileApi(data, authuser.token))
                .then((response) => {
                    console.log("updateprofileApi res:: ", response)
                    if (response.status == 200) {
                        getProfileDetails()
                        ErrorFn()
                        setLoading(false)
                        setEditable(!isEditable)
                        setTimeout(() => {
                            profile?.isProfileComplete == 0 &&  navigation.navigate('coupons');
                           }, 1000);
                    } else {
                        console.log("updateprofileApi res error:: ", response);
                        setLoading(false)
                    }
                    Toast.show(response.message, Toast.SHORT);
                }).catch((error) => {
                    console.log("updateprofileApi error:: ", error)
                    ShowErrorToast(error)
                    setLoading(false)
                })
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

                console.log("url send >> " + response.assets[0].uri.replace('file://', ''));
                // setUserState({ ...userState, business_logo: image });
                setPhoto(image);
            } else {
                // setPhoto('');
            }
        });
    };
        console.log('userState?.city-->',userState?.city);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
            style={styles.container}>


            <TouchableOpacity style={{ alignSelf: "flex-end" }} onPress={() => { setEditable(!isEditable) }}  >
                <Text style={styles.text}>{isEditable ? t('common:viewBtn') : t('common:editBtn')}</Text>
            </TouchableOpacity>

            <ScrollView style={{ flex: 1, paddingBottom: hp(2), marginTop: hp(0) }}>
                <CustomInput
                    name={'business_name'}
                    value={userState.business_name}
                    setValue={onChangeValue}
                    placeholder={t('common:businessName')}
                    keyboardType={'default'}
                    hasError={IsBusinessNameValidate}
                    errorMessage={t('error:business_name')}
                    // customStyle={{ marginTop: 10 }}
                    isEditable={isEditable}
                />
                <CustomInput
                    name={'registration_number'}
                    value={userState.registration_number}
                    setValue={onChangeValue}
                    placeholder={t('common:regNo')}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsRegistrationNumberValidate}
                    errorMessage={t('error:registration_number')}
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
                    hasError={IsPhoneNumberValidate}
                    errorMessage={t('error:phone_number')}
                    // customStyle={{ marginTop: 10 }}
                    isEditable={isEditable}
                />

                <CustomInput
                    name={'user_name'}
                    value={userState.user_name}
                    setValue={onChangeValue}
                    placeholder={t('common:user_name')}
                    keyboardType={'default'}
                    // hasError={IsOccupationValidate}
                    errorMessage={t("error:user_name")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />
                {/* <View style={{
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
                </View> */}

                <CustomInput
                    name={'bio'}
                    value={userState.bio}
                    setValue={onChangeValue}
                    placeholder={t('common:bio')}
                    keyboardType={'default'}
                    // hasError={IsOccupationValidate}
                    errorMessage={t("error:bio")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />
                <CustomInput
                    name={'link'}
                    value={userState.link}
                    setValue={onChangeValue}
                    placeholder={t('common:link')}
                    keyboardType={'default'}
                    //  hasError={IsOccupationValidate}
                    errorMessage={t("error:link")}
                    isEditable={isEditable}
                    customStyle={{ marginTop: 3 }}
                />

                <CustomInput
                    name={'website'}
                    value={userState.website}
                    setValue={onChangeValue}
                    placeholder={t('common:website')}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    hasError={IsWebsiteValidate}
                    errorMessage={t('error:website')}
                    isEditable={isEditable}
                />

                <CustomInput
                    name={'location_url'}
                    value={userState.location_url}
                    setValue={onChangeValue}
                    placeholder={t('common:location_url')}
                    keyboardType={'default'}
                    returnKeyType={'done'}
                    hasError={IsLocationUrlValidate}
                    errorMessage={t('error:location_url')}
                    isEditable={isEditable}
                />

                {/* <DropdownComponent
                    name={'marital_status'}
                    value={userState.marital_status}
                    setValue={onChangeValue}
                    placeholder={t('common:maritalStatus')}
                    hasError={IsMaritalStatusValidate}
                    errorMessage={t('error:marital_status')}
                    data={maritalData}
                /> */}

                <DropdownComponent
                    name={'business_activity'}
                    value={userState.business_activity}
                    setValue={onChangeValue}
                    placeholder={t('common:businessActivity')}
                    hasError={IsBusinessActivityValidate}
                    errorMessage={t("error:business_activity")}
                    data={businessActivity}
                    disable={!isEditable}
                />

                <DropdownComponent
                    name={'business_sector'}
                    value={userState.business_sector}
                    setValue={onChangeValue}
                    hasError={IsBusinessSectorValidate}
                    errorMessage={t("error:business_sector")}
                    placeholder={t('common:businessSector')}
                    data={businessSector}
                    disable={!isEditable}

                />

                <CustomInput
                    name={'establishment_year'}
                    value={userState.establishment_year}
                    setValue={onChangeValue}
                    placeholder={t('common:establishmentYear')}
                    keyboardType={'default'}
                    hasError={IsEstablishmentYearValidate}
                    errorMessage={t("error:establishment_year")}
                    customStyle={{ marginTop: 3 }}
                    isEditable={isEditable}
                />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 5 }}>
                    <Text style={styles.text}>{t('common:businessLogo')}</Text>
                    <TouchableOpacity style={styles.uploadwrapper} onPress={() => {
                        isEditable ? handleChoosePhoto() : null
                    }}  >
                        <Image
                            source={photo ? { uri: photo.uri } : userState.business_logo ? { uri: userState.business_logo } : upload}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>

                {
                    isEditable ? (<View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: hp(1),
                        }}
                    >
                        <Text style={[styles.text, { flex: 1, textAlign: 'left' }]}>
                            {t('common:businessHours')}
                        </Text>

                        <View style={{ flexDirection: 'column', width: '45%', alignItems: 'center' }} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', height: hp(7) }}>
                                <TextInput
                                    style={[styles.input, {
                                        //marginTop: Platform.OS === 'ios' ? 12 : -5,
                                        flex: 1,
                                        paddingBottom: 2,
                                        height: Platform.OS === 'ios' ? hp(4) : hp(6)
                                    }]}
                                    value={userState.from}
                                    onChangeText={text => {
                                        const format = /[0-9]/;
                                        if (text && text === '' || format.test(text)) {
                                            onChangeValue('from', text)
                                        } else {
                                            onChangeValue('from', "")
                                        }

                                    }}
                                    placeholder={t('common:from')}
                                    cursorColor={COLORS.text}
                                    keyboardType={'numeric'}
                                    returnKeyType={'done'}
                                    placeholderTextColor={COLORS.textPlaceHolder}
                                    activeUnderlineColor={COLORS.border}
                                    maxLength={2}
                                />
                                <View style={{
                                    width: Platform.OS === 'ios' ? hp(11) : hp(11),
                                    marginLeft: wp(3)
                                }}>
                                    <DropdownComponent
                                        name={'fromAMPM'}
                                        value={userState.fromAMPM}
                                        setValue={onChangeValue}
                                        // placeholder={t('common:AM')}
                                        data={AMPM}
                                        style={{ width: hp(9), height: hp(7) }}
                                    />
                                </View>
                            </View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center',
                                marginTop: hp(1), height: hp(7)
                            }}>
                                <TextInput
                                    style={[styles.input, {
                                        //marginTop: Platform.OS === 'ios' ? 12 : hp(1),
                                        paddingBottom: 2,
                                        height: Platform.OS === 'ios' ? hp(4) : hp(6)
                                    }]}
                                    value={userState.to}
                                    onChangeText={text => {
                                        const format = /[0-9]/;
                                        if (text && text === '' || format.test(text)) {
                                            onChangeValue('to', text)
                                        } else {
                                            onChangeValue('to', text)
                                        }
                                    }}
                                    placeholder={t('common:to')}
                                    cursorColor={COLORS.text}
                                    keyboardType={'numeric'}
                                    returnKeyType={'done'}
                                    maxLength={2}
                                    placeholderTextColor={COLORS.textPlaceHolder}
                                    activeUnderlineColor={COLORS.border}
                                />
                                <View style={{
                                    width: Platform.OS === 'ios' ? hp(11) : hp(11),
                                    marginLeft: wp(3),
                                }}>
                                    <DropdownComponent
                                        name={'toAMPM'}
                                        value={userState.toAMPM}
                                        setValue={onChangeValue}
                                        // placeholder={t('common:AM')}
                                        data={AMPM}
                                        style={{ width: hp(9), height: hp(6) }}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>) : <CustomInput
                        name={'business_hours'}
                        value={userState.business_hours}
                        setValue={onChangeValue}
                        placeholder={t('common:businessHours')}
                        keyboardType={'default'}
                        hasError={IsBusinessHoursValidate}
                        errorMessage={t("error:business_hours")}
                        //  customStyle={{ marginTop: 10 }}
                        isEditable={isEditable}
                    />
                }

                <CustomInput
                    name={'street_address_name'}
                    value={userState.street_address_name}
                    setValue={onChangeValue}
                    placeholder={t('common:streetAddName')}
                    keyboardType={'default'}
                    hasError={IsStreetAddressValidate}
                    errorMessage={t("error:street_address_name")}
                    //   customStyle={{ marginTop: 10 }}
                    isEditable={isEditable}
                />
                <CustomInput
                    name={'street_number'}
                    value={userState.street_number}
                    setValue={onChangeValue}
                    placeholder={t('common:streetNo')}
                    keyboardType={'number-pad'}
                    returnKeyType={'done'}
                    hasError={IsStreetNumberValidate}
                    errorMessage={t("error:street_number")}
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
                            {userState?.city == '' && <Text style={{
                                fontSize: RFValue(13),
                                color: COLORS.error,
                                paddingBottom:10
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
                {/* <CustomInput
                    name={'district'}
                    value={userState.district}
                    setValue={onChangeValue}
                    placeholder={t('common:district')}
                    keyboardType={'default'}
                    hasError={IsDistrictValidate}
                    errorMessage={t("error:district")}
                    isEditable={isEditable}
                /> */}


            </ScrollView>
            {/* <View style={{ marginTop: 20, marginHorizontal: '20%', marginBottom: Platform.OS === 'ios' ? 30 : 0 }}>
                <CustomButton onCallback={onSave} title={t('common:Save')} />
            </View> */}
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
            <View style={{ marginVertical: hp(2), marginHorizontal: hp(10) }}>
                <CustomButton onCallback={onSave} title={t('common:save')} />
            </View>
        </KeyboardAvoidingView>
    )
}

export default MerchantProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,
        padding: 20,
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'contain'
    },
    text: {
        fontSize: 20,
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    uploadwrapper: {
        borderRadius: 5,
        borderColor: COLORS.border,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    input: {
        width: 50,
        fontSize: RFValue(18),
        color: COLORS.text,
        borderColor: COLORS.border,
        borderWidth: 0,
        borderBottomWidth: 1,
        //paddingBottom: 2,
        // paddingVertical:5,
        backgroundColor: 'transparent',
        textAlign: 'center',
        fontFamily:
            Platform.OS === 'ios' ? 'MyriadPro-Regular' : 'Myriad-Pro-Regular',
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
        paddingBottom: 10
    },
    Citytext: {
        color: COLORS.white,
        fontSize: RFValue(16),
        marginLeft: 5,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    }
})