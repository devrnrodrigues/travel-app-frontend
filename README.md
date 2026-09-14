# Travel App

Aplicativo moderno de turismo e planejamento de viagens desenvolvido em **React Native** com **Expo**. O app oferece descoberta de destinos turísticos com fotos em alta resolução, previsão do tempo ao vivo, descrições e estimativas geradas por Inteligência Artificial, busca de voos em tempo real, suporte a temas (claro/escuro) e sincronização na nuvem com **Supabase**.

## Funcionalidades

### Descoberta e Exploração
- **Home Dinâmica:** Carrosséis de destinos populares e recomendados por país e categoria.
- **Filtro por Países:** Modal interativo para filtrar locais por região ou popularidade.
- **Busca em Tempo Real:** Pesquisa rápida de destinos com feedback visual e skeletons.
- **Explorar por Categorias:** Navegação em grade categorizada (Praias, Montanhas, Históricos, etc.) com paletas temáticas.

### Detalhes do Destino
- **Galeria Imersiva:** Modal de tela cheia com fotos em alta definição via Pexels API e navegação por miniaturas (*thumbnails*).
- **Previsão do Tempo em Tempo Real:** Clima e temperatura atualizados da localização.
- **Inteligência Artificial (Google Gemini):**
  - Resumos descritivos inteligentes do destino.
  - Estimativa de custos médios para planejamento.
- **Avaliações dos Usuários:** Seção modular com reviews e comentários interativos.

### Busca de Voos
- **Pesquisa Completa:** Origem, destino, classe de cabine (Econômica, Premium, Executiva, Primeira Classe) e seleção de moedas (BRL, USD, EUR, GBP, AED).
- **Calendário Customizado:** Seletor visual de datas para ida e volta.
- **Resultados Detalhados:** Listagem de passagens com cia aérea, paradas, bagagem inclusa e redirecionamento para compra.

### Favoritos e Perfil
- **Favoritos Sincronizados:** Adicione ou remova destinos favoritos salvos no Supabase.
- **Dark Mode / Light Mode:** Suporte completo a tema escuro e claro com persistência local.
- **Autenticação Segura:** Cadastro, login e sessão persistida via Supabase Auth.
- **Perfil do Usuário:** Gerenciamento de dados cadastrais, avatar e alteração de senha.

## Tecnologias e Bibliotecas

- **Core:** [React Native](https://reactnative.dev/) (0.86) & [Expo](https://expo.dev/) (SDK 57)
- **Navegação:** [@react-navigation/native](https://reactnavigation.org/) (Stack & Bottom Tabs v7)
- **Backend & Auth:** [@supabase/supabase-js](https://supabase.com/)
- **Armazenamento Local:** [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/)
- **Animações e Efeitos:** `react-native-reanimated`, `expo-linear-gradient`, `expo-blur`
- **Ícones:** `@expo/vector-icons` (Ionicons, Feather, MaterialCommunityIcons)
- **APIs Externas:**
  - Pexels API (Imagens e galerias)
  - Weather API (Clima em tempo real)
  - Google Gemini API (Geração de resumos e preços)
  - RapidAPI / Google Flights (Busca de voos)

## Arquitetura de Pastas

A estrutura segue o padrão Feature-Based Modular:

```text
travel-app-frontend/
├── assets/                  # Ícones, splash screen e imagens estáticas
├── src/
│   ├── config/              # Configurações globais (Supabase client, etc.)
│   ├── features/            # Módulos organizados por funcionalidade
│   │   ├── auth/            # Telas de login/registro e estilos de autenticação
│   │   ├── destinations/    # Detalhes do destino, API de IA, clima e avaliações
│   │   ├── explore/         # Tela e estilos de exploração por categoria
│   │   ├── favorites/       # Gestão de destinos favoritos
│   │   ├── flights/         # Mecanismo de busca e listagem de voos
│   │   ├── home/            # Tela inicial, cards e modais de busca/filtro
│   │   ├── onboarding/      # Telas de boas-vindas e introdução
│   │   └── profile/         # Gerenciamento de conta, temas e dados do usuário
│   ├── navigation/          # AppNavigator (Tabs), RootNavigator (Stack) e TabBar
│   ├── shared/              # Componentes globais (Skeletons, FadeInView, Message)
│   └── theme/               # ThemeContext, paletas claro/escuro e tipografia
├── App.js                   # Ponto de entrada com ThemeProvider e navegação
├── app.json                 # Configurações do Expo
└── package.json             # Dependências e scripts do projeto
```

## Como rodar localmente?

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- [Git](https://git-scm.com/)
- Aplicativo **Expo Go** no smartphone (Android/iOS) ou emulador configurado.

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

Preencha com as suas respectivas chaves de API:
```env
EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_supabase
EXPO_PUBLIC_PEXELS_API_KEY=sua_chave_pexels
EXPO_PUBLIC_WEATHER_API_KEY=sua_chave_weather_api
EXPO_PUBLIC_GEMINI_API_KEY=sua_chave_gemini_api
EXPO_PUBLIC_RAPIDAPI_KEY=sua_chave_rapidapi
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
