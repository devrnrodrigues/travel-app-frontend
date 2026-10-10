import React from "react";
import StateFeedbackView from "../../../shared/components/StateFeedbackView";

const notFoundImage = require("../../../../assets/images/not-found.png");
const emptyFavoritesImage = require("../../../../assets/images/image00.png");
const errorImage = require("../../../../assets/images/error.png");
const noConnectionImage = require("../../../../assets/images/no-connection.png");

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
          imageSource={notFoundImage}
          title="Favoritos não encontrados"
          message="Não foi possível localizar seus favoritos salvos."
          buttonText="Tentar novamente"
          onButtonPress={onRetry}
          isDarkMode={isDarkMode}
          showDarkFilter={false}
        />
      );
    }

    if (error?.status >= 500) {
      return (
        <StateFeedbackView
          imageSource={errorImage}
          title="Falha ao carregar favoritos"
          message="Ocorreu uma instabilidade ao carregar seus dados salvos. Tente novamente em instantes."
          buttonText="Tentar novamente"
          onButtonPress={onRetry}
          isDarkMode={isDarkMode}
          showDarkFilter={false}
        />
      );
    }

    return (
      <StateFeedbackView
        imageSource={noConnectionImage}
        title="Sem conexão"
        message="Não foi possível acessar seus favoritos salvos. Verifique sua conexão com a internet."
        buttonText="Tentar novamente"
        onButtonPress={onRetry}
        isDarkMode={isDarkMode}
        showDarkFilter={false}
      />
    );
  }

  const isSearchActive = searchQuery && searchQuery.trim().length > 0;

  if (isSearchActive) {
    return (
      <StateFeedbackView
        imageSource={notFoundImage}
        title="Nenhum favorito encontrado"
        message={`Nenhum dos seus favoritos salvos corresponde a "${searchQuery}".`}
        buttonText="Limpar filtro"
        onButtonPress={onClearSearch}
        isDarkMode={isDarkMode}
        showDarkFilter={false}
      />
    );
  }

  return (
    <StateFeedbackView
      imageSource={emptyFavoritesImage}
      title="Nenhum favorito salvo"
      message="Você ainda não adicionou nenhum destino à sua lista de favoritos."
      buttonText={onExplorePress ? "Explorar destinos" : undefined}
      buttonIcon={onExplorePress ? "compass" : undefined}
      buttonIconType="feather"
      onButtonPress={onExplorePress}
      isDarkMode={isDarkMode}
      showDarkFilter={false}
    />
  );
});

export default FavoriteEmptyState;
