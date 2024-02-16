import React from 'react';
import { Platform, StyleSheet, View,Text } from "react-native"
import { RFValue } from "react-native-responsive-fontsize"
import { COLORS } from "../theme"

const EmptyListComponent = ({isLoading = false,  data, msg }) => {
    return <View style={{ flex: 1, paddingBottom: 10, alignItems: 'center',
     justifyContent:'center' }}>
        {
          !isLoading && data && data.length <= 0 ?
                <View style={[{}]}>
                    <Text style={[styles.itemText]}>{msg}</Text>
                </View>
                : null
        }
    </View>
}

export default EmptyListComponent

const styles = StyleSheet.create({
    itemText: {
        fontSize: RFValue(18),
        color: COLORS.text,
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular"
    },
})