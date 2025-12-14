import { useEffect, useState, useRef, useCallback } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage, type ChatCta } from '../api/chatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import chatbotAvatar from '../assets/logo_fresh.jpg';

type ChatMessage = { id: string; type: 'user' | 'system'; message: string; cta?: ChatCta | null; suggestedDemo?: number | null };

const createMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Demo metadata with keywords for smart routing
interface DemoMetadata {
  id: number;
  title: string;
  description: string;
  videoPath: string;
  duration: string;
  keywords: string[];
  segments: { 
    name: string; 
    startTime: number; 
    endTime: number;
    askAboutPrompt?: string; // Question to ask about this segment
  }[];
}

const demos: DemoMetadata[] = [
  {
    id: 0,
    title: 'Platform Overview',
    description: 'Get a comprehensive introduction to our platform',
    videoPath: '/assets/demobuilder/demo1.mov',
    duration: '3:45',
    keywords: ['overview', 'introduction', 'platform', 'features', 'getting started', 'basics'],
    segments: [
      { name: 'Introduction', startTime: 0, endTime: 45, askAboutPrompt: 'Tell me more about the platform' },
      { name: 'Core Features', startTime: 45, endTime: 120, askAboutPrompt: 'What are the key features?' },
      { name: 'Dashboard Tour', startTime: 120, endTime: 225, askAboutPrompt: 'Show me the dashboard' },
    ],
  },
  {
    id: 1,
    title: 'Pricing & Plans',
    description: 'Explore our pricing structure and subscription plans',
    videoPath: '/assets/demobuilder/demo2.mov',
    duration: '2:30',
    keywords: ['pricing', 'plans', 'subscription', 'cost', 'billing', 'payment', 'tiers'],
    segments: [
      { name: 'Pricing Overview', startTime: 0, endTime: 60, askAboutPrompt: 'Tell me about pricing' },
      { name: 'Plan Comparison', startTime: 60, endTime: 120, askAboutPrompt: 'Compare the plans' },
      { name: 'Billing Options', startTime: 120, endTime: 150, askAboutPrompt: 'What are the billing options?' },
    ],
  },
  {
    id: 2,
    title: 'Integration Setup',
    description: 'Learn how to integrate with your existing tools',
    videoPath: '/assets/demobuilder/demo3.mov',
    duration: '4:15',
    keywords: ['integration', 'setup', 'connect', 'api', 'webhook', 'crm', 'tools', 'connectivity'],
    segments: [
      { name: 'Integration Hub', startTime: 0, endTime: 90, askAboutPrompt: 'How do integrations work?' },
      { name: 'API Configuration', startTime: 90, endTime: 180, askAboutPrompt: 'Tell me about API setup' },
      { name: 'Testing & Validation', startTime: 180, endTime: 255, askAboutPrompt: 'How do I test integrations?' },
    ],
  },
  {
    id: 3,
    title: 'Advanced Features',
    description: 'Discover advanced capabilities and customization',
    videoPath: '/assets/demobuilder/demo4.mov',
    duration: '5:00',
    keywords: ['advanced', 'customization', 'automation', 'workflows', 'enterprise', 'power user'],
    segments: [
      { name: 'Workflow Builder', startTime: 0, endTime: 120, askAboutPrompt: 'What are the advanced features?' },
      { name: 'Custom Rules', startTime: 120, endTime: 210, askAboutPrompt: 'How do custom rules work?' },
      { name: 'Enterprise Features', startTime: 210, endTime: 300, askAboutPrompt: 'Tell me about enterprise features' },
    ],
  },
  {
    id: 4,
    title: 'Security & Compliance',
    description: 'Learn about our security measures and compliance standards',
    videoPath: '/assets/demobuilder/demo1.mov',
    duration: '3:20',
    keywords: ['security', 'compliance', 'data protection', 'encryption', 'gdpr', 'soc2'],
    segments: [
      { name: 'Security Overview', startTime: 0, endTime: 60, askAboutPrompt: 'Tell me about security' },
      { name: 'Compliance Standards', startTime: 60, endTime: 140, askAboutPrompt: 'What compliance standards do you meet?' },
      { name: 'Data Protection', startTime: 140, endTime: 200, askAboutPrompt: 'How is data protected?' },
    ],
  },
  {
    id: 5,
    title: 'Analytics & Reporting',
    description: 'Explore powerful analytics and reporting capabilities',
    videoPath: '/assets/demobuilder/demo2.mov',
    duration: '4:00',
    keywords: ['analytics', 'reporting', 'insights', 'metrics', 'dashboard', 'data'],
    segments: [
      { name: 'Analytics Dashboard', startTime: 0, endTime: 90, askAboutPrompt: 'Show me the analytics' },
      { name: 'Custom Reports', startTime: 90, endTime: 180, askAboutPrompt: 'How do I create reports?' },
      { name: 'Data Export', startTime: 180, endTime: 240, askAboutPrompt: 'Can I export data?' },
    ],
  },
];

const SystemMessageBubble: React.FC<{
  text: string;
  cta?: ChatCta | null;
  normalizeUrl: (raw: string) => string;
  onTextUpdate?: () => void;
  suggestedDemo?: number | null;
  onDemoSelect?: (demoId: number) => void;
}> = ({ text, cta, normalizeUrl, onTextUpdate, suggestedDemo, onDemoSelect }) => {
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
      if (onTextUpdate) {
        onTextUpdate();
      }
      if (index >= text.length) {
        window.clearInterval(intervalId);
        setIsComplete(true);
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
      {isComplete && suggestedDemo !== null && suggestedDemo !== undefined && onDemoSelect && (
        <div className="mt-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 mb-2">
            💡 Suggested Demo
          </p>
          <p className="text-sm font-semibold text-gray-900 mb-1">
            {demos[suggestedDemo]?.title}
          </p>
          <p className="text-xs text-gray-600 mb-3">
            {demos[suggestedDemo]?.description}
          </p>
          <button
            onClick={() => onDemoSelect(suggestedDemo)}
            className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Watch This Demo →
          </button>
        </div>
      )}
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

// Smart routing function - analyzes message to suggest relevant demo
const suggestDemoFromMessage = (message: string): number | null => {
  const lowerMessage = message.toLowerCase();
  let bestMatch = { index: -1, score: 0 };

  demos.forEach((demo, index) => {
    const score = demo.keywords.reduce((acc, keyword) => {
      if (lowerMessage.includes(keyword)) {
        return acc + 1;
      }
      return acc;
    }, 0);

    if (score > bestMatch.score) {
      bestMatch = { index, score };
    }
  });

  return bestMatch.score > 0 ? bestMatch.index : null;
};

export function DemoBuilderPage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Background music
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => {
    const saved = localStorage.getItem('demoBuilderMusicEnabled');
    return saved === 'true';
  });
  const musicRef = useRef<HTMLAudioElement>(null);
  
  // Progress tracking
  const [watchedDemos, setWatchedDemos] = useState<Set<number>>(new Set());
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('demoBuilderRole'));
  const [showRoleSelector, setShowRoleSelector] = useState(!userRole);
  const [hasReturned, setHasReturned] = useState(localStorage.getItem('demoBuilderReturned') === 'true');
  
  // Chat state
  const [searchInput, setSearchInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [hasInteractedWithChat, setHasInteractedWithChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);

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
      onConversationText: (text) => {},
      onError: (error) => {
        console.error('[VoiceAgent] Error:', error);
      },
      onStateChange: (state) => {},
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

  const isIntroActive = chatMessages.length === 0;

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  // Background music control
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;

    music.volume = 0.2; // Soft background music at 20% volume
    music.loop = true;

    if (isMusicPlaying) {
      const playPromise = music.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Background music autoplay prevented:', error);
          // Music will play when user interacts with the page
        });
      }
    } else {
      music.pause();
    }
  }, [isMusicPlaying]);

  // Start music on first user interaction if enabled
  useEffect(() => {
    if (!isMusicPlaying) return;

    const handleFirstInteraction = () => {
      const music = musicRef.current;
      if (music && music.paused) {
        music.play().catch(() => {
          // Ignore autoplay errors
        });
      }
      // Remove listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isMusicPlaying]);

  // Save music preference to localStorage
  useEffect(() => {
    localStorage.setItem('demoBuilderMusicEnabled', isMusicPlaying.toString());
  }, [isMusicPlaying]);

  const toggleMusic = () => {
    setIsMusicPlaying(prev => !prev);
  };

  // Video time tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setVideoDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [currentVideoIndex]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    const suggestedDemo = suggestDemoFromMessage(userMessage);
    
    setChatMessages(prev => [...prev, { 
      id: createMessageId(), 
      type: 'user', 
      message: userMessage 
    }]);
    setSearchInput('');
    setIsLoadingMessage(true);
    setHasInteractedWithChat(true);
    
    try {
      const response = await sendChatMessage(userMessage, sessionId || undefined);
      
      if (response.session_id) {
        setSessionId(response.session_id);
      }
      
      setChatMessages(prev => [...prev, { 
        id: createMessageId(),
        type: 'system', 
        message: response.response,
        cta: response.cta ?? null,
        suggestedDemo: suggestedDemo,
      }]);
    } catch (error) {
      console.error('Error sending chat message:', error);
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
    if (searchInput.trim()) {
      handleSendMessage(searchInput.trim());
      return;
    }

    setChatMessages([]);
    setSessionId(null);
    setHasInteractedWithChat(true);
  };

  // Video controls
  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handlePreviousVideo = () => {
    const newIndex = (currentVideoIndex - 1 + demos.length) % demos.length;
    handleVideoSelect(newIndex);
  };

  const handleNextVideo = () => {
    const newIndex = (currentVideoIndex + 1) % demos.length;
    handleVideoSelect(newIndex);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Mark demo as watched when video ends
    setWatchedDemos(prev => new Set([...prev, currentVideoIndex]));
  };

  // Track watched demos when video reaches 80% completion
  useEffect(() => {
    if (videoDuration > 0 && currentTime > 0 && currentTime / videoDuration >= 0.8) {
      setWatchedDemos(prev => new Set([...prev, currentVideoIndex]));
    }
  }, [currentTime, videoDuration, currentVideoIndex]);

  // Load watched demos from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('demoBuilderWatched');
    if (saved) {
      try {
        const watched = JSON.parse(saved);
        setWatchedDemos(new Set(watched));
      } catch (e) {
        console.error('Error loading watched demos:', e);
      }
    }
    
    const returned = localStorage.getItem('demoBuilderReturned');
    if (returned === 'true') {
      setHasReturned(true);
    }
  }, []);

  // Save watched demos to localStorage
  useEffect(() => {
    if (watchedDemos.size > 0) {
      localStorage.setItem('demoBuilderWatched', JSON.stringify([...watchedDemos]));
    }
  }, [watchedDemos]);

  // Set body and html background color to match page
  useEffect(() => {
    const originalBodyBackground = document.body.style.backgroundColor;
    const originalHtmlBackground = document.documentElement.style.backgroundColor;
    
    document.body.style.backgroundColor = '#F5EEDC';
    document.documentElement.style.backgroundColor = '#F5EEDC';
    
    return () => {
      document.body.style.backgroundColor = originalBodyBackground;
      document.documentElement.style.backgroundColor = originalHtmlBackground;
    };
  }, []);

  const handleRoleSelect = (role: string) => {
    setUserRole(role);
    setShowRoleSelector(false);
    localStorage.setItem('demoBuilderRole', role);
    
    // Route to appropriate demo based on role
    if (role === 'tech') {
      // Tech users might want to see Integration Setup first
      handleVideoSelect(2);
    } else if (role === 'non-tech') {
      // Non-tech users might want Platform Overview first
      handleVideoSelect(0);
    }
  };

  const handleContinueWhereLeftOff = () => {
    // Find first unwatched demo
    const unwatched = demos.findIndex((_, idx) => !watchedDemos.has(idx));
    if (unwatched !== -1) {
      handleVideoSelect(unwatched);
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimelineSegmentClick = (segmentIndex: number) => {
    const segment = demos[currentVideoIndex].segments[segmentIndex];
    if (videoRef.current && segment) {
      videoRef.current.currentTime = segment.startTime;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleDemoSelectFromChat = (demoId: number) => {
    handleVideoSelect(demoId);
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const currentDemo = demos[currentVideoIndex];
  const progress = videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0;

  return (
    <>
      {/* Background Music */}
      <audio
        ref={musicRef}
        src="/assets/demobuilder/background-music.mp3"
        preload="auto"
        loop
      />

      <div id="page-root" className="min-h-screen relative overflow-hidden font-sf-pro overscroll-y-contain" data-name="page-root" style={{ backgroundColor: '#F5EEDC', minHeight: '100vh' }}>
        {/* Fixed base background */}
        <div
          className="fixed inset-0 -z-10"
          data-name="global-background"
          style={{
            backgroundColor: '#F5EEDC',
          }}
        >
          {/* Grain texture overlay */}
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
        </div>

        {/* Split-Screen Layout: Video (60%) + Chat (40%) */}
        <section className="relative z-10 h-screen flex flex-col lg:flex-row w-full pt-8 pb-8 px-12 gap-2 lg:gap-3">
          {/* Music Toggle Button - Fixed Position */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusic}
            className="fixed top-4 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all"
            style={{ backgroundColor: '#564F4B' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
            aria-label={isMusicPlaying ? 'Mute background music' : 'Play background music'}
          >
            {isMusicPlaying ? (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M6.343 6.343l11.314 11.314M6.343 17.657L17.657 6.343" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
          </motion.button>

          {/* Left Side - Video Player (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col gap-2 lg:gap-3 overflow-hidden">
            {/* Progress Indicator */}
            {watchedDemos.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200 flex-shrink-0 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#564F4B' }}>
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        You've watched {watchedDemos.size}/{demos.length} demos — keep going! 🚀
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-32 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${(watchedDemos.size / demos.length) * 100}%`, backgroundColor: '#564F4B' }}
                          />
                        </div>
                        <span className="text-xs text-gray-600">{Math.round((watchedDemos.size / demos.length) * 100)}% complete</span>
                      </div>
                    </div>
                  </div>
                  {watchedDemos.size === demos.length && (
                    <div className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: '#564F4B' }}>
                      All Complete! 🎉
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Video Player */}
            <div className="relative w-full flex-1 min-h-0 bg-black rounded-xl overflow-hidden shadow-xl">
              <video
                ref={videoRef}
                src={currentDemo.videoPath}
                className="w-full h-full object-contain"
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                playsInline
              />
              
              {/* Play/Pause Button (Center) */}
              <button
                onClick={handlePlayPause}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center transition-all hover:scale-110"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 lg:w-6 lg:h-6 text-gray-900 ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Video Info */}
              <div className="absolute bottom-2 left-2 z-20 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] lg:text-xs">
                <p className="font-semibold">{currentDemo.title}</p>
                <p className="text-white/70">{currentDemo.duration}</p>
              </div>

              {/* "Ask about this" Floating Buttons */}
              <AnimatePresence>
                {(() => {
                  // Find the current active segment
                  const activeSegment = currentDemo.segments.find(
                    segment => currentTime >= segment.startTime && currentTime < segment.endTime
                  );
                  
                  if (!activeSegment || !activeSegment.askAboutPrompt || !isPlaying) return null;
                  
                  // Show button after 3 seconds in segment
                  const timeInSegment = currentTime - activeSegment.startTime;
                  if (timeInSegment < 3) return null;
                  
                  return (
                    <motion.button
                      key={`ask-about-${activeSegment.name}`}
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleSendMessage(activeSegment.askAboutPrompt!);
                      }}
                      className="absolute right-4 top-1/4 z-30 px-4 py-2 text-white rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all"
                      style={{ backgroundColor: '#564F4B' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      Ask about this
                    </motion.button>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Demo Preview Cards */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1.5 border border-gray-200 flex-shrink-0 shadow-sm">
              <h3 className="text-[10px] lg:text-xs font-semibold text-gray-900 mb-1">Available Demos</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5">
                {demos.map((demo, index) => (
                  <button
                    key={demo.id}
                    onClick={() => handleVideoSelect(index)}
                    className={`relative aspect-[4/3] rounded-md overflow-hidden transition-all ${
                      currentVideoIndex === index
                        ? 'ring-1.5 scale-105 border-1.5'
                        : 'opacity-70 hover:opacity-100 hover:scale-102'
                    }`}
                    style={currentVideoIndex === index ? { borderColor: '#564F4B', boxShadow: '0 0 0 1.5px #564F4B' } : {}}
                  >
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center border border-gray-200">
                      <div className="text-center p-1">
                        <div className="w-5 h-5 mx-auto mb-0.5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#564F4B' }}>
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                        <p className="text-[9px] font-semibold text-gray-900 leading-tight">{demo.title}</p>
                        <p className="text-[8px] text-gray-600 mt-0.5">{demo.duration}</p>
                      </div>
                    </div>
                    {currentVideoIndex === index && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(86, 79, 75, 0.1)' }}>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#564F4B' }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Chat (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col min-w-0">
            <div className="flex-1 bg-white rounded-xl shadow-xl overflow-hidden flex flex-col min-h-0">
              {/* Chat Header */}
              <div className="flex items-center justify-between gap-2 lg:gap-3 px-3 lg:px-4 py-2 border-b border-gray-100 bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-inner bg-gray-100">
                    <img 
                      src={chatbotAvatar} 
                      alt="Chatbot avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-base text-gray-900">Nex</p>
                    <p className="text-xs text-gray-500">AI Demo Assistant</p>
                  </div>
                </div>
                <motion.a
                  href="https://calendly.com/kp-nexbit/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center justify-center rounded-md text-white px-2 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs font-medium shadow-sm hover:shadow transition-all whitespace-nowrap"
                  style={{ backgroundColor: '#564F4B' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                >
                  Book Full Demo
                  <svg
                    className="ml-1 w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0-6-6m6 6-6 6" />
                  </svg>
                </motion.a>
              </div>

              {/* Chat Messages */}
              <div ref={chatScrollContainerRef} className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-3 bg-gray-50/50 min-h-0">
                {isIntroActive && (
                  <div className="space-y-3" ref={introBlockRef}>
                    {/* Role Selector */}
                    {showRoleSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[85%] rounded-2xl px-4 py-4 text-sm text-black bg-white shadow-sm border-2"
                        style={{ borderColor: '#564F4B' }}
                      >
                        <p className="font-semibold mb-3">👋 Welcome! Let's personalize your experience</p>
                        <p className="text-xs text-gray-600 mb-3">Are you comfortable with technical tools?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleRoleSelect('tech');
                              localStorage.setItem('demoBuilderReturned', 'true');
                            }}
                            className="flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors"
                            style={{ backgroundColor: '#564F4B' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                          >
                            I'm in tech
                          </button>
                          <button
                            onClick={() => {
                              handleRoleSelect('non-tech');
                              localStorage.setItem('demoBuilderReturned', 'true');
                            }}
                            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                          >
                            I'm not in tech
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Personalized Welcome */}
                    {!showRoleSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-[85%] rounded-2xl px-4 py-3 text-sm text-black bg-white shadow-sm"
                      >
                        {hasReturned && watchedDemos.size > 0 ? (
                          <>
                            <p className="font-semibold mb-2">👋 Welcome back{userRole === 'tech' ? ', tech enthusiast' : userRole === 'non-tech' ? ', business leader' : ''}!</p>
                            <p className="mb-3">You've watched {watchedDemos.size} demo{watchedDemos.size !== 1 ? 's' : ''}. Want to continue where you left off?</p>
                            <button
                              onClick={handleContinueWhereLeftOff}
                              className="w-full px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors mb-3"
                              style={{ backgroundColor: '#564F4B' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a433f'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#564F4B'}
                            >
                              Continue Where I Left Off →
                            </button>
                            <p className="text-xs text-gray-500 mb-2">Or explore something new:</p>
                          </>
                        ) : (
                          <>
                            <p className="font-semibold mb-2">👋 Welcome to your personalized demo!</p>
                            <p className="mb-2">I'm here to help you explore our platform. Ask me about:</p>
                          </>
                        )}
                        <ul className="list-disc list-inside space-y-1 text-gray-600 ml-2">
                          <li>Pricing and plans</li>
                          <li>Integration options</li>
                          <li>Advanced features</li>
                          <li>Platform overview</li>
                        </ul>
                        <p className="mt-2 text-xs text-gray-500">I'll suggest the most relevant demo based on your questions!</p>
                      </motion.div>
                    )}
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
                      className={`max-w-[85%] px-4 py-2.5 text-sm ${
                        msg.type === 'user' ? 'text-gray-900 rounded-xl bg-blue-50' : 'text-black rounded-2xl bg-white shadow-sm'
                      }`}
                      style={{
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        fontWeight: 300,
                      }}
                    >
                      {msg.type === 'system' ? (
                        <SystemMessageBubble 
                          text={msg.message} 
                          cta={msg.cta} 
                          normalizeUrl={normalizeUrl} 
                          onTextUpdate={scrollToBottom}
                          suggestedDemo={msg.suggestedDemo ?? null}
                          onDemoSelect={handleDemoSelectFromChat}
                        />
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
                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-black bg-white shadow-sm">
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
                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-red-600 bg-red-50 border border-red-200">
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
                    <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm text-gray-700 bg-blue-50 border border-blue-200">
                      <p className="text-xs font-medium mb-1">Voice conversation:</p>
                      <p>{voiceConversationText}</p>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="px-3 py-2 border-t border-gray-100 bg-white flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchInput.trim()) {
                      handleSendMessage(searchInput.trim());
                    }
                  }}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex items-stretch gap-1.5">
                    <div className="flex items-center justify-center flex-shrink-0">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center justify-center rounded-xl w-12 h-12 bg-white text-gray-100 shadow-sm border-2 relative overflow-visible"
                        style={{
                          borderColor: isRecording ? '#ef4444' : '#564F4B',
                          backgroundColor: isRecording ? '#fee2e2' : 'white',
                        }}
                        aria-label={isRecording ? "Stop voice input" : "Start voice input"}
                        onClick={async (e) => {
                          e.preventDefault();
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
                            <div className="w-5 h-5 border-2 border-[#564F4B] border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                        {voiceAgentState === 'recording' && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-8 h-8 bg-red-500 rounded-full animate-pulse" />
                          </div>
                        )}
                        {voiceAgentState === 'playing' && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="relative flex items-end justify-center gap-0.5 h-6">
                              <div className="w-1 bg-blue-500 rounded-full" style={{ height: '40%', animation: 'soundWave 0.8s ease-in-out infinite', animationDelay: '0s' }} />
                              <div className="w-1 bg-blue-500 rounded-full" style={{ height: '70%', animation: 'soundWave 0.8s ease-in-out infinite', animationDelay: '0.2s' }} />
                              <div className="w-1 bg-blue-500 rounded-full" style={{ height: '100%', animation: 'soundWave 0.8s ease-in-out infinite', animationDelay: '0.4s' }} />
                              <div className="w-1 bg-blue-500 rounded-full" style={{ height: '70%', animation: 'soundWave 0.8s ease-in-out infinite', animationDelay: '0.6s' }} />
                            </div>
                          </div>
                        )}
                        <svg
                          className={`w-6 h-6 ${voiceAgentState === 'connecting' || voiceAgentState === 'recording' || voiceAgentState === 'playing' ? 'opacity-0' : 'opacity-100'}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#564F4B"
                          strokeWidth={2}
                        >
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      </motion.button>
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="relative bg-gray-50 rounded-lg flex items-center min-h-[2.5rem] border border-gray-200">
                        <input
                          type="text"
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          placeholder="Ask about pricing, integrations, features..."
                          disabled={isLoadingMessage}
                          className="w-full rounded-lg pl-3 pr-10 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                        />
                        <motion.button
                          type="submit"
                          disabled={isLoadingMessage || !searchInput.trim()}
                          whileHover={{ scale: searchInput.trim() && !isLoadingMessage ? 1.05 : 1 }}
                          whileTap={{ scale: searchInput.trim() && !isLoadingMessage ? 0.95 : 1 }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md text-white w-7 h-7 shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          style={{ backgroundColor: '#564F4B' }}
                          aria-label="Send message"
                        >
                          <svg 
                            className="w-3.5 h-3.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </motion.button>
                      </div>
                      <div className="flex gap-1.5 items-center px-1 pt-1.5 flex-wrap">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("Tell me about pricing")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                          💰 Pricing
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("How do integrations work?")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                          🔌 Integrations
                        </motion.button>
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSendMessage("What are the advanced features?")}
                          className="px-2 py-1 text-[10px] sm:text-xs rounded-full transition-colors text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
                        >
                          ⚡ Advanced
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
