import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { normalizeUrl, isValidUrl, isValidEmail, isEmailDomainAuthorized, submitEmailToSheet, getEmailDomain, submitWaitlistEmail } from '../utils/urlUtils';
import aiReadinessData from '../data/aiReadinessData.json';
import logoSrc from '../assets/logo.png';

interface AssessmentData {
  overallScore: number;
  category: string;
  metrics: {
    customerJourneyComplexity: {
      findProductActionsCurrent: string;
      findProductActionsAI: string;
      compareProductsActionsCurrent: string;
      compareProductsActionsAI: string;
      staticQuizAvailable: boolean;
    };
    productDetailsGrade: {
      grade: string;
      analysis: string;
    };
    personalizationIndex: {
      currentStatus: string;
      analysis: string;
    };
    competitorBenchmark: {
      averageScore: number;
      note?: string;
    };
  };
}

const loadingMessages = [
  "Analyzing product catalog structure...",
  "Evaluating customer data collection methods...",
  "Checking API integrations and technical infrastructure...",
  "Reviewing personalization capabilities...",
  "Assessing mobile experience and site performance...",
  "Calculating conversational commerce readiness..."
];

export function AIReadinessPage() {
  const [currentStep, setCurrentStep] = useState<'form' | 'loading' | 'results'>('form');
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [urlError, setUrlError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);
  // Results CTA email capture state
  const [resultsEmail, setResultsEmail] = useState('');
  const [resultsEmailError, setResultsEmailError] = useState('');
  const [resultsSubmitted, setResultsSubmitted] = useState(false);

  // Handle loading messages rotation
  useEffect(() => {
    if (currentStep === 'loading') {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1200);

      // Show loading for 3.5 seconds then show results
      const timeout = setTimeout(() => {
        setCurrentStep('results');
      }, 6000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [currentStep]);

  // Animate score counter
  useEffect(() => {
    if (currentStep === 'results' && assessmentData) {
      let start = 0;
      const end = assessmentData.overallScore;
      const duration = 2000; // 2 seconds
      const increment = end / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedScore(end);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [currentStep, assessmentData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    setEmailError('');

    // Validate email
    if (!email.trim()) {
      setEmailError('Please enter your company email address');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate URL
    if (!url.trim()) {
      setUrlError('Please enter a website URL');
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError('Please enter a valid website URL');
      return;
    }

    // Check domain authorization
    if (!isEmailDomainAuthorized(email, url)) {
      const freeEmailDomains = new Set([
        'gmail.com', 'outlook.com', 'yahoo.com', 'rediffmail.com', 'aol.com',
        'hotmail.com', 'live.com', 'msn.com', 'mail.com', 'icloud.com',
        'proton.me', 'protonmail.com', 'yandex.com', 'zoho.com'
      ]);
      const emailDomain = getEmailDomain(email);
      if (freeEmailDomains.has(emailDomain)) {
        setEmailError('Please enter your work email to continue.');
      } else {
        setEmailError("Looking at your email, it seems you may not work at this company. Please use your company email and website.");
      }
      return;
    }

    const normalizedUrl = normalizeUrl(url);
    const data = (aiReadinessData as Record<string, AssessmentData>)[normalizedUrl];

    if (!data) {
      setUrlError('We can\'t access this website due to access restrictions');
      return;
    }

    // Submit email to SheetDB (fire-and-forget)
    submitEmailToSheet(email, url);

    setAssessmentData(data);
    setCurrentStep('loading');
  };

  const resetAssessment = () => {
    setCurrentStep('form');
    setUrl('');
    setEmail('');
    setUrlError('');
    setEmailError('');
    setAssessmentData(null);
    setAnimatedScore(0);
    setLoadingMessageIndex(0);
    setResultsEmail('');
    setResultsEmailError('');
    setResultsSubmitted(false);
  };

  // Load local images from assets (beauty, fashion, health) and support common formats
  const beautyModules = import.meta.glob('../assets/beauty/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const fashionModules = import.meta.glob('../assets/fashion/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
  const healthModules = import.meta.glob('../assets/health/*.{png,jpg,jpeg,webp,avif,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

  // Create stable-ordered arrays per folder so each column maps to one folder
  const beautyImages = Object.keys(beautyModules).sort().map((key) => beautyModules[key]);
  const fashionImages = Object.keys(fashionModules).sort().map((key) => fashionModules[key]);
  const healthImages = Object.keys(healthModules).sort().map((key) => healthModules[key]);

  // One column per folder: [beauty, fashion, health]
  const imageColumns: string[][] = [beautyImages, fashionImages, healthImages];

  const flatImages = imageColumns.flat();

  // We duplicate each column once at render time for seamless 50% translate loops

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50 font-sf-pro">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-6 sm:px-12 lg:px-20 py-6"
      >
        <div className="flex items-center gap-3">
          <img 
            src={logoSrc} 
            alt="Nexbit Logo" 
            className="w-8 h-8"
            style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(3%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)' }}
          />
          <span className="text-xl font-semibold tracking-tight text-stone-900 font-ibm-plex-serif">Nexbit</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetAssessment}
          className="flex items-center gap-2 px-5 py-2.5 text-stone-700 rounded-full font-medium hover:bg-black/5 transition-colors border border-stone-200/70 bg-white/70 backdrop-blur-sm shadow-sm"
        >
          Back to Home
        </motion.button>
      </motion.header>

      <div className="px-6 sm:px-12 lg:px-20 pb-12">
        <AnimatePresence mode="wait">
          {/* Form Step */}
          {currentStep === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto pt-12 lg:pt-[20vh]"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Left: Compact form */}
                <div className="order-1 lg:order-1">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mt-8 mb-6"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-4 font-ibm-plex-serif">
                      Discover how ready you are for <br /> AI-powered conversational commerce.
                    </h1>
                  </motion.div>

                  <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 w-full max-w-md"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setUrlError('');
                        }}
                        placeholder="Company website URL"
                        className={`w-full px-5 py-3.5 text-base rounded-xl border transition-all duration-300 focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm ${
                          urlError 
                            ? 'border-stone-400 focus:border-stone-900/80 focus:ring-stone-200' 
                            : 'border-stone-300 focus:border-stone-900/80 focus:ring-stone-100'
                        }`}
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        placeholder="Your company email"
                        className={`w-full px-5 py-3.5 text-base rounded-xl border transition-all duration-300 focus:outline-none focus:ring-4 bg-white/80 backdrop-blur-sm ${
                          emailError 
                            ? 'border-stone-400 focus:border-stone-900/80 focus:ring-stone-200' 
                            : 'border-stone-300 focus:border-stone-900/80 focus:ring-stone-100'
                        }`}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-slate-900 text-white px-7 py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-slate-800 transition-all duration-300 shadow-sm"
                    >
                      Analyze AI Readiness
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>

                    {(emailError || urlError) && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-stone-800 text-sm"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{emailError || urlError}</span>
                      </motion.div>
                    )}
                  </motion.form>
                </div>

                {/* Right: Media area */}
                <div className="order-2 lg:order-2 lg:-mt-[20vh]">
                  {/* Mobile: compact horizontal scroll strip */}
                  <div className="block lg:hidden mt-6">
                    <div className="relative h-28 rounded-2xl bg-white border border-gray-200 overflow-x-auto overflow-y-hidden whitespace-nowrap p-2 snap-x snap-mandatory">
                      <div className="inline-flex gap-2">
                        {flatImages.concat(flatImages).map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt="Commerce stock"
                            className="h-24 w-36 object-cover rounded-lg flex-shrink-0 snap-start"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Desktop: Animated running grid of images */}
                  <div className="hidden lg:block">
                    <div className="relative h-[80vh] md:h-[90vh] lg:h-[100vh] rounded-3xl bg-gradient-to-br from-stone-100 to-white border border-stone-200 overflow-hidden">
                      {/* Gradient rim */}
                      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }} />

                      <div className="absolute inset-0 grid grid-cols-3 gap-3 p-3">
                        {imageColumns.map((col, colIndex) => (
                          <div key={colIndex} className="relative overflow-hidden rounded-2xl">
                            {/* Scrolling column */}
                            <div className="absolute inset-x-0 top-0" style={{ animation: `scrollY${colIndex} 36s linear infinite` }}>
                              {[...col, ...col].map((src, i) => (
                                <div key={i} className="mb-3 last:mb-0">
                                  <img src={src} alt="Commerce stock" className="w-full h-48 object-cover rounded-xl contrast-110" />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Subtle overlay for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent" />
                    </div>

                    {/* Inline keyframe styles */}
                    <style>{`
                      @keyframes scrollY0 { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
                      @keyframes scrollY1 { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
                      @keyframes scrollY2 { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
                    `}</style>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Loading Step */}
          {currentStep === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center py-20"
            >
              <div className="max-w-2xl mx-auto mb-12">
                <div className="mx-auto w-full md:w-3/4 lg:w-2/3 bg-white/70 backdrop-blur-xl border border-stone-200/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] p-6">
                  <h3 className="text-xl md:text-2xl font-semibold mb-4 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-700 bg-clip-text text-transparent">Preparing your AI Readiness report</h3>
                  <div className="relative w-full h-3 bg-stone-200/80 rounded-full overflow-hidden">
                  {/* Fill progression synced with 6s results reveal */}
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                    style={{ background: 'linear-gradient(90deg, rgba(30,41,59,0.95), rgba(2,6,23,0.98))' }}
                  />

                  {/* Shimmer sweep */}
                  <motion.div
                    className="absolute inset-y-0 -left-1/3 w-1/3 rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)' }}
                    animate={{ x: ['0%', '130%'] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  </div>
                  <div className="mt-3 text-xs text-stone-600">This takes just a few seconds</div>
                </div>
              </div>

              <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-stone-900 via-black to-stone-700 bg-clip-text text-transparent">Analyzing Your Website</h2>

              <motion.div
                key={loadingMessageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-lg text-stone-600 min-h-[2rem]"
              >
                {loadingMessages[loadingMessageIndex]}
              </motion.div>

              <div className="mt-8 flex justify-center">
                <div className="flex space-x-2">
                  {loadingMessages.map((_, index) => (
                    <motion.div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        index === loadingMessageIndex ? 'bg-stone-800' : 'bg-stone-300'
                      }`}
                      animate={index === loadingMessageIndex ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5, repeat: index === loadingMessageIndex ? Infinity : 0 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Step */}
          {currentStep === 'results' && assessmentData && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto mt-6 sm:mt-0"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 mb-3 font-ibm-plex-serif"
                >
                  AI Readiness Report
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-lg md:text-xl text-stone-600"
                >
                  Here's how your website scores for AI integration
                </motion.p>
              </div>

              {/* Overall Score - Linear Progress */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-16 max-w-3xl mx-auto w-full"
              >
                {/* Label Row */}
                <div className="flex items-end justify-between mb-3">
                  <div className="text-xl font-semibold text-stone-900">Overall Readiness Score</div>
                  <div className="text-2xl font-bold text-stone-900 font-ibm-plex-serif">{animatedScore} <span className="text-stone-600 text-base font-medium">/ 100</span></div>
                </div>
                {/* Track */}
                <div className="w-full h-4 md:h-5 rounded-full bg-stone-200/80 overflow-hidden border border-stone-300/60">
                  {/* Fill */}
                  {(() => {
                    const score = assessmentData.overallScore;
                    return (
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${score}%` }}
                        transition={{ delay: 0.5, duration: 1.8, ease: 'easeOut' }}
                        style={{ background: 'linear-gradient(90deg, #475569, #0f172a)' }}
                        className="h-full rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.08)]"
                      />
                    );
                  })()}
                </div>
              </motion.div>

              {/* Metrics Analysis - Compact Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Left Column - Metrics */}
                <div className="space-y-6">
                  {/* Metric 1: Customer Journey Complexity */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-stone-200/70"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-1 font-ibm-plex-serif">
                      Customer Journey Complexity
                    </h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Effort required to find and compare the right products
                    </p>
                    
                    {/* Desktop/Tablet table */}
                    <div className="hidden sm:block rounded-xl border border-stone-200 overflow-hidden">
                      {/* Table Header */}
                      <div className="grid grid-cols-[0.9fr_1.05fr_1.05fr] md:grid-cols-[0.7fr_1.15fr_1.15fr] bg-stone-100/80">
                        <div className="px-3 py-2 text-left">
                          <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">Metric</p>
                        </div>
                        <div className="px-3 py-2 text-center">
                          <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">Your Site</p>
                        </div>
                        <div className="px-3 py-2 text-center">
                          <p className="text-xs font-medium text-stone-600 uppercase tracking-wide">AI Competitors</p>
                        </div>
                      </div>
                      {/* Table Rows */}
                      <div className="bg-white">
                        <div className="grid grid-cols-[0.9fr_1.05fr_1.05fr] md:grid-cols-[0.7fr_1.15fr_1.15fr] border-b border-stone-200">
                          <div className="px-3 py-3 text-xs font-medium text-stone-900">Find Product</div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                              {assessmentData.metrics.customerJourneyComplexity.findProductActionsCurrent}
                            </div>
                          </div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                              {assessmentData.metrics.customerJourneyComplexity.findProductActionsAI}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-[0.9fr_1.05fr_1.05fr] md:grid-cols-[0.7fr_1.15fr_1.15fr] border-b border-stone-200">
                          <div className="px-3 py-3 text-xs font-medium text-stone-900">Compare Products</div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                              {assessmentData.metrics.customerJourneyComplexity.compareProductsActionsCurrent}
                            </div>
                          </div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-semibold text-stone-900 whitespace-nowrap">
                              {assessmentData.metrics.customerJourneyComplexity.compareProductsActionsAI}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-[0.9fr_1.05fr_1.05fr] md:grid-cols-[0.7fr_1.15fr_1.15fr]">
                          <div className="px-3 py-3 text-xs font-medium text-stone-900">Static Quiz Available</div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.staticQuizAvailable ? 'Yes' : 'No'}
                            </div>
                          </div>
                          <div className="px-3 py-3 text-center">
                            <div className="text-sm font-bold text-stone-500">Dynamic and Personalized Quiz</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile stacked cards (no horizontal scroll) */}
                    <div className="sm:hidden space-y-3">
                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <div className="text-xs font-medium text-stone-900 mb-2">Find Product</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">Your Site</div>
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.findProductActionsCurrent}
                            </div>
                          </div>
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">AI Competitors</div>
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.findProductActionsAI}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <div className="text-xs font-medium text-stone-900 mb-2">Compare Products</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">Your Site</div>
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.compareProductsActionsCurrent}
                            </div>
                          </div>
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">AI Competitors</div>
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.compareProductsActionsAI}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-stone-200 bg-white p-3">
                        <div className="text-xs font-medium text-stone-900 mb-2">Static Quiz Available</div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">Your Site</div>
                            <div className="text-sm font-semibold text-stone-900">
                              {assessmentData.metrics.customerJourneyComplexity.staticQuizAvailable ? 'Yes' : 'No'}
                            </div>
                          </div>
                          <div className="rounded-lg bg-stone-50 border border-stone-200 p-2 text-center">
                            <div className="text-[10px] uppercase tracking-wide text-stone-500 mb-1">AI Competitors</div>
                            <div className="text-sm font-bold text-stone-500">Dynamic and Personalized Quiz</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Metric 2: Product Details Grade */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-stone-200/70"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-1 font-ibm-plex-serif">
                      Product Details Grade
                    </h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Are product details ready for AI?
                    </p>
                    
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl font-bold text-stone-900 font-ibm-plex-serif">
                        {assessmentData.metrics.productDetailsGrade.grade}
                      </div>
                      <div className="text-sm text-stone-600">Grade</div>
                    </div>
                    
                    <p className="text-sm text-stone-700 leading-relaxed">
                      {assessmentData.metrics.productDetailsGrade.analysis.slice(0, 120)}...
                    </p>
                  </motion.div>

                  {/* Metric 3: Personalization Index */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-stone-200/70"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-1 font-ibm-plex-serif">
                      Personalization Index
                    </h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Current user experience type
                    </p>
                    <div className="text-sm text-stone-800 font-semibold mb-2">{assessmentData.metrics.personalizationIndex.currentStatus}</div>
                    <div className="text-sm text-stone-700 leading-relaxed">Analysis: {assessmentData.metrics.personalizationIndex.analysis}</div>
                  </motion.div>
                </div>

                {/* Right Column - Competitor Benchmark + Business Impact */}
                <div className="space-y-6">
                  {/* Competitor Benchmark */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 0.6 }}
                    className="bg-white/80 rounded-2xl p-6 shadow-sm border border-stone-200/70 backdrop-blur-sm"
                  >
                    <h3 className="text-lg font-semibold tracking-tight text-stone-900 mb-1 font-ibm-plex-serif">How Your Competitors Are Doing</h3>
                    <p className="text-sm text-stone-600 mb-4">Average Score of brands in {assessmentData.category} category</p>
                    <div className="flex items-end justify-between">
                      <div className="text-2xl font-bold text-stone-900 font-ibm-plex-serif">
                        {assessmentData.metrics.competitorBenchmark.averageScore}
                        <span className="text-sm text-stone-600 font-medium"> / 100</span>
                      </div>
                    </div>
                    {/* Competitor progress bar */}
                    <div className="mt-3 w-full h-3 md:h-4 rounded-full bg-stone-200/80 overflow-hidden border border-stone-300/60">
                      {(() => {
                        const avg = assessmentData.metrics.competitorBenchmark.averageScore;
                        return (
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${avg}%` }}
                            transition={{ delay: 0.2, duration: 1.4, ease: 'easeOut' }}
                            style={{ background: 'linear-gradient(90deg, #16a34a, #065f46)' }}
                            className="h-full rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.06)]"
                          />
                        );
                      })()}
                    </div>
                    {assessmentData.metrics.competitorBenchmark.note && (
                      <p className="text-xs text-stone-600 mt-3">{assessmentData.metrics.competitorBenchmark.note}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="bg-stone-50 rounded-2xl p-4 shadow-sm border border-stone-200/80"
                  >
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900 mb-1 font-ibm-plex-serif">
                      The Business Impact
                    </h3>
                    <p className="text-sm text-stone-800 font-semibold mb-3">
                      The Opportunity Cost of Not Being AI-Native
                    </p>
                    
                    <div className="space-y-2">
                      <div className="bg-white/70 rounded-lg p-3 border border-stone-200/70">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-stone-900 text-sm mb-0.5">15-20% Conversion Boost</p>
                            <p className="text-xs text-stone-600">Brands with conversational AI see significant increases</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-3 border border-stone-200/70">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-stone-900 text-sm mb-0.5">Missing Zero-Party Data</p>
                            <p className="text-xs text-stone-600">Direct customer preferences shared in conversations</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/70 rounded-lg p-3 border border-stone-200/70">
                        <div className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-semibold text-stone-900 text-sm mb-0.5">30% Cart Abandonment</p>
                            <p className="text-xs text-stone-600">Customers overwhelmed by choices without guidance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Call to Action */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-sm border border-stone-800/40"
              >
                <h3 className="text-2xl font-semibold tracking-tight mb-3 font-ibm-plex-serif">
                  Ready to Make Your Brand AI‑Native?
                </h3>
                <p className="text-base md:text-lg mb-6 text-gray-100/90">
                  Leave your email and we’ll reach out with a tailored plan.
                </p>

                {!resultsSubmitted ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      // No checks here; send waitlistemail per spec
                      submitWaitlistEmail(resultsEmail);
                      setResultsSubmitted(true);
                    }}
                    className="mx-auto max-w-xl flex flex-col sm:flex-row items-stretch gap-3"
                  >
                    <input
                      type="email"
                      value={resultsEmail}
                      onChange={(e) => {
                        setResultsEmail(e.target.value);
                        setResultsEmailError('');
                      }}
                      placeholder="Your work email"
                    className={`flex-1 px-5 py-3.5 rounded-xl border bg-white/90 text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-4 ${
                        resultsEmailError ? 'border-stone-400 focus:ring-stone-300' : 'border-stone-300 focus:ring-stone-200'
                      }`}
                    />
                    <button
                      type="submit"
                    className="px-6 py-3.5 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <div className="mx-auto max-w-xl">
                    <div className="inline-block px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-sm">
                      Thanks! We’ll get in touch shortly.
                    </div>
                  </div>
                )}

                {resultsEmailError && (
                  <div className="mt-3 text-sm text-red-200">{resultsEmailError}</div>
                )}

                {/* Optional: Allow another analysis */}
                {/* <div className="mt-6">
                  <motion.button
                    onClick={resetAssessment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-100 hover:text-white underline font-medium"
                  >
                    Analyze Another Website
                  </motion.button>
                </div> */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
