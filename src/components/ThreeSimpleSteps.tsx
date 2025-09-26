import React from "react";

/**
 * Three Simple Steps — responsive section
 * TailwindCSS required
 */

const StepCard = ({ index, title, description, Icon = null }) => (
  <div className="relative">
    {/* offset shadow block */}
    <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-2xl bg-slate-200 opacity-100" aria-hidden="true" />

    <div className="relative z-10 rounded-2xl bg-white p-6 md:p-7 lg:p-8 shadow-lg border border-slate-200">
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          {Icon ? <Icon className="h-14 w-14" /> : (
            <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="10" y="12" width="44" height="32" rx="4" fill="white" />
              <path d="M16 20h24M16 28h20M16 36h12" stroke="currentColor" />
              <circle cx="50" cy="40" r="8" fill="white" />
              <path d="M46 40h8M50 36v8" stroke="currentColor" />
            </svg>
          )}
        </div>
        <div>
          <p className="font-semibold tracking-tight text-primary text-lg">{String(index).padStart(2, "0")}. <span className="text-slate-800">{title}</span></p>
          <p className="mt-2 text-slate-600 font-light leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  </div>
);

const steps = [
  {
    title: "Enter Your Numbers",
    description: "Add your estimated annual card revenue, average transaction value, and how you take payments.",
  },
  {
    title: "See Your Costs",
    description: "We'll calculate monthly fees for each provider and highlight the most cost-effective options.",
  },
  {
    title: "Get Your Recommendation",
    description: "Pick the best match for your setup and start saving on processing every month.",
  },
];

export default function ThreeSimpleSteps({ imageSrc = "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1200&auto=format&fit=crop" }) {
  return (
    <section className="w-full bg-[#f7f9f8] py-12 md:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold tracking-widest text-slate-600">HOW IT WORKS</p>
        <h2 className="mt-3 text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-slate-800 m-auto">Three Simple Steps</h2>

        <div className="mt-10 grid items-start gap-8 lg:mt-14 lg:grid-cols-2">
          {/* Left image card */}
          <div className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-3xl bg-slate-200" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-200">
              <img src={imageSrc} alt="Merchant taking card payment" className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-slate-800/70 to-transparent p-4 text-white">
                <span className="text-xl">★</span>
                <span className="font-semibold">Best In Class.</span>
              </div>
            </div>
          </div>

          {/* Right steps */}
          <div className="flex flex-col gap-8">
            {steps.map((s, i) => (
              <StepCard key={s.title} index={i + 1} title={s.title} description={s.description} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
