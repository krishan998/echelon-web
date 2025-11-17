import { useEffect, useState, useRef } from 'react';
import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { GradientText } from '../components/common/AnimatedText';
import { submitWebsiteLandingPageEmail, isValidEmail } from '../utils/urlUtils';
import logoSrc from '../assets/logo_fresh.jpg';
import backImage from '../assets/back.jpg';


 


export function TeaserPage() {
  const containerControls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreviewingChat, setIsPreviewingChat] = useState(false);
  const [panelHeight] = useState(560);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'system'; message: string }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const isMobilePanelActive = isMobile && (showChatBox || isPreviewingChat);
  
  const suggestedQuestions = [
    "What services do you offer?",
    "Tell me about pricing"
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showChatBox) {
        setShowChatBox(false);
      }
    };

    if (showChatBox) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showChatBox]);

  // Handle sending messages
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [...prev, { type: 'user', message: message.trim() }]);
    setShowChatBox(true);
    setSearchInput('');
    
    // Add a system response (you can replace this with actual API call)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        message: 'Thank you for your question. We\'ll get back to you soon!' 
      }]);
    }, 500);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto highlight/peek animation before user interacts (only once on web, not on mobile)
  useEffect(() => {
    // Don't run on mobile
    if (isMobile) return;
    
    // Don't run if user has interacted or chat box is shown
    if (hasUserInteracted || showChatBox) return;

    // Check if animation has already been shown (using localStorage)
    const hasShownAnimation = localStorage.getItem('nexbit-chat-animation-shown');
    if (hasShownAnimation === 'true') return;

    // Trigger the peek animation once
    const triggerPeek = () => {
      setIsHighlighted(true);
      setIsPreviewingChat(true);

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = setTimeout(() => {
        setIsHighlighted(false);
        setIsPreviewingChat(false);
        // Mark as shown in localStorage
        localStorage.setItem('nexbit-chat-animation-shown', 'true');
      }, 2200);
    };

    // Trigger once after a short delay
    const timeout = setTimeout(triggerPeek, 2000);

    return () => {
      clearTimeout(timeout);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, [hasUserInteracted, showChatBox, isMobile]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Submit email to API
    submitWebsiteLandingPageEmail(email);
    
    // Show success state
    setIsSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setEmail('');
    }, 3000);
  };

  // Bounce the front layer when pulling down at the very top of the page
  useEffect(() => {
    let touchStartY = 0;

    const triggerBounce = () => {
      containerControls.start({ y: 14, transition: { type: 'spring', stiffness: 300, damping: 20 } })
        .then(() => containerControls.start({ y: 0, transition: { type: 'spring', stiffness: 280, damping: 18 } }));
    };

    const onWheel = (e: WheelEvent) => {
      if (window.scrollY <= 0 && e.deltaY < 0) {
        triggerBounce();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY || 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY || 0;
      const diff = currentY - touchStartY; // positive when pulling down
      if (window.scrollY <= 0 && diff > 10) {
        triggerBounce();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('touchstart', onTouchStart as any);
      window.removeEventListener('touchmove', onTouchMove as any);
    };
  }, [containerControls]);


  return (
    <>
    <div className="min-h-screen relative overflow-hidden font-sf-pro overscroll-y-contain bg-transparent" data-name="page-root">
      {/* Fixed base background so it never moves */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        data-name="global-background"
        style={{
          backgroundImage: `url(${backImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      {/* Two-layer background wrapper */}
      <motion.div
        animate={containerControls}
        className="relative z-10 mt-1 sm:mt-3 lg:mt-6 mb-4 sm:mb-8 lg:mb-16 mx-2 sm:mx-4 lg:mx-8 xl:mx-12 2xl:mx-16 rounded-[3rem] overflow-hidden will-change-transform bg-[#F6F5F2]"
        data-name="front-layer"
      >
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-6"
      >
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <img 
            src={logoSrc} 
            alt="Nexbit Logo" 
            className="w-10 h-10 rounded-[2px] object-cover"
          />
          <span className="text-xl font-medium text-gray-900">Nexbit</span>
        </div>

        {/* Contact Button - pill, dark bg, light text */}
        <motion.a
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          href="https://calendly.com/kp-nexbit/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-[#343434] text-white px-6 py-3 md:px-7 md:py-2.5 text-base md:text-lg font-normal shadow-sm hover:shadow md:shadow transition-all"
        >
          Contact
        </motion.a>
      </motion.header>
      
      {/* Hero Section */}
      <section className="relative z-10 h-[100vh] flex items-start px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 -mt-12 lg:-mt-6 pt-16 lg:pt-24 overflow-hidden" data-section="hero">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-center items-center">
            
            {/* Centered Text Content */}
            <div className="text-center flex flex-col justify-center items-center mt-8 lg:mt-4">
              
              {/* Main Heading - Centered */}
              <div className="mb-8">
                <GradientText
                  text="Transform visitor to qualified conversation in seconds"
                  gradient="from-gray-950 via-black to-gray-800"
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-5xl font-medium tracking-tight leading-tight"
                />
              </div>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-gray-600 mb-12 leading-relaxed"
              >
                We're building something extraordinary. Be the first to experience it.
              </motion.div>

              {/* Join Early Access */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center mb-8 mt-12"
              >
                <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 mb-6">
                  Join Early Access
                </h3>
                
                {/* Email Input */}
                <div className="max-w-lg mx-auto">
                  <form onSubmit={handleEmailSubmit}>
                    <div className="flex gap-3 items-start">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        placeholder="Enter email"
                        className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent shadow-sm transition-all duration-200 ${
                          emailError 
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                            : 'border-gray-200'
                        }`}
                        disabled={isSubmitting || isSubmitted}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: isSubmitting || isSubmitted ? 1 : 1.02 }}
                        whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                        disabled={isSubmitting || isSubmitted}
                         className={`px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-medium transition-colors text-base sm:text-lg whitespace-nowrap ${
                          isSubmitted
                            ? 'bg-green-600 text-white'
                            : isSubmitting
                            ? 'bg-gray-500 text-white cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                      >
                        {isSubmitted ? '✓ Joined!' : isSubmitting ? 'Joining...' : 'Join'}
                      </motion.button>
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm mt-2 text-center">
                        {emailError}
                      </p>
                    )}
                    {isSubmitted && (
                      <p className="text-green-600 text-sm mt-2 text-center">
                        Thanks! We'll notify you when we launch.
                      </p>
                    )}
                  </form>
            </div>
          </motion.div>


              {/* AI Readiness Assessment CTA */}
              {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mb-8"
              >
                <motion.a
                  href="/ai-readiness-check"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-gray-800 to-black text-white px-6 py-3 rounded-full font-medium hover:from-gray-900 hover:to-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span>Check Your AI Readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
                <p className="text-sm text-gray-500 mt-2">Free assessment • Takes 30 seconds</p>
              </motion.div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Second Page Container with emerging white background */}
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative -mt-32"
        data-section="cta"
      >
        {/* Emerging white background plate (second page) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[2rem] shadow-sm -z-10 bg-cover bg-center"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.94), rgba(246,245,242,0.98)), url(${backImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative">
      {/* Footer */}
      <footer
        className="text-white border-t border-white/10"
        data-section="footer"
        style={{
          backgroundColor: '#0D6C72',
          backgroundImage:
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.2)), url(https://www.transparenttextures.com/patterns/dust.png)',
          backgroundBlendMode: 'overlay',
        }}
      >
        {/* Main Footer Content */}
        <div className="px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-10 md:py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            {/* Left Column - Brand Information */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
              <img src={logoSrc} alt="Nexbit Logo" className="w-12 h-12 rounded-[2px] object-cover" />
              <div className="font-semibold text-lg">Nexbit</div>
            </div>

            {/* Right Column - Back to Top & Links */}
            <div className="text-center md:text-right space-y-3">
              <a href="#page-root" className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1 justify-center md:justify-end">
                Back to top
                <span>↑</span>
              </a>
              <a href="https://www.linkedin.com/company/nexbit-ai/" target="_blank" rel="noopener noreferrer" className="block text-white/80 hover:text-white transition-colors">LinkedIn</a>
              <a href="https://x.com/NexbitAi" className="block text-white/80 hover:text-white transition-colors">X</a>
            </div>
          </div>
        </div>
      </footer>
        </div>
      </motion.section>
      </motion.div>
    </div>

    {/* Fixed Chat Widget */}
    <div
      className={`fixed z-50 flex flex-col gap-4 ${isMobilePanelActive ? 'inset-0 p-0' : 'left-4 bottom-6 sm:left-6 sm:bottom-6'}`}
      data-name="chat-widget"
      style={
        isMobilePanelActive
          ? undefined
          : { width: isMobile ? 'auto' : 'min(90vw, 520px)' }
      }
    >

      {/* Chat Box - Emerges from search icon */}
      <div
        className="w-full"
        style={{ height: isMobilePanelActive ? '100%' : panelHeight }}
      >
        <AnimatePresence>
          {(showChatBox || isPreviewingChat) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full h-full overflow-hidden flex flex-col bg-[#1f1f1f]/95 backdrop-blur ${
                isMobilePanelActive ? '' : 'rounded-2xl shadow-2xl'
              }`}
              style={{
                pointerEvents: showChatBox ? 'auto' : 'none',
                opacity: showChatBox ? 1 : 0.95,
              }}
              ref={panelRef}
              data-chat-panel
            >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 text-white"
            style={{
              background: 'linear-gradient(135deg, rgba(230,123,98,0.95), rgba(176,80,58,0.95))',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.343-4 3v1h8v-1c0-1.657-1.79-3-4-3z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Nexbit</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setShowChatBox(false);
                setIsPreviewingChat(false);
                setHasUserInteracted(true);
              }}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-white/3 to-transparent">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.05, ease: 'easeOut' }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-lg ${
                      msg.type === 'user'
                        ? 'bg-[#3b3b3b] text-white'
                        : 'bg-white/8 text-white'
                    }`}
                  >
                    {msg.message}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {suggestedQuestions.length > 0 && (
              <div className="px-4 pb-3 pt-2 border-t border-white/10 bg-white/3">
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage(question)}
                      className="px-3 py-1.5 text-xs rounded-full transition-colors text-white"
                      style={{
                        background: 'linear-gradient(135deg, rgba(230,123,98,0.28), rgba(176,80,58,0.28))',
                        border: '1px solid rgba(255,255,255,0.2)',
                      }}
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input inside chat box */}
            <div className="px-4 pb-4">
              <div
                className="flex items-center gap-3 rounded-2xl px-4 py-3 border border-white/15 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(230,123,98,0.22), rgba(176,80,58,0.2))',
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(230,123,98,0.95), rgba(176,80,58,0.95))',
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setHasUserInteracted(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey && searchInput.trim()) {
                      e.preventDefault();
                      handleSendMessage(searchInput.trim());
                    }
                  }}
                  placeholder="Ask anything about Nexbit..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/70"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (searchInput.trim()) {
                      handleSendMessage(searchInput.trim());
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isMobilePanelActive && (
        <div className={`flex items-end gap-3 w-full ${isMobile ? 'justify-start' : ''}`}>
          <AnimatePresence>
            {!showChatBox && !isPreviewingChat && (
            <motion.button
              key="chat-launcher"
              onClick={() => {
                setShowChatBox(true);
                setHasUserInteracted(true);
                setIsHighlighted(false);
                setIsPreviewingChat(false);
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{
                opacity: 1,
                scale: isHighlighted ? 1.15 : 1,
                y: 0,
                boxShadow: isHighlighted
                  ? '0 0 35px rgba(93, 70, 255, 0.55)'
                  : '0 12px 25px rgba(17, 12, 64, 0.25)',
              }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-16 h-16 rounded-full text-white flex items-center justify-center transition-shadow overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(230,123,98,0.95), rgba(176,80,58,0.95))',
              }}
            >
              <div
                className="absolute inset-0 opacity-30 mix-blend-screen"
                style={{
                  backgroundImage: 'url(https://www.transparenttextures.com/patterns/dust.png)',
                }}
              ></div>
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(230,123,98,0) 60%)',
                }}
                animate={{ scale: [1, 1.5], opacity: [0.25, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </motion.button>
          )}
          </AnimatePresence>

          {/* spacing placeholder to keep layout width for icon preview on larger screens */}
          {!isMobile && <div className="flex-1 min-w-[200px]" />}
        </div>
      )}
    </div>
    </>
  );
}
