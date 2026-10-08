import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    borderWidth: 1.5,
    width: "100%",
    justifyContent: "center",
  },
  containerLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  textInput: {
    fontSize: 15,
    paddingVertical: 0,
    color: "#FFFFFF",
  },
  textInputLight: {
    color: "#000000",
  },
  textInputSingle: {
    height: 48,
  },
  textInputMultiline: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
});

export const getInputAnimatedStyle = (borderColor, minHeight) => ({
  borderColor,
  minHeight,
});

export const getTextInputStyle = (minHeight) => ({
  minHeight,
});
