
import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

export const useStaggerAnimation = (selector: string, delay = 100) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const elements = containerRef.current.querySelectorAll(selector);
      
      anime({
        targets: elements,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(delay),
        easing: 'easeOutQuart'
      });
    }
  }, [selector, delay]);

  return containerRef;
};

export const useCardHoverAnimation = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      anime({
        targets: card,
        scale: 1.02,
        duration: 200,
        easing: 'easeOutQuart'
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: card,
        scale: 1,
        duration: 200,
        easing: 'easeOutQuart'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return cardRef;
};

export const useFadeInAnimation = (delay = 0) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      anime({
        targets: elementRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay,
        easing: 'easeOutExpo'
      });
    }
  }, [delay]);

  return elementRef;
};
