import { apiClient } from "../../../config/apiClient";

export const CABIN_CLASS_MAP = {
  "Econômica": "ECONOMY",
  "Econômica Premium": "PREMIUM_ECONOMY",
  "Executiva": "BUSINESS",
  "Primeira Classe": "FIRST",
};

export async function getAirportsApi() {
  try {
    const data = await apiClient.get("/airports");
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.id,
      codigo_iata: item.iataCode,
      iataCode: item.iataCode,
      nome_aeroporto: item.name,
      name: item.name,
      cidade: item.city,
      city: item.city,
      estado: item.state,
      state: item.state,
      country: item.country,
    }));
  } catch {
    return [];
  }
}

export async function searchFlights({
  fromIata,
  toIata,
  departDate,
  returnDate,
  adults,
  children,
  cabinClass,
  currency,
}) {
  const fromId = fromIata.includes(".AIRPORT") ? fromIata : `${fromIata}.AIRPORT`;
  const toId = toIata.includes(".AIRPORT") ? toIata : `${toIata}.AIRPORT`;
  const apiCabinClass = CABIN_CLASS_MAP[cabinClass] || "ECONOMY";
  const childrenQty = parseInt(children, 10) || 0;
  const childrenParam = Array(childrenQty).fill("17").join(",");

  const params = new URLSearchParams({
    fromId,
    toId,
    departDate,
    pageNo: "1",
    adults: String(adults || "1"),
    sort: "CHEAPEST",
    cabinClass: apiCabinClass,
    currencyCode: currency || "BRL",
  });

  if (returnDate) {
    params.append("returnDate", returnDate);
  }
  if (childrenParam) {
    params.append("children", childrenParam);
  }

  const data = await apiClient.get(`/flights/search?${params.toString()}`);

  if (!Array.isArray(data)) {
    return [];
  }

  const normalized = data.map((card) => {
    const outbound = card.outbound;
    const inbound = card.inbound;
    const hasReturn = Boolean(inbound);

    return {
      id: card.id || String(Math.random()),
      company: card.airlineName || "Companhia Aérea",
      logo: card.airlineLogoUrl || null,
      stops: card.stopsLabel || (card.stopsCount > 0 ? `${card.stopsCount} escala(s)` : "Direto"),
      departureTime: outbound?.departureTime || null,
      arrivalTime: outbound?.arrivalTime || null,
      duration: outbound?.duration || null,
      hasReturn,
      returnDepartureTime: inbound?.departureTime || null,
      returnArrivalTime: inbound?.arrivalTime || null,
      returnDuration: inbound?.duration || null,
      returnStops: hasReturn ? (card.stopsLabel || "Direto") : null,
      baggageInfo: card.baggageInfo || null,
      cabinBagInfo: null,
      price: card.formattedPrice || (card.totalPrice != null ? Number(card.totalPrice).toFixed(2) : null),
      priceNum: card.totalPrice != null ? Number(card.totalPrice) : Infinity,
      currency: card.currency || currency || "BRL",
      bookingUrl: card.bookingUrl || null,
    };
  });

  const unique = normalized.filter((ticket, index, self) =>
    index === self.findIndex((t) =>
      t.price === ticket.price &&
      t.company === ticket.company &&
      t.departureTime === ticket.departureTime &&
      t.arrivalTime === ticket.arrivalTime
    )
  );

  return [...unique].sort((a, b) => a.priceNum - b.priceNum);
}
