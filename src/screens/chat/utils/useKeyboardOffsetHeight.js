import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export default function useKeyboardOffsetHeight() {
    const [keyBoardOffsetHeight, setKeyboardOffsetHeight] = useState(0);
    useEffect(() => {
        const keyboardWillShowListener = Keyboard.addListener("keyboardDidShow", (e) => {
                setKeyboardOffsetHeight(e.endCoordinates.height);
            }
        );
        const keyboardWillHideListener = Keyboard.addListener("keyboardDidHide", (e) => {
                setKeyboardOffsetHeight(0);
            }
        );

        return () => {
            keyboardWillHideListener.remove();
            keyboardWillShowListener.remove();
        };
    }, []);

    return keyBoardOffsetHeight;
}
