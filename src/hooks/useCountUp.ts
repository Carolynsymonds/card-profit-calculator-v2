import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startOnMount?: boolean;
  delay?: number;
}

export function useCountUp(
  endValue: number,
  options: UseCountUpOptions = {}
) {
  const { duration = 2000, startOnMount = true, delay = 0 } = options;
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCount(0);
    
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }
      
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = endValue * easeOutCubic;
      
      setCount(currentValue);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setCount(endValue);
      }
    };
    
    setTimeout(() => {
      animationRef.current = requestAnimationFrame(animate);
    }, delay);
  };

  useEffect(() => {
    if (startOnMount) {
      startAnimation();
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [endValue, startOnMount, duration, delay]);

  return { count, isAnimating, startAnimation };
}

// Hook for currency formatting with count-up
export function useCountUpCurrency(
  value: number,
  options: UseCountUpOptions = {}
) {
  const { count } = useCountUp(value, options);
  
  return {
    formatted: new Intl.NumberFormat('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(count),
    raw: count
  };
}

// Hook for percentage formatting with count-up
export function useCountUpPercentage(
  value: number,
  options: UseCountUpOptions = {}
) {
  const { count } = useCountUp(value, options);
  
  return {
    formatted: count.toFixed(2),
    raw: count
  };
}
