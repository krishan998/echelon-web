import React, { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { CallToAction } from '../components/home/CallToAction';
import { Footer } from '../components/layout/Footer';
import { SecuritySection } from '../components/home/SecuritySection';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';

export function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ company: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    setDone(false);
    try {
      await emailjs.send(
        'service_klc0mn5',
        'template_ubrf3u3',
        {
          name: form.company,
          email: form.email,
        },
        'UtIAElvH3Ul0d3cZE'
      );
      setSuccess(true);
      setDone(true);
      setForm({ company: '', email: '' });
      setTimeout(() => {
        setModalOpen(false);
        setSuccess(false);
        setDone(false);
      }, 1200);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#18181b] overflow-hidden">
      <div className="relative z-10">
        <Navbar />
        {/* Main Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl mb-6 tracking-tight text-left text-white leading-tight font-semibold"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
          >
            Reimagining accounting with AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl text-left leading-relaxed mt-6 mb-8"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 300 }}
          >
            Accounting began over 7,000 years ago. <br/><br/>Mesopotamian traders carved tallies into clay to track livestock and grain. Ledgers evolved with empires from Roman wax tablets to Venetian double-entry bookkeeping. Every civilization left ruins and records. <br/><br/>Accounting is humanity's oldest language of <strong><em>trust</em></strong>, telling stories of ambition, risk, and survival through precision. Empires ran on it. Wars were funded by it. Revolutions were audited before they were remembered.

            <br/><br/>Yet, accounting remains stubbornly <strong><em>analog</em></strong> in spirit. <br/><br/>Behind digital dashboards, teams wrestle with PDFs, emails, and Excel exports, losing hours to reconciliation. Knowledge stays trapped in files, not shared across minds.

Finance isn’t just numbers. It’s the living memory of a business’s journey. Miscategorized expenses are tiny lies repeated endlessly. Late reconciliations are businesses flying blind. Month-end closes trade speed for truth.

But <strong><em>change</em></strong> is here. Intelligent systems are emerging. Not mere automation, but tools that think like your best analyst, remember like your sharpest CA. They don’t just process data; they understand it, spotting risks, explaining trends, and learning from every close.

<br/>AI won’t replace accountants, but it will make <strong><em>mediocre</em></strong> accounting obsolete. Finance teams will converse with systems that anticipate, illuminate, and refine, freeing them from drudgery to focus on judgment.

<br/><br/>
Accounting was born in clay, evolved in ink, scaled with spreadsheets. Now, it learns.
          </motion.p>
          
          {/* Join Waitlist Button */}
          <motion.button
            onClick={() => setModalOpen(true)}
            className="mt-4 px-8 py-3.5 text-lg font-normal rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Waitlist!
          </motion.button>
        </div>
        {/* Modal with AnimatePresence for smooth transitions */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <motion.div
                className="bg-[#23232a] rounded-2xl p-10 md:p-14 w-full max-w-md shadow-xl relative border border-[#23232a]/40"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.25, type: 'spring', bounce: 0.2 }}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
                  onClick={() => { setModalOpen(false); setSuccess(false); setError(''); setDone(false); }}
                  aria-label="Close"
                  tabIndex={0}
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold text-white mb-6 text-center tracking-tight" style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontWeight: 400 }}>
                  Almost on the ship
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="company">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-[#18181b] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-[#18181b] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>
                  {error && <div className="text-red-400 text-center">{error}</div>}
                  <motion.button
                    type="submit"
                    className={`w-full py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-normal text-lg shadow-sm hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 ${done ? 'bg-green-600 cursor-default' : ''}`}
                    disabled={loading || done}
                    whileHover={!done ? { scale: 1.03 } : {}}
                    whileTap={!done ? { scale: 0.97 } : {}}
                  >
                    {done ? 'Done' : loading ? 'Joining...' : 'Join Waitlist'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Keep existing components but hide them */}
        <div className="hidden">
          <Hero />
          <Features />
          <SecuritySection />
          <CallToAction />
        </div>
        <Footer />
      </div>
    </div>
  );
}