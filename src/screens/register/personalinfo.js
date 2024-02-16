import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import { COLORS } from '../../theme';
import { useTranslation } from 'react-i18next';
import DropdownComponent from '../../components/dropdownComponent';
import { ChildrenData, EducationData, maritalData } from '../../constants/constant';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from 'react-native-responsive-fontsize';

const PersonalInfo = ({ onCallback, onBack,  userState, setUserState  }) => {
    const { t } = useTranslation();

    const [IsMaritalStatusValidate, setMaritalStatusValidate] = useState(false);
    const [IsNoOfChildValidate, setNoOfChildValidate] = useState(false);
    const [IsOccupationValidate, setOccupationValidate] = useState(false);
    const [IsEduLevelValidate, setEduLevelValidate] = useState(false);

    const onChangeValue = (name, value) => {
        setUserState({ ...userState, [name]: value });
    };

    const onRegister = () => {
        let user = {
            marital_status: userState.marital_status,
            no_of_child: userState.no_of_child,
            occupation: userState.occupation,
            education_level: userState.education_level,
        };
        setMaritalStatusValidate(false);
        setNoOfChildValidate(false);
        setOccupationValidate(false);
        setEduLevelValidate(false);

        var isError = false;

        if (!user.marital_status.trim()) {
            isError = true;
            setMaritalStatusValidate(true);
        }
        if (!user.no_of_child.trim()) {
            isError = true;
            setNoOfChildValidate(true);
        }
        if (!user.occupation.trim()) {
            isError = true;
            setOccupationValidate(true);
        }
        if (!user.education_level.trim()) {
            isError = true;
            setEduLevelValidate(true);
        }

        if (!isError) {
            onCallback(user);
            //console.log('Pressed', user);
        }
    };



    // console.log('userState', userState);
    return (
        <View>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: 50 }} >
                <Text style={Styles.headerTitle}>{t('common:morePersonalInfo')}</Text>
            </View>

            <DropdownComponent
                name={'marital_status'}
                value={userState.marital_status}
                setValue={onChangeValue}
                placeholder={t('common:maritalStatus')}
                data={maritalData}
                hasError={IsMaritalStatusValidate}
                errorMessage={t('error:marital_status')}
                customStyle={{ marginTop: hp("0%") }}
            />

            <DropdownComponent
                name={'no_of_child'}
                value={userState.no_of_child}
                setValue={onChangeValue}
                placeholder={t('common:numbersofChildren')}
                data={ChildrenData}
                hasError={IsNoOfChildValidate}
                errorMessage={t('error:no_of_child')}
                customStyle={{ marginTop: 0 }}
            />
            <CustomInput
                name={'occupation'}
                value={userState.occupation}
                setValue={onChangeValue}
                placeholder={t('common:occupation')}
                keyboardType={'default'}
                hasError={IsOccupationValidate}
                errorMessage={t('error:occupation')}
                customStyle={{ marginTop: Platform.OS === 'ios' ? IsOccupationValidate ? 5 : 10 : 2, }}

            />

            <DropdownComponent
                name={'education_level'}
                value={userState.education_level}
                setValue={onChangeValue}
                placeholder={t('common:educationLevel')}
                data={EducationData}
                hasError={IsEduLevelValidate}
                errorMessage={t('error:education_level')}
            />

            <View style={{ marginTop: '10%', marginHorizontal: '5%', flexDirection: 'row', justifyContent: 'space-around' }}>
                <CustomButton onCallback={() => onBack(1)} title={t('common:back')} textStyle={{ fontSize: RFValue(18), width: "100%" }} />
                <CustomButton onCallback={onRegister} title={t('common:next')} textStyle={{ fontSize: RFValue(18), width: "100%" }} />
            </View>
        </View>
    );
};

export default PersonalInfo;

const Styles = StyleSheet.create({
    headerTitle: {
        fontSize: RFValue(18),
        color: COLORS.textDark,
        //   fontWeight: 'bold',
        marginTop: 20,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Bold" : "Myriad-Pro-Bold",
    },
});
