import React, { memo } from "react";
import { View, Image } from "react-native";
import styles from "../auth.styles";

function AuthBackgroundComponent() {
  return (
    <View style={styles.backgroundWrapper} pointerEvents="none">
      <Image
        source={require("../../../../assets/welcome-bg.jpg")}
        style={styles.background}
        resizeMode="cover"
        blurRadius={3}
      />
      <View style={styles.overlay} />
    </View>
  );
}

export const AuthBackground = memo(AuthBackgroundComponent);
export default AuthBackground;
