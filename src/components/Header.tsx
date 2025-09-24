import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { siteContent } from "@/config/site-content";
import { useUtmTracking } from "@/hooks/useUtmTracking";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const { navigateWithUtm } = useUtmTracking();

  // Handle scroll effect for header
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
   <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-sm border-b' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <img 
                src={siteContent.brand.logoUrl}  
                alt={`${siteContent.brand.name} Logo`} 
                className="h-32 w-auto hover:opacity-80 transition-opacity"
                />
            </Link>
            
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center gap-4">
            
            {/* Mobile Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-background [&>button:last-child]:hidden">
                <div className="flex flex-col h-full">
                  {/* Header with logo and close button */}
                  <div className="flex items-center justify-between p-2">
                    {/* Footer logo on the left */}
                    <Link to="/" className="flex items-center">
                      <img 
                        src={siteContent.brand.footerLogoUrl} 
                        alt={`${siteContent.brand.name} Logo`} 
                        className="w-12 h-12"
                      />
                    </Link>
                    
                    {/* Close button on the right */}
                    <div className="flex items-center gap-2">
                      <SheetClose asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                  
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;