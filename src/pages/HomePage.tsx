import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/home/Hero';
import { Features } from '../components/home/Features';
import { DocumentUnderstanding } from '../components/home/DocumentUnderstanding';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <DocumentUnderstanding />
    </div>
  );
}