export function formatTimeAgo(dateString) {
  if (!dateString) return "poucos instantes";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 60) {
    return "poucos instantes";
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  }
  const diffInHours = Math.floor(diffInMinutes / 60);
  const remainingMinutes = diffInMinutes % 60;
  if (diffInHours < 24) {
    const horaStr = `${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    if (remainingMinutes > 0) {
      return `${horaStr} e ${remainingMinutes} ${remainingMinutes === 1 ? "minuto" : "minutos"}`;
    }
    return horaStr;
  }
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
}

export function getFirstParagraph(text) {
  if (!text) return "";
  if (Array.isArray(text)) return (text[0] || "").trim();
  const paragraphs = text.split(/\r?\n\r?\n/).filter((p) => p.trim().length > 0);
  return (paragraphs[0] || text).trim();
}

export function getTruncatedFirstParagraph(text) {
  const firstParagraph = getFirstParagraph(text);
  if (!firstParagraph) return "";

  const words = firstParagraph.split(/\s+/);
  if (words.length === 0) return firstParagraph;

  const lastWord = words[words.length - 1];
  const cleanWord = lastWord.replace(/[.,!?;:]+$/, "");
  const halfWord =
    cleanWord.length > 2
      ? cleanWord.slice(0, Math.ceil(cleanWord.length / 2))
      : cleanWord;

  const rest = words.slice(0, -1).join(" ");
  return rest ? `${rest} ${halfWord}...` : `${halfWord}...`;
}

export function getRemainingParagraphs(text) {
  if (!text) return [];
  if (Array.isArray(text)) {
    return text.slice(1).map((p) => (p || "").trim()).filter(Boolean);
  }
  const paragraphs = text.split(/\r?\n\r?\n/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length <= 1) return [];
  return paragraphs.slice(1);
}

export function isDescriptionUnavailable(text) {
  if (!text) return true;
  const first = getFirstParagraph(text).toLowerCase();
  return (
    first.length === 0 ||
    first.includes("indisponível") ||
    first.includes("indisponivel") ||
    first.includes("não foi possível") ||
    first.includes("nao foi possivel")
  );
}

export function parseCostEstimates(raw) {
  if (!raw) return null;
  if (typeof raw === "object") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
