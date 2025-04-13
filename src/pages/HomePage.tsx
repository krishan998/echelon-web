import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { CallToAction } from '../components/home/CallToAction';
import { Footer } from '../components/layout/Footer';
import { GradientWaveCanvas } from '../components/backgrounds/GradientWaveCanvas';
import { SecuritySection } from '../components/home/SecuritySection';

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-white">
      <GradientWaveCanvas />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <SecuritySection />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}