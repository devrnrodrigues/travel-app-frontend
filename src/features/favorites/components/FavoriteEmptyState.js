import React from "react";
import StateFeedbackView from "../../../shared/components/StateFeedbackView";

export const FavoriteEmptyState = React.memo(function FavoriteEmptyState({
  isError,
  error,
  searchQuery,
  onRetry,
  onClearSearch,
  onExplorePress,
  isDarkMode = true,
}) {
  if (isError) {
    if (error?.status === 404) {
      return (
        <StateFeedbackView
          icon="alert-circle-outline"
          title="Favoritos não encontrados"
          message="Não foi possível localizar seus favoritos salvos."
          buttonText="Tentar novamente"
          onButtonPress={onRetry}
          isDarkMode={isDarkMode}
        />
      );
    }

    if (error?.status >= 500) {
      return (
        <StateFeedbackView
          icon="server-outline"
          title="Falha ao carregar favoritos"
          message="Ocorreu uma instabilidade ao carregar seus dados salvos. Tente novamente em instantes."
          buttonText="Tentar novamente"
          onButtonPress={onRetry}
          isDarkMode={isDarkMode}
        />
      );
    }

    return (
      <StateFeedbackView
        icon="cloud-offline-outline"
        title="Sem conexão"
        message="Não foi possível acessar seus favoritos salvos. Verifique sua conexão com a internet."
        buttonText="Tentar novamente"
        onButtonPress={onRetry}
        isDarkMode={isDarkMode}
      />
    );
  }

  const isSearchActive = searchQuery && searchQuery.trim().length > 0;

  if (isSearchActive) {
    return (
      <StateFeedbackView
        icon="search"
        iconType="feather"
        title="Nenhum favorito encontrado"
        message={`Nenhum dos seus favoritos salvos corresponde a "${searchQuery}".`}
        buttonText="Limpar filtro"
        onButtonPress={onClearSearch}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <StateFeedbackView
      icon="heart-outline"
      title="Nenhum favorito salvo"
      message="Você ainda não adicionou nenhum destino à sua lista de favoritos."
      buttonText={onExplorePress ? "Explorar destinos" : undefined}
      onButtonPress={onExplorePress}
      isDarkMode={isDarkMode}
    />
  );
});

export default FavoriteEmptyState;
