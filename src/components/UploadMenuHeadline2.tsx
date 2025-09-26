import { Button } from "@/components/ui/button";
import { useUtmTracking } from "@/hooks/useUtmTracking";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoModal from "@/components/VideoModal";


const UploadMenuHeadline2 = ({ onButtonClick }: { onButtonClick?: (buttonName: string) => void }) => {
  const { navigateWithUtm } = useUtmTracking();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const brandLogos = [
    {
      src: "/lovable-uploads/9efe8d5f-1e81-42b0-8803-d420694c0d6d.png",
      alt: "Papa John's",
      className: "[height:2rem]"
    },
    {
      src: "/lovable-uploads/ec3ab3f1-fac3-42f8-80b5-c88c5a6ca92f.png",
      alt: "Chipotle Mexican Grill",
      className: "h-16"
    },
    {
      src: "/lovable-uploads/2e57f3ae-6eeb-4f88-8a90-a459f7dc5c67.png",
      alt: "Chick-fil-A",
      className: "h-16"
    },
    {
      src: "/lovable-uploads/8881ee5b-e5b5-4950-a384-bf791c2cb69a.png",
      alt: "Applebee's",
      className: "h-20"
    }
  ];

  const handleSignupClick = () => {
    onButtonClick?.('Get started now');
    try {
      window.gtag?.('event', 'sign_up', {
        method: 'cta_button',
        button_id: 'signup-btn',
        button_text: 'Get started now',
        page_location: window.location.href,
      });
    } catch (e) {
      // no-op if gtag not available
    }
    // Scroll to the SolarStyleEstimateCard component
    setTimeout(() => {
      const estimateCard = document.querySelector('[data-estimate-card]');
      if (estimateCard) {
        estimateCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDemoClick = () => {
    onButtonClick?.('Watch demo');
    try {
      window.gtag?.('event', 'video_play', {
        method: 'demo_button',
        button_id: 'demo-btn',
        button_text: 'Watch demo',
        page_location: window.location.href,
      });
    } catch (e) {
      // no-op if gtag not available
    }
    // Open video modal
    setIsVideoModalOpen(true);
  };


  return (
    <>
    <section className="relative overflow-hidden flex flex-col pt-16 md:pt-12">
      {/* Background */}

      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 flex-1 flex flex-col justify-between">
        <div className="animate-fade-in grid gap-16 flex-1 flex flex-col justify-center">
          {/* Main Banner Section - Side by Side */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6 text-center md:text-left order-1 md:order-1">
              <p className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[-0.02em] text-foreground">
              Find the best card machine for your business with <span className="text-primary">Tap Wise advice</span> 
              </p>
              <p className="text-lg md:text-lg text-muted-foreground leading-relaxed font-light">
              Get your personalised payment report – we’ll calculate your monthly costs, compare the top card readers, and match you with the most cost-effective option for your needs.              </p>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Button
                  onClick={handleSignupClick}
                  className="px-6 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ borderRadius: '32px', height: '3rem' }}
                >
                  Get started now
                </Button>
              </div>

            </div>

             {/* Right: Image */}
             <div className="flex justify-end order-2 md:order-2">
               <img
                 src="/lovable-uploads/image_card2.png"
                 alt="Card machine on counter"
                 className="w-full max-w-lg rounded-2xl"
                 loading="eager"
               />
             </div>
          </div>
        </div>
      </div>

    </section>

    
    </>
  );
};

export default UploadMenuHeadline2;
