import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProviderOfferCardWide from "@/components/ProviderOfferCardWide";

// Provider data from SolarStyleEstimateCard
const PROVIDERS = [
  {
    id: "tide",
    name: "Tide Card Reader",
    deviceCostGBP: 49,
    transactionFeeRate: 1.50,
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
    transactionFeeRate: 1.60,
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
    transactionFeeRate: 1.75,
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
    transactionFeeRate: 1.75,
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
    transactionFeeRate: 1.75,
    fees: {
      pct: { inPerson: 0.0175, online: 0.025, phone: 0.025 },
      fixed: { inPerson: 0, online: 0, phone: 0 }
    },
    url: "https://www.zettle.com/gb/payments/terminal",
    imageUrl: "https://cardmachine.co.uk/wp-content/uploads/2024/01/iZettle-terminal.webp"
  }
];

const CompareCardReaders = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mt-16">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-slate-800 mb-4">
              Compare Card Readers
            </h1>
            <p className="text-lg text-slate-600 font-light leading-relaxed max-w-3xl mx-auto">
              Find the perfect card machine for your business. Compare features, costs, and get personalized quotes from top providers.
            </p>
          </div>
        </div>
      </section>

      {/* Provider Cards Section */}
      <section className="pb-16 md:pb-20 bg-white">
        <div className="mx-auto max-w-6xl px-6 space-y-8">
          {PROVIDERS.map((provider) => (
            <ProviderOfferCardWide
              key={provider.id}
              logo={provider.imageUrl}
              name={provider.name}
              tag={provider.notes || "CARD READER"}
              compareHref={provider.url}
              dealsHref={provider.url}
              stats={{
                cost: { 
                  label: "Card Machine Cost", 
                  prefix: "£", 
                  value: (provider.deviceCostGBP || 0).toString() 
                },
                monthly: { 
                  label: "Monthly Fee", 
                  prefix: "£", 
                  value: (provider.monthlyFeeGBP || 0).toString() 
                },
                fee: { 
                  label: "Transaction Fee (%)", 
                  value: (provider.transactionFeeRate || 0).toString() 
                },
                payout: { 
                  label: "Payout Duration", 
                  value: (provider.payoutDays || 1).toString(), 
                  suffix: " Day" 
                },
              }}
              contractNote={provider.monthlyFeeGBP > 0 ? "*12 months contract" : "*No monthly contract"}
            />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompareCardReaders;
