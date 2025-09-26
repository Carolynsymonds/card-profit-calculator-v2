const copy = {
  title: "Why compare card machines?",
  cards: [
    {
      key: "rising-costs",
      title: "Card fees eat into your profits",
      emphasis: "",
      bodyPre: "Every provider charges different transaction fees. Even a <strong>0.2% difference</strong> can cost your business hundreds – or thousands – each year.",
      bodyPost: "",
      imageUrl: "lovable-uploads/money_icon.png",
    },
    {
      key: "battery-benefit",
      title: "Find the right fit for your business",
      emphasis: null,
      bodyPre: "Whether you mainly take in-person, online, or phone payments, some providers are better suited than others. We'll show you the <strong>most cost-effective</strong> option for your setup.",
      bodyPost: "",
      imageUrl: "lovable-uploads/money_icon3.png",
    },
    {
      key: "cut-costs",
      title: "Save money every month",
      emphasis: "",
      bodyPre: "By choosing the right card machine, you can <strong>cut payment processing costs</strong> and keep more of your hard-earned revenue.",
      bodyPost: "",
      imageUrl: "lovable-uploads/pig_icon.png",
    },
  ],
};


export default function WhyInvestSolar() {
  return (
    <section className="w-full py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl md:text-5xl font-extrabold tracking-[-0.02em] text-slate-800 m-auto mb-6">
          {copy.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {copy.cards.map(({ key, title, emphasis, bodyPre, bodyPost, imageUrl }) => (
            <div key={key} className="text-center">
              <div className="mb-6">
                <img 
                  src={imageUrl}
                  alt=""
                  width="75" 
                  height="75" 
                  className="mx-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                {title}
              </h3>
              <p 
                className="text-center text-slate-600 font-light leading-relaxed [&_strong]:text-primary [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: bodyPre + (emphasis || '') + bodyPost }}
              />
            </div>
          ))}
          
        </div>

        {/* CTA Button */}
        <div className="flex items-center justify-center mt-12">
          <button
            onClick={() => {
              const estimateCard = document.querySelector('[data-estimate-card]');
              if (estimateCard) {
                estimateCard.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
            style={{ borderRadius: '32px', height: '3rem' }}
          >
            Compare Card Machines Now
          </button>
        </div>

      </div>
    </section>
  );
}
