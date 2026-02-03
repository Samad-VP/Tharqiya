import type { Variants } from 'framer-motion';

/**
 * Standard professional entrance animation (Fade In Up)
 * Designed for institutional weight and smooth transition.
 */
export const fadeInUp: Variants = {
    initial: { 
        opacity: 0, 
        y: 30 
    },
    animate: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.25, 0.1, 0.25, 1.0] // Smooth institutional ease
        }
    }
};

/**
 * Stagger container for grid items and list elements
 */
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

/**
 * Scale in animation for icons and badges
 */
export const scaleIn: Variants = {
    initial: { 
        opacity: 0, 
        scale: 0.8 
    },
    animate: { 
        opacity: 1, 
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

/**
 * Institutional Slide In (from left)
 */
export const slideInLeft: Variants = {
    initial: { 
        opacity: 0, 
        x: -40 
    },
    animate: { 
        opacity: 1, 
        x: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut"
        }
    }
};
