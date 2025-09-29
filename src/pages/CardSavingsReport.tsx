import React from "react";
import { useLocation } from "react-router-dom";
import { useCountUpCurrency } from "@/hooks/useCountUp";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CardReader {
  providerName: string;
  totalMonthly: number;
  deviceCostGBP: number;
  monthlyFee: string;
  transactionFeeRate: number;
  blendedPct: number;
  isLowest: boolean;
  imageUrl?: string;
  url?: string;
  createAccountUrl?: string;
}

interface LocationState {
  results: CardReader[];
  annualRevenue: number;
  avgTransaction: number;
  paymentMethods: string[];
}

function AnimatedResultCard({ reader, index }: { reader: CardReader; index: number }) {
  const monthlyTotal = useCountUpCurrency(reader.totalMonthly, { delay: index * 200 });
  const [showMoreInfo, setShowMoreInfo] = React.useState(false);

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
        <div className="image-container flex flex-col overflow-hidden sm:w-[174px] sm:min-w-[174px] sm:m-[12px_0_10px] rounded-[8px] w-[180px] bg-white border border-[#E4E4E5] m-[12px_0_10px_10px]">
          <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="h-[100px] sm:h-[134px] w-auto mx-auto flex justify-center items-center bg-white sm:px-[12px]">
            <img
              src={reader.imageUrl || "https://cardmachine.co.uk/wp-content/uploads/2024/01/Barclay-1.png"}
              alt={`${reader.providerName} card reader`}
              className="w-[140px] max-h-[80px] sm:w-auto lg:w-full lg:max-w-[130px] lg:max-h-[90px] object-contain"
              height={80}
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
         
        </div>

        {/* Selling lines and features */}
        <div className="selling-lines hidden sm:flex sm:shrink-0 sm:w-[150px] lg:w-[180px] flex-col gap-[8px]">
          <a href={reader.url || "#"} target="_blank" rel="noreferrer" className="w-fit">
            <h3 className="text-lg font-semibold text-slate-800">{reader.providerName}</h3>
          </a>

          <div className="bullets">
            <ul className="flex flex-col gap-[2px] sm:w-fit lg:w-[378px] text-[13px]">
              <li className="flex gap-[4px] items-center whitespace-nowrap text-[#727574]">
                <img src="https://top5-websitebuilders.com/app/themes/topsites/public/images/selling-line-bullets-checkmark.776c94.svg" alt="checkmark" className="h-[16px] w-[16px]" aria-hidden="true" /> Card Machine: <span className="font-semibold">£{reader.deviceCostGBP || 0}</span>
              </li>
              <li className="flex gap-[4px] items-center whitespace-nowrap text-[#727574]">
                <img src="https://top5-websitebuilders.com/app/themes/topsites/public/images/selling-line-bullets-checkmark.776c94.svg" alt="checkmark" className="h-[16px] w-[16px]" aria-hidden="true" /> Transaction Fee: <span className="font-semibold">{(reader.transactionFeeRate || 0).toFixed(2)}%</span>
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
        className="promotion-line font-extrabold flex sm:hidden w-full max-w-[311px] text-center justify-center border-[#f9f4ee] border-dashed border bg-[#f9f4ee;] rounded-[8px] px-[6px] py-[5px] text-[#323738] text-md leading-[18px] my-[6px] mx-auto mb-4 text-slate-900 "
      >
        £{monthlyTotal.raw.toFixed(0)}/month
      </a>

      {/* More Info Content */}
      {showMoreInfo && (
        <div className="bg-white p-4 border-t border-gray-200 block sm:hidden">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-xs text-[#727574]">
              <div>
                <span className="font-medium">Card Machine Cost:</span>
                <div className="font-semibold text-[#323738]">£{reader.deviceCostGBP || 0}</div>
              </div>
              <div>
                <span className="font-medium">Transaction Fee:</span>
                <div className="font-semibold text-[#323738]">{(reader.transactionFeeRate || 0).toFixed(2)}%</div>
              </div>
              <div>
                <span className="font-medium">Monthly Fee:</span>
                <div className="font-semibold text-[#323738]">£{reader.monthlyFee}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More Info Button */}
      <button 
        onClick={() => setShowMoreInfo(!showMoreInfo)}
        className="flex p-[5px] cursor-pointer bg-[#f2f2f4] text-[#727574] leading-[22px] justify-center rounded-bl-[16px] rounded-br-[16px] w-full text-sm block sm:hidden"
        data-skeleton="true"
        data-tracking="more-info"
      >
        {showMoreInfo ? 'Less Info' : 'More Info'} &nbsp;
        <img 
          src="https://top5-websitebuilders.com/app/themes/topsites/public/images/more-info-arrow.da2dcf.svg" 
          alt="More info arrow" 
          height="16" 
          width="16" 
          className={`transition-all duration-300 ${showMoreInfo ? 'rotate-180' : 'rotate-0'}`}
          data-action="toggle"
        />
      </button>

    </article>
  );
}

function AnimatedSummary({ annualRevenueNum, avgTransaction }: { annualRevenueNum: number; avgTransaction: number }) {
  const monthlyTransactions = (annualRevenueNum / 12) / avgTransaction;
  return (
    <p className="text-lg text-slate-600">
      Based on your monthly revenue of £{(annualRevenueNum / 12).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} and {monthlyTransactions.toFixed(0)} estimated transactions
    </p>
  );
}

export default function CardSavingsReport() {
  const location = useLocation();
  const state = location.state as LocationState;

  // If no data is passed, redirect back to home
  if (!state?.results) {
    window.location.href = '/';
    return null;
  }

  const { results, annualRevenue, avgTransaction, paymentMethods } = state;

  return (
    <div className="min-h-screen bg-white">
      {/* Site Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto md:px-24 px-5 pt-16 pb-16">
        {/* Report Header */}
        <div className="text-center mb-8 mt-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-slate-800 mb-4">
            Your Card Savings Report
          </h1>
          <AnimatedSummary annualRevenueNum={annualRevenue} avgTransaction={avgTransaction} />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {results.map((reader, index) => (
            <AnimatedResultCard key={reader.providerName} reader={reader} index={index} />
          ))}
        </div>
      </div>
      
      {/* Site Footer */}
      <Footer />
    </div>
  );
}
