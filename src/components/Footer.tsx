import { Link } from "react-router-dom";
import { siteContent } from "@/config/site-content";

interface FooterProps {
  variant?: "default" | "white";
}

const Footer = ({ variant = "default" }: FooterProps) => {
  return (
    <footer className="bg-[#f7f9f8] w-full">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Top row with logo/copyright on left, navigation on right */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6 mb-6">
          {/* Left side - Brand and Copyright */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={siteContent.brand.footerLogoUrl} alt={`${siteContent.brand.name} Logo`} className="w-16 h-16" />
            </div>
            <p className="text-xs" style={{ color: '#0000008a' }}>
               © 2025 {siteContent.brand.name}, Inc.
            </p>
          </div>
          
          {/* Right side - Navigation links */}
          <nav className="flex flex-wrap gap-6">
            <Link 
              to="/privacy-policy" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
           
            <Link 
              to="/terms-conditions" 
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Terms of Use
            </Link>
          </nav>
        </div>

        {/* Divider line */}
        <hr className="border-gray-200 mb-6" />

        {/* Bottom legal row - Company details */}
        <div className="text-xs text-gray-500">
          Registered Office: 1st & 2nd Floors, Wenlock Works, 1A Shepherdess Walk, London, N1 7QE, United Kingdom. Registered in England & Wales (no. 06951544)
        </div>
      </div>
    </footer>
  );
};

export default Footer;