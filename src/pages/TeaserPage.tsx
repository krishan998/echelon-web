import { useEffect, useState, useRef, useCallback } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitWebsiteLandingPageEmail, isValidEmail } from '../utils/urlUtils';
import { sendChatMessage, type ChatCta } from '../api/chatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useVoiceAgent } from '../hooks/useVoiceAgent';

type ChatMessage = { id: string; type: 'user' | 'system'; message: string; cta?: ChatCta | null };
import logoSrc from '../assets/logo_fresh.jpg';
import chatbotAvatar from '../assets/logo_fresh.jpg';
import feature1Image from '../assets/presales-features/First_Funnel.png';
import feature2Image from '../assets/presales-features/Second-personalization.png';
import feature3Image from '../assets/presales-features/Third_CRM_enrichment.png';
import integrationTile from '../assets/integrationTile.png';
import reliableIcon from '../assets/reliable.svg';
import scalableIcon from '../assets/scalable.svg';
import reliableSectionImage from '../assets/reliablesection.png';
import heroBgVideo from '../assets/herobg.webm';
import increasedemoIcon from '../assets/selling_points/increasedemo.png';
import fdeIcon from '../assets/selling_points/fde.png';
import uptimeIcon from '../assets/selling_points/uptime.png';
import latencyIcon from '../assets/selling_points/latency.png';
import securityIcon from '../assets/selling_points/security.png';

const createMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const SystemMessageBubble: React.FC<{
  text: string;
  cta?: ChatCta | null;
  normalizeUrl: (raw: string) => string;
  onTextUpdate?: () => void;
}> = ({ text, cta, normalizeUrl, onTextUpdate }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);

    if (!text) {
      setIsComplete(true);
      return;
    }

    if (typeof window === 'undefined') {
      setDisplayedText(text);
      setIsComplete(true);
      return;
    }

    let index = 0;
    const step = Math.max(15, Math.min(50, Math.ceil(900 / text.length)));

    const intervalId = window.setInterval(() => {
      index += 1;
      setDisplayedText(text.slice(0, index));
      // Trigger scroll on each text update
      if (onTextUpdate) {
        onTextUpdate();
      }
      if (index >= text.length) {
        window.clearInterval(intervalId);
        setIsComplete(true);
        // Final scroll when complete
        if (onTextUpdate) {
          onTextUpdate();
        }
      }
    }, step);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [text, onTextUpdate]);

  const ctaHref = cta?.url ? normalizeUrl(cta.url) : '';

  return (
    <>
      <div className="space-y-3 text-base leading-relaxed">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="whitespace-pre-line" {...props} />
            ),
            strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="ml-5 list-disc space-y-1 text-left" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="ml-5 list-decimal space-y-1 text-left" {...props} />
            ),
            li: ({ node, ...props }) => <li className="leading-relaxed" {...props} />,
          }}
        >
          {displayedText}
        </ReactMarkdown>
      </div>
      {isComplete && cta && ctaHref && (
        <div className="mt-3 rounded-2xl border border-[#e4dcd2] bg-[#f7f3ee] p-4 text-left shadow-[0_12px_35px_rgba(26,73,35,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1A4923]">{"Let's Connect"}</p>
          <p className="mt-2 text-base font-semibold text-gray-900">
            {cta.title || 'Book a Demo'}
          </p>
          {cta.description && (
            <p className="mt-1 text-sm text-gray-600">
              {cta.description}
            </p>
          )}
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#1A4923] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#123217] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A4923]"
          >
            Book a Demo
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
            </svg>
          </a>
        </div>
      )}
    </>
  );
};
// import splashVideo from '../assets/ctavideo.mp4';

export function TeaserPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [hasInteractedWithChat, setHasInteractedWithChat] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const earlyAccessButtonRef = useRef<HTMLButtonElement>(null);
  const botReplyTimeoutRef = useRef<number | null>(null);

  // Voice Agent Hook
  const {
    state: voiceAgentState,
    isRecording,
    conversationText: voiceConversationText,
    error: voiceError,
    startRecording: startVoiceRecording,
    stopRecording: stopVoiceRecording,
    disconnect: disconnectVoiceAgent,
  } = useVoiceAgent({
    callbacks: {
      onConversationText: (text) => {
        // Optionally add voice conversation text to chat messages
        // You can customize this behavior
      },
      onError: (error) => {
        console.error('[VoiceAgent] Error:', error);
      },
      onStateChange: (state) => {
      },
    },
  });

  const normalizeUrl = useCallback((rawUrl: string) => {
    const trimmed = rawUrl.trim();
    if (!trimmed) return '';
    try {
      return new URL(trimmed).toString();
    } catch {
      try {
        return new URL(`https://${trimmed}`).toString();
      } catch {
        return trimmed;
      }
    }
  }, []);

  const handleCloseChat = useCallback(() => {
    if (botReplyTimeoutRef.current) {
      window.clearTimeout(botReplyTimeoutRef.current);
      botReplyTimeoutRef.current = null;
    }
    setChatMessages([]);
    setSessionId(null);
    setIsLoadingMessage(false);
    setShowChatBox(false);
    setHasInteractedWithChat(true);
    setIsTransitioning(false); // Reset transition state
    // Stop voice recording if active
    if (isRecording) {
      stopVoiceRecording();
      disconnectVoiceAgent();
    }
  }, [isRecording, stopVoiceRecording, disconnectVoiceAgent]);

  const suggestedQuestions: string[] = [];

  // Load all integration logos from assets/integrations
  const integrationLogos = React.useMemo(() => {
    const modules = import.meta.glob('../assets/integrations/*.{png,jpg,jpeg,svg}', {
      eager: true,
      import: 'default',
    }) as Record<string, string>;
    return Object.values(modules);
  }, []);

  const whyNexbitRows = [
    {
      label: '5x Demo Requests',
      color: '#E9B3FF',
      title: 'Increase demo requests',
      body: '5x increase in demo requests from chat first discovery on search and catalogue.',
      icon: increasedemoIcon,
    },
    {
      label: 'Forward-deployed team',
      color: '#FFB27B',
      title: 'Hands-on deployment support',
      body: 'Partner with a forward-deployed engineer to go live quickly and keep your playbooks evolving.',
      icon: fdeIcon,
    },
    {
      label: '99.99% uptime',
      color: '#E9B3FF',
      title: 'Enterprise-grade reliability',
      body: 'Our AI agents are built on a hardened runtime with multi-region failover and continuous monitoring.',
      icon: uptimeIcon,
    },
   
    {
      label: 'Sub-500ms latency',
      color: '#7BD8FF',
      title: 'Instant, human-like experiences',
      body: 'Low-latency infra ensures every interaction feels natural, even at peak traffic.',
      icon: latencyIcon,
    },
    {
      label: 'AI guardrails',
      color: '#7BFFD6',
      title: 'Controlled, compliant conversations',
      body: 'Guardrails and policies keep every response on brand, on topic, and safe for your users.',
      icon: securityIcon,
    },
  ];

  const featureCards = [
    {
      label: 'Turn website visitors into informed buyers',
      color: '#FFB27B',
      title: 'Turn website visitors into informed buyers',
      body: 'Instantly explain your product, pricing, and value to every visitor, no matter where they land in the funnel.',
      image: feature1Image,
    },
    {
      label: 'Personalize every conversation',
      color: '#7BD8FF',
      title: 'Personalize every conversation with Persona Intelligence',
      body: 'Nex adapts to buyer persona, intent, and funnel stage so every touchpoint feels 1:1 and on-message.',
      image: feature2Image,
    },
    {
      label: 'Give sales teams superhuman context',
      color: '#7BFFD6',
      title: 'Give your sales team superhuman context',
      body: 'Enrich your CRM with qualification signals, intent, and call-ready notes from every conversation.',
      image: feature3Image,
    },
  ];

  const isIntroActive = showChatBox && chatMessages.length === 0;
  const isCollapsedTipActive = !showChatBox;

  // Auto-scroll to latest message (only within chat box, not the page)
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current && showChatBox) {
      // Use requestAnimationFrame for smooth scrolling during text animation
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  }, [showChatBox]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, showChatBox, scrollToBottom]);
  

  useEffect(() => {
    if (!showChatBox || !chatPanelRef.current) return;
  }, [showChatBox]);

  useEffect(() => {
    if (!isIntroActive || !introBlockRef.current) return;
  }, [isIntroActive]);

  useEffect(() => {
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
      
      // Reset transition state after a short delay to allow animation to complete
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
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
        
        // Calculate position directly below button, aligned to left edge
        let top = rect.bottom + spacing;
        let left = rect.left;
        
        // Ensure popup stays within viewport horizontally
        if (left + popupWidth > window.innerWidth - 20) {
          left = window.innerWidth - popupWidth - 20;
        }
        
        if (left < 20) {
          left = 20;
        }
        
        // If popup would go below viewport, adjust top position
        if (top + popupHeight > window.innerHeight - 20) {
          top = window.innerHeight - popupHeight - 20;
        }
        
        setPopupPosition({ top, left });
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
    if (!message.trim()) return;
    
    // Preserve scroll position before opening chat box
    scrollPositionRef.current = window.scrollY;
    
    const userMessage = message.trim();
    setChatMessages(prev => [...prev, { id: createMessageId(), type: 'user', message: userMessage }]);
    setShowChatBox(true);
    setSearchInput('');
    setIsLoadingMessage(true);
    setHasInteractedWithChat(true);
    
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
        id: createMessageId(),
        type: 'system', 
        message: response.response,
        cta: response.cta ?? null,
      }]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      // Show error message to user
      setChatMessages(prev => [...prev, { 
        id: createMessageId(),
        type: 'system', 
        message: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoadingMessage(false);
    }
  };

  const handleStartChat = () => {
    setIsTransitioning(true); // Hide input/button immediately
    if (searchInput.trim()) {
      handleSendMessage(searchInput.trim());
      return;
    }

    scrollPositionRef.current = window.scrollY;
    setChatMessages([]);
    setSessionId(null); // Reset session when starting fresh chat
    setShowChatBox(true);
    setHasInteractedWithChat(true);
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

  const scrollToTop = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
    <div id="page-root" className="min-h-screen relative overflow-hidden font-sf-pro overscroll-y-contain" data-name="page-root">
      {/* Fixed base background - Black with grain texture */}
      <div
        className="fixed inset-0 -z-10"
        data-name="global-background"
        style={{
          backgroundColor: '#0E0E13',
        }}
      >
        {/* Grain texture overlay - Animated */}
        <div
          className="absolute inset-0 z-[1] opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
            backgroundSize: '240px 240px',
            backgroundRepeat: 'repeat',
            animation: 'grain 8s steps(10) infinite',
          }}
        />
        <style>{`
          @keyframes grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-5%, -10%); }
            20% { transform: translate(-15%, 5%); }
            30% { transform: translate(7%, -25%); }
            40% { transform: translate(-5%, 25%); }
            50% { transform: translate(-15%, 10%); }
            60% { transform: translate(15%, 0%); }
            70% { transform: translate(0%, 15%); }
            80% { transform: translate(3%, 35%); }
            90% { transform: translate(-10%, 10%); }
          }
        `}</style>
        {/* Animated blob - top left */}
        <motion.div
          className="hidden md:block pointer-events-none absolute left-[-4%] top-[12px] z-0"
          style={{
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(235, 248, 85, 0.18) 0%, rgba(235, 248, 85, 0.08) 40%, rgba(0, 0, 0, 0) 70%)',
          }}
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Animated blob - bottom right */}
        <motion.div
          className="hidden md:block pointer-events-none absolute z-0 bottom-[-40px] right-[-10%]"
          style={{
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(26, 73, 35, 0.15) 0%, rgba(26, 73, 35, 0.08) 40%, rgba(0, 0, 0, 0) 70%)',
          }}
          animate={{
            x: [0, -25, 0],
            y: [0, -20, 0],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        </div>
      {/* Join Early Access Popup */}
      <AnimatePresence>
        {showJoinPopup && (
          <>
            {/* Popup positioned near button */}
            <motion.div
              className="fixed z-50"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0, 
                y: -10,
                transformOrigin: 'top center'
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
                  className={`w-full px-4 py-3 rounded-2xl font-medium text-base transition-colors text-white ${
                    isSubmitted
                      ? 'bg-green-600'
                      : isSubmitting
                      ? 'bg-gray-500 cursor-not-allowed'
                      : ''
                  }`}
                  style={!isSubmitted && !isSubmitting ? { backgroundColor: '#564F4B' } : undefined}
                  onMouseEnter={!isSubmitted && !isSubmitting ? (e) => e.currentTarget.style.backgroundColor = '#4a433f' : undefined}
                  onMouseLeave={!isSubmitted && !isSubmitting ? (e) => e.currentTarget.style.backgroundColor = '#564F4B' : undefined}
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
      <section className="relative z-10 min-h-screen flex items-start justify-start w-full pt-0 pb-0 overflow-hidden" data-section="hero">
        {/* Hero Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        >
          <source src={heroBgVideo} type="video/webm" />
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-[1]" />
        
        <div className="relative z-10 w-full">
          <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 pt-6 sm:pt-8 lg:pt-10 pb-10 flex flex-col gap-8">
            {/* Header inside hero so it shares video background */}
            <header
              className="relative z-20 flex items-center justify-between gap-2"
            >
              {/* Logo and Name */}
              <div className="flex items-center gap-2 min-w-0">
                <img 
                  src={logoSrc} 
                  alt="Nexbit Logo" 
                  className="w-10 h-10 rounded-[2px] object-cover"
                />
                <span className="text-xl sm:text-2xl md:text-3xl font-clash-grotesk font-medium text-white truncate">
                  Nexbit
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                <div className="relative inline-block">
                  <div
                    className="absolute inset-0 rounded-full opacity-30 blur-md"
                    style={{
                      background: 'linear-gradient(118.05deg, rgba(10, 10, 13, 0), rgba(29, 62, 37, 0.8) 25%, rgba(49, 79, 29, 0.9) 54%, rgba(8, 40, 34, 0.8) 80%, rgba(10, 10, 13, 0))',
                      transform: 'scale(1.1)',
                      zIndex: 0,
                      pointerEvents: 'none',
                      top: '-4px',
                      left: '-4px',
                      right: '-4px',
                      bottom: '-4px',
                    }}
                  />
                  <button
                    ref={earlyAccessButtonRef}
                    onClick={() => {
                      if (earlyAccessButtonRef.current) {
                        const rect = earlyAccessButtonRef.current.getBoundingClientRect();
                        const popupWidth = Math.min(448, window.innerWidth * 0.9);
                        const popupHeight = 400;
                        const spacing = 12;
                        
                        // Calculate position directly below button, aligned to left edge
                        let top = rect.bottom + spacing;
                        let left = rect.left;
                        
                        // Ensure popup stays within viewport horizontally
                        if (left + popupWidth > window.innerWidth - 20) {
                          left = window.innerWidth - popupWidth - 20;
                        }
                        
                        if (left < 20) {
                          left = 20;
                        }
                        
                        // If popup would go below viewport, adjust top position
                        if (top + popupHeight > window.innerHeight - 20) {
                          top = window.innerHeight - popupHeight - 20;
                        }
                        
                        setPopupPosition({ top, left });
                      }
                      setShowJoinPopup(true);
                    }}
                  className="relative inline-flex items-center justify-center rounded-lg bg-white text-gray-900 px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base font-normal shadow-sm hover:shadow md:shadow whitespace-nowrap z-10"
                  >
                    Join Early Access
                  </button>
                </div>
                <a
                  href="https://calendly.com/kp-nexbit/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg text-white px-2.5 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:text-base font-normal shadow-sm hover:shadow md:shadow whitespace-nowrap"
                  style={{ backgroundColor: '#564F4B' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                >
                  Contact
                </a>
              </div>
            </header>

          {/* Left Aligned Text Content - Centered Container */}
            <div className="text-left flex flex-col justify-center items-start gap-6 py-10 mt-16 md:mt-20 lg:mt-24 max-w-6xl mx-auto ml-8 md:ml-12 lg:ml-16">
            
            {/* Main Heading - Left Aligned */}
            <div className="mb-4">
                <div className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-[4.5rem] font-[3500] tracking-tight leading-tight font-clash-grotesk">
                Let your product do the talking 
              </div>
            </div>

            {/* Tagline */}
            <div
                  className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 font-light leading-relaxed text-gray-300 max-w-2xl"
              >
                Interactive demos built to engage, qualify, and convert up to 3× more prospects than your current funnel.
              </div>

              {/* Primary CTA Button with gradient strip effect */}
              <div className="relative inline-block">
                <div
                  className="absolute inset-0 rounded-xl opacity-20 blur-xl"
                  style={{
                    background: 'linear-gradient(118.05deg, rgba(10, 10, 13, 0), rgba(29, 62, 37, 0.8) 25%, rgba(49, 79, 29, 0.9) 54%, rgba(8, 40, 34, 0.8) 80%, rgba(10, 10, 13, 0))',
                  transform: 'scale(1.2)',
                  zIndex: 0,
                  pointerEvents: 'none',
                  top: '-10px',
                  left: '-10px',
                  right: '-10px',
                  bottom: '-10px',
                  borderRadius: '12px',
                }}
                />
            <button
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                const popupWidth = Math.min(448, window.innerWidth * 0.9);
                const popupHeight = 400;
                const spacing = 12;

                // Calculate position directly below button, aligned to left edge
                let top = rect.bottom + spacing;
                let left = rect.left;

                // Ensure popup stays within viewport horizontally
                if (left + popupWidth > window.innerWidth - 20) {
                  left = window.innerWidth - popupWidth - 20;
                }

                if (left < 20) {
                  left = 20;
                }

                // If popup would go below viewport, adjust top position
                if (top + popupHeight > window.innerHeight - 20) {
                  top = window.innerHeight - popupHeight - 20;
                }

                setPopupPosition({ top, left });
                setShowJoinPopup(true);
              }}
              className="relative inline-flex items-center justify-center rounded-lg bg-white text-gray-900 px-6 py-3 text-base font-medium shadow-sm hover:shadow z-10"
            >
              Join Early Access
            </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section (second page, just below hero) */}
      <section className="relative z-10 mt-16 sm:mt-20 lg:mt-24 mb-16 lg:mb-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16">
          <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
              {/* Static integration illustration image */}
              <div className="relative w-full max-w-md">
                <img
                  src={integrationTile}
                  alt="Integrations visualization"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 max-w-2xl w-full space-y-5 text-center lg:text-left lg:ml-4">
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-[0.4em] text-[#A386FF]">
                    Integrations
                  </p>
                  <h2 className="text-3xl sm:text-[2.3rem] lg:text-[3.1rem] font-clash-grotesk text-white leading-tight">
                    Integrate with more than 20+ apps in a snap.
                  </h2>
            </div>

                {/* Horizontal marquee row that stays within this box */}
                <div className="relative overflow-hidden mt-2 sm:mt-3">
                  <motion.div
                    className="flex gap-4 sm:gap-5"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{
                      duration: 25,
                      ease: 'linear',
                      repeat: Infinity,
                    }}
                  >
                    {[...integrationLogos, ...integrationLogos].map((logoSrc, idx) => (
                      <div
                        key={`${logoSrc}-${idx}`}
                        className="flex items-center justify-center"
                      >
                        <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.45)]">
                          <img
                            src={logoSrc}
                            alt="Integration logo"
                            className="max-h-10 sm:max-h-12 md:max-h-14 w-auto object-contain"
                            loading="lazy"
                />
              </div>
              </div>
                    ))}
                  </motion.div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Nexbit Section - Reliable. Scalable. Secure. */}
      <section className="relative overflow-hidden z-10 mt-32 sm:mt-40 lg:mt-48 mb-0 pb-16 sm:pb-24 lg:pb-28 min-h-screen">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: '#F5EEDC',
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16">
          <div className="rounded-[32px] p-6 sm:p-10 lg:p-14">
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
              {/* Left: headline + feature rows */}
              <div className="flex-1 space-y-10 text-[#14110F]">
                <h2 className="text-2xl sm:text-[2.3rem] lg:text-[2.8rem] font-clash-grotesk leading-tight flex flex-wrap md:flex-nowrap gap-3 items-center">
                  <span className="font-medium whitespace-nowrap">Reliable.</span>
                  <img src={reliableIcon} alt="Reliable icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">Scalable.</span>
                  <img src={scalableIcon} alt="Scalable icon" className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">Secure.</span>
                </h2>

                <div className="space-y-6">
                  {whyNexbitRows.map((row, idx) => (
                    <div
                      key={row.label}
                      className={`flex flex-col sm:flex-row items-start gap-4 pt-6 ${
                        idx === 0 ? 'border-t-0' : 'border-t border-[#E3D8C4]'
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:w-64">
                        <div
                          className="h-11 w-11 rounded-full flex items-center justify-center shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
                          style={{ backgroundColor: row.color }}
                        >
                          <img
                            src={row.icon}
                            alt={row.title}
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <p className="text-sm sm:text-base font-medium">{row.label}</p>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm sm:text-base font-semibold">{row.title}</p>
                        <p className="text-sm sm:text-[0.95rem] text-[#4D463F] leading-relaxed">
                          {row.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>

              {/* Right: abstract lock made of dots */}
              <div className="hidden lg:flex flex-1 items-center justify-center">
                <img
                  src={reliableSectionImage}
                  alt="Security lock composed of colored dots"
                  className="max-w-[520px] w-full h-auto object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards - 4 Quadrant Grid Design */}
      <section
        className="relative z-10 mb-0 lg:py-16 lg:py-24"
        style={{
          backgroundColor: '#F5EEDC',
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
      >
        <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 pb-14 lg:pb-20">
          {/* Mobile Layout - Stacked features */}
          <div className="md:hidden w-full space-y-6 sm:space-y-8">
            {/* Headline */}
            <div className="w-full px-1">
              <h2 className="text-xl sm:text-2xl font-clash-grotesk text-black leading-tight break-words">
                A funnel that converts
              </h2>
            </div>
            
            {/* Feature 1 */}
            <div className="w-full space-y-3 sm:space-y-4">
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src={featureCards[0].image}
                  alt={featureCards[0].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 px-1">
                <h3 className="text-base sm:text-lg font-clash-grotesk font-semibold text-[#14110F] leading-snug sm:leading-tight break-words">
                  {featureCards[0].title}
                </h3>
                <p className="text-sm sm:text-base text-[#4D463F] leading-relaxed break-words whitespace-normal">
                  {featureCards[0].body}
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="w-full space-y-3 sm:space-y-4">
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src={featureCards[1].image}
                  alt={featureCards[1].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 px-1">
                <h3 className="text-base sm:text-lg font-clash-grotesk font-semibold text-[#14110F] leading-snug sm:leading-tight break-words">
                  {featureCards[1].title}
                </h3>
                <p className="text-sm sm:text-base text-[#4D463F] leading-relaxed break-words whitespace-normal">
                  {featureCards[1].body}
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="w-full space-y-3 sm:space-y-4">
              <div className="relative w-full overflow-hidden rounded-lg" style={{ aspectRatio: '16 / 9' }}>
                <img
                  src={featureCards[2].image}
                  alt={featureCards[2].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="space-y-2 px-1">
                <h3 className="text-base sm:text-lg font-clash-grotesk font-semibold text-[#14110F] leading-snug sm:leading-tight break-words">
                  {featureCards[2].title}
                </h3>
                <p className="text-sm sm:text-base text-[#4D463F] leading-relaxed break-words whitespace-normal">
                  {featureCards[2].body}
                </p>
              </div>
            </div>
          </div>

          {/* Desktop Layout - 4 Quadrant Grid Container */}
          <div className="hidden md:block w-full max-w-6xl mx-auto">
            {/* Grid: 2x2 layout - Square on desktop */}
            <div className="w-full max-w-5xl mx-auto relative">
              <div className="grid grid-cols-2 md:[grid-template-rows:repeat(2,1fr)] border-l border-r border-black/20"
                style={{
                  backgroundColor: '#F5EEDC',
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                  aspectRatio: '1 / 1',
                  gap: '68px',
                  rowGap: '68px',
                }}
              >
              {/* Top Left: Headline */}
              <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-center items-start h-full w-full"
                style={{
                  backgroundColor: '#F5EEDC',
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              >
               
                <h2 className="text-2xl sm:text-3xl lg:text-[2.4rem] xl:text-[3rem] font-clash-grotesk text-black leading-tight">
                  A funnel that converts
                </h2>
              </div>

              {/* Top Right: First Feature */}
              <div className="relative flex flex-col overflow-hidden h-full w-full"
                style={{
                  backgroundColor: '#F5EEDC',
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              >
                {/* Image: 60% of height */}
                <div className="relative w-full overflow-hidden" style={{ height: '60%', backgroundColor: 'transparent' }}>
                  <img
                    src={featureCards[0].image}
                    alt={featureCards[0].title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                {/* Text: 40% of height */}
                <div className="pt-0 pl-2 sm:pl-3 lg:pl-4 pr-4 sm:pr-6 lg:pr-8 pb-4 sm:pb-6 lg:pb-8 flex flex-col justify-center overflow-hidden" style={{ height: '40%' }}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-clash-grotesk font-semibold text-[#14110F] leading-tight mb-2">
                    {featureCards[0].title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-[#4D463F] leading-relaxed line-clamp-2">
                    {featureCards[0].body}
                  </p>
                </div>
              </div>

              {/* Bottom Left: Third Feature */}
              <div className="relative flex flex-col overflow-hidden h-full w-full"
                style={{
                  backgroundColor: '#F5EEDC',
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              >
                {/* Image: 60% of height */}
                <div className="relative w-full overflow-hidden" style={{ height: '60%', backgroundColor: 'transparent' }}>
                  <img
                    src={featureCards[2].image}
                    alt={featureCards[2].title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                {/* Text: 40% of height */}
                <div className="pt-0 pl-2 sm:pl-3 lg:pl-4 pr-4 sm:pr-6 lg:pr-8 pb-4 sm:pb-6 lg:pb-8 flex flex-col justify-center overflow-hidden" style={{ height: '40%' }}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-clash-grotesk font-semibold text-[#14110F] leading-tight mb-2">
                    {featureCards[2].title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-[#4D463F] leading-relaxed line-clamp-2">
                    {featureCards[2].body}
                  </p>
                </div>
              </div>

              {/* Bottom Right: Second Feature */}
              <div className="relative flex flex-col overflow-hidden h-full w-full"
                style={{
                  backgroundColor: '#F5EEDC',
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              >
                {/* Image: 60% of height */}
                <div className="relative w-full overflow-hidden" style={{ height: '60%', backgroundColor: 'transparent' }}>
                  <img
                    src={featureCards[1].image}
                    alt={featureCards[1].title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
                {/* Text: 40% of height */}
                <div className="pt-0 pl-2 sm:pl-3 lg:pl-4 pr-4 sm:pr-6 lg:pr-8 pb-4 sm:pb-6 lg:pb-8 flex flex-col justify-center overflow-hidden" style={{ height: '40%' }}>
                  <h3 className="text-base sm:text-lg lg:text-xl font-clash-grotesk font-semibold text-[#14110F] leading-tight mb-2">
                    {featureCards[1].title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-[#4D463F] leading-relaxed line-clamp-2">
                    {featureCards[1].body}
                  </p>
                </div>
              </div>
              </div>
              {/* Single vertical divider line - positioned at right edge of left column */}
              <div 
                className="hidden md:block absolute top-0 bottom-0 w-px bg-black/20 pointer-events-none"
                style={{
                  left: 'calc(50% - 34px)',
                }}
              />
              {/* Single vertical divider line - positioned at left edge of right column */}
              <div 
                className="hidden md:block absolute top-0 bottom-0 w-px bg-black/20 pointer-events-none"
                style={{
                  left: 'calc(50% + 34px)',
                }}
              />
              {/* Single horizontal divider line - positioned at top of bigger square, extends full width */}
              <div 
                className="hidden md:block absolute h-px bg-black/20 pointer-events-none"
                style={{
                  top: '0',
                  left: '50%',
                  width: '100vw',
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Single horizontal divider line - positioned at bottom of top row, extends full width */}
              <div 
                className="hidden md:block absolute h-px bg-black/20 pointer-events-none"
                style={{
                  top: 'calc(50% - 34px)',
                  left: '50%',
                  width: '100vw',
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Single horizontal divider line - positioned at top of bottom row, extends full width */}
              <div 
                className="hidden md:block absolute h-px bg-black/20 pointer-events-none"
                style={{
                  top: 'calc(50% + 34px)',
                  left: '50%',
                  width: '100vw',
                  transform: 'translateX(-50%)',
                }}
              />
              {/* Single horizontal divider line - positioned at bottom of bigger square, extends full width */}
              <div 
                className="hidden md:block absolute h-px bg-black/20 pointer-events-none"
                style={{
                  bottom: '0',
                  left: '50%',
                  width: '100vw',
                  transform: 'translateX(-50%)',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="relative z-0 w-full"
        data-section="footer"
        style={{
          backgroundColor: '#1A4923'
        }}
      >
        {/* Main Footer Content */}
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 py-14 md:py-18">
          <div className="w-full">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            {/* Left Column - Brand Information */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start gap-3">
              <img src={logoSrc} alt="Nexbit Logo" className="w-12 h-12 rounded-[2px] object-cover" />
              <div className="font-clash-grotesk font-medium text-xl text-white">Nexbit</div>
              <p className="text-white/60 text-sm mt-2">© 2025 Logikeon Labs Private Limited. All rights reserved.</p>
            </div>

            {/* Right Column - Back to Top & Links */}
            <div className="text-center md:text-right space-y-3">
              <a href="#page-root" onClick={scrollToTop} className="text-white/80 hover:text-white inline-flex items-center gap-1 justify-center md:justify-end cursor-pointer">
                Back to top
                <span>↑</span>
              </a>
              <a href="https://www.linkedin.com/company/nexbit-ai/" target="_blank" rel="noopener noreferrer" className="block text-white/80 hover:text-white">LinkedIn</a>
              <a href="https://x.com/NexbitAi" className="block text-white/80 hover:text-white">X</a>
            </div>
          </div>
        </div>
        </div>
      </footer>

      {/* End of Page - NEXBIT */}
      <div
        className="relative z-0 w-full mt-[-2rem] md:mt-[-3rem]"
        style={{
          backgroundColor: '#1A4923'
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 pt-0 md:pt-0 pb-0 md:pb-0">
          <div className="text-center overflow-hidden">
            <h1 
              className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[16rem] xl:text-[20rem] 2xl:text-[24rem] font-clash-grotesk font-bold italic tracking-tight leading-none transform translate-y-[10%] md:translate-y-[32%]"
              style={{
                fontFamily: '\'Clash Grotesk\', sans-serif',
                background: 'linear-gradient(to bottom, rgba(245,238,220,0.2) 0%, rgba(245,238,220,0.4) 20%, rgba(245,238,220,0.7) 50%, rgba(245,238,220,0.9) 80%, rgba(245,238,220,1) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              NEXBIT
            </h1>
          </div>
        </div>
      </div>

      {/* Docked Chat overlay (disabled) */}
      <AnimatePresence>
        {false && showChatBox && (
          <motion.div
            key="chat-backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleCloseChat}
          />
        )}
      </AnimatePresence>

      {/* Docked Chat Bar (hidden) */}
      <div className="hidden fixed inset-0 md:inset-x-0 md:bottom-0 md:top-auto bottom-4 md:bottom-10 z-50 px-0 md:px-6 pointer-events-none">
        <AnimatePresence initial={false}>
          {showChatBox ? (
            <motion.div
              key="chat-expanded"
              className="w-full h-full md:mx-auto md:w-full md:max-w-4xl md:h-auto pointer-events-auto"
              ref={chatPanelRef}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <div className="relative h-full md:h-auto">
                <motion.div 
                  layoutId="docked-chat-shell"
                  className="h-full md:h-auto md:rounded-2xl border-0 md:border border-gray-100 shadow-[0_25px_60px_rgba(15,15,15,0.18)] overflow-hidden relative bg-white"
                  transition={{ 
                    layout: {
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 35,
                      mass: 0.7
                    }
                  }}
                >
                  <div className="flex flex-col h-full md:h-[650px] relative z-10">
                  <div className="flex items-center justify-between gap-4 px-5 py-2 border-b border-gray-100 bg-white/95">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-1xl overflow-hidden flex items-center justify-center shadow-inner bg-gray-100">
                        <img 
                          src={chatbotAvatar} 
                          alt="Chatbot avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-base text-gray-900">Nex</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleCloseChat}
                      className="w-9 h-9 rounded-full bg-white hover:bg-gray-50 flex items-center justify-center transition"
                      aria-label="Minimize chat"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </motion.button>
                  </div>
                  <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
                    {isIntroActive && (
                      <div className="space-y-3" ref={introBlockRef}>
                        <motion.div
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="max-w-[85%] rounded-2xl px-4 py-3 text-sm text-black"
                        >
                          Hi there! I'm Nexbit the AI SDR Agent. I'm here to help answer any questions you may have. How can I help you today?
                        </motion.div>
                      </div>
                    )}
                    {chatMessages.map((msg, index) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2.5 text-sm ${
                            msg.type === 'user' ? 'text-gray-900 rounded-xl' : 'text-black rounded-2xl'
                          }`}
                          style={{
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontWeight: 300,
                            ...(msg.type === 'user' ? { backgroundColor: '#F2F2F2' } : {}),
                          }}
                        >
                          {msg.type === 'system' ? (
                            <SystemMessageBubble text={msg.message} cta={msg.cta} normalizeUrl={normalizeUrl} onTextUpdate={scrollToBottom} />
                          ) : (
                            msg.message
                          )}
                        </div>
                      </motion.div>
                    ))}
                    {isLoadingMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm text-black">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {voiceError && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200">
                          <p className="font-medium">Voice Error</p>
                          <p className="text-xs mt-1">{voiceError}</p>
                        </div>
                      </motion.div>
                    )}
                    {voiceConversationText && isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm text-gray-700 bg-blue-50 border border-blue-200">
                          <p className="text-xs font-medium mb-1">Voice conversation:</p>
                          <p>{voiceConversationText}</p>
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
                            className="px-3 py-1.5 text-xs rounded-full transition-colors text-gray-800 bg-white shadow-sm"
                          >
                            {question}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                  <motion.div 
                    layoutId="input-form-container"
                    layout="position"
                    className="px-2 py-2 border-t border-gray-100 bg-white relative z-20" 
                    transition={{ duration: 0 }}
                  >
                    <motion.form
                      layout={false}
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (searchInput.trim()) {
                          handleSendMessage(searchInput.trim());
                        }
                      }}
                      className="flex flex-col gap-1 w-full"
                    >
                      <div className="flex items-stretch gap-1 w-full">
                        <div className="flex items-center justify-center flex-shrink-0">
                          <motion.button
                            type="button"
                            layout={false}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center justify-center rounded-2xl w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-100 shadow-sm border-[6px] relative overflow-visible"
                            style={{
                              borderColor: isRecording ? '#ef4444' : '#564F4B',
                              backgroundColor: isRecording ? '#fee2e2' : 'white',
                            }}
                            aria-label={isRecording ? "Stop voice input" : "Start voice input"}
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isRecording) {
                                stopVoiceRecording();
                                disconnectVoiceAgent();
                              } else {
                                try {
                                  await startVoiceRecording();
                                } catch (error) {
                                  console.error('Failed to start voice recording:', error);
                                }
                              }
                            }}
                          >
                            {voiceAgentState === 'connecting' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-[#564F4B] border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                            {voiceAgentState === 'recording' && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* Listening/Recording effect - Red pulsing circle with ripple */}
                                <div className="relative">
                                  <div className="w-12 h-12 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                  <div className="absolute inset-0 w-12 h-12 bg-red-400 rounded-full animate-ping opacity-75" />
                                  <div className="absolute inset-0 w-12 h-12 bg-red-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                </div>
                              </div>
                            )}
                            {voiceAgentState === 'playing' && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* Computer speaking effect - Blue animated sound waves */}
                                <div className="relative flex items-end justify-center gap-1 h-10">
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '35%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '60%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.2s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '100%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.4s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '60%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.6s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '35%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.8s'
                                  }} />
                                </div>
                                <style>{`
                                  @keyframes soundWave {
                                    0%, 100% { 
                                      transform: scaleY(0.2); 
                                      opacity: 0.6; 
                                    }
                                    50% { 
                                      transform: scaleY(1); 
                                      opacity: 1; 
                                    }
                                  }
                                `}</style>
                              </div>
                            )}
                            <svg
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${voiceAgentState === 'connecting' || voiceAgentState === 'recording' || voiceAgentState === 'playing' ? 'opacity-0' : 'opacity-100'}`}
                              viewBox="0 0 40 40"
                              xmlns="http://www.w3.org/2000/svg"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <rect
                                x="4"
                                y="0"
                                width="32"
                                height="40"
                                rx="8"
                                fill="#FFFFFF"
                              />
                              <g fill="#564F4B">
                                {/* Mic head - 5 rows of 3 dots with extra vertical spacing */}
                                <circle cx="13" cy="6" r="1.6" />
                                <circle cx="20" cy="6" r="1.6" />
                                <circle cx="27" cy="6" r="1.6" />

                                <circle cx="13" cy="11" r="1.6" />
                                <circle cx="20" cy="11" r="1.6" />
                                <circle cx="27" cy="11" r="1.6" />

                                <circle cx="13" cy="16" r="1.6" />
                                <circle cx="20" cy="16" r="1.6" />
                                <circle cx="27" cy="16" r="1.6" />

                                <circle cx="13" cy="21" r="1.6" />
                                <circle cx="20" cy="21" r="1.6" />
                                <circle cx="27" cy="21" r="1.6" />

                                <circle cx="13" cy="26" r="1.6" />
                                <circle cx="20" cy="26" r="1.6" />
                                <circle cx="27" cy="26" r="1.6" />

                                {/* Mic stand - single vertical dot */}
                                <circle cx="20" cy="31" r="1.6" />

                                {/* Mic base - 3 dots */}
                                <circle cx="13" cy="35" r="1.6" />
                                <circle cx="20" cy="35" r="1.6" />
                                <circle cx="27" cy="35" r="1.6" />
                              </g>
                            </svg>
                          </motion.button>
                        </div>
                        <div className="flex-1 flex flex-col min-w-0">
                          <div className="relative bg-white rounded-lg flex items-center min-h-[2.5rem]">
                          <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Ask me anything about Nexbit..."
                            disabled={isLoadingMessage}
                            className="w-full rounded-lg pl-2.5 pr-12 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0"
                          />
                          <motion.button
                            layoutId="send-button"
                            layout={false}
                            type="submit"
                            disabled={isLoadingMessage || !searchInput.trim()}
                            whileHover={{ scale: searchInput.trim() && !isLoadingMessage ? 1.03 : 1 }}
                            whileTap={{ scale: searchInput.trim() && !isLoadingMessage ? 0.97 : 1 }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md text-white w-8 h-8 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                            style={{ backgroundColor: '#564F4B' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                            aria-label="Send message"
                            transition={{ duration: 0 }}
                          >
                            <svg 
                              className="w-3 h-3" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </motion.button>
                      </div>
                      <motion.div 
                        layoutId="suggested-buttons-container"
                        className="flex gap-1.5 items-center px-1 pt-1.5 pb-0.5 flex-wrap"
                        transition={{ duration: 0 }}
                      >
                        <motion.button
                          type="button"
                          layout={false}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("Why Nexbit?")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                          Why Nexbit?
                        </motion.button>
                        <motion.button
                          type="button"
                          layout={false}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("Tell me about pricing")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                          Tell me about pricing
                        </motion.button>
                        <motion.button
                          type="button"
                          layout={false}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("How fast can we go live?")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                        How fast can we go live?
                      </motion.button>
                        <motion.button
                          type="button"
                          layout={false}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("List some of your features")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                        List some of your features
                      </motion.button>
                      </motion.div>
                        </div>
                      </div>
                    </motion.form>
                  </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-collapsed"
              className="mx-auto w-full max-w-4xl pointer-events-auto absolute bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ duration: 0 }}
            >
              <div className="relative overflow-visible">
                {isCollapsedTipActive && !hasInteractedWithChat && (
                  <motion.div
                    className="absolute left-3 -top-24 sm:-top-20 md:-top-16 flex justify-start pointer-events-none select-none z-30"
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <motion.div
                      className="relative w-auto rounded-[28px] bg-white/95 px-6 py-3 text-sm text-gray-900 shadow-2xl border border-gray-200"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className="absolute left-6 bottom-0 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-gray-200"></div>
                      <div className="absolute left-[26px] bottom-0 translate-y-full w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[7px] border-t-white/95"></div>
                      Everything you see on the site, Nex can explain it better.
                    </motion.div>
                  </motion.div>
                )}
                <motion.div 
                  layoutId="docked-chat-shell"
                  className="rounded-2xl border border-gray-200 shadow-[0_15px_45px_rgba(15,15,15,0.12)] relative bg-white"
                  transition={{ 
                    layout: {
                      type: 'spring', 
                      stiffness: 200, 
                      damping: 35,
                      mass: 0.7
                    }
                  }}
                >
                  <div className="px-3 py-3 min-h-[100px] md:min-h-[90px] flex flex-col justify-end relative z-10">
                  </div>
                </motion.div>
                
                {!isTransitioning && !showChatBox && (
                  <motion.div 
                    layoutId="input-form-container"
                    layout="position"
                    className="absolute inset-0 flex flex-col justify-end px-2 py-2 z-20"
                    style={{ 
                      pointerEvents: isTransitioning ? 'none' : 'auto',
                      opacity: isTransitioning ? 0 : 1,
                      transition: 'opacity 0.1s'
                    }}
                    transition={{ duration: 0 }}
                  >
                    <div className="w-full">
                      <div className="flex items-stretch gap-1 w-full">
                        <div className="flex items-center justify-center flex-shrink-0">
                          <motion.button
                            type="button"
                            layout={false}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center justify-center rounded-3xl w-16 h-16 sm:w-20 sm:h-20 bg-white text-gray-100 shadow-sm border-[1px] relative overflow-visible"
                            style={{
                              borderColor: isRecording ? '#ef4444' : '#564F4B',
                              backgroundColor: isRecording ? '#fee2e2' : 'white',
                            }}
                            aria-label={isRecording ? "Stop voice input" : "Start voice input"}
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (isRecording) {
                                stopVoiceRecording();
                                disconnectVoiceAgent();
                              } else {
                                try {
                                  await startVoiceRecording();
                                } catch (error) {
                                  console.error('Failed to start voice recording:', error);
                                }
                              }
                            }}
                          >
                            {voiceAgentState === 'connecting' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-[#564F4B] border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                            {voiceAgentState === 'recording' && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* Listening/Recording effect - Red pulsing circle with ripple */}
                                <div className="relative">
                                  <div className="w-12 h-12 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                  <div className="absolute inset-0 w-12 h-12 bg-red-400 rounded-full animate-ping opacity-75" />
                                  <div className="absolute inset-0 w-12 h-12 bg-red-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.5s' }} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  </div>
                                </div>
                              </div>
                            )}
                            {voiceAgentState === 'playing' && (
                              <div className="absolute inset-0 flex items-center justify-center z-10">
                                {/* Computer speaking effect - Blue animated sound waves */}
                                <div className="relative flex items-end justify-center gap-1 h-10">
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '35%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '60%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.2s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '100%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.4s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '60%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.6s'
                                  }} />
                                  <div className="w-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50" style={{ 
                                    height: '35%',
                                    animation: 'soundWave 0.8s ease-in-out infinite',
                                    animationDelay: '0.8s'
                                  }} />
                                </div>
                                <style>{`
                                  @keyframes soundWave {
                                    0%, 100% { 
                                      transform: scaleY(0.2); 
                                      opacity: 0.6; 
                                    }
                                    50% { 
                                      transform: scaleY(1); 
                                      opacity: 1; 
                                    }
                                  }
                                `}</style>
                              </div>
                            )}
                            <svg
                              className={`w-10 h-10 sm:w-12 sm:h-12 ${voiceAgentState === 'connecting' || voiceAgentState === 'recording' || voiceAgentState === 'playing' ? 'opacity-0' : 'opacity-100'}`}
                              viewBox="0 0 40 40"
                              xmlns="http://www.w3.org/2000/svg"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <rect
                                x="4"
                                y="0"
                                width="32"
                                height="40"
                                rx="8"
                                fill="#FFFFFF"
                              />
                              <g fill="#564F4B">
                                {/* Mic head - 5 rows of 3 dots with extra vertical spacing */}
                                <circle cx="13" cy="6" r="1.6" />
                                <circle cx="20" cy="6" r="1.6" />
                                <circle cx="27" cy="6" r="1.6" />

                                <circle cx="13" cy="11" r="1.6" />
                                <circle cx="20" cy="11" r="1.6" />
                                <circle cx="27" cy="11" r="1.6" />

                                <circle cx="13" cy="16" r="1.6" />
                                <circle cx="20" cy="16" r="1.6" />
                                <circle cx="27" cy="16" r="1.6" />

                                <circle cx="13" cy="21" r="1.6" />
                                <circle cx="20" cy="21" r="1.6" />
                                <circle cx="27" cy="21" r="1.6" />

                                <circle cx="13" cy="26" r="1.6" />
                                <circle cx="20" cy="26" r="1.6" />
                                <circle cx="27" cy="26" r="1.6" />

                                {/* Mic stand - single vertical dot */}
                                <circle cx="20" cy="31" r="1.6" />

                                {/* Mic base - 3 dots */}
                                <circle cx="13" cy="35" r="1.6" />
                                <circle cx="20" cy="35" r="1.6" />
                                <circle cx="27" cy="35" r="1.6" />
                              </g>
                            </svg>
                          </motion.button>
                        </div>
                        <div className="flex-1 flex flex-col min-w-0 relative bg-white rounded-lg border-0 overflow-hidden">
                          <div className="relative flex items-center py-2">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          onFocus={() => setHasInteractedWithChat(true)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && searchInput.trim()) {
                              e.preventDefault();
                              handleStartChat();
                            }
                          }}
                          placeholder="Ask me anything about Nexbit..."
                          className="w-full rounded-lg pl-2.5 pr-[5%] py-0 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent border-0"
                        />
                    </div>
                    <motion.div 
                      layoutId="suggested-buttons-container"
                      className="flex gap-1.5 items-center px-1 pr-[5%] pt-1.5 pb-0.5 flex-wrap"
                      transition={{ duration: 0 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("Why Nexbit?")}
                        className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                      >
                        Why Nexbit?
                      </motion.button>
                      {/* <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("Tell me about pricing")}
                        className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                      >
                        Tell me about pricing
                      </motion.button> */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSendMessage("How fast can we go live?")}
                        className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-800 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                      >
                        How fast can we go live?
                      </motion.button>
                    </motion.div>
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-[5%] flex items-center justify-center rounded-r-lg"
                      style={{ backgroundColor: '#564F4B' }}
                    >
                      <motion.button
                        layoutId="send-button"
                        whileHover={{ scale: searchInput.trim() ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleStartChat}
                        disabled={!searchInput.trim()}
                        className="flex items-center justify-center text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Send message"
                        transition={{ duration: 0 }}
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.button>
                    </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    </>
  );
}
