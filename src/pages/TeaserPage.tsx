import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { GradientText } from '../components/common/AnimatedText';
import { submitWebsiteLandingPageEmail, isValidEmail } from '../utils/urlUtils';
import logoSrc from '../assets/logo.png';
import ctaImage from '../assets/ctaction.png';


 


export function TeaserPage() {
  const containerControls = useAnimation();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    <div className="min-h-screen relative overflow-hidden font-sf-pro overscroll-y-contain">
      {/* Fixed base background so it never moves */}
      <div className="fixed inset-0 bg-[#E9E8E1] -z-10"></div>
      {/* Two-layer background wrapper */}
      <motion.div animate={containerControls} className="relative z-10 mt-1 sm:mt-3 lg:mt-6 mb-4 sm:mb-8 lg:mb-16 mx-4 sm:mx-8 lg:mx-20 xl:mx-28 2xl:mx-36 bg-[#F6F5F2] rounded-[3rem] overflow-hidden will-change-transform">
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-6"
      >
        {/* Logo and Name */}
        <div className="flex items-center gap-1">
          <img 
            src={logoSrc} 
            alt="Nexbit Logo" 
            className="w-8 h-8"
            style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(3%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(90%)' }}
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
      <section className="relative z-10 min-h-screen flex items-center px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 -mt-12 lg:-mt-6 pt-4 lg:pt-12">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-center items-center">
            
            {/* Centered Text Content */}
            <div className="text-center flex flex-col justify-center items-center mt-24 lg:mt-8">
              
              {/* Main Heading - Centered */}
              <div className="mb-8">
                <GradientText
                  text="Make Your Commerce AI-Native in Minutes"
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
                    {!isSubmitted && !emailError && (
                      <p className="text-sm text-gray-500 mt-3 text-center">
                        Get notified when we launch. No spam, ever.
                      </p>
                    )}
                  </form>
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="flex flex-col items-center mt-32 md:mt-64"
          >
            <p className="text-sm text-gray-400 mb-4">Discover more below</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="w-1 h-3 bg-gray-400 rounded-full mt-2"
              />
            </motion.div>
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

      {/* Benefit Cards Section - Appears on Scroll */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative py-16 md:py-24"
      >
        {/* Background Design */}
        <div className="relative z-10 bg-white rounded-[3rem] shadow-sm">
          <div className="px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-14 md:py-20">
            <div className="max-w-7xl mx-auto">
              {/* Section Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center mb-16"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-6">
                  Why Go AI-Native?
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Transform your business with intelligent automation that works seamlessly in the background.
                </p>
              </motion.div>

              {/* Benefit Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Card 1 - Conversational AI */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Conversational AI</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Smart conversations that understand your business and customers.
                  </p>
                </motion.div>

                {/* Card 2 - Eliminate Manual Work */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Eliminate Manual Grunt Work</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Automate repetitive tasks so you can focus on what matters most. Customers are seeing a 80% reduction in grunt work.
                    </p>
                </motion.div>

                {/* Card 3 - Quick Onboarding */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">Onboard in Minutes, Not Months</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Get up and running in minutes with our streamlined onboarding process.
                    </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Second Page Container with emerging white background */}
      <motion.section
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        {/* Emerging white background plate (second page) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-[2rem] bg-white shadow-sm -z-10"
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="relative">
      {/* CTA Above Footer */}
      <section className="px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-10">
        <div className="bg-[#FFF7D9] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-7 md:gap-9 shadow-sm">
          {/* Left: Headings and Button */}
          <div className="flex-1">
            <div className="text-2xl md:text-3xl font-normal text-gray-600">Interested in knowing full potential of AI for your brand?</div>
            <a
              href="https://calendly.com/kp-nexbit/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center justify-center bg-[#181515] text-white px-7 py-3.5 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Get in touch
            </a>
          </div>
          {/* Right: Image */}
          <div className="w-full md:w-[26rem] h-60 md:h-72 rounded-lg overflow-hidden">
            <img
              src={ctaImage}
              alt="Contact illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-transparent border-t border-gray-100">

        {/* Main Footer Content */}
        <div className="px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column - Brand Information */}
            <div className="text-center sm:text-left">
            <div className="font-semibold text-lg mb-2" style={{ color: "#343434" }}>
  Nexbit
</div>
            </div>

            {/* Middle Column - Navigation/Social Links */}
            <div className="text-center sm:text-left space-y-3">
              <a href="https://calendly.com/kp-nexbit/30min" className="block text-gray-600 hover:text-black transition-colors">Get in touch</a>
              <a href="https://www.linkedin.com/company/nexbit-ai/" target="_blank" rel="noopener noreferrer" className="block text-gray-600 hover:text-black transition-colors">LinkedIn</a>
              <a href="https://x.com/NexbitAi" className="block text-gray-600 hover:text-black transition-colors">X</a>
            </div>

            {/* Right Column - Back to Top */}
            <div className="text-center sm:col-span-2 md:col-span-1 md:text-right">
              <a href="#" className="text-gray-600 hover:text-black transition-colors">Back to top ↑</a>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="border-t border-gray-200 px-2 sm:px-4 lg:px-12 xl:px-16 2xl:px-20 3xl:px-24 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-sm text-gray-500">
            <div className="text-center sm:text-left">© Logikeon Labs Private Limited 2025</div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-center">
              {/* <a href="#" className="hover:text-gray-700 transition-colors">Terms of use</a>
              <a href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</a> */}
            </div>
          </div>
        </div>
      </footer>
        </div>
      </motion.section>
      </motion.div>
    </div>
  );
}
