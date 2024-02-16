import { Dimensions, FlatList, I18nManager, Image, Keyboard, KeyboardAvoidingView, Platform, ScrollView, Share, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import DatePicker from 'react-native-date-picker'

import { COLORS } from '../../theme'
import { calendar, close, logo, mac_logo, send_message, share } from '../../constants/images'
import { getlocationList, postAddCoupon, postAddMyCoupon, postdeleteCouponImage, postSaveMyCoupon, postUpdateCoupon } from '../../redux/actions/couponActions';
import CustomInput from '../../components/customInput';
import moment from 'moment';
import DropdownComponent from '../../components/dropdownComponent'
import axios from 'axios';
import { LANGUAGES } from '../settings';
import { ActivityIndicator } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { DATE_, IsRightOrLeft, ShowErrorToast, getLabelField, isVideo, urlPatternValidation } from '../../utils/common';
import CustomVideoPlayer from '../../components/customVideoPlayer';
import FastImage from 'react-native-fast-image';
import VideoFullScreen from '../publicFeed/videoFullscreen';
import CustomUpload from '../../components/customUpload';
import { createFileUriFromContentUri } from '../../constants/constant';
import LocationPopup from '../../components/LocationSearch';

const SCREEN_WIDTH = Dimensions.get('screen').width
const widthP = (SCREEN_WIDTH * 15) / 100
const AddEditCoupon = ({ route }) => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation();
    const dispatch = useDispatch()
    if (route) {
        // const { itemId, item } = route.params;
        //    console.log('AddEditCoupon  ', route.params)
    }
    const authuser = useSelector(({ auth }) => auth.data);
    const userProfile = useSelector(({ user }) => user.profile)
    const locationList = useSelector(({ coupon }) => coupon.locationList);
    // console.log('locationList', locationList)
    const categories = useSelector(({ coupon }) => coupon.couponsCategory);
    const couponsCategory = categories && categories.coupons ? categories.coupons : [];

    const [IsCouponTitle, setCouponTitleValidate] = useState(false);
    const [IsDescription, setDescriptionValidate] = useState(false);
    const [IsCode, setCodeValidate] = useState(false);
    const [IsLocation, setLocationValidate] = useState(false);
    const [IsQRCodeUrl, setQRCodeUrlValidate] = useState(false);
    const [IsCategory, setCategoryValidate] = useState(false);
    const [IsDiscountType, setDiscountTypeValidate] = useState(false);
    const [IsDiscountAmount, setDiscountAmountValidate] = useState(false);

    const [IsTermsAdded, setTermsAddedValidate] = useState(false);

    const [open, setOpen] = useState(false)
    const [photo, setPhoto] = useState(null);
    const [isButtonClick, setButtonClick] = useState(false);
    const [AddTerms, setAddTerms] = useState('')
    const [locationData, setLocationData] = useState([])
    const [categoryDataArray, setCategoryDataArray] = useState([]);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [selectedImage, setselectedImage] = React.useState(0);
    const [selectedImageList, setselectedList] = React.useState([]);

    const [SelectedImages, setSelectedImages] = useState([])
    const [locationModalVisible, setLocationModalVisible] = useState(false)


    const [couponState, setCouponState] = useState({
        coupon_code: "",
        discount_amount: "",
        discount_type: "",
        location_id: '',
        expiry_date: moment().format(DATE_),
        coupon_title: "",
        coupon_title_ar: "",
        coupon_title_he: "",
        coupon_title_fr: "",
        coupon_title_ru: "",
        coupon_description: "",
        coupon_description_ar: "",
        coupon_description_he: "",
        coupon_description_fr: "",
        coupon_description_ru: "",
        category_id: "",
        qrcode_url: "",
        term_condition: [],
        term_condition_ar: [],
        term_condition_he: [],
        term_condition_fr: [],
        term_condition_ru: [],
        business_logo: userProfile.business_logo,
        language_code: i18n.language,
        images: []
    })

    useEffect(() => {
        if (locationList && locationList.length <= 0) {
            console.log('test')
            dispatch(getlocationList(authuser.token))
        }
    }, [])




    useEffect(() => {
        setLocationData(locationList.map((item) => {
            return { label: item.city_area, label_ar: item.city_area_ab, label_he: item.city_area_he, value: String(item.id) }
        }))


        if (couponsCategory) {
            setCategoryDataArray(couponsCategory.map((item, index) => {
                return { label: item.category_name, label_ar: item.category_name_ab, label_he: item.category_name_he, value: String(item.category_id) }
            }))
        }
        return () => {
        }
    }, [locationList, couponsCategory, couponState.location_id, couponState.category_id])



    const getchangeLang = async (request) => {

        const finalArray = []

        const filteredLang = LANGUAGES.filter(({ value }) => value !== i18n.language)
        //  const filteredLang = LANGUAGES


        const strTerms = [].concat([request[titlename], request[descname]], request[termsname])

        var srty = []

        strTerms.forEach(element => {
            srty.push(element)
        });
        console.log('strTerms', JSON.stringify(srty))
        for await (const { value } of filteredLang) {
            const lang = value;
            const strQuery = `{"q": ${JSON.stringify(srty)},"source": "${i18n.language}","target": "${lang}" }`
            //  const strQuery = `{"q": ${JSON.stringify(srty)},"target": "${lang}" }`
            //  console.log('strQuery', strQuery)
            const options0 = {
                method: 'POST',
                url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2',
                // headers: {
                //     'content-type': 'application/json',
                //     // 'X-RapidAPI-Key': 'cfe6dd3265msh572ac20d7123917p147913jsne2a8167a8ff3',
                //     'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com',
                //     'X-RapidAPI-Key': '880da63e94mshf109a148aabede0p143d9cjsnf3f0e133c056',
                // },
                headers: {
                    'X-RapidAPI-Key': '880da63e94mshf109a148aabede0p143d9cjsnf3f0e133c056',
                    'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
                },
                data: strQuery
                // data: `{"q":["Festival Discount Flat 45%", "Description", "Dominos Everyday Value Offer - Get the Lowest Prices on Pizzas.",
                //  "No Dominos coupon code required.", "Minimum order of 2 pizzas is necessary." ],
                // "source": "${i18n.language}","target": "${lang}" }`,
            };

            const options = {
                method: 'POST',
                url: 'https://deep-translate1.p.rapidapi.com/language/translate/v2/detect',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': 'cfe6dd3265msh572ac20d7123917p147913jsne2a8167a8ff3',
                    'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
                },
                data: strQuery
            };
            await axios.request(options).then(function (response) {
                const translations = response.data.data.translations.translatedText;
                //console.log('translations>>>',translations.length,  translations);
                const title = translations.slice(0, 1);
                const desc = translations.slice(1, 2);
                const terms = translations.slice(2, translations.length);
                const title_ = lang === 'en' ? 'coupon_title' : "coupon_title_" + lang
                const desc_ = lang === 'en' ? 'coupon_description' : "coupon_description_" + lang
                const terms_ = lang === 'en' ? "term_condition" : "term_condition_" + lang

                //   finalArray.push({ [title_]: title, [terms_]: JSON.stringify(terms) });
                // console.log('request', finalArray)
                //console.log("title> ", title[0], "Terms >>> ", JSON.stringify(terms));

                request[title_] = title[0]
                request[desc_] = desc[0]
                request[terms_] = JSON.stringify(terms)
                // console.log(' request[terms_]', request[terms_], terms)
            }).catch(function (error) {
                console.error("catch error ", error);

                const title_ = lang === 'en' ? 'coupon_title' : "coupon_title_" + lang
                const desc_ = lang === 'en' ? 'coupon_description' : "coupon_description_" + lang
                const terms_ = lang === 'en' ? "term_condition" : "term_condition_" + lang

                request[title_] = request[titlename]
                request[desc_] = request[descname]
                request[terms_] = request[termsname]
            });
        }


        //   console.log('request', request)

        return request
    }


    const getchangeLangTranslo = async (request) => {

        const filteredLang = LANGUAGES.filter(({ value }) => value !== i18n.language)
        const strTerms = [].concat([request[titlename], request[descname]], request[termsname])

        for await (const { value } of filteredLang) {
            const lang = value;
            const from = i18n.language;
            var srty = []
            strTerms.forEach(element => {
                const item = {
                    "from": from,
                    "to": lang,
                    "text": element
                }
                srty.push(item)
            });
            //  console.log('strTerms', JSON.stringify(srty))
            const options = {
                method: 'POST',
                url: 'https://translo.p.rapidapi.com/api/v3/batch_translate',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '55d5a4c363msh20d5eb7ffe5f0e5p18ffd1jsnd2a013785100',
                    'X-RapidAPI-Host': 'translo.p.rapidapi.com'
                },
                data: JSON.stringify(srty)
            };
            await axios.request(options).then(function (response) {
                const translations = response.data.batch_translations;
                //    console.log('translations>>>', translations);
                const title = translations.slice(0, 1)[0].text;
                const desc = translations.slice(1, 2)[0].text;
                const terms = translations.slice(2, translations.length);
                console.log('title >>>', title);
                console.log('desc >>>', desc);
                console.log('terms >>>', terms);
                var finalTerms = []
                terms.forEach(element => {
                    finalTerms.push(element.text)
                });
                console.log('finalTerms >>>', finalTerms);
                const title_ = lang === 'en' ? 'coupon_title' : "coupon_title_" + lang
                const desc_ = lang === 'en' ? 'coupon_description' : "coupon_description_" + lang
                const terms_ = lang === 'en' ? "term_condition" : "term_condition_" + lang

                request[title_] = title
                request[desc_] = desc
                request[terms_] = JSON.stringify(finalTerms)
                console.log(' request[terms_]', finalTerms)
            }).catch(function (error) {
                const title_ = lang === 'en' ? 'coupon_title' : "coupon_title_" + lang
                const desc_ = lang === 'en' ? 'coupon_description' : "coupon_description_" + lang
                const terms_ = lang === 'en' ? "term_condition" : "term_condition_" + lang

                request[title_] = request[titlename]
                request[desc_] = request[descname]
                request[terms_] = JSON.stringify(request[termsname])


                //  console.error(error);
            });
        }

        //   console.log('request', request)

        return request
    }

    useEffect(() => {

        // getchangeLang()

        navigation.setOptions({ title: route.params && route.params.itemId ? t("navigate:editCoupon") : t("navigate:addCoupon") });

        if (route.params && route.params.itemId) {
            const item = route.params.item
            //   console.log('couponState.location_id', item)
            console.log('item.term_condition', item.term_condition)
            console.log('item.term_condition_ar', item.term_condition_ar)
            console.log('item.term_condition_he', item.term_condition_he)
            setCouponState({
                ...couponState,
                coupon_code: item.coupon_code,
                discount_amount: item.discount_amount,
                discount_type: item.discount_type,
                location: item.location,
                expiry_date: moment(item.expiry_date).format(DATE_),
                coupon_title: item.coupon_title,
                coupon_title_ar: item.coupon_title_ar,
                coupon_title_he: item.coupon_title_he,
                coupon_title_fr: item.coupon_title_fr,
                coupon_title_ru: item.coupon_title_ru,
                coupon_description: item.coupon_description,
                coupon_description_ar: item.coupon_description_ar,
                coupon_description_he: item.coupon_description_he,
                coupon_description_fr: item.coupon_description_fr,
                coupon_description_ru: item.coupon_description_ru,
                category_id: String(item.category_id),
                qrcode_url: item.qrcode_url,
                term_condition: item.term_condition,
                term_condition_ar: item.term_condition_ar,
                term_condition_he: item.term_condition_he,
                term_condition_fr: item.term_condition_fr,
                term_condition_ru: item.term_condition_ru,
                business_logo: item.business_logo,
                location_id: String(item.location_id),
                images: item.image ? item.image : [],
            })
        }
    }, [route.params])


    const onChangeValue = (name, value) => {
        //  console.log(name, value);
        setCouponState({ ...couponState, [name]: value });
    };

    const isValidate = (request) => {
        setCouponTitleValidate(false);
        setDescriptionValidate(false);
        setCodeValidate(false);
        setQRCodeUrlValidate(false);
        setDiscountAmountValidate(false);
        setDiscountTypeValidate(false);
        setLocationValidate(false);
        setCategoryValidate(false);

        var isError = false

        if (!request[titlename].trim()) {
            isError = true;
            setCouponTitleValidate(true);
        }
        if (!request[descname].trim()) {
            isError = true;
            setDescriptionValidate(true);
        }
        if (!request.coupon_code.trim()) {
            isError = true;
            setCodeValidate(true);
        }
        console.log('urlPatternValidation(request.qrcode_url)', urlPatternValidation(request.qrcode_url))
        if (request.qrcode_url && !request.qrcode_url.trim()) {
            isError = true;
            setQRCodeUrlValidate(true);
        }
        if (!urlPatternValidation(request.qrcode_url)) {
            isError = true;
            setQRCodeUrlValidate(true);
        }
        if (!request.discount_amount.trim()) {
            isError = true;
            setDiscountAmountValidate(true);
        }
        if (!request.discount_type.trim()) {
            isError = true;
            Toast.show(t('error:discount_type'), Toast.SHORT);
            setDiscountTypeValidate(true);
        }
        if (request.discount_type === "Percentage") {
            if (request.discount_amount > 100) {
                Toast.show(t('error:discount_percent'), Toast.SHORT);
                isError = true;
                setDiscountAmountValidate(true);
            }
        }

        if (!request.location_id.trim()) {
            isError = true;
            setLocationValidate(true);
        }
        if (!request.category_id.trim()) {
            isError = true;
            setCategoryValidate(true);
        }

        if (request[termsname].length <= 0) {
            isError = true;
            Toast.show(t('error:terms'), Toast.SHORT);
        }
        return isError
    }


    const addCoupon = async () => {
        let request = {
            ...couponState,
        };
        //   console.log('request', request)
        var isError = isValidate(request)


        if (!isError) {
            // console.log('request >>>', request)
            setButtonClick(true)
            //   const req = await getchangeLang(request)
            const req = await getchangeLangTranslo(request)
            req[termsname] = JSON.stringify(req[termsname])
            console.log('req >>>', req)
            const data = new FormData();
            // return
            if (couponState.images && couponState.images.length > 0) {
                for (let index = 0; index < couponState.images.length; index++) {
                    const image = couponState.images[index];
                    const url = image ?
                        Platform.OS === 'android' && image.type === 'video/mp4' ?
                            await createFileUriFromContentUri(image.uri) :
                            image.uri : ''
                    const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
                    data.append('image[]', {
                        name: fileName,
                        type: image.type,
                        uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : url,
                    });
                }
            }

            Object.keys(req).forEach(key => {
                if (key !== 'images') {
                    data.append(key, req[key]);
                }
            });

            // delete data._parts.images
            console.log('postAddCoupon req', data);
            //  setButtonClick(false)
            dispatch(postAddCoupon(data, authuser.token))
                .then((response) => {
                    setButtonClick(false)
                    console.log("postAddCoupon res:: ", response)
                    if (response.status == 200) {
                        navigation.goBack()
                    } else {
                        // console.log("postAddCoupon res error:: ", response)
                    }
                    Toast.show(response.message, Toast.SHORT);
                }).catch((error) => {
                    console.log('error >>>>', error)
                    setButtonClick(false)
                    // console.log("postAddCoupon error:: ", error)
                    ShowErrorToast(error)
                })
        }
    }


    const updateCoupon = async () => {
        let request = {
            ...couponState,
            coupon_id: route.params.item.coupon_id
        };

        var isError = isValidate(request)

        if (!isError) {
            setButtonClick(true)
            const req = await getchangeLangTranslo(request)
            req[termsname] = JSON.stringify(req[termsname])
            console.log('req >>>', req)

            const data = new FormData();
            if (couponState.images && couponState.images.length > 0) {
                for (let index = 0; index < couponState.images.length; index++) {
                    const image = couponState.images[index];
                    console.log('image UUU', image.uri ? image.id : "null")
                    if (image.uri) {
                        const url = image ?
                            Platform.OS === 'android' && image.type === 'video/mp4' ?
                                await createFileUriFromContentUri(image.uri) :
                                image.uri : ''
                        const fileName = image ? Platform.OS === 'android' && image.type === 'video/mp4' ? 'video.mp4' : image.fileName : ''
                        data.append('image[]', {
                            name: fileName,
                            type: image.type,
                            uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : url,
                        });
                    }
                }
            }
            Object.keys(req).forEach(key => {
                if (key !== 'images') {
                    data.append(key, req[key]);
                }
            });
            //console.log('req >>>>', data);
            // setButtonClick(false)
            // return
            dispatch(postUpdateCoupon(data, authuser.token))
                .then((response) => {
                    console.log("postUpdateCoupon res:: ", response)
                    setButtonClick(false)
                    if (response.status == 200) {
                        // getProfileDetails()
                        navigation.goBack()
                    } else {
                        console.log("postUpdateCoupon res error:: ", response)
                    }
                    Toast.show(response.message, Toast.SHORT);
                }).catch((error) => {
                    setButtonClick(false)
                    console.log("postUpdateCoupon error:: ", error)
                    ShowErrorToast(error)
                })
        }
    }

    const addTerms = (value) => {
        const term_conditions = [...couponState[termsname], value]
        setCouponState({ ...couponState, [termsname]: term_conditions });
    }

    const deleteTerms = (pos) => {
        const term_conditions = [...couponState[termsname]]
        term_conditions.splice(pos, 1)
        //   console.log('pos', pos, term_conditions,)
        setCouponState({ ...couponState, [termsname]: term_conditions });
    }

    const setImages = async (image) => {
        // setSelectedImages([...SelectedImages, image])
        setCouponState({ ...couponState, images: [...couponState.images, image] });
    }

    const deleteImages = (pos) => {
        const tempImages = [...couponState.images]
        const image = couponState.images[pos]
        if (image.id) {
            console.log('delete api call')
            deleteImageApiCall(image.id)
        }
        tempImages.splice(pos, 1)
        //setCouponState({ ...couponState, images: tempImages });
        // setSelectedImages(tempImages)
        setCouponState({ ...couponState, images: tempImages });
    }


    const deleteImageApiCall = (id) => {
        const params = {
            image_id: id
        }
        dispatch(postdeleteCouponImage(params, authuser.token))
            .then((response) => {
                console.log("postdeleteCouponImage res:: ", response)
                Toast.show(response.message, Toast.SHORT);
            }).catch((error) => {
                ShowErrorToast(error)
            })
    }


    const renderImagesItem = ({ item, index }, parentIndex) => {
        //    console.log('renderImagesItem item', item.uri ? item.uri : item.image)
        return (
            <>
                <TouchableOpacity
                    style={{ width: 150, height: 60, marginHorizontal: 0 }} onPress={() => {
                        //  console.log('SelectedImages[parentIndex].images', couponState.images)
                        setModalVisible(true)
                        setselectedImage(index)
                        setselectedList(couponState.images)
                    }}>
                    {
                        // item.toString().endsWith("mp4") || item.toString().endsWith("mov") ?
                        isVideo(item) ?
                            <CustomVideoPlayer
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                videoUrl={item.uri ? item.uri : item.image}
                                itemList={couponState.images}
                                selectedImage={index}
                                videoHight={120}
                                videoWidth={150} />
                            // <></>
                            :
                            <FastImage style={{ width: 150, height: 120 }}
                                source={{
                                    uri: item ? item.uri ? item.uri : item.image : "",
                                    priority: FastImage.priority.normal,
                                }}
                                resizeMode={FastImage.resizeMode.cover}
                            />
                    }
                </TouchableOpacity>

                <TouchableOpacity style={{
                    justifyContent: 'flex-start',
                    marginLeft: wp("-5%")
                }} onPress={() => {
                    deleteImages(index)
                }}>
                    <Image
                        source={close}
                        style={[styles.image_small, {
                            width: 15,
                            height: 15,
                            marginRight: 12,
                            tintColor: COLORS.primary
                        }]}
                    />
                </TouchableOpacity>
            </>
        )
    }

    const selectedLocation = locationData.find((item) => item.value === couponState.location_id)
    const labelField = i18n.language === 'he' ? "label_he" : i18n.language === 'ar' ? 'label_ar' : "label"
    const titlename = i18n.language === 'en' ? 'coupon_title' : "coupon_title_" + i18n.language
    const descname = i18n.language === 'en' ? 'coupon_description' : "coupon_description_" + i18n.language
    const termsname = i18n.language === 'en' ? "term_condition" : "term_condition_" + i18n.language

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100} style={styles.container}>
            <ScrollView keyboardShouldPersistTaps={"handled"} style={{ paddingBottom: 20 }}>
                <View>

                    <View style={{ flexDirection: 'row', marginLeft: 10, alignItems: 'center', paddingTop: hp(1) }}>

                        {/* <TouchableOpacity onPress={handleChoosePhoto}  > */}
                        <Image
                            source={couponState.business_logo ? { uri: couponState.business_logo } : logo}
                            style={[styles.image, {
                                width: 100,
                                height: 100,
                            }]}
                        />
                        {/* </TouchableOpacity> */}

                        <View style={{ marginLeft: 10, }}>
                            <CustomInput
                                name={titlename}
                                value={couponState[titlename]}
                                setValue={onChangeValue}
                                placeholder={t('common:coupon_title')}
                                keyboardType={'default'}
                                hasError={IsCouponTitle}
                                errorMessage={t('error:coupon_title')}
                                customStyle={{ width: wp('66%') }}
                            />
                            <CustomInput
                                name={descname}
                                value={couponState[descname]}
                                setValue={onChangeValue}
                                placeholder={t('common:coupon_description')}
                                keyboardType={'default'}
                                //  returnKeyType={'done'}
                                hasError={IsDescription}
                                errorMessage={t(`error:coupon_description`)}
                                customStyle={{ width: wp('66%') }}
                                isMultiline={true}
                            />
                        </View>
                    </View>

                    <View style={{ alignItems: 'flex-start', marginLeft: 20, marginTop: 10 }}>
                        <CustomInput
                            name={'coupon_code'}
                            value={couponState.coupon_code}
                            setValue={onChangeValue}
                            placeholder={t('common:coupon_code')}
                            keyboardType={'default'}
                            //returnKeyType={'done'}
                            hasError={IsCode}
                            errorMessage={t("error:coupon_code")}
                        />
                        <CustomInput
                            name={'qrcode_url'}
                            value={couponState.qrcode_url}
                            setValue={onChangeValue}
                            placeholder={t('common:qrcode_url')}
                            keyboardType={'default'}
                            //returnKeyType={'done'}
                            hasError={IsQRCodeUrl}
                            errorMessage={t("error:qrcode_url")}
                        />

                        <CustomInput
                            name={'discount_amount'}
                            value={couponState.discount_amount}
                            setValue={onChangeValue}
                            placeholder={t('common:discount_amount')}
                            keyboardType={'number-pad'}
                            returnKeyType={'done'}
                            hasError={IsDiscountAmount}
                            errorMessage={t("error:discount_amount")}
                        />

                        <View style={styles.typeWrapper}>
                            <Text style={[styles.headerTitle,
                            { color: COLORS.textDark, marginEnd: 10 }]}>
                                {t("common:discount_type")}</Text>
                            <View style={styles.typeinnerWrapper}>
                                <TouchableOpacity
                                    style={styles.rbStyle}
                                    onPress={() => {
                                        setCouponState({ ...couponState, discount_type: "Flat" });
                                    }}>
                                    {couponState.discount_type === "Flat" && <View style={styles.selected} />}
                                </TouchableOpacity>
                                <Text style={styles.typeText}>{t('common:flat')}</Text>
                            </View>
                            <View style={styles.typeinnerWrapper}>

                                <TouchableOpacity
                                    style={styles.rbStyle}
                                    onPress={() => {
                                        setCouponState({ ...couponState, discount_type: "Percentage" });
                                    }}>
                                    {couponState.discount_type === "Percentage" && <View style={styles.selected} />}
                                </TouchableOpacity>
                                <Text style={styles.typeText}>{t('common:percentage')}</Text>
                            </View>
                        </View>

                        {/* <DropdownComponent
                            name={'location_id'}
                            value={couponState.location_id}
                            setValue={onChangeValue}
                            hasError={IsLocation}
                            errorMessage={t("error:location_id")}
                            placeholder={t('common:storelocation')}
                            data={locationData}
                            isSearch={true}
                        /> */}

                        <TouchableOpacity style={{
                            width: (SCREEN_WIDTH - widthP),
                            justifyContent: 'center',
                            marginLeft: wp("1%"),
                            borderColor: "#000",
                            borderBottomColor: "#fff",
                            borderBottomWidth: 1,
                        }} onPress={() => {
                            setLocationModalVisible(!locationModalVisible)
                        }}>
                            <Text style={[styles.text, {
                                color: COLORS.white,
                                fontSize: RFValue(16), alignItems: 'center',
                            }]}>
                                {selectedLocation ? selectedLocation[getLabelField(i18n.language)] : t('common:storelocation')}
                            </Text>
                        </TouchableOpacity>
                        {
                            locationModalVisible ? <LocationPopup
                                name={'location_id'}
                                locationData={locationData}
                                modalVisible={locationModalVisible}
                                setModalVisible={setLocationModalVisible}
                                onCallBack={onChangeValue} /> : null
                        }


                        <DropdownComponent
                            name={'category_id'}
                            value={couponState.category_id}
                            setValue={onChangeValue}
                            hasError={IsCategory}
                            errorMessage={t("error:category_id")}
                            placeholder={t('common:storecategory')}
                            data={categoryDataArray}
                        />



                        <View style={[styles.buttonContainer, { marginTop: hp(1) }]}>
                            <TouchableOpacity onPress={() => {
                                Keyboard.dismiss()
                                setOpen(true)
                            }} style={{
                                width: 350,
                                flexDirection: 'row',
                                borderColor: COLORS.border,
                                borderWidth: 0,
                                borderBottomWidth: 1,
                                alignItems: 'flex-end',
                                paddingRight: 10
                            }}>
                                <TextInput
                                    mode='flat'
                                    style={[styles.input, {
                                        color: "white",
                                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                                        marginTop: 10
                                    }]}
                                    value={moment(couponState.expiry_date).format(DATE_)}
                                    placeholder={t('common:expiry_date')}
                                    placeholderTextColor={COLORS.textPlaceHolder}
                                    activeUnderlineColor={COLORS.border}
                                    editable={false}
                                />
                                <Image
                                    source={calendar}
                                    style={[styles.image, { width: 20, height: 20, marginBottom: 10, tintColor: COLORS.primary }]}
                                />
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            modal
                            open={open}
                            mode={'date'}
                            date={moment(couponState.expiry_date).toDate()}
                            onConfirm={(date) => {
                                console.log('date', date)
                                setOpen(false)
                                setCouponState({ ...couponState, expiry_date: moment(date).format(DATE_) })
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />
                    </View>

                    <View style={{
                        display: 'flex', flex: 1,
                        flexDirection: 'row', alignItems: 'center', marginTop: 3,
                        justifyContent: 'space-between', marginHorizontal: wp(5),
                        //   backgroundColor: "#000"
                    }}>

                        <CustomUpload AddComment={couponState.images} postComment={setImages} />
                    </View>

                    <View style={{ marginVertical: 0, paddingLeft: 10, paddingRight: 10 }}>
                        {
                            couponState.images && couponState.images.length > 0 ?
                                <FlatList
                                    horizontal={true}
                                    data={couponState.images}
                                    renderItem={(childData, index) => renderImagesItem(childData, index)}
                                    keyExtractor={(item, index) => index}
                                    snapToEnd={true}
                                    inverted={false}
                                //  inverted={Platform.OS === 'ios' ? false : || i18n.language === 'ru' || i18n.language === 'fr' ? false : true}
                                /> : null
                        }



                        {
                            modalVisible ? <VideoFullScreen
                                modalVisible={modalVisible} setModalVisible={setModalVisible}
                                selectedImage={selectedImage}
                                itemList={selectedImageList} updatePosition={() => setselectedImage(0)} /> : null
                        }
                    </View>

                    <View style={{ alignItems: 'flex-start', marginLeft: 20, marginTop: 30, flexDirection: 'row' }}>
                        <Text style={[styles.text, { fontSize: RFValue(18), alignItems: 'center', }]}>
                            {t('navigate:termsncondition') + ":"}
                        </Text>
                    </View>

                    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'flex-start' }} style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginLeft: 20, marginTop: 10, marginRight: 20,
                    }}>
                        {
                            couponState[termsname].length > 0 ? couponState[termsname].map((item, index) => {
                                return (<View key={index} style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginTop: hp(.5)
                                }}>
                                    <Text style={[styles.itemText, { fontSize: RFValue(16), flex: 1, textAlign: 'left' }]}>
                                        {" " + item}
                                    </Text>
                                    <TouchableOpacity style={{
                                        justifyContent: 'center',
                                        marginLeft: wp("1%")
                                    }} onPress={() => {
                                        deleteTerms(index)
                                    }}>
                                        <Image
                                            source={close}
                                            style={[styles.image_small, {
                                                width: 15,
                                                height: 15,
                                                marginRight: 12,
                                                tintColor: COLORS.primary
                                            }]}
                                        />
                                    </TouchableOpacity>
                                </View>)
                            }) : null
                        }

                        <View style={[styles.itemText, { flex: 1, flexDirection: 'row', marginTop: hp("1%"), marginRight: wp("2%") }]}>
                            <View style={styles.msgWrapper}>
                                <TextInput
                                    placeholder={t('common:addTerms')}
                                    style={{
                                        borderBottomWidth: 0, color: '#7f94c1', paddingBottom: Platform.OS === 'ios' ? 0 : 8,
                                        textAlign: IsRightOrLeft(i18n.language)
                                    }}
                                    keyboardType={'default'}
                                    value={AddTerms || ''}
                                    onChangeText={(text) => setAddTerms(text)}
                                    placeholderTextColor={"#7f94c1"}
                                />
                            </View>
                            <TouchableOpacity style={{
                                alignItems: 'center', justifyContent: 'center',
                                marginLeft: wp("2%")
                            }} onPress={() => {
                                if (AddTerms.trim() !== '') {
                                    addTerms(AddTerms)
                                    setAddTerms('')
                                }
                            }}  >
                                <Image
                                    source={send_message}
                                    style={[styles.image_small, {
                                        width: 30,
                                        height: 30,
                                    }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>


                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        marginTop: 30,
                        marginBottom: 20,
                        paddingLeft: wp("5%"), paddingEnd: wp("5%")
                    }}>
                        <TouchableOpacity
                            style={styles.buttonStyle}
                            activeOpacity={.5}
                            disabled={isButtonClick}
                            onPress={() => {
                                Keyboard.dismiss()
                                if (route.params && route.params.itemId) {
                                    updateCoupon()
                                } else {
                                    addCoupon()
                                }

                            }}
                        >
                            <Text style={[styles.itemText, { fontSize: RFValue(15) }]}>{
                                route.params && route.params.itemId ? t("common:updateBtn") : t('common:addBtn')
                            }</Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </ScrollView>
            {
                isButtonClick ? <View style={[styles.loading]}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View> : null
            }
        </KeyboardAvoidingView>
    )
}

export default AddEditCoupon

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: COLORS.secondary,

    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: COLORS.white,
    },
    text: {
        fontSize: hp('1.5%'),
        color: COLORS.textDark,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    image: {
        width: 50,
        height: 50,
        left: 0,
        resizeMode: 'contain'
    },
    image_small: {
        width: 20,
        height: 20,
        //  tintColor: COLORS.text,
        left: 0
    },
    itemText: {
        // fontSize: hp('1.5%'),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    fontBold: {
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    buttonStyle: {
        //marginLeft: wp(1),
        paddingTop: hp("1%"),
        paddingBottom: hp("1%"),
        width: wp("30%"),
        backgroundColor: COLORS.primary,
        borderRadius: 35,
        alignItems: 'center',
    },

    validateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp("5%"),
        borderColor: COLORS.white,
        borderBottomWidth: 2,
        borderTopWidth: 2,
    },

    typeWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    headerTitle: {
        fontSize: RFValue(18),
        color: COLORS.text,
        // fontWeight: 'bold',
        marginRight: 20,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold"
    },
    typeinnerWrapper: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5
    },
    typeText: {
        fontSize: RFValue(16),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    rbStyle: {
        height: 25,
        width: 25,
        borderRadius: 110,
        borderWidth: 2,
        marginHorizontal: 5,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selected: {
        width: 16,
        height: 16,
        borderRadius: 55,
        backgroundColor: COLORS.primary,
    },
    buttonContainer: {
        display: 'flex',

        flexDirection: 'column',
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        // backgroundColor:'#000'
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: COLORS.text,
        paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        backgroundColor: "transparent",
        //fontFamily: "adoif",
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    errorText: {
        fontSize: 15,
        //height: 16,
        color: COLORS.error,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    msgWrapper: {
        height: 40,
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 35,
        backgroundColor: "#b7c8db",
    },
    loading: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '50%',
        marginLeft: "40%"
    }
})