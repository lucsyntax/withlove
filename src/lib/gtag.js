// lib/gtag.js
export const GA_TRACKING_ID = "G-0WGZ3PKM4J";

// Log de página
export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Evento
export const event = ({ action, category, label, value }) => {
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
