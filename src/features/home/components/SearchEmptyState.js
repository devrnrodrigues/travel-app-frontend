import React from "react";
import StateFeedbackView from "../../../shared/components/StateFeedbackView";

const notFoundImage = require("../../../../assets/images/not-found.png");
const errorImage = require("../../../../assets/images/error.png");
const noConnectionImage = require("../../../../assets/images/no-connection.png");

const SearchEmptyState = React.memo(function SearchEmptyState({
  normalizedSearch = "",
  isError = false,
  error = null,
  onRetry,
  isDarkMode = true,
  isMinimalist = false,
}) {
  const feedbackDarkMode = isDarkMode;

  if (isError) {
    const status = error?.response?.status;

    if (status === 404) {
      return (
        <StateFeedbackView
          imageSource={notFoundImage}
          title="Conteúdo não encontrado"
          message="O recurso solicitado não foi encontrado no servidor."
          buttonText="Tentar novamente"
          buttonIcon="refresh-cw"
          onButtonPress={onRetry}
          isDarkMode={feedbackDarkMode}
          showDarkFilter={false}
        />
      );
    }

    if (typeof status === "number" && status >= 500) {
      return (
        <StateFeedbackView
          imageSource={errorImage}
          title="Instabilidade no servidor"
          message="Nosso sistema está passando por instabilidades no momento. Tente novamente em instantes."
          buttonText="Tentar novamente"
          buttonIcon="refresh-cw"
          onButtonPress={onRetry}
          isDarkMode={feedbackDarkMode}
          showDarkFilter={false}
        />
      );
    }

    return (
      <StateFeedbackView
        imageSource={noConnectionImage}
        title="Sem conexão com o servidor"
        message="Verifique sua conexão ou tente novamente mais tarde."
        buttonText="Tentar novamente"
        buttonIcon="refresh-cw"
        onButtonPress={onRetry}
        isDarkMode={feedbackDarkMode}
        showDarkFilter={false}
      />
    );
  }

  return (
    <StateFeedbackView
      imageSource={notFoundImage}
      title={normalizedSearch.length > 0 ? "Nenhum resultado encontrado" : "Nenhum destino encontrado"}
      message={
        normalizedSearch.length > 0
          ? `Não encontramos nenhum destino para "${normalizedSearch}".`
          : "Nenhum destino corresponde aos filtros aplicados."
      }
      isDarkMode={feedbackDarkMode}
      showDarkFilter={false}
    />
  );
});

export default SearchEmptyState;
