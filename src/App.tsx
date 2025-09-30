import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { initGA } from "@/utils/analytics/ga";
import { bindProviderCtas } from "@/utils/analytics/bindProviderCtas";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Application from "./pages/Application";
import PurchasesBySupplier from "./pages/PurchasesBySupplier";
import Inventory from "./pages/Inventory";
import InventoryAnalytics from "./pages/InventoryAnalytics";
import Pricing from "./pages/Pricing";
import Features from "./pages/Features";
import CompareCardReaders from "./pages/CompareCardReaders";
import CardSavingsReport from "./pages/CardSavingsReport";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";
import { useUtmTracking } from "./hooks/useUtmTracking";

const queryClient = new QueryClient();

const UtmTracker = () => {
  useUtmTracking(); // Initialize UTM tracking
  return null;
};

const App = () => {
  useEffect(() => {
    initGA();
    bindProviderCtas();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UtmTracker />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/free-plan" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/how-it-works" element={<Features />} />
          <Route path="/compare-card-readers" element={<CompareCardReaders />} />
          <Route path="/card-savings-report" element={<CardSavingsReport />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/app" element={<Application />} />
          <Route path="/app/purchases" element={<PurchasesBySupplier />} />
          <Route path="/app/inventory" element={<Inventory />} />
          <Route path="/app/inventory/analytics" element={<InventoryAnalytics />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
