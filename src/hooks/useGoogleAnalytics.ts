import { useEffect } from 'react';
import { siteContent } from '@/config/site-content';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Global flag to prevent multiple loading attempts
let isGAInitializing = false;
let isGALoaded = false;

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const measurementId = siteContent.analytics.googleAnalyticsId;
    
    if (!measurementId) {
      console.warn('Google Analytics: No measurement ID found');
      return;
    }

    // Prevent multiple loading attempts
    if (isGAInitializing || isGALoaded) {
      console.log('Google Analytics: Already initializing or loaded');
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${measurementId}"]`);
    if (existingScript) {
      console.log('Google Analytics: Script already exists');
      isGALoaded = true;
      return;
    }

    isGAInitializing = true;

    // Initialize dataLayer first
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // Create script element for Google Analytics
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    
    // Configure Google Analytics after script loads
    script.onload = () => {
      isGAInitializing = false;
      isGALoaded = true;
      console.log('Google Analytics: Script loaded successfully');
      
      try {
        window.gtag('js', new Date());
        window.gtag('config', measurementId, {
          debug_mode: process.env.NODE_ENV === 'development',
        });
        console.log(`Google Analytics: Configured with ID ${measurementId}`);
      } catch (error) {
        console.error('Google Analytics: Configuration error:', error);
      }
    };

    script.onerror = (error) => {
      isGAInitializing = false;
      console.error('Google Analytics: Failed to load script. This may be due to ad blockers or network issues.', error);
    };

    try {
      document.head.appendChild(script);
      console.log('Google Analytics: Initializing...');
    } catch (error) {
      isGAInitializing = false;
      console.error('Google Analytics: Failed to append script:', error);
    }
  }, []);
};