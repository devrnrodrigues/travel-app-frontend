import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../../config/apiClient";
import { ENV } from "../../../config/env";

const GEMINI_API_KEY = ENV.GEMINI_API_KEY;
const PEXELS_API_KEY = ENV.PEXELS_API_KEY;

export async function getWeather(destinationId) {
  if (!destinationId) return null;
  try {
    const data = await apiClient.get(`/destinations/${destinationId}/weather`);
    if (!data) return null;
    return {
      temp: Math.round(data.temperature ?? 0),
      humidity: data.rainProbability ?? 0,
      rainProbability: data.rainProbability ?? 0,
      wind: Math.round(data.windSpeed ?? 0),
      condition: data.conditionText || "Tempo estável",
      updatedAt: data.updatedAt,
    };
  } catch {
    return null;
  }
}

export async function getAiDescription(item, forceRefresh = false) {
  const cacheKey = `@gemini_desc_v4_${item.id}`;
  if (!forceRefresh) {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          return parsed;
        }
      } catch {
      }
    }
  }

  const destinationName = item.title || item.name || "o destino";
  const destinationLoc = [item.city, item.state, item.location || item.country]
    .filter(Boolean)
    .join(", ") || "França";

  const prompt = `Escreva uma descrição turística para ${destinationName}, localizado em ${destinationLoc}.
A resposta DEVE ter exatamente 3 parágrafos curtos (separados apenas por quebra de linha dupla):
- Regra de tamanho: Cada parágrafo deve ter estritamente entre 4 a 6 frases curtas e objetivas (aproximadamente 35 a 50 palavras por parágrafo). Seja conciso e evite frases longas ou prolixas.
- 1º parágrafo: Apresentação do local, atmosfera e o que mais impressiona de início.
- 2º parágrafo: História essencial e detalhes visuais ou arquitetônicos marcantes.
- 3º parágrafo: Dicas práticas e diretas para aproveitar a visita da melhor forma.
REGRAS OBRIGATÓRIAS: Não use títulos, marcadores, numerações ou asteriscos (**). Apenas os 3 parágrafos de texto direto.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const paragraphs = rawText
    .replace(/\*\*/g, "")
    .replace(/^#+\s*/gm, "")
    .split(/\r?\n\r?\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const result =
    paragraphs.length > 0
      ? paragraphs
      : ["Descrição indisponível."];

  await AsyncStorage.setItem(cacheKey, JSON.stringify(result));
  return result;
}

export async function getAiPrice(item) {
  const cacheKey = `@gemini_price_${item.id}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) return parseInt(cached, 10);

  const prompt = `Você é um especialista em turismo brasileiro. Estime o preço médio em reais (BRL) de uma viagem turística para ${item.title}, localizado em ${item.location}. Considere: se o destino for dentro do Brasil, calcule transporte doméstico (ônibus ou aéreo) saindo de São Paulo e hospedagem por 5 noites para 1 pessoa. Se for fora do Brasil, calcule passagem aérea internacional ida e volta saindo do Brasil e hospedagem por 5 noites para 1 pessoa. Responda APENAS com o número inteiro, sem texto, sem símbolo de moeda, sem pontos, sem vírgulas. Exemplo: 3200`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  const number = parseInt(raw?.replace(/\D/g, ""), 10);

  if (!isNaN(number)) {
    await AsyncStorage.setItem(cacheKey, String(number));
  }

  return isNaN(number) ? null : number;
}

export async function getPexelsImages(item) {
  const cacheKey = `@pexels_thumbs_${item.id}`;
  const cached = await AsyncStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const query = encodeURIComponent(`${item.title.trim()} ${item.location.trim()}`);

  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${query}&per_page=6`,
    { headers: { Authorization: PEXELS_API_KEY } }
  );

  const data = await response.json();
  const images = data?.photos?.map((photo) => photo.src.large) || [item.image_url];
  await AsyncStorage.setItem(cacheKey, JSON.stringify(images));
  return images;
}
