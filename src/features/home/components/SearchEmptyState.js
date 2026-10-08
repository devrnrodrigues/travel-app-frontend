import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/searchModal.styles";

const SearchEmptyState = React.memo(function SearchEmptyState({ normalizedSearch }) {
  return (
    <View style={styles.searchEmptyContainer}>
      <Text style={styles.whiteText}>
        {normalizedSearch.length > 0
          ? `Nenhum destino encontrado para "${normalizedSearch}".`
          : "Nenhum destino encontrado."}
      </Text>
    </View>
  );
});

export default SearchEmptyState;
