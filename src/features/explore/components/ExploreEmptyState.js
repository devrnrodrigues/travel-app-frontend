import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/exploreEmptyState.styles";

export const ExploreEmptyState = React.memo(function ExploreEmptyState({ searchFilter }) {
  return (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="search-outline" size={48} color="#FFFFFF" />
      <Text style={styles.emptyStateText}>
        {searchFilter?.length > 0
          ? `Nenhum destino encontrado para "${searchFilter}".`
          : "Nenhum destino encontrado para sua pesquisa."}
      </Text>
    </View>
  );
});

export default ExploreEmptyState;
