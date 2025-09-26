// Component: MassiveBenefits2025 (WordPress reference style)
// Matching the provided reference structure: centered H2, two-column UL with check icons
// Notes: dependency-free inline SVG icons; Tailwind utility classes emulate .text-side-by-side-list layout

function CheckIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8 12 2.2 2.2L16 8.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const benefitsCopy = {
  title: "Massive Benefits of Choosing the Right Card Machine in 2025",
  items: [
    {
      key: "save-thousands",
      text:
        "Even a small difference in transaction rates (e.g. 1.5% vs 1.75%) can add up to <strong>£250–£500 saved per £100,000 revenue</strong>.",
      sup: null,
    },
    {
      key: "boost-satisfaction",
      text:
        "Fast, reliable card readers reduce checkout friction, helping you serve more customers and close more sales.",
      sup: null,
    },
    {
      key: "tailored-payments",
      text:
        "Whether you take payments <strong>in-person, online, or over the phone</strong>, the right provider ensures the lowest costs for your business model.",
      sup: null,
    },
    {
      key: "transparent-pricing",
      text:
        "No hidden charges or confusing contracts — see exactly what you'll pay each month before you commit.",
      sup: null,
    },
  ],
};

export default function MassiveBenefits2025() {
  return (
    <section className="w-full bg-white bg-center py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* H2 centered like reference */}
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-slate-800 mb-12 m-auto">
          {benefitsCopy.title}
        </h2>

        {/* UL with two columns on md+, matching .text-side-by-side-list--2-col */}
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 md:mt-16 md:grid-cols-2">
          {benefitsCopy.items.map(({ key, text, sup }) => (
            <li key={key} className="text-lg leading-7 text-slate-600 font-light">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-flex text-primary" aria-hidden="true">
                  <CheckIcon className="h-6 w-6 text-primary" />
                </span>
                <span 
                  className="[&_strong]:text-primary [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: text + (sup ? `<sup class="ml-0.5 align-super text-sm text-slate-500">${sup}</sup>` : '') }}
                />
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
