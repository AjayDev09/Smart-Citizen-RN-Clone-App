import React from 'react'
import { View, Text, StyleSheet, TextInput, I18nManager, Platform, Image, TouchableOpacity, Dimensions } from "react-native";
import { eyeIcon, eyeoffIcon } from '../constants/images';
import { COLORS, SPACING } from '../theme';
import { useTogglePasswordVisibility } from './useTogglePasswordVisibility';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

const SCREEN_WIDTH = Dimensions.get('screen').width
const CustomInput = ({ name, value, setValue, placeholder, keyboardType = 'default', isPasswordField = false,
    returnKeyType = "next", hasError = false, errorMessage = "", customStyle, placeholderTextColor = COLORS.textPlaceHolder,
     isEditable = true, isMultiline = false, autoFocus=false,  clearButtonMode='never',textRef }) => {
    const { passwordVisibility, rightIcon, handlePasswordVisibility } = useTogglePasswordVisibility(isPasswordField);


    const widthP = (SCREEN_WIDTH * 15) / 100
    return (
        <View style={styles.buttonContainer}>

            <View style={[{
                // /height:40, 
                width: (SCREEN_WIDTH - widthP),
                flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                borderColor: COLORS.border,
                borderWidth: 0,
                borderBottomWidth: 1,
                ...customStyle
            }]}>
                <TextInput
                    ref={textRef? textRef: null}
                    mode='flat'
                    style={[styles.input, {
                        color: "white", // This does not work
                        // backgroundColor: "transparent", // This works
                        textAlign: I18nManager.isRTL ? 'right' : 'left',
                        ...customStyle
                    }]}
                    value={String(value)}
                    maxLength={1000}
                    onChangeText={(text) => setValue(name, text)}
                    secureTextEntry={passwordVisibility}
                    placeholder={placeholder}
                    cursorColor={COLORS.text}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    placeholderTextColor={placeholderTextColor}
                    activeUnderlineColor={COLORS.border}
                    editable={isEditable}
                    multiline={isMultiline}
                    // focusable={true}
                     autoFocus={autoFocus}
                     clearButtonMode={clearButtonMode}
                    
                //  numberOfLines={3}
                //maxLength={50}
                />

                {isPasswordField ?
                    <TouchableOpacity onPress={handlePasswordVisibility}>
                        <Image
                            source={rightIcon == 'eye' ? eyeIcon : eyeoffIcon}
                            style={[styles.image, {
                                width: 20,
                                height: 20,
                                bottom: 15,
                                tintColor: COLORS.primary
                            }]}
                        />
                    </TouchableOpacity>
                    : <View style={{
                        width: 20,
                        height: 20,
                    }}>
                    </View>}

            </View>
            {hasError != "" ? (
                <Text style={styles.errorText}>
                    {errorMessage}
                </Text>
            ) : (
                false
            )}
        </View>


    )
}

export default CustomInput

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingVertical: Platform.OS === 'ios' ? 7 : 0,
        // backgroundColor:'#000'

    },
    input: {
        flex: 1,
        //  width: '100%',
        fontSize: RFValue(18),
        color: COLORS.text,
        paddingBottom: Platform.OS === 'ios' ? 0 : 0,
        backgroundColor: "transparent",
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
    errorText: {
        fontSize: RFValue(13),
        //height: 16,
        color: COLORS.error,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
})