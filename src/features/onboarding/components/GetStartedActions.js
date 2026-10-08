import React from "react";
import { Text, TouchableOpacity, Animated } from "react-native";
import styles, { getButtonsAnimatedStyle } from "../styles/getStarted.styles";

const GetStartedActions = React.memo(function GetStartedActions({
  buttonsOpacity,
  buttonsTranslateY,
  onRegister,
  onLogin,
}) {
  return (
    <Animated.View
      style={[
        styles.bottomContainer,
        getButtonsAnimatedStyle(buttonsOpacity, buttonsTranslateY),
      ]}
    >
      <TouchableOpacity
        style={styles.primaryButton}
        activeOpacity={0.85}
        onPress={onRegister}
      >
        <Text style={styles.primaryButtonText}>Cadastre-se</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryLink}
        activeOpacity={0.7}
        onPress={onLogin}
      >
        <Text style={styles.secondaryLinkText}>
          Já tem uma conta? <Text style={styles.secondaryLinkHighlight}>Entrar</Text>
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default GetStartedActions;
