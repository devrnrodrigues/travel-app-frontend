# Travel App

Aplicativo moderno de turismo e planejamento de viagens desenvolvido em **React Native** com **Expo**. O projeto oferece uma experiência visual imersiva para descoberta de destinos turísticos ao redor do mundo, com galerias de fotos em alta definição, previsão do tempo ao vivo, resumos culturais e estimativas de custos de viagem gerados por inteligência artificial, mecanismo de busca e cotação de passagens aéreas reais, avaliações interativas com fotos, coleções pessoais e sincronização segura com backend próprio em **Spring Boot** e **PostgreSQL**.

## Funcionalidades

### Descoberta e exploração
- **Página inicial dinâmica:** Carrosséis de destinos em destaque e recomendações com paginação infinita (*infinite scroll*) e deduplicação de listas via **React Query**.
- **Filtro rápido e categorias:** Navegação fluida por categorias (florestas, praias, montanhas, históricos, etc.) com paletas de cores e gradientes dinâmicos.
- **Busca em tempo real:** Modal interativo de busca com debounce, filtros e estados de feedback imediato.
- **Catálogo em grade:** Tela dedicada para exploração de destinos em formato de cartões verticais com paginação e ordenação.

### Detalhes do destino
- **Galeria de fotos:** Modal em tela cheia com navegação por miniaturas (*thumbnails*) e pré-visualização em alta resolução.
- **Previsão do tempo atualizada:** Temperatura, sensação, probabilidade de chuva e vento (dados integrados e cacheados via backend).
- **Inteligência artificial integrada:** Resumo turístico em múltiplos parágrafos e estimativa de custos médios para planejamento de viagem.
- **Avaliações da comunidade:**
  - Sistema de notas (1 a 5 estrelas) e comentários.
  - Envio e visualização de fotos anexadas em formato polaroid com ampliação.
  - Votação de comentários úteis.

### Busca de voos
- **Pesquisa completa:** Seleção de aeroportos de origem/destino com autocompletar e códigos IATA, quantidade de passageiros (adultos e crianças com faixas etárias).
- **Filtros e configurações:** Classe de cabine (econômica, premium, executiva, primeira classe), ordenação (mais barato, mais rápido, melhor) e moedas internacionais (BRL, USD, EUR, etc.).
- **Calendário customizado:** Modal visual para seleção de datas de ida e volta.
- **Resultados detalhados:** Cards com companhia aérea, horários de partida/chegada, conexões e detalhes de franquia de bagagem.

### Perfil, coleções e favoritos
- **Favoritos sincronizados:** Adição e remoção de destinos com atualização em cache e pull-to-refresh.
- **Coleções pessoais de fotos:** Criação e organização de coleções de fotos de viagens no perfil, com contagem e visualizador em galeria.
- **Gerenciamento de conta:** Edição de perfil (nome, bio, nacionalidade com bandeiras), upload de avatar e logout seguro.
- **Autenticação segura:**
  - Login e cadastro local com e-mail e senha.
  - Login social com Google.
  - Telas de introdução e boas-vindas com memorização de exibição.
  - Sessão persistida via JWT e renovação automática via refresh token.

## Interface, estética e transições

- **Modos estéticos:** Suporte à alternância entre modo imersivo (fundos fotográficos dinâmicos com gradientes e desfoque via BlurView) e modo minimalista (foco em contraste limpo e legibilidade).
- **Esquema de cores e temas:** Tema escuro e tema claro com persistência local da escolha do usuário.
- **Paletas contextuais:** Cores de destaque, cabeçalhos e gradientes sincronizados automaticamente com a categoria selecionada.
- **Sistema de skeletons:** Esqueletos visuais com animação de brilho (*shimmer*) espelhando fielmente as dimensões de cada componente durante o carregamento (cards, categorias, bandeiras, comentários e perfil).
- **Transições e micro-interações:**
  - Telas de detalhes e cotação de passagens com animações verticais rápidas para evitar intermitência visual.
  - Animações de esmaecimento (*fade in*) para carregamento de imagens remotas.
  - Barra de navegação inferior flutuante customizada, com gradiente e transição de opacidade integrada à rolagem e busca.

## Tratamento de erros e feedback visual

- **Feedbacks visuais contextualizados:** Componente centralizado de feedback (`StateFeedbackView`) que exibe ilustrações exclusivas e mensagens amigáveis de acordo com o status HTTP da resposta.
- **Conteúdo não encontrado (404):** Mensagem orientada com ação para recarregar a navegação inicial.
- **Instabilidade no servidor (500):** Feedback visual com instrução clara de tentativa posterior.
- **Ausência de conexão:** Detecção de falhas de rede com botão direto de tentar novamente (*retry*).
- **Estados vazios (*empty states*):** Mensagens personalizadas para listas de favoritos, coleções de fotos ou buscas sem correspondência.

## Comunicação com a API e rede

O aplicativo consome a API REST desenvolvida em Spring Boot através de um cliente HTTP centralizado (`apiClient`), implementando:

- **Autenticação e interceptação de sessão:** Injeção automática do cabeçalho `Authorization: Bearer <token>` em rotas protegidas e renovação transparente de sessão via refresh token ao receber status HTTP 401.
- **Upload de arquivos em formato nativo:** Suporte a requisições multipartes (`multipart/form-data`) para envio e processamento de imagens (fotos de perfil e coleções).
- **Tratamento de integridade:** Captura de erros de validação padronizados pelo servidor (`fieldErrors` e mensagens amigáveis).

### Principais recursos consumidos da API
- `/api/auth` - Cadastro, login local, login social com Google e renovação de token
- `/api/destinations` - Catálogo de destinos, detalhes, fotos, clima e estimativas de viagem
- `/api/categories` - Categorias temáticas e metadados visuais
- `/api/flights` e `/api/airports` - Consulta de aeroportos e busca de voos em tempo real
- `/api/favorites` e `/api/comments` - Sincronização de destinos salvos, avaliações e fotos
- `/api/collections` e `/api/users` - Coleções pessoais de fotos e perfil do viajante

> Para documentação completa dos contratos, DTOs e regras de negócio, consulte o repositório do [travel-app-backend](https://github.com/devrnrodrigues/travel-app-backend).

## Tecnologias e bibliotecas

- **Core:** [React Native](https://reactnative.dev/) (0.86) & [Expo](https://expo.dev/) (SDK 57)
- **Gerenciamento de dados e cache:** [@tanstack/react-query](https://tanstack.com/query) v5
- **Navegação:** [@react-navigation/native](https://reactnavigation.org/) (pilha nativa e abas inferiores v7)
- **Autenticação:** [@react-native-google-signin/google-signin](https://github.com/react-native-google-signin/google-signin) & JWT
- **Armazenamento local:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Animações e interface:** `react-native-reanimated`, `expo-linear-gradient`, `expo-blur`, `LayoutAnimation`
- **Manipulação de mídia:** `expo-image-picker`, `expo-image-manipulator`
- **Ícones e tipografia:** `@expo/vector-icons` (Ionicons, Feather) e fontes customizadas Google Fonts (Caveat)

## Arquitetura de pastas

A estrutura segue o padrão modular baseado em funcionalidades:

```text
travel-app-frontend/
├── assets/                  # Fontes, telas de abertura e ilustrações de estado
├── src/
│   ├── config/              # Cliente HTTP centralizado (apiClient) e variáveis de ambiente
│   ├── context/             # Contextos globais (AuthContext)
│   ├── features/            # Módulos organizados por funcionalidade
│   │   ├── auth/            # Login, cadastro, autenticação com Google e contexto
│   │   ├── categories/      # Hooks e serviços de categorias
│   │   ├── destinations/    # Detalhes do destino, avaliações, clima e galeria
│   │   ├── explore/         # Listagem exploratória por categorias
│   │   ├── favorites/       # Gestão de destinos salvos
│   │   ├── flights/         # Mecanismo de busca de voos, filtros e modais
│   │   ├── home/            # Tela inicial, destaques, recomendações e busca rápida
│   │   ├── onboarding/      # Telas de introdução e boas-vindas
│   │   └── profile/         # Perfil do usuário, coleções de fotos e edição
│   ├── navigation/          # Navegadores de pilha, abas inferiores e barra customizada
│   ├── shared/              # Utilitários, feedback visual e skeletons
│   └── theme/               # Contexto de temas, paletas dinâmicas e modos estéticos
├── App.js                   # Ponto de entrada com provedores globais (React Query, tema, auth)
├── app.json                 # Configurações do Expo
└── package.json             # Dependências e scripts
```

## Como rodar localmente?

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no smartphone (Android/iOS) ou emulador configurado.
- Backend **travel-app-backend** em execução para consumo dos endpoints.

### 1. Clonar o repositório
```bash
git clone https://github.com/devrnrodrigues/travel-app-frontend.git
cd travel-app-frontend
```

### 2. Instalar as dependências
```bash
npm install
```

### 3. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```bash
cp .env.example .env
```

Preencha com o endereço da sua API local (substitua pelo IP da sua máquina na rede local):
```env
EXPO_PUBLIC_API_URL=http://<seu-ip-local>:8080/api
```

### 4. Executar o projeto
```bash
npx expo start
```

Ou diretamente para a plataforma desejada:
```bash
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
