import React from "react";

/**
 * ProviderOfferCardWide — matches the screenshot layout
 * - Two-column card
 * - Left: logo, provider name, big Compare button
 * - Right: dashed tag pill, 4-col spec table, contract note, View Deals link
 * TailwindCSS required
 */

export default function ProviderOfferCardWide({
  logo = "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png",
  name = "Barclaycard Smartpay Touch",
  tag = "ALL IN ONE SMART READER",
  compareHref = "https://portal.cardmachine.co.uk/getaquote",
  dealsHref = "https://www.barclaycard.co.uk/business/accepting-payments/card-readers/mobile",
  stats = {
    cost: { label: "Card Machine Cost", prefix: "£", value: "0" },
    monthly: { label: "Monthly Fee", prefix: "£", value: "29" },
    fee: { label: "Transaction Fee (%)", value: "1.60" },
    payout: { label: "Payout Duration", value: "1", suffix: " Day" },
  },
  contractNote = "*12 months contract",
}) {
  const specList = [stats.cost, stats.monthly, stats.fee, stats.payout];

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white shadow-lg p-6 lg:p-8">
      <div className="grid items-center gap-8 lg:grid-cols-[420px_1fr]">
        {/* LEFT */}
        <div className="flex flex-col items-center lg:items-start gap-6">
          <img src={logo} alt={name} className="h-24 w-20 object-contain" />
          <h3 className="text-center lg:text-left text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-slate-800">{name}</h3>
          <a
            href={compareHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center px-6 py-3 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
            style={{ borderRadius: '32px', height: '3rem' }}
          >
            COMPARE QUOTES
          </a>
        </div>

        {/* RIGHT */}
        <div>
          {/* Tag Pill */}
          <div className="mb-6 flex justify-center">
            <span className="rounded-full border border-dashed border-slate-300 px-4 py-2 text-xs font-semibold tracking-wide text-primary">
              {tag}
            </span>
          </div>

          {/* Spec table */}
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-4 bg-slate-50">
              {specList.map((s) => (
                <div key={s.label} className="border-r border-slate-200 p-3 last:border-r-0">
                  <p className="text-center text-sm font-medium text-slate-600">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 border-t border-slate-200">
              {specList.map((s) => (
                <div key={s.label + "-v"} className="flex items-center justify-center border-r border-slate-200 p-4 last:border-r-0">
                  <p className="text-xl md:text-2xl font-extrabold text-slate-800">
                    {s.prefix && <span className="mr-1 align-top text-sm font-bold">{s.prefix}</span>}
                    {s.value}
                    {s.suffix && (
                      <span className="ml-1 align-middle text-sm font-bold">{s.suffix}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Note + deals */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500">{contractNote}</p>
            <a
              href={dealsHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 text-base font-semibold text-slate-600 hover:text-primary transition-colors"
            >
              <span>VIEW DEALS</span>
              <svg aria-hidden="true" viewBox="0 0 448 512" className="h-4 w-4 fill-current"><path d="M313.941 216H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h301.941v46.059c0 21.382 25.851 32.09 40.971 16.971l86.059-86.059c9.373-9.373 9.373-24.569 0-33.941l-86.059-86.059c-15.119-15.119-40.971-4.411-40.971 16.971V216z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
