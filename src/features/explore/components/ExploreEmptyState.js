import React from "react";
import StateFeedbackView from "../../../shared/components/StateFeedbackView";

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
          icon="alert-circle-outline"
          title="Destinos não encontrados"
          message="Não foi possível localizar os destinos solicitados."
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
          title="Erro ao carregar destinos"
          message="Não conseguimos processar a listagem de destinos agora. Tente de novo em instantes."
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
        message="Não foi possível carregar os destinos. Verifique sua internet para continuar explorando."
        buttonText="Tentar novamente"
        onButtonPress={onRetry}
        isDarkMode={isDarkMode}
      />
    );
  }

  const hasSearch = Boolean(searchFilter && searchFilter.trim().length > 0);

  return (
    <StateFeedbackView
      icon="search-outline"
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
