// Haptic feedback utilities using Vibration API
// Respects user's motion preferences

const isSupported = () => {
  return 'vibrate' in navigator;
};

const shouldVibrate = () => {
  if (!isSupported()) return false;
  
  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !prefersReducedMotion;
};

export const lightTap = () => {
  if (shouldVibrate()) {
    navigator.vibrate(10);
  }
};

export const mediumTap = () => {
  if (shouldVibrate()) {
    navigator.vibrate(20);
  }
};

export const successTap = () => {
  if (shouldVibrate()) {
    navigator.vibrate([10, 50, 10]);
  }
};

export const haptics = {
  light: lightTap,
  medium: mediumTap,
  success: successTap
};
