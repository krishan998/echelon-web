import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HomePage } from './pages/HomePage';
import { SecurityPage } from './pages/SecurityPage';
import { TermsPage } from './pages/TermsPage';
import { WorkPage } from './pages/WorkPage';
import { TeaserPage } from './pages/TeaserPage';
import { AIReadinessPage } from './pages/AIReadinessPage';
import { ExtensionPrivacyPage } from './pages/ExtensionPrivacyPage';

export default function App() {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<TeaserPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/teaser" element={<TeaserPage />} />
        <Route path="/ai-readiness-check" element={<AIReadinessPage />} />
        <Route path="/extension-privacy-policy" element={<ExtensionPrivacyPage />} />
        <Route path="/extension-privacy-page" element={<ExtensionPrivacyPage />} />

        {/* Redirect all external link fallbacks to home */}
        <Route path="/pricing" element={<Navigate to="/" replace />} />
        <Route path="/enterprise" element={<Navigate to="/" replace />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="/demo" element={<Navigate to="/" replace />} />
        <Route path="/features" element={<Navigate to="/" replace />} />
        <Route path="/privacy" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
