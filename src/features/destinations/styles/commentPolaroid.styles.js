import { StyleSheet } from "react-native";

export const polaroidStyles = StyleSheet.create({
  wrapper: {
    width: 80,
    height: 98,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    marginTop: 2,
  },
  touchable: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  card: {
    position: "absolute",
    width: 70,
    height: 86,
    backgroundColor: "#FFFFFF",
    paddingTop: 3.5,
    paddingHorizontal: 3.5,
    paddingBottom: 10,
    borderRadius: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 3.5,
    elevation: 3,
  },
  imageBox: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2a303c",
    overflow: "hidden",
    borderRadius: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000000",
  },
});

export default polaroidStyles;
