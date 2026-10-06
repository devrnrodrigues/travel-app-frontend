import { useState, useMemo, useCallback } from "react";
import { Linking } from "react-native";

export function useFlightResults({ tickets }) {
  const [selectedTicketIndex, setSelectedTicketIndex] = useState(null);

  const cheapestTicket = useMemo(() => {
    return tickets && tickets.length > 0 ? tickets[0] : null;
  }, [tickets]);

  const sanitizeBaggage = useCallback((text, prefix) => {
    if (!text) return null;
    let clean = String(text).replace(/undefined/gi, "").replace(/0x\s*/gi, "").trim();
    if (!clean) return "Inclusa";
    if (prefix) {
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`^(?:${escapedPrefix}\\s*)+`, "i");
      clean = clean.replace(regex, "").trim();
      return `${prefix} ${clean}`;
    }
    return clean;
  }, []);

  const formatPriceDisplay = useCallback((price, currency) => {
    if (!price) return "";
    let str = String(price).trim();
    if (currency) {
      str = str.replace(new RegExp(`^${currency}\\s*`, "i"), "").trim();
    }
    str = str.replace(/^BRL\s*/i, "").trim();
    const symbolMap = {
      BRL: "R$",
      USD: "US$",
      EUR: "€",
      GBP: "£",
      AED: "AED",
    };
    const symbol = symbolMap[currency?.toUpperCase()] || (currency === "BRL" ? "R$" : currency) || "R$";
    return `${symbol} ${str}`;
  }, []);

  const handleSelectTicketAndBook = useCallback((index, ticket) => {
    setSelectedTicketIndex(index);
    if (ticket.bookingUrl) {
      Linking.openURL(ticket.bookingUrl);
    } else {
      const query = encodeURIComponent(`${ticket.company || "companhia aérea"} passagens`);
      Linking.openURL(`https://www.google.com/search?q=${query}`);
    }
  }, []);

  return {
    selectedTicketIndex,
    setSelectedTicketIndex,
    cheapestTicket,
    sanitizeBaggage,
    formatPriceDisplay,
    handleSelectTicketAndBook,
  };
}
