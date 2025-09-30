// GA4 Analytics utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID || "G-7ZRZTC4JJ3";

export function initGA() {
  if (typeof window === "undefined" || !GA4_ID) {
    console.warn("GA4 ID not found or running on server");
    return;
  }

  // Load gtag script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = function() {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    page_title: document.title,
    page_location: window.location.href,
  });

  console.log("GA4 initialized with ID:", GA4_ID);
}

export function trackPageView(path?: string) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("config", GA4_ID, {
    page_path: path || window.location.pathname,
    page_title: document.title,
    page_location: window.location.href,
  });
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("GA4 not initialized or running on server");
    return;
  }

  window.gtag("event", eventName, parameters);
  console.log("GA4 Event tracked:", eventName, parameters);
}

