import { trackEvent } from "@/utils/analytics/ga";

export function bindProviderCtas() {
  if (typeof window === "undefined") return;

  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as HTMLElement)?.closest<HTMLElement>(
        "[data-ga-event='provider_cta_click']"
      );
      if (!el) return;

      const params = {
        provider_id: el.getAttribute("data-ga-provider-id") || undefined,
        provider_name: el.getAttribute("data-ga-provider-name") || undefined,
        cta_type: el.getAttribute("data-ga-cta-type") as
          | "visit_site"
          | "create_account"
          | undefined,
        rank: Number(el.getAttribute("data-ga-rank") || "0"),
        page_section: el.getAttribute("data-ga-section") || "recommendations",
        href:
          (el as HTMLAnchorElement).href ||
          el.getAttribute("data-ga-href") ||
          undefined,
      };

      trackEvent("provider_cta_click", params);
    },
    true
  );

  console.log("Provider CTA event listener bound");
}

