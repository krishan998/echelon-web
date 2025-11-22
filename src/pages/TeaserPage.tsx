import { useEffect, useState, useRef, useCallback } from 'react';
import React from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { GradientText } from '../components/common/AnimatedText';
import { submitWebsiteLandingPageEmail, isValidEmail } from '../utils/urlUtils';
import { sendChatMessage } from '../api/chatApi';
import logoSrc from '../assets/logo_fresh.jpg';
import backImage from '../assets/back.jpg';

export function TeaserPage() {
  const containerControls = useAnimation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, right: 0 });
  const [chatMessages, setChatMessages] = useState<Array<{ type: 'user' | 'system'; message: string }>>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const earlyAccessButtonRef = useRef<HTMLButtonElement>(null);
  const botReplyTimeoutRef = useRef<number | null>(null);
  const debugLog = useCallback((...args: any[]) => {
    if (typeof window === 'undefined') return;
    console.log('[ChatDebug]', ...args);
  }, []);

  const handleCloseChat = useCallback(() => {
    if (botReplyTimeoutRef.current) {
      window.clearTimeout(botReplyTimeoutRef.current);
      botReplyTimeoutRef.current = null;
    }
    debugLog('handleCloseChat');
    setChatMessages([]);
    setSessionId(null);
    setIsLoadingMessage(false);
    setShowChatBox(false);
  }, [debugLog]);

  const suggestedQuestions = [
    "What services do you offer?",
    "Tell me about pricing"
  ];

  const isIntroActive = showChatBox && chatMessages.length === 0;
  const isCollapsedTipActive = !showChatBox;

  // Auto-scroll to latest message (only within chat box, not the page)
  useEffect(() => {
    if (messagesEndRef.current && showChatBox) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [chatMessages, showChatBox]);
  

  useEffect(() => {
    if (!showChatBox || !chatPanelRef.current) return;
    debugLog('chat-panel-bounds', chatPanelRef.current.getBoundingClientRect());
  }, [showChatBox, debugLog]);

  useEffect(() => {
    if (!isIntroActive || !introBlockRef.current) return;
    debugLog('intro-block-bounds', introBlockRef.current.getBoundingClientRect());
  }, [isIntroActive, debugLog]);

  useEffect(() => {
    debugLog('state-change', {
      showChatBox,
      chatCount: chatMessages.length,
      isIntroActive,
      hasMessages: chatMessages.length > 0,
    });
  }, [showChatBox, chatMessages, isIntroActive]);

  useEffect(() => {
    return () => {
      if (botReplyTimeoutRef.current) {
        window.clearTimeout(botReplyTimeoutRef.current);
      }
    };
  }, []);
  
  // Preserve scroll position when chat box opens
  useEffect(() => {
    if (showChatBox) {
      const savedScrollY = scrollPositionRef.current || window.scrollY;
      
      // Restore scroll position using requestAnimationFrame for smooth restoration
      const restoreScroll = () => {
        window.scrollTo({
          top: savedScrollY,
          left: 0,
          behavior: 'auto' // Use 'auto' instead of 'smooth' to prevent animation
        });
      };
      
      // Restore immediately and after DOM updates
      restoreScroll();
      requestAnimationFrame(() => {
        restoreScroll();
        requestAnimationFrame(restoreScroll);
      });
    }
  }, [showChatBox]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showChatBox) {
          handleCloseChat();
        }
        if (showJoinPopup) {
          setShowJoinPopup(false);
        }
      }
    };

    if (showChatBox || showJoinPopup) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showChatBox, showJoinPopup, handleCloseChat]);

  // Update popup position on scroll/resize
  useEffect(() => {
    if (!showJoinPopup || !earlyAccessButtonRef.current) return;

    const updatePosition = () => {
      if (earlyAccessButtonRef.current) {
        const rect = earlyAccessButtonRef.current.getBoundingClientRect();
        const popupWidth = Math.min(448, window.innerWidth * 0.9);
        const popupHeight = 400;
        const spacing = 12;
        
        let top = rect.bottom + spacing;
        let right = window.innerWidth - rect.right;
        
        if (top + popupHeight > window.innerHeight - 20) {
          top = rect.top - popupHeight - spacing;
        }
        
        if (right + popupWidth > window.innerWidth - 20) {
          right = 20;
        }
        
        if (right < 20) {
          right = 20;
        }
        
        setPopupPosition({ top, right });
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [showJoinPopup]);

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    debugLog('handleSendMessage', { rawMessage: message, sessionId });
    if (!message.trim()) return;
    
    // Preserve scroll position before opening chat box
    scrollPositionRef.current = window.scrollY;
    
    const userMessage = message.trim();
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    setShowChatBox(true);
    setSearchInput('');
    setIsLoadingMessage(true);
    
    // Clear any existing timeout
    if (botReplyTimeoutRef.current) {
      window.clearTimeout(botReplyTimeoutRef.current);
      botReplyTimeoutRef.current = null;
    }
    
    try {
      // Call the chat API
      const response = await sendChatMessage(userMessage, sessionId || undefined);
      
      // Store session_id from response (will be set on first message and used for subsequent messages)
      if (response.session_id) {
        setSessionId(response.session_id);
      }
      
      // Add the system response
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        message: response.response 
      }]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      // Show error message to user
      setChatMessages(prev => [...prev, { 
        type: 'system', 
        message: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleStartChat = () => {
    debugLog('Start chat clicked', {
      hasInput: Boolean(searchInput.trim()),
      existingMessages: chatMessages.length,
    });
    if (searchInput.trim()) {
      handleSendMessage(searchInput.trim());
      return;
    }

    scrollPositionRef.current = window.scrollY;
    setChatMessages([]);
    setSessionId(null); // Reset session when starting fresh chat
    setShowChatBox(true);
  };

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
    let isBouncing = false;
    let lastTriggerTime = 0;
    let isScrolling = false;
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    let lastScrollY = window.scrollY;
    const DEBOUNCE_DELAY = 1000; // Minimum time between bounce triggers (ms)
    const SCROLL_STOP_DELAY = 150; // Time to wait before considering scroll stopped (ms)

    const triggerBounce = () => {
      const now = Date.now();
      // Prevent triggering if already bouncing, if triggered too recently, or if not actively scrolling
      if (isBouncing || (now - lastTriggerTime) < DEBOUNCE_DELAY || !isScrolling) {
        return;
      }

      isBouncing = true;
      lastTriggerTime = now;

      containerControls.start({ y: 14, transition: { type: 'spring', stiffness: 300, damping: 20 } })
        .then(() => containerControls.start({ y: 0, transition: { type: 'spring', stiffness: 280, damping: 18 } }))
        .then(() => {
          // Reset bounce flag after animation completes
          setTimeout(() => {
            isBouncing = false;
          }, 200);
        });
    };

    const markScrolling = () => {
      isScrolling = true;
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
      }, SCROLL_STOP_DELAY);
    };

    const onWheel = (e: WheelEvent) => {
      const currentScrollY = window.scrollY;
      // Only trigger if scroll position actually changed (user is actively scrolling)
      if (currentScrollY !== lastScrollY) {
        markScrolling();
        lastScrollY = currentScrollY;
      }
      
      if (window.scrollY <= 0 && e.deltaY < 0 && isScrolling) {
        triggerBounce();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY || 0;
      markScrolling();
    };

    const onTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0]?.clientY || 0;
      const diff = currentY - touchStartY; // positive when pulling down
      markScrolling();
      if (window.scrollY <= 0 && diff > 10) {
        triggerBounce();
      }
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY !== lastScrollY) {
        markScrolling();
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('scroll', onScroll as any);
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
          <span className="text-xl font-clash-display font-medium text-gray-900">Nexbit</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <motion.button
            ref={earlyAccessButtonRef}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (earlyAccessButtonRef.current) {
                const rect = earlyAccessButtonRef.current.getBoundingClientRect();
                const popupWidth = Math.min(448, window.innerWidth * 0.9); // max-w-md is 448px
                const popupHeight = 400; // approximate height
                const spacing = 12;
                
                // Calculate position - prefer below button, aligned to right edge
                let top = rect.bottom + spacing;
                let right = window.innerWidth - rect.right;
                
                // If popup would go off bottom of screen, position above button instead
                if (top + popupHeight > window.innerHeight - 20) {
                  top = rect.top - popupHeight - spacing;
                }
                
                // Ensure popup doesn't go off right edge
                if (right + popupWidth > window.innerWidth - 20) {
                  right = 20;
                }
                
                // Ensure popup doesn't go off left edge
                if (right < 20) {
                  right = 20;
                }
                
                setPopupPosition({ top, right });
              }
              setShowJoinPopup(true);
            }}
            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-900 px-5 py-2.5 text-sm sm:text-base font-medium shadow-sm hover:shadow transition-all"
          >
            Join Early Access
          </motion.button>
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
        </div>
      </motion.header>
      
      {/* Join Early Access Popup */}
      <AnimatePresence>
        {showJoinPopup && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinPopup(false)}
            />
            {/* Popup positioned near button */}
            <motion.div
              className="fixed z-50"
              style={{
                top: `${popupPosition.top}px`,
                right: `${popupPosition.right}px`,
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0, 
                y: -10,
                transformOrigin: 'top right'
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0 
              }}
              exit={{ 
                scale: 0.85, 
                opacity: 0, 
                y: -5 
              }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-[90vw] max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl space-y-6 relative">
              <button
                onClick={() => setShowJoinPopup(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
                aria-label="Close join popup"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="space-y-2 text-center">
                <p className="text-xs font-semibold tracking-[0.3em] text-gray-500 uppercase">Early access</p>
              </div>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="join-email">
                    Email Address
                  </label>
                  <input
                    id="join-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="you@email.com"
                    className={`w-full px-4 py-3 rounded-2xl border text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition ${
                      emailError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
                        : 'border-gray-200'
                    }`}
                    disabled={isSubmitting || isSubmitted}
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">
                      {emailError}
                    </p>
                  )}
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: isSubmitting || isSubmitted ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting || isSubmitted ? 1 : 0.98 }}
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full px-4 py-3 rounded-2xl font-medium text-base transition-colors ${
                    isSubmitted
                      ? 'bg-green-600 text-white'
                      : isSubmitting
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {isSubmitted ? '✓ Joined!' : isSubmitting ? 'Joining...' : 'Join waitlist'}
                </motion.button>
                {isSubmitted && (
                  <p className="text-green-600 text-sm text-center">
                    Thanks! We'll notify you when we launch.
                  </p>
                )}
              </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-start pl-8 sm:pl-12 lg:pl-16 pr-2 sm:pr-4 lg:pr-12 xl:pr-16 2xl:pr-20 3xl:pr-24 -mt-10 lg:-mt-4 pt-10 lg:pt-14 pb-10 overflow-visible" data-section="hero">
        <div className="w-full flex flex-col items-start gap-6">
          {/* Left Aligned Text Content */}
          <div className="text-left flex flex-col justify-center items-start mt-4 lg:mt-2">
            
            {/* Main Heading - Left Aligned */}
            <div className="mb-4">
              <GradientText
                text="Nexbit explains your product better than you do."
                gradient="from-gray-950 via-black to-gray-800"
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-regular tracking-tight leading-tight font-clash-display"
              />
            </div>

            {/* Tagline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 font-light leading-relaxed font-clash-display"
              >
                Stop letting your traffic bounce. Turn visitors into booked demos with AI that chats like your best sales rep.
              </motion.div>
          </div>
        </div>
      </section>

      {/* Second Page Container with emerging white background */}
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-16 sm:mt-20 lg:mt-28"
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
              <div className="font-clash-display font-medium text-lg">Nexbit</div>
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

      {/* Docked Chat overlay */}
      <AnimatePresence>
        {showChatBox && (
          <motion.div
            key="chat-backdrop"
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseChat}
          />
        )}
      </AnimatePresence>

      {/* Docked Chat Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 px-3 sm:px-6 pb-5 pointer-events-none">
        <AnimatePresence initial={false} mode="wait">
          {showChatBox ? (
            <motion.div
              key="chat-expanded"
              layoutId="docked-chat-shell"
              className="mx-auto w-full max-w-2xl pointer-events-auto"
              ref={chatPanelRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              style={{ originY: 1 }}
            >
              <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_25px_60px_rgba(15,15,15,0.18)] overflow-hidden">
                <div className="flex flex-col h-[70vh] max-h-[620px]">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-100 bg-white/95">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center shadow-inner">
                        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.343-4 3v1h8v-1c0-1.657-1.79-3-4-3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-base text-gray-900">Nexbit</p>
                        <p className="text-xs text-gray-500">AI SDR agent</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleCloseChat}
                      className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
                      aria-label="Close chat"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    {isIntroActive && (
                      <div className="space-y-3" ref={introBlockRef}>
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-gray-100 text-gray-900 shadow-inner"
                        >
                          Hi there! I'm Nexbit the AI SDR Agent. I'm here to help answer any questions you may have. How can I help you today?
                        </motion.div>
                      </div>
                    )}
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={`${msg.message}-${index}`}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-lg ${
                            msg.type === 'user' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {msg.message}
                        </div>
                      </motion.div>
                    ))}
                    {isLoadingMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm bg-gray-100 text-gray-900 shadow-lg">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-gray-500 text-xs">Nexbit is typing...</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {suggestedQuestions.length > 0 && (
                    <div className="px-5 pb-3 pt-2 border-t border-gray-100 bg-gray-50/60">
                      <div className="flex flex-wrap gap-2">
                        {suggestedQuestions.map((question, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleSendMessage(question)}
                            className="px-3 py-1.5 text-xs rounded-full transition-colors text-gray-800 border border-gray-200 bg-white shadow-sm"
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="px-5 pb-5 pt-4 border-t border-gray-100 bg-white/95">
                    <motion.form
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (searchInput.trim()) {
                          handleSendMessage(searchInput.trim());
                        }
                      }}
                      className="flex flex-col sm:flex-row items-center gap-4 w-full"
                    >
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Ask Nexbit anything..."
                          disabled={isLoadingMessage}
                          className="w-full bg-transparent text-lg sm:text-xl text-gray-900 placeholder-gray-400 px-0 py-2 border-b border-gray-200 focus:border-gray-900 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={isLoadingMessage || !searchInput.trim()}
                        whileHover={{ scale: searchInput.trim() && !isLoadingMessage ? 1.03 : 1 }}
                        whileTap={{ scale: searchInput.trim() && !isLoadingMessage ? 0.97 : 1 }}
                        className="w-full sm:w-auto rounded-full bg-gray-900 text-white px-7 py-3 font-medium hover:bg-gray-800 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoadingMessage ? 'Sending...' : 'Send'}
                      </motion.button>
                    </motion.form>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-collapsed"
              layoutId="docked-chat-shell"
              className="mx-auto w-full max-w-2xl pointer-events-auto"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              style={{ originY: 1 }}
            >
              <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_15px_45px_rgba(15,15,15,0.12)] px-5 py-6 flex flex-col gap-4 relative">
                {isCollapsedTipActive && (
                  <div className="absolute left-0 right-0 -top-16 flex justify-center pointer-events-none select-none">
                    <div className="w-full rounded-[28px] bg-white/95 px-6 py-3 text-sm text-gray-900 shadow-2xl border border-gray-200 max-w-[calc(100%-3rem)]">
                      I engage and qualify inbound buyers on your site. Let me explain how I can help you.
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold text-gray-900">Chat with Nexbit the AI SDR Agent</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Ask Nexbit anything..."
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/15"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: searchInput.trim() ? 1.03 : 1 }}
                    whileTap={{ scale: searchInput.trim() ? 0.97 : 1 }}
                    onClick={handleStartChat}
                    className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-medium shadow-sm hover:bg-gray-800 transition w-full sm:w-auto whitespace-nowrap"
                  >
                    Start chat
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>₹
      </div>
    </div>

    </>
  );
}
