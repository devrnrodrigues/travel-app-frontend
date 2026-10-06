import React, { memo } from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../auth.styles";

function PasswordRequirementsComponent({ requirements }) {
  if (!requirements || requirements.length === 0) {
    return null;
  }

  return (
    <View style={styles.passwordRequirements}>
      <Text style={styles.requirementsTitle}>REQUISITOS DA SENHA:</Text>
      {requirements.map((req) => (
        <View key={req.id} style={styles.requirementItem}>
          <Ionicons
            name={req.valid ? "checkmark-circle" : "close-circle"}
            size={15}
            color={req.valid ? "#00E676" : "#FF3B30"}
          />
          <Text
            style={[
              styles.requirementText,
              req.valid ? styles.requirementTextValid : styles.requirementTextInvalid,
            ]}
          >
            {req.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

export const PasswordRequirements = memo(PasswordRequirementsComponent);
export default PasswordRequirements;
