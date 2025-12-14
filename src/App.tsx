import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HomePage } from './pages/HomePage';
import { DemoPage } from './pages/DemoPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { SecurityPage } from './pages/SecurityPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { WorkPage } from './pages/WorkPage';
import { TeaserPage } from './pages/TeaserPage';
import { AIReadinessPage } from './pages/AIReadinessPage';
import { DemoBuilderPage } from './pages/DemoBuilderPage';
import { DemoBuilderDashboard } from './pages/DemoBuilderDashboard';

export default function App() {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<TeaserPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/teaser" element={<TeaserPage />} />
        <Route path="/ai-readiness-check" element={<AIReadinessPage />} />
        <Route path="/demo-builder" element={<DemoBuilderPage />} />
        <Route path="/demo-builder-dashboard" element={<DemoBuilderDashboard />} />
        <Route path="/demo-builde-dashboard" element={<DemoBuilderDashboard />} />
        
        {/* Redirect all external link fallbacks to home */}
        <Route path="/pricing" element={<Navigate to="/" replace />} />
        <Route path="/enterprise" element={<Navigate to="/" replace />} />
        <Route path="/contact" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}