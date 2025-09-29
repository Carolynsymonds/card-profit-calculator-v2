import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { siteContent } from "@/config/site-content";
import { useUtmTracking } from "@/hooks/useUtmTracking";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  const { navigateWithUtm } = useUtmTracking();

  // Handle scroll effect for header visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when at top
      if (currentScrollY < 10) {
        setIsVisible(true);
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
   <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
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
                className="h-16 w-auto hover:opacity-80 transition-opacity"
                />
            </Link>
            
          </div>

          {/* Right Side - User Actions */}
          <div className="flex items-center gap-4">
            
            {/* Awards Section */}
            <ul className="hidden lg:flex items-center gap-4 mr-4">
              <li className="text-sm">
                As featured in:
              </li>
              <li>
                <img 
                  src="https://images-ulpn.ecs.prd9.eu-west-1.mvfglobal.net/wp-content/uploads/2025/06/the-guardian-new-2018.svg?width=91&height=30&format=webply" 
                  alt="The Guardian" 
                  width="91" 
                  height="30" 
                  className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </li>
              <li>
                <img 
                  src="https://images-ulpn.ecs.prd9.eu-west-1.mvfglobal.net/wp-content/uploads/2025/06/business-insider-seeklogo.svg?width=40&height=30&format=webply" 
                  alt="Business Insider" 
                  width="40" 
                  height="60" 
                  className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </li>
              <li>
                <img 
                  src="https://images-ulpn.ecs.prd9.eu-west-1.mvfglobal.net/wp-content/uploads/2025/06/The_Telegraph.svg?width=184&height=30&format=webply" 
                  alt="The Telegraph" 
                  width="184" 
                  height="30" 
                  className="h-6 w-auto opacity-70 hover:opacity-100 transition-opacity"
                />
              </li>
            </ul>
            
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
                  
                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col gap-4 px-4 py-6">
                    <Button
                      variant="ghost"
                      className="text-foreground font-sans text-sm justify-start hover:bg-transparent hover:underline hover:underline-offset-4 hover:decoration-primary"
                      onClick={() => {
                        navigateWithUtm('/how-it-works');
                        document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                      }}
                    >
                      How it works
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-foreground font-sans text-sm justify-start hover:bg-transparent hover:underline hover:underline-offset-4 hover:decoration-primary"
                      onClick={() => {
                        navigateWithUtm('/compare-card-readers');
                        document.querySelector('[data-state="open"]')?.dispatchEvent(new Event('click'));
                      }}
                    >
                      Card Machines
                    </Button>
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