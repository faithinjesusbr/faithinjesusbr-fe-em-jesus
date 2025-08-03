export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

export const mobileRedirect = (url: string): void => {
  if (isMobileDevice()) {
    // For mobile devices, use location.href for full page reload
    setTimeout(() => {
      window.location.href = url;
    }, 500);
  } else {
    // For desktop, use normal navigation
    window.location.href = url;
  }
};

export const debugLog = (message: string, data?: any): void => {
  console.log(`[MOBILE DEBUG] ${message}`, data || '');
};