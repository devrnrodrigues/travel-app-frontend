import React from "react";
import StateFeedbackView from "../../../shared/components/StateFeedbackView";

const notFoundImage = require("../../../../assets/images/not-found.png");
const errorImage = require("../../../../assets/images/error.png");
const noConnectionImage = require("../../../../assets/images/no-connection.png");

export const ExploreEmptyState = React.memo(function ExploreEmptyState({
  isError,
  error,
  searchFilter,
  onRetry,
  onClearSearch,
  isDarkMode = true,
}) {
  if (isError) {
    if (error?.status === 404) {
      return (
        <StateFeedbackView
          imageSource={notFoundImage}
          title="Destinos não encontrados"
          message="Não foi possível localizar os destinos solicitados."
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
          title="Erro ao carregar destinos"
          message="Não conseguimos processar a listagem de destinos agora. Tente de novo em instantes."
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
        message="Não foi possível carregar os destinos. Verifique sua internet para continuar explorando."
        buttonText="Tentar novamente"
        onButtonPress={onRetry}
        isDarkMode={isDarkMode}
        showDarkFilter={false}
      />
    );
  }

  const hasSearch = Boolean(searchFilter && searchFilter.trim().length > 0);

  return (
    <StateFeedbackView
      imageSource={notFoundImage}
      title="Nenhum destino encontrado"
      message={
        hasSearch
          ? `Não encontramos resultados para "${searchFilter}". Tente buscar por outros termos.`
          : "Não encontramos resultados para sua pesquisa. Tente buscar por outros termos."
      }
      buttonText={hasSearch ? "Limpar busca" : undefined}
      onButtonPress={hasSearch ? onClearSearch : undefined}
      isDarkMode={isDarkMode}
    />
  );
});

export default ExploreEmptyState;
