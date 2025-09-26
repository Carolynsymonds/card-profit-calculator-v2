import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteContent } from "@/config/site-content";

import ThreeSimpleSteps from "@/components/ThreeSimpleSteps";

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
            

      {/* How It Works Section */}
      <ThreeSimpleSteps />

      <Footer />
    </div>
  );
};

export default Features;