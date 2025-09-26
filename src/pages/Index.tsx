import Header from "@/components/Header";
import UploadMenuHeadline2 from "@/components/UploadMenuHeadline2";
import SolarStyleEstimateCard from "@/components/SolarStyleEstimateCard";
import WhyInvestSolar from "@/components/WhyInvestSolar";
import MassiveBenefits2025 from "@/components/MassiveBenefits2025";
import ThreeSimpleSteps from "@/components/ThreeSimpleSteps";
import TeamRolesSection from "@/components/TeamRolesSection";
import FeatureIntroSection from "@/components/FeatureIntroSection";
import SplitScreenSection from "@/components/SplitScreenSection";
import AllFeaturesSection from "@/components/AllFeaturesSection";
import HeroBanner from "@/components/HeroBanner";
import Footer from "@/components/Footer";
import { useUtmTracking } from "@/hooks/useUtmTracking";

const Index = () => {
  // Initialize UTM tracking to capture parameters from URL
  useUtmTracking();
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <UploadMenuHeadline2 />
      <SolarStyleEstimateCard />
      <WhyInvestSolar />
      <ThreeSimpleSteps />
      <MassiveBenefits2025 />
      <Footer />
    </div>
  );
};

export default Index;