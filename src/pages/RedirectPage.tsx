import { useEffect } from 'react';

export function RedirectPage() {
  useEffect(() => {
    window.location.href = 'https://cal.com/shubh.r/discuss';
  }, []);

  return null;
}