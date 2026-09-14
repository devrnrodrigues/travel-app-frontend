import { ENV } from "../../../config/env";

const RAPIDAPI_KEY = ENV.RAPIDAPI_KEY;
const RAPIDAPI_HOST = "booking-com15.p.rapidapi.com";

export const CABIN_CLASS_MAP = {
  "Econômica": "ECONOMY",
  "Econômica Premium": "PREMIUM_ECONOMY",
  "Executiva": "BUSINESS",
  "Primeira Classe": "FIRST",
};

const formatPrice = (units = 0, nanos = 0) =>
  (units + nanos / 1_000_000_000).toFixed(2);

const priceValue = (units = 0, nanos = 0) =>
  units + nanos / 1_000_000_000;

const extractTime = (dateStr) => (dateStr ? dateStr.slice(11, 16) : null);

const formatDuration = (seconds) => {
  if (!seconds) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
};

const normalizeOffer = (offer, fallbackCurrency) => {
  const outbound = offer.segments?.[0];
  const inbound  = offer.segments?.[1];
  const outLeg   = outbound?.legs?.[0];
  const inLeg    = inbound?.legs?.[0];

  const carrierData = outLeg?.carriersData?.[0] || {};
  const company = carrierData.name || null;
  const logo    = carrierData.logo || null;

  const totalUnits    = offer.priceBreakdown?.total?.units;
  const totalNanos    = offer.priceBreakdown?.total?.nanos;
  const price         = totalUnits != null ? formatPrice(totalUnits, totalNanos) : null;
  const priceNum      = totalUnits != null ? priceValue(totalUnits, totalNanos)  : Infinity;
  const offerCurrency = offer.priceBreakdown?.total?.currencyCode || fallbackCurrency;

  const departureTime = extractTime(outbound?.departureTime);
  const arrivalTime   = extractTime(outbound?.arrivalTime);
  const duration      = formatDuration(outbound?.totalTime);

  const outStops = outbound?.legs?.length > 1
    ? `${outbound.legs.length - 1} escala(s)`
    : outLeg?.flightStops?.length > 0
      ? `${outLeg.flightStops.length} escala(s)`
      : "Direto";

  const checkedBag  = outbound?.travellerCheckedLuggage?.[0]?.luggageAllowance;
  const baggageInfo = checkedBag
    ? `${checkedBag.maxPiece}x ${checkedBag.maxWeightPerPiece} ${checkedBag.massUnit}`
    : null;

  const cabinBag     = outbound?.travellerCabinLuggage?.[0]?.luggageAllowance;
  const cabinBagInfo = cabinBag
    ? `${cabinBag.maxPiece}x ${cabinBag.maxWeightPerPiece} ${cabinBag.massUnit}`
    : null;

  const hasReturn           = !!inbound;
  const returnDepartureTime = hasReturn ? extractTime(inbound.departureTime) : null;
  const returnArrivalTime   = hasReturn ? extractTime(inbound.arrivalTime)   : null;
  const returnDuration      = hasReturn ? formatDuration(inbound.totalTime)  : null;
  const inStops = hasReturn
    ? inbound?.legs?.length > 1
      ? `${inbound.legs.length - 1} escala(s)`
      : inLeg?.flightStops?.length > 0
        ? `${inLeg.flightStops.length} escala(s)`
        : "Direto"
    : null;

  return {
    id:                   offer.token || String(Math.random()),
    token:                offer.token,
    company,
    logo,
    price,
    priceNum,
    currency:             offerCurrency,
    departureTime,
    arrivalTime,
    duration,
    stops:                outStops,
    baggageInfo,
    cabinBagInfo,
    hasReturn,
    returnDepartureTime,
    returnArrivalTime,
    returnDuration,
    returnStops:          inStops,
  };
};

export const searchFlights = async ({ fromIata, toIata, departDate, returnDate, adults, children, cabinClass, currency }) => {
  const fromId        = `${fromIata}.AIRPORT`;
  const toId          = `${toIata}.AIRPORT`;
  const apiCabinClass = CABIN_CLASS_MAP[cabinClass] || "ECONOMY";
  const childrenQty   = parseInt(children, 10) || 0;
  const childrenParam = Array(childrenQty).fill("17").join(",");

  const params = new URLSearchParams({
    fromId,
    toId,
    departDate,
    returnDate,
    pageNo:        "1",
    adults:        adults || "1",
    sort:          "BEST",
    cabinClass:    apiCabinClass,
    currency_code: currency,
  });
  if (childrenParam) params.append("children", childrenParam);

  const url = `https://${RAPIDAPI_HOST}/api/v1/flights/searchFlights?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key":  RAPIDAPI_KEY,
    },
  });

  const json = await response.json();

  if (!json.status || !json.data?.flightOffers?.length) {
    return [];
  }

  const normalized = json.data.flightOffers.map((offer) => normalizeOffer(offer, currency));

  const unique = normalized.filter((ticket, index, self) =>
    index === self.findIndex((t) =>
      t.price === ticket.price &&
      t.company === ticket.company &&
      t.departureTime === ticket.departureTime &&
      t.arrivalTime === ticket.arrivalTime
    )
  );

  return [...unique].sort((a, b) => a.priceNum - b.priceNum);
};
