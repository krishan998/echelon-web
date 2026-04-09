import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { CallToAction } from '../components/home/CallToAction';
import { FlickeringFooter } from '../components/ui/flickering-footer';
import { GradientWaveCanvas } from '../components/backgrounds/GradientWaveCanvas';
import { SecuritySection } from '../components/home/SecuritySection';

export function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0e0e12]">
      <GradientWaveCanvas />
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <SecuritySection />
        <CallToAction />
        <FlickeringFooter />
      </div>
    </div>
  );
}
