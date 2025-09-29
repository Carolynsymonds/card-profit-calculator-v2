import * as React from "react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, CreditCard, Globe, Phone, Check, ArrowLeft } from "lucide-react";
import { useCountUpCurrency, useCountUpPercentage } from "@/hooks/useCountUp";

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

// Component for animated summary
function AnimatedSummary({ annualRevenueNum, results }) {
  return (
    <p className="text-slate-600 font-light leading-relaxed">
      Based on your estimated monthly revenue of £{(annualRevenueNum / 12).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} and {results[0]?.estTransactions.toFixed(0)?.toLocaleString()} transactions
    </p>
  );
}

// Component for animated result cards
function AnimatedResultCard({ reader, index }) {
  const monthlyTotal = useCountUpCurrency(reader.totalMonthly, { delay: index * 200 });

  return (
    <article
      className="lineup-item promoted flex flex-col max-w-[1200px] rounded-[16px] shadow-[0_0_8px_0_rgba(0,0,0,0.12)] w-full mx-auto bg-white relative sm:pb-[16px]"
      aria-label={`${reader.providerName} card offer`}
    >
      {/* Header ribbon */}
      <div className="mobile-header relative h-[18px] sm:flex has-ribbon">
        <div className={`card-number hidden sm:flex items-center justify-center h-[20px] w-[34px] py-0 px-[15px] text-black rounded-tl-[12px] bg-[#2C386233] text-[11px] font-bold ${!reader.isLowest ? 'rounded-br-[16px]' : ''}`}>
          {index + 1}
        </div>
        {reader.isLowest && <div
          className="ribbon mx-auto sm:mx-0 w-fit text-white flex items-center sm:rounded-tl-none sm:rounded-bl-none uppercase text-[11px] pt-[2px] sm:pt-0 h-[20px] px-[15px] font-bold rounded-bl-[16px] rounded-br-[16px]"
          style={{ backgroundColor: reader.isLowest ? "#10d49c" : "#6b7280" }}
        >
          {reader.isLowest ? "Lowest Cost" : `${index + 1}`}
        </div>}
      </div>
      

      <div className="brand-container flex flex-row justify-evenly items-center gap-[16px] sm:justify-around sm:px-[16px] overflow-hidden">
        {/* Left: provider image + name */}
        <div className="image-container flex flex-col overflow-hidden sm:w-[174px] sm:min-w-[174px] sm:m-[12px_0_10px] rounded-[8px] w-[147px] bg-white border border-[#E4E4E5] m-[12px_0_10px_10px]">
          <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="h-[72px] sm:h-[134px] w-auto mx-auto flex justify-center items-center bg-white sm:px-[12px]">
            <img
              src={reader.imageUrl || "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png"}
              alt={`${reader.providerName} card reader`}
              className="w-[103px] max-h-[55px] sm:w-auto lg:w-full lg:max-w-[130px] lg:max-h-[90px] object-contain"
              height={55}
              onError={(e) => {
                console.log(`Failed to load image for ${reader.providerName}:`, reader.imageUrl);
                (e.currentTarget as HTMLImageElement).src =
                  "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png";
              }}
              onLoad={() => {
                console.log(`Successfully loaded image for ${reader.providerName}:`, reader.imageUrl);
              }}
            />
          </a>
          {/* Mobile score under image */}
          <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="block sm:hidden h-[20px] border-t border-[#E4E4E5]">
            <div className="flex sm:hidden justify-center items-center gap-[6px] w-auto py-1">
              <span className="score text-[16px] leading-[16px] font-bold">£{monthlyTotal.formatted}</span>
              <span className="text-xs text-slate-500">/month</span>
            </div>
          </a>
        </div>

        {/* Selling lines and features */}
        <div className="selling-lines hidden sm:flex sm:shrink-0 sm:w-[150px] lg:w-[180px] flex-col gap-[8px]">
          <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="w-fit">
            <h3 className="text-lg font-semibold text-slate-800">{reader.providerName}</h3>
          </a>

          <div className="bullets">
            <ul className="flex flex-col gap-[2px] sm:w-fit lg:w-[378px] text-[13px]">
              <li className="flex gap-[4px] items-center whitespace-nowrap text-[#727574]">
                <img src="https://top5-websitebuilders.com/app/themes/topsites/public/images/selling-line-bullets-checkmark.776c94.svg" alt="checkmark" className="h-[16px] w-[16px]" aria-hidden="true" /> Card Machine One-off: <span className="font-semibold">£{reader.deviceCostGBP || 0}</span>
              </li>
              <li className="flex gap-[4px] items-center whitespace-nowrap text-[#727574]">
                <img src="https://top5-websitebuilders.com/app/themes/topsites/public/images/selling-line-bullets-checkmark.776c94.svg" alt="checkmark" className="h-[16px] w-[16px]" aria-hidden="true" />we fdfdfTransaction Fee: <span className="font-semibold">{(reader.transactionFeeRate || 0).toFixed(2)}%</span>
              </li>
              <li className="flex gap-[4px] items-center whitespace-nowrap text-[#727574]">
                <img src="https://top5-websitebuilders.com/app/themes/topsites/public/images/selling-line-bullets-checkmark.776c94.svg" alt="checkmark" className="h-[16px] w-[16px]" aria-hidden="true" /> Monthly Fee: <span className="font-semibold">£{reader.monthlyFee}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Score box (desktop) */}
        <div className="score-box flex-col hidden md:flex md:w-[174px]">
          <div className="flex flex-col items-center">
            <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="score-rating w-[100px] h-[100px] p-[6px] flex flex-col gap-[3px] justify-center items-center rounded-[8px] border border-[#E4E4E5]">
              <div className="score font-semibold text-2xl text-[#323738]">£{monthlyTotal.raw.toFixed(0)}</div>
              <div className="score-wrapper text-center">
                <div className="score-text font-medium text-[12px] leading-[18px] text-[#323738]">per month</div>
              </div>
            </a>
          </div>
        </div>

        {/* Right actions */}
        <div className="action-links flex flex-col justify-center items-center gap-[8px] p-[8px] sm:gap-[12px] min-w-[140px] max-w-[180px]">
          <a href={reader.url || "#"} target="_blank" rel="noreferrer">
            <button className="bg-primary hover:brightness-[1.15] active:brightness-[0.91] rounded-[8px] h-[36px] w-[130px] sm:w-[150px] text-white flex flex-row gap-[6px] justify-center items-center shadow-[0_2px_5px_0_rgba(44,56,98,0.09),0_4px_12px_0_rgba(44,56,98,0.20)]">
              <span className="flex items-center gap-[4px] text-[12px] leading-[18px] font-medium sm:text-[13px]">
                Visit Site
                <svg className="h-[16px] w-[16px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13.172 12 8.222 7.05l1.414-1.414L16 12l-6.364 6.364-1.414-1.414z" />
                </svg>
              </span>
            </button>
          </a>
          <div className="visit-link text-[12px] leading-[18px] sm:text-[13px] text-[#5878EB] font-medium">
            <a href={reader.createAccountUrl || reader.url || "#"} target="_blank" rel="noreferrer">
              Create Account
              
            </a>
          </div>
        </div>
      </div>

      {/* Mobile promo line */}
      <a
        href={reader.url || "#"}
        target="_blank"
        rel="noreferrer"
        className="promotion-line flex sm:hidden w-full max-w-[311px] text-center justify-center border-secondary border-dashed border bg-secondary/10 rounded-[8px] px-[6px] py-[5px] text-[#323738] font-semibold text-[13px] leading-[18px] my-[6px] mx-auto mt-[15px]"
      >
        Total: £{monthlyTotal.formatted}/month
      </a>

      {/* Collapsible More Info (mobile) */}
      <details className="rounded-bl-[16px] rounded-br-[16px] lineup-brand-more-info bg-white block sm:hidden overflow-hidden">
        <summary className="flex p-[5px] cursor-pointer bg-[#f2f2f4] text-[#727574] leading-[22px] justify-center rounded-bl-[16px] rounded-br-[16px] w-full">
          More Info &nbsp;
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </summary>
        <div className="more-info-wrapper flex flex-col text-[#323738] text-[12px] leading-[20px] mb-[4px]">
          <div className="bullet-points text-primary bg-[#F5F7FC] p-[10px_16px]">
            <ul className="flex flex-col gap-[2px]">
              <li className="flex gap-[4px] text-[#323738]">Card Machine Cost: £{reader.deviceCostGBP || 0}</li>
              <li className="flex gap-[4px] text-[#323738]">Transactssion Fee: {(reader.transactionFeeRate || 0).toFixed(2)}%</li>
              <li className="flex gap-[4px] text-[#323738]">Monthly Fee: £{reader.monthlyFee}</li>
            </ul>
          </div>
          <div className="p-[10px_16px]">
            <div className="text-[16px] leading-[20px] font-semibold">Key Features</div>
            <ul className="flex flex-col gap-[4px] text-[14px] leading-[19px]">
              <li>Fast payment processing</li>
              <li>Secure transactions</li>
              <li>24/7 customer support</li>
              <li>Easy setup and management</li>
            </ul>
          </div>
          <div className="flex gap-[6px] justify-center p-[8px_12px_16px]">
            <a href={reader.url || "#"}>
              <button className="flex font-medium gap-[4px] justify-center items-center rounded-[8px] text-[#5878EB] bg-transparent text-[12px] leading-[18px] h-[30px] w-[110px] py-[4px]">
                Visit site <span>&gt;</span>
              </button>
            </a>
            <a href={reader.createAccountUrl || reader.url || "#"}>
              <button className="visit-site flex justify-center items-center rounded-[8px] border border-solid border-[#5878EB] text-[#5878EB] bg-transparent text-[12px] font-medium leading-[18px] h-[30px] w-[120px] py-[4px]">
                Create Account
              </button>
            </a>
          </div>
        </div>
      </details>
    </article>
  );
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
              <path d="M20 6L9 17l-5-5" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
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
  transactionFeeRate: number; // transaction fee rate as percentage (e.g., 1.75 for 1.75%)
  transactionPence?: number; // fixed pence per transaction (e.g., 3 for 3p)
  monthlyFeeGBP: number;      // recurring monthly fee
  fees: FeeByChannel;         // % and fixed fees by channel
  transaction?: {             // new per-channel structure
    inPerson?: { ratePct?: number; fixedGBP?: number };
    online?: { ratePct?: number; fixedGBP?: number };
    phone?: { ratePct?: number; fixedGBP?: number };
  };
  variants?: {               // optional variants/add-ons
    tapToPay?: { ratePct?: number; fixedGBP?: number };
    nextDaySettlementBoostGBP?: number;
  };
  payoutDays?: number | null;
  notes?: string;
  url?: string;               // provider URL
  createAccountUrl?: string;  // create account URL
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
  transactionPence?: number; // fixed pence per transaction
};

type Mix = { inPerson?: number; online?: number; phone?: number };

function normaliseMix(mix?: Mix): Required<Mix> {
  const raw = {
    inPerson: mix?.inPerson ?? 0,
    online: mix?.online ?? 0,
    phone: mix?.phone ?? 0,
  };
  const sum = raw.inPerson + raw.online + raw.phone;
  if (sum > 0) {
    return {
      inPerson: raw.inPerson / sum,
      online: raw.online / sum,
      phone: raw.phone / sum,
    };
  }
  // sensible default: 100% in-person
  return { inPerson: 1, online: 0, phone: 0 };
}

export function computeCost(p: Provider, inputs: Inputs): CostBreakdown {
  const monthlyRevenue = inputs.annualRevenueGBP / 12;
  const avgTxn = Math.max(0.01, inputs.avgTransactionGBP); // guard divide-by-zero

  const mix = normaliseMix(inputs.mix);

  // Use FLOAT transaction count for cost math (do not round)
  const estTransactionsFloat = monthlyRevenue / avgTxn;

  // Blended percentage (fees are decimals e.g., 0.0175)
  // Use new transaction structure if available, fallback to old fees structure
  const pct = p.transaction ? 
    ((p.transaction.inPerson?.ratePct || 0) * mix.inPerson +
     (p.transaction.online?.ratePct || 0) * mix.online +
     (p.transaction.phone?.ratePct || 0) * mix.phone) :
    ((p.fees.pct.inPerson || 0) * mix.inPerson +
     (p.fees.pct.online || 0) * mix.online +
     (p.fees.pct.phone || 0) * mix.phone);

  // Blended fixed per-transaction (in GBP)
  // Use new transaction structure if available, fallback to old fees structure
  const fixed = p.transaction ?
    ((p.transaction.inPerson?.fixedGBP || 0) * mix.inPerson +
     (p.transaction.online?.fixedGBP || 0) * mix.online +
     (p.transaction.phone?.fixedGBP || 0) * mix.phone) :
    ((p.fees.fixed.inPerson || 0) * mix.inPerson +
     (p.fees.fixed.online || 0) * mix.online +
     (p.fees.fixed.phone || 0) * mix.phone);

  const percentFeeCost = monthlyRevenue * pct;
  const fixedFeeCost = estTransactionsFloat * fixed;

  const monthlyFee = p.monthlyFeeGBP || 0;
  const months = inputs.amortiseMonths && inputs.amortiseMonths > 0 ? inputs.amortiseMonths : 0;
  const deviceAmortised = months ? (p.deviceCostGBP || 0) / months : 0;

  console.log(`percentFeeCost: ${percentFeeCost}, fixedFeeCost: ${fixedFeeCost}, monthlyFee: ${monthlyFee}, deviceAmortised: ${deviceAmortised}`);
  const totalMonthly = percentFeeCost + fixedFeeCost + monthlyFee + deviceAmortised;

  return {
    providerId: p.id,
    providerName: p.name,
    monthlyRevenue,
    estTransactions: estTransactionsFloat,     // keep float for accuracy; round only for UI
    blendedPct: pct,
    blendedFixed: fixed,
    percentFeeCost,
    fixedFeeCost,
    monthlyFee,
    deviceAmortised,
    totalMonthly,
    transactionPence: p.transactionPence
  };
}

// Rank providers by cheapest total
export function recommend(providers: Provider[], inputs: Inputs) {
  // Filter out providers that don't support the selected payment channels
  const supportedProviders = providers.filter(provider => {
    const mix = normaliseMix(inputs.mix);
    
    // Check if provider supports all selected channels
    const supportsInPerson = mix.inPerson === 0 || 
      (provider.transaction?.inPerson?.ratePct !== null && provider.transaction?.inPerson?.ratePct !== undefined) ||
      (provider.fees.pct.inPerson !== null && provider.fees.pct.inPerson !== undefined);
      
    const supportsOnline = mix.online === 0 || 
      (provider.transaction?.online?.ratePct !== null && provider.transaction?.online?.ratePct !== undefined) ||
      (provider.fees.pct.online !== null && provider.fees.pct.online !== undefined);
      
    const supportsPhone = mix.phone === 0 || 
      (provider.transaction?.phone?.ratePct !== null && provider.transaction?.phone?.ratePct !== undefined) ||
      (provider.fees.pct.phone !== null && provider.fees.pct.phone !== undefined);
    
    return supportsInPerson && supportsOnline && supportsPhone;
  });
  
  const rows = supportedProviders.map((p) => computeCost(p, inputs));
  rows.sort((a, b) => a.totalMonthly - b.totalMonthly);
  return rows;
}

interface CardReader extends CostBreakdown {
  isLowest: boolean;
  deviceCostGBP: number;
  url?: string;
  imageUrl?: string;
  transactionFeeRate?: number; // Original transaction fee rate from provider
  transactionPence?: number; // Fixed pence per transaction
}

const PROVIDERS: Provider[] = [
  {
    id: "tide",
    name: "Tide Card Reader",
  
    // Device cost (PAYG, "from £59" ex VAT)
    deviceCostGBP: 59,
  
    // Backward-compat defaults (treat as in-person reader rates)
    transactionFeeRate: 1.39,  // %
    transactionPence: 0.05,    // £0.05 fixed per txn (GBP)
  
    monthlyFeeGBP: 0,
  
    // New per-channel structure
    transaction: {
      inPerson: { ratePct: 0.0139, fixedGBP: 0.05 }, // 1.39% + £0.05
      online:   { ratePct: null,   fixedGBP: null }, // not specified
      phone:    { ratePct: null,   fixedGBP: null }  // not specified
    },
  
    // (Optional) keep your existing 'fees' block in sync
    fees: {
      pct:   { inPerson: 0.0139, online: null, phone: null },
      fixed: { inPerson: 0.05,   online: null, phone: null }
    },
  
    // Variants / add-ons
    variants: {
      tapToPay: { ratePct: 0.0150, fixedGBP: 0.11 },   // 1.5% + £0.11
      nextDaySettlementBoostGBP: 2.99                  // + VAT / month
    },
  
    // Next-day settlement typically requires the paid boost
    payoutDays: 1,
  
    notes: "PAYG reader: 1.39% + 5p per in-person transaction. Tap to Pay on iPhone is 1.5% + 11p. Next-day settlement available for £2.99 + VAT/month. Online/phone rates not listed here.",
  
    url: "https://www.tide.co/features/card-reader/",
    createAccountUrl: "https://web.tide.co/sign-up",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Tide-Reader.webp"
  },  
  {
    id: "barclaycard-smartpay-touch",
    name: "Barclaycard Smartpay Touch",
    deviceCostGBP: 0,
    monthlyFeeGBP: 29,
  
    // Backward-compat (defaults to in-person)
    transactionFeeRate: 1.60,  // %
    transactionPence: 0,       // £0.00 fixed per txn in-person
  
    // Optional per-channel structure (recommended)
    transaction: {
      inPerson: { ratePct: 0.0160, fixedGBP: 0.00 }, // 1.60% + £0.00
      online:   { ratePct: null,   fixedGBP: null }, // typically separate e-com/gateway pricing
      phone:    { ratePct: null,   fixedGBP: null }  // not publicly standardised; varies by contract
    },
  
    // Keep your existing fees block in sync if used
    fees: {
      pct:   { inPerson: 0.0160, online: null, phone: null },
      fixed: { inPerson: 0,      online: null, phone: null }
    },
  
    payoutDays: 1,
    url: "https://www.barclaycard.co.uk/business/accepting-payments/card-readers/mobile",
    createAccountUrl: "https://www.barclaycard.co.uk/business/contact-us",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png",
    notes: "Monthly rental £29 + VAT. Typical in-person rate ~1.60% with no fixed pence. Contract/setup fees may apply; online/phone rates handled under separate agreements."
  },
  {
    id: "sumup-air",
    name: "SumUp Air",
    deviceCostGBP: 25,
    monthlyFeeGBP: 0,
  
    // Backward-compat (defaults to in-person)
    transactionFeeRate: 1.69,   // %
    transactionPence: 0,        // £
  
    // New per-channel structure
    transaction: {
      inPerson: { ratePct: 0.0169, fixedGBP: 0.00 },   // 1.69% + £0.00
      online:   { ratePct: 0.0250, fixedGBP: 0.00 },   // 2.5%  + £0.00
      phone:    { ratePct: 0.0295, fixedGBP: 0.25 }    // 2.95% + £0.25 (Virtual Terminal)
    },
  
    // (Optional) keep your existing fees block in sync
    fees: {
      pct:   { inPerson: 0.0169, online: 0.0250, phone: 0.0295 },
      fixed: { inPerson: 0.00,   online: 0.00,   phone: 0.25 }
    },
  
    payoutDays: 1,
    notes: "In-person: 1.69% (no fixed). Online: 2.5%. Phone: 2.95% + 25p.",
    url: "https://www.sumup.com/en-gb/air-contactless-card-reader/",
    createAccountUrl: "https://www.sumup.com/en-gb/pricing/",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Square-reader.webp"
  },  
  {
    id: "square",
    name: "Square",
    deviceCostGBP: 99,
    monthlyFeeGBP: 0,
  
    // Backward-compat (defaults to in-person)
    transactionFeeRate: 1.75,  // %
    transactionPence: 0,       // £
  
    // New per-channel structure
    transaction: {
      inPerson: { ratePct: 0.0175, fixedGBP: 0.00 }, // 1.75% + £0.00
      online:   { ratePct: 0.0140, fixedGBP: 0.25 }, // 1.4% + £0.25 (UK cards; non-UK typically 2.5% + £0.25)
      phone:    { ratePct: 0.0250, fixedGBP: 0.00 }  // 2.5% (Virtual Terminal)
    },
  
    // (Optional) keep your existing fees block in sync
    fees: {
      pct:   { inPerson: 0.0175, online: 0.0140, phone: 0.0250 },
      fixed: { inPerson: 0.00,   online: 0.25,   phone: 0.00 }
    },
  
    payoutDays: 1,
    notes: "In-person: 1.75% (no fixed). Online (UK cards): 1.4% + 25p; non-UK cards usually 2.5% + 25p. Phone (Virtual Terminal): 2.5%.",
    url: "https://squareup.com/gb/en/pricing",
    createAccountUrl: "https://squareup.com/gb/en",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/Square-stand.webp"
  },  
  {
    id: "zettle-terminal",
    name: "Zettle Payment Terminal",
    deviceCostGBP: 149,
    monthlyFeeGBP: 0,
  
    // Backward-compat (defaults to in-person)
    transactionFeeRate: 1.75,  // %
    transactionPence: 0,       // £0.00 fixed per txn in-person
  
    // Optional per-channel structure (recommended)
    transaction: {
      inPerson: { ratePct: 0.0175, fixedGBP: 0.00 }, // 1.75% + £0.00
      online:   { ratePct: null,   fixedGBP: null }, // handled via PayPal Commerce fees, not Zettle POS
      phone:    { ratePct: null,   fixedGBP: null }  // no Virtual Terminal support
    },
  
    // Keep your existing fees block in sync if used
    fees: {
      pct:   { inPerson: 0.0175, online: null, phone: null },
      fixed: { inPerson: 0,      online: null, phone: null }
    },
  
    payoutDays: 1, // funds land in PayPal Business acct quickly; bank transfer schedules apply
    url: "https://www.zettle.com/gb/payments/terminal",
    createAccountUrl: "https://www.paypal.com/unifiedonboarding/entry?products=ZETTLE&origin=PAYPAL_WEB",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/iZettle-terminal.webp",
    notes: "In-person: 1.75% (no fixed). No Virtual Terminal; online payments use PayPal fee schedule."
  }  
];

export default function SolarStyleEstimateCard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [annualRevenue, setAnnualRevenue] = useState("");
  const [avgTransaction, setAvgTransaction] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [results, setResults] = useState<CardReader[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [touched, setTouched] = useState({ annualRevenue: false, avgTransaction: false });
  const [showValidation, setShowValidation] = useState(false);

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
            <path d="M8 22l16-10 16 10v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V22z" stroke="#1B4B66" strokeWidth="2" fill="#E6F3F7" />
            <path d="M18 38V26h12v12" stroke="#1B4B66" strokeWidth="2" />
          </svg>
        ),
      },
      {
        key: "3",
        title: "3 bedrooms",
        icon: (
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
            <path d="M6 24l18-12 18 12v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V24z" stroke="#1B4B66" strokeWidth="2" fill="#EAF6EE" />
            <path d="M16 39V27h16v12" stroke="#1B4B66" strokeWidth="2" />
          </svg>
        ),
      },
      {
        key: "4+",
        title: "4+ bedrooms",
        icon: (
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden>
            <path d="M4 24l20-14 20 14v14a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V24z" stroke="#1B4B66" strokeWidth="2" fill="#F3EEF9" />
            <path d="M14 42V28h20v14" stroke="#1B4B66" strokeWidth="2" />
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
      amortiseMonths: 0 // Don't amortize device cost - exclude from monthly calculation
    };

    // Use the new calculation logic
    const costBreakdowns = recommend(PROVIDERS, inputs);

    // Add isLowest flag and convert to CardReader format
    const cardReaders: CardReader[] = costBreakdowns.map((breakdown, index) => {
      const provider = PROVIDERS.find(p => p.id === breakdown.providerId);
      console.log(`Provider ${provider?.name}: transactionFeeRate = ${provider?.transactionFeeRate}, transactionPence = ${provider?.transactionPence}, breakdown.transactionPence = ${breakdown.transactionPence}, imageUrl = ${provider?.imageUrl}`);
      return {
        ...breakdown,
        isLowest: index === 0, // First item (cheapest) is marked as lowest
        deviceCostGBP: provider ? provider.deviceCostGBP : 0,
        url: provider?.url,
        imageUrl: provider?.imageUrl,
        transactionFeeRate: provider?.transactionFeeRate || 0, // Use the direct transaction fee rate
        transactionPence: provider?.transactionPence || breakdown.transactionPence // Use provider's pence or breakdown's pence
      };
    });

    return cardReaders;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowValidation(true);
    if (!canSubmit) return;

    setIsCalculating(true);

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const calculatedResults = calculateResults();
    
    // Navigate to the savings report page with the results
    navigate('/card-savings-report', {
      state: {
        results: calculatedResults,
        annualRevenue: annualRevenueNum,
        avgTransaction: avgTransactionNum,
        paymentMethods: paymentMethods
      }
    });
    
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
    setShowValidation(true);
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
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-[0_8px_24px_rgba(16,24,40,0.08)] border border-slate-100 py-8 px-4 md:px-[4rem]">

        {!results ? (
          // Form Section with Stepper
          <div className="py-2 ">
            {/* Stepper Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] text-slate-800 m-auto mb-2">
                Let’s get started with your card savings report  </h2>
              <p className="text-md text-slate-600 font-light leading-relaxed"> We’ll calculate the savings based on your card turnover and average transaction size.
              </p>
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
                      error={(touched.annualRevenue || showValidation) && (annualRevenue === "" || annualRevenueNum <= 0)}
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
                      What's your estimated average transaction value? (£)
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
                      placeholder="£ 56"
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
                  className="px-6 text-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
                  style={{ borderRadius: '32px', height: '3.5rem' }}
                >
                  Continue <ChevronRight className="ml-2 h-4 w-4 inline" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="px-6 text-md font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300 focus:outline-none"
                  style={{ borderRadius: '32px', height: '3.5rem' }}
                >
                  {isCalculating ? "Calculating..." : "Get Savings Report"}
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
              Your Card Savings Report
              </h3>
              <AnimatedSummary annualRevenueNum={annualRevenueNum} results={results} />
            </div>

            <div className="space-y-6">
              {results.map((reader, index) => (
                <AnimatedResultCard key={reader.providerName} reader={reader} index={index} />
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
