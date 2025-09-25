import * as React from "react";
import { useState, useMemo } from "react";
import { Search, ChevronRight, CreditCard, Globe, Phone, Check, ArrowLeft } from "lucide-react";

// --- Brand palette (inline so you don't need Tailwind config) ---
const BRAND_ORANGE = "#fc7b4f"; // border, icon, helper text
const VALID_GREEN = "#16a34a"; // success state (green-600)

// Utility: format a number as "£ 200,000"
function formatGBP(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.]/g, ""));
  if (Number.isNaN(num)) return "";
  return `£ ${new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 }).format(Math.round(num))}`;
}

// Utility: parse from formatted to number
function parseGBP(input) {
  // Allow truly empty state (no forced 0)
  if (input === "" || input === null || input === undefined) return "";
  const digits = String(input).replace(/[^0-9.]/g, "");
  if (digits === "") return ""; // keep empty when user deletes all
  const n = Number(digits);
  return Number.isNaN(n) ? "" : n;
}

function CurrencyInput({
  id,
  value,
  onChange,
  placeholder = "£ 200,000",
  required = false,
  error,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const showError = Boolean(error);
  const isValid = !showError && (required ? value !== "" && Number(value) > 0 : value !== "");

  // derive display value
  const displayValue = useMemo(() => (isFocused ? value : formatGBP(value)), [value, isFocused]);

  return (
    <div className="w-full max-w-xl">
      <div className="relative">
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="w-full rounded-2xl border-2 bg-white px-5 py-4 text-xl leading-none placeholder:text-gray-400 outline-none focus:ring-4"
          style={{
            borderColor: showError ? BRAND_ORANGE : (isValid ? VALID_GREEN : "#e5e7eb"),
            boxShadow: isFocused ? `0 0 0 4px ${showError ? BRAND_ORANGE : (isValid ? VALID_GREEN : "#94a3b8")}20` : undefined,
          }}
          placeholder={placeholder}
          value={displayValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => {
            const raw = e.target.value;
            const parsed = parseGBP(raw);
            onChange?.(parsed);
          }}
          aria-invalid={showError}
          aria-required={required}
        />

        {/* Right-side status icon */}
        {showError && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-white text-lg font-bold"
            style={{ backgroundColor: BRAND_ORANGE }}
            aria-hidden
            title="Field is required"
          >
            !
          </span>
        )}
        {!showError && isValid && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: VALID_GREEN }}
            aria-hidden
            title="Looks good"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>

      {/* Helper text */}
      {showError && (
        <p className="mt-3 text-base" style={{ color: BRAND_ORANGE }}>
          Required
        </p>
      )}
    </div>
  );
}

/**
 * Solar‑Style Estimate Card
 * - Postcode input with search icon
 * - House size segmented cards (radio behavior)
 * - CTA disabled until both postcode + size are present
 * - Accessible, responsive, and easy to drop into any page
 */
// ---- Types
type Channel = "inPerson" | "online" | "phone";

type FeeByChannel = {
  // percentage as decimal (e.g., 1.69% -> 0.0169)
  pct: Partial<Record<Channel, number>>;
  // fixed per-transaction fee in GBP (e.g., £0.20 -> 0.20)
  fixed: Partial<Record<Channel, number>>;
};

export type Provider = {
  id: string;
  name: string;
  products?: string[];
  deviceCostGBP: number;      // upfront device price
  monthlyFeeGBP: number;      // recurring monthly fee
  fees: FeeByChannel;         // % and fixed fees by channel
  payoutDays?: number | null;
  notes?: string;
  url?: string;               // provider URL
  imageUrl?: string;          // provider image URL
};

export type Inputs = {
  annualRevenueGBP: number;
  avgTransactionGBP: number;
  mix: { inPerson: number; online: number; phone: number }; // decimals sum to 1
  amortiseMonths?: number | 0; // e.g., 12 to spread device cost, 0/undefined = no amortisation
};

// ---- Helpers
const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

const clampMix = (mix: Inputs["mix"]) => {
  const total = (mix.inPerson || 0) + (mix.online || 0) + (mix.phone || 0);
  if (!total) return { inPerson: 1, online: 0, phone: 0 };
  return {
    inPerson: (mix.inPerson || 0) / total,
    online: (mix.online || 0) / total,
    phone: (mix.phone || 0) / total,
  };
};

// ---- Core calculation
export type CostBreakdown = {
  providerId: string;
  providerName: string;
  monthlyRevenue: number;
  estTransactions: number;
  blendedPct: number;     // weighted % fee
  blendedFixed: number;   // weighted fixed fee per txn
  percentFeeCost: number; // monthlyRevenue * blendedPct
  fixedFeeCost: number;   // estTransactions * blendedFixed
  monthlyFee: number;
  deviceAmortised: number; // deviceCost / amortiseMonths (or 0)
  totalMonthly: number;
};

export function computeCost(p: Provider, inputs: Inputs): CostBreakdown {
  const monthlyRevenue = inputs.annualRevenueGBP / 12;
  const estTransactions = Math.max(1, Math.round(monthlyRevenue / inputs.avgTransactionGBP));
  const mix = clampMix(inputs.mix);

  // Blended percentage
  const pct =
    (p.fees.pct.inPerson || 0) * mix.inPerson +
    (p.fees.pct.online || 0) * mix.online +
    (p.fees.pct.phone || 0) * mix.phone;

  // Blended fixed fee per transaction
  const fixed =
    (p.fees.fixed.inPerson || 0) * mix.inPerson +
    (p.fees.fixed.online || 0) * mix.online +
    (p.fees.fixed.phone || 0) * mix.phone;

  const percentFeeCost = monthlyRevenue * pct;
  const fixedFeeCost = estTransactions * fixed;
  const monthlyFee = p.monthlyFeeGBP || 0;
  const deviceAmortised =
    inputs.amortiseMonths && inputs.amortiseMonths > 0
      ? p.deviceCostGBP / inputs.amortiseMonths
      : 0;

  const totalMonthly = percentFeeCost + fixedFeeCost + monthlyFee + deviceAmortised;

  return {
    providerId: p.id,
    providerName: p.name,
    monthlyRevenue,
    estTransactions,
    blendedPct: pct,
    blendedFixed: fixed,
    percentFeeCost,
    fixedFeeCost,
    monthlyFee,
    deviceAmortised,
    totalMonthly,
  };
}

// Rank providers by cheapest total
export function recommend(providers: Provider[], inputs: Inputs) {
  const rows = providers.map((p) => computeCost(p, inputs));
  rows.sort((a, b) => a.totalMonthly - b.totalMonthly);
  return rows;
}

interface CardReader extends CostBreakdown {
  isLowest: boolean;
  deviceCostGBP: number;
  url?: string;
  imageUrl?: string;
}

const PROVIDERS: Provider[] = [
  {
    id: "tide",
    name: "Tide Card Reader",
    deviceCostGBP: 49,
    monthlyFeeGBP: 0,
    fees: {
      pct: { inPerson: 0.015, online: 0.022, phone: 0.022 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    payoutDays: 1,
    notes: "Low in-person %.",
    url: "https://www.tide.co/offers/card-reader-getpaidsummer/?gclsrc=aw.ds&utm_source=GoogleAds&utm_medium=CPC&utm_campaign=ACQPOS-UK-EN-DA-PaidSearch-Product-POS-Generic&utm_content=Generic-POS-Device&utm_term=card%20processor&gad_source=1&gad_campaignid=22848929742&gbraid=0AAAAADOJNHcc7VQeGrvZ3p4X7uR_vDI6z&gclid=Cj0KCQjw0NPGBhCDARIsAGAzpp1SWVy7IfAPsu8tvSnB_N5I7do8bqBb6b0b_mCbnBmI04DiQAiExhUaAs1MEALw_wcB",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Tide-Reader.webp"
  },
  {
    id: "barclaycard-smartpay-touch",
    name: "Barclaycard Smartpay Touch",
    deviceCostGBP: 0,
    monthlyFeeGBP: 29,
    fees: {
      pct: { inPerson: 0.016, online: 0.022, phone: 0.022 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    payoutDays: 1,
    url: "https://www.barclaycard.co.uk/business/accepting-payments/card-readers/mobile",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png"
  },
  {
    id: "sumup-air",
    name: "SumUp Air",
    deviceCostGBP: 25,
    monthlyFeeGBP: 0,
    fees: {
      pct: { inPerson: 0.0169, online: 0.025, phone: 0.025 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    url: "https://squareup.com/us/en?irgwc=1&utm_medium=affiliate&utm_source=impact_radius&utm_term=_myxdh0bn6gkaxyvezq2dewrscm222vbpgdjjqchc00",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Square-reader.webp"
  },
  {
    id: "square",
    name: "Square",
    deviceCostGBP: 99,
    monthlyFeeGBP: 0,
    fees: {
      pct: { inPerson: 0.0175, online: 0.0175, phone: 0.0175 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    payoutDays: 1,
    url: "https://squareup.com/us/en?irgwc=1&utm_medium=affiliate&utm_source=impact_radius&utm_term=_myxdh0bn6gkaxyvezq2dewrscm222vbpxxjjqchc00",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Square-stand.webp"
  },
  {
    id: "zettle-terminal",
    name: "Zettle Payment Terminal",
    deviceCostGBP: 149,
    monthlyFeeGBP: 0,
    fees: {
      pct: { inPerson: 0.0175, online: 0.025, phone: 0.025 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    url: "https://www.zettle.com/gb/payments/terminal",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/iZettle-terminal.webp"
  }
];

export default function SolarStyleEstimateCard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [avgTransaction, setAvgTransaction] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [results, setResults] = useState<CardReader[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [touched, setTouched] = useState({ annualRevenue: false, avgTransaction: false });
  
  const totalSteps = 3;
  const annualRevenueNum = Number(annualRevenue) || 0;
  const avgTransactionNum = Number(avgTransaction) || 0;
  
  const canProceed = 
    (currentStep === 1 && annualRevenueNum > 0) ||
    (currentStep === 2 && avgTransactionNum > 0) ||
    (currentStep === 3 && paymentMethods.length > 0);
  const canSubmit = annualRevenueNum > 0 && avgTransactionNum > 0 && paymentMethods.length > 0;

  const paymentOptions = [
    {
      key: "in-person",
      label: "Face to face",
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      key: "online",
      label: "Online",
      icon: <Globe className="h-6 w-6" />
    },
    {
      key: "over-phone",
      label: "Over the phone",
      icon: <Phone className="h-6 w-6" />
    }
  ];

  const items: Array<{
    key: "1-2" | "3" | "4+";
    title: string;
    icon: React.ReactNode;
  }> = [
    {
      key: "1-2",
      title: "1–2 bedrooms",
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
          <path d="M8 22l16-10 16 10v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V22z" stroke="#1B4B66" strokeWidth="2" fill="#E6F3F7"/>
          <path d="M18 38V26h12v12" stroke="#1B4B66" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      key: "3",
      title: "3 bedrooms",
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
          <path d="M6 24l18-12 18 12v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V24z" stroke="#1B4B66" strokeWidth="2" fill="#EAF6EE"/>
          <path d="M16 39V27h16v12" stroke="#1B4B66" strokeWidth="2"/>
        </svg>
      ),
    },
    {
      key: "4+",
      title: "4+ bedrooms",
      icon: (
        <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
          <path d="M4 24l20-14 20 14v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V24z" stroke="#1B4B66" strokeWidth="2" fill="#F3EEF9"/>
          <path d="M14 42V28h20v14" stroke="#1B4B66" strokeWidth="2"/>
        </svg>
      ),
    },
  ];

  function calculateResults() {
    // Create payment mix from selected methods
    const mix: Inputs["mix"] = { inPerson: 0, online: 0, phone: 0 };
    
    if (paymentMethods.length > 0) {
      const weight = 1 / paymentMethods.length;
      paymentMethods.forEach(method => {
        switch (method) {
          case 'in-person': mix.inPerson += weight; break;
          case 'online': mix.online += weight; break;
          case 'over-phone': mix.phone += weight; break;
        }
      });
    } else {
      // Default to in-person if no methods selected
      mix.inPerson = 1;
    }

    const inputs: Inputs = {
      annualRevenueGBP: annualRevenueNum,
      avgTransactionGBP: avgTransactionNum,
      mix,
      amortiseMonths: 12 // Amortize device cost over 12 months
    };

    // Use the new calculation logic
    const costBreakdowns = recommend(PROVIDERS, inputs);
    
        // Add isLowest flag and convert to CardReader format
        const cardReaders: CardReader[] = costBreakdowns.map((breakdown, index) => {
          const provider = PROVIDERS.find(p => p.id === breakdown.providerId);
          return {
            ...breakdown,
            isLowest: index === 0, // First item (cheapest) is marked as lowest
            deviceCostGBP: provider ? provider.deviceCostGBP : 0,
            url: provider?.url,
            imageUrl: provider?.imageUrl
          };
        });

    return cardReaders;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    
    setIsCalculating(true);
    
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const calculatedResults = calculateResults();
    setResults(calculatedResults);
    setIsCalculating(false);
  }

  const handlePaymentMethodToggle = (method: string) => {
    setPaymentMethods(prev => 
      prev.includes(method) 
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  const handleGoBack = () => {
    setResults(null);
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="w-full py-10 flex justify-center bg-[#f7f9f8]" data-estimate-card>
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-[0_8px_24px_rgba(16,24,40,0.08)] border border-slate-100 py-8"
        style={{ paddingLeft: '8.5rem', paddingRight: '8.5rem' }}>
        
        {!results ? (
          // Form Section with Stepper
          <div>
            {/* Stepper Header */}
            <div className="text-center mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-[-0.02em] text-slate-800 m-auto">
              We’ll find your best card machine rates with trusted providers in just 3 simple steps.               </h2>
            
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => handleStepClick(step)}
                    className={[
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                      step <= currentStep
                        ? "bg-primary text-white"
                        : "bg-slate-200 text-slate-400"
                    ].join(" ")}
                  >
                    {step}
                  </button>
                  {step < 3 && (
                    <div className={[
                      "w-16 h-1 mx-2 transition-all",
                      step < currentStep ? "bg-primary" : "bg-slate-200"
                    ].join(" ")} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div>
              {/* Step 1: Annual Revenue */}
              {currentStep === 1 && (
                <div className="text-center">
                  <div className="max-w-md mx-auto">
                    <label htmlFor="annualRevenue" className="block text-md font-semibold text-slate-700 mb-2">
                    What's your estimated annual card revenue? (£)
                    </label>
                    <CurrencyInput
                      id="annualRevenue"
                      value={annualRevenue}
                      onChange={(value) => {
                        setAnnualRevenue(value);
                        if (!touched.annualRevenue) {
                          setTouched(prev => ({ ...prev, annualRevenue: true }));
                        }
                      }}
                      required
                      error={touched.annualRevenue && (annualRevenue === "" || annualRevenueNum <= 0)}
                      placeholder="£ 200,000"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Average Transaction */}
              {currentStep === 2 && (
                <div className="text-center">
                  <div className="max-w-md mx-auto">
                    <label htmlFor="avgTransaction" className="block text-md font-semibold text-slate-700 mb-2">
                    What's your average transaction value? (£)
                    </label>
                    <CurrencyInput
                      id="avgTransaction"
                      value={avgTransaction}
                      onChange={(value) => {
                        setAvgTransaction(value);
                        if (!touched.avgTransaction) {
                          setTouched(prev => ({ ...prev, avgTransaction: true }));
                        }
                      }}
                      required
                      error={touched.avgTransaction && (avgTransaction === "" || avgTransactionNum <= 0)}
                      placeholder="£ 56.24"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Payment Methods */}
              {currentStep === 3 && (
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-800 mb-6">
                    How do you take payments?
                  </h3>
                  <div className="max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {paymentOptions.map((option) => {
                        const selected = paymentMethods.includes(option.key);
                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => handlePaymentMethodToggle(option.key)}
                            className={[
                              "group flex items-center gap-4 rounded-xl border bg-white px-4 py-4 text-left transition",
                              selected
                                ? "border-primary ring-4 ring-primary/20"
                                : "border-slate-200 hover:border-slate-300 hover:shadow-sm",
                            ].join(" ")}
                          >
                            <span className="shrink-0 text-slate-600">{option.icon}</span>
                            <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                            <span
                              className={[
                                "ml-auto h-5 w-5 rounded border-2 flex items-center justify-center",
                                selected ? "border-primary bg-primary" : "border-slate-300",
                              ].join(" ")}
                              aria-hidden
                            >
                              {selected && <Check className="h-3 w-3 text-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center mt-8 gap-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-300 flex items-center justify-center"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed}
                  className={[
                    "px-6 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300",
                    "focus:outline-none",
                    canProceed
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                  style={{ borderRadius: '32px' }}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4 inline" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit || isCalculating}
                  className={[
                    "px-6 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300",
                    "focus:outline-none",
                    canSubmit && !isCalculating
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed",
                  ].join(" ")}
                  style={{ borderRadius: '32px' }}
                >
                  {isCalculating ? "Calculating..." : "Calculate my savings"} 
                  {!isCalculating && <ChevronRight className="ml-2 h-4 w-4 inline" />}
                </button>
              )}
            </div>
          </div>
        ) : (
                // Results Section
                <div>

            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-slate-800 mb-4">
                Your Card Reader Comparison
              </h3>
              <p className="text-slate-600 font-light leading-relaxed">
                Based on your monthly revenue of £{(annualRevenueNum / 12).toLocaleString()} and {results[0]?.estTransactions?.toLocaleString()} estimated transactions
              </p>
            </div>

            <div className="space-y-6">
              {results.map((reader, index) => (
                <div
                  key={reader.providerName}
                  className={`relative bg-white rounded-2xl border-2 p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
                    reader.isLowest 
                      ? 'border-green-500 ring-4 ring-green-100' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {reader.isLowest && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Best Value
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6">
                      {/* Left side - Name and Image */}
                      <div className="flex-shrink-0 text-center max-w-[150px] min-w-[150px]">
                        <img
                          src={reader.imageUrl || "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png"}
                          alt={`${reader.providerName} card reader`}
                          className="w-24 h-24 object-contain mx-auto mb-3"
                          onError={(e) => {
                            console.log(`Failed to load image for ${reader.providerName}:`, reader.imageUrl);
                            e.currentTarget.src = "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png";
                          }}
                          onLoad={() => {
                            console.log(`Successfully loaded image for ${reader.providerName}:`, reader.imageUrl);
                          }}
                        />
                        <h4 className="text-lg font-semibold text-slate-800">{reader.providerName}</h4>
                      </div>

                    {/* Right side - Content */}
                    <div className="flex-1 min-w-[150px]">
                      <div className="mb-4 text-center">
                        <div className="text-3xl font-extrabold text-slate-900 mb-1">
                          £{reader.totalMonthly.toFixed(0)}
                        </div>
                        <div className="text-sm text-slate-500">total per month</div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-1">Device cost</div>
                          <div className="text-lg font-semibold text-slate-800">£{reader.deviceCostGBP || 0}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-1">Blended rate</div>
                          <div className="text-lg font-semibold text-slate-800">{(reader.blendedPct * 100).toFixed(2)}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-1">Transaction fee</div>
                          <div className="text-lg font-semibold text-slate-800">£{reader.percentFeeCost.toFixed(0)}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-500 mb-1">Monthly fee</div>
                          <div className="text-lg font-semibold text-slate-800">£{reader.monthlyFee}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (reader.url) {
                            window.open(reader.url, "_blank");
                          }
                        }}
                        className="w-full px-6 py-2 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                        style={{ borderRadius: '32px' }}
                      >
                        View Deals
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

                  <div className="mt-8 text-center">
                    <p className="text-slate-600 font-light">
                      *Prices shown are estimates. Actual costs may vary based on your specific business needs.
                    </p>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="flex items-center justify-center mt-8">
                    <button
                      type="button"
                      onClick={handleGoBack}
                      className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 transition-all duration-300 flex items-center justify-center"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  </div>
                </div>
        )}
      </div>
    </div>
  );
}
