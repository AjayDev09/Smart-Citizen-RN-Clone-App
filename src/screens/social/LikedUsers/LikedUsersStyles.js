import { Platform, StyleSheet } from "react-native";
import { COLORS } from "../../../theme";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { RFValue } from "react-native-responsive-fontsize";

export const styles = StyleSheet.create({
    chatscreen: {
        backgroundColor: COLORS.secondary,  // "#F7F7F7",
        flex: 1,
        padding: 0,
        position: "relative",
    },
    chatheading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "green",
    },
    chattopContainer: {
        backgroundColor: "#F7F7F7",
        height: 70,
        width: "100%",
        padding: 20,
        justifyContent: "center",
        marginBottom: 15,
        elevation: 2,
    },
    chatheader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    chatlistContainer: {
        paddingHorizontal: 0,
        paddingVertical: 10
    },
    chatemptyContainer: {
        display:'flex',
        flexDirection:'column',
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    chatemptyText: {
        fontWeight: "bold",
        fontSize: 24, paddingBottom: 30
    },
    messagingscreen: {
        flex: 1,
        //flexDirection:"column"
    },
    messaginginputContainer: {
        // minHeight: 100,
        // backgroundColor: "white",
        paddingBottom: 10,
        paddingVertical: 0,
        paddingHorizontal: 10,
        justifyContent: "center",
        flexDirection: "row",
        marginBottom: Platform.OS === 'ios'? 15: 15,
    },
    messageWrapper: {
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 0,
        flex: 1,
        display:'flex',
        flexDirection:'row',
        marginRight: 10,
        borderRadius: 45,
        alignItems:'center',
        justifyContent:'center'
    },
    messaginginput: {
        flex:1,
        marginRight: 5,
        height:40,
        color: COLORS.textDark,
    },
    messagingbuttonContainer: {
        //  width: "10%",
        //  backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    modalbutton: {
        width: "40%",
        height: 20,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
    },
    modalbuttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    modaltext: {
        color: "#fff",
    },
    modalContainer: {
        width: "100%",
        borderTopColor: "#ddd",
        borderTopWidth: 1,
        elevation: 1,
        height: 400,
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        zIndex: 10,
        paddingVertical: 50,
        paddingHorizontal: 20,
    },
    modalinput: {
        borderWidth: 2,
        padding: 15,
    },
    modalsubheading: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    mmessageWrapper: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    mmessage: {
        maxWidth: "50%",
        backgroundColor: COLORS.secondary,
        padding: 2,
        borderRadius: 2,
        marginBottom: 2,
        color: COLORS.white
    },
    mvatar: {
        marginRight: 5,
    },
    cchat: {
        flex: 1,
        display: 'flex',
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor:  COLORS.cardBackgroundColor,
        // height: 80,
        marginBottom: 10,
        marginHorizontal: Platform. OS === 'ios'? 8: 8
    },
    cavatar: {
        marginRight: 15,
    },
    cusername: {
        fontSize: 18,
        marginBottom: 5,
        fontWeight: "bold",
        alignSelf: 'flex-start',
        alignSelf: 'flex-start',
        color: COLORS.primary,
        //  backgroundColor: "#fff"
    },
    cmessage: {
        fontSize: 14,
        opacity: 1,
    },
    crightContainer: {
        flexDirection: "row",
        flex: 1,
    },
    ctime: {
        opacity: 1,
        color: COLORS.textDark
    },
    image_small: {
        width: wp(10),
        height: wp(10),
        //  tintColor: COLORS.text,
        borderRadius: wp(10) / 2,
        left: 5,
        marginRight: 15,
    },

    viewBar: {
        backgroundColor: '#ccc',
        height: 4,
        alignSelf: 'stretch',
    },
    viewBarPlay: {
        backgroundColor: 'white',
        height: 4,
        width: 0,
    },
    searchWrapper: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        marginHorizontal: 15,
        alignItems: 'center',
        borderRadius: 35,
        borderWidth: 1,
        borderColor: COLORS.white,
        marginBottom:5,
    },
    actionButtonStyle: {
        // marginLeft: wp(1),
        height: hp(4.5),
        width: wp(20),
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        fontSize: RFValue(13),
        color: COLORS.text,
        textAlign: 'left',
        fontFamily: Platform.OS === 'ios' ? "MyriadPro-Regular" : "Myriad-Pro-Regular",
        marginHorizontal: wp(0)
    },
});