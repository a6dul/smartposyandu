import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Otomatis scroll ke atas setiap kali berpindah halaman/route
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

export default ScrollToTop;
