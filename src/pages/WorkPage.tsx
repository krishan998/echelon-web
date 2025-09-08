import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProjectCard, FilterButton } from '../components/common/ProjectCard';
import { AnimatedText, GradientText, RevealText } from '../components/common/AnimatedText';
import { GeometricBackground } from '../components/backgrounds/GeometricBackground';
import { ArrowRight, ExternalLink, Play, Sparkles, Zap, Target, Users, Lightbulb } from 'lucide-react';

export function WorkPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const projects = [
    {
      id: 1,
      title: "Sierra",
      category: "Strategy, Brand + Comms, Product, Development",
      description: "Redefining digital strategy through innovative design and seamless user experiences.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Brand", "Product", "Development"]
    },
    {
      id: 2,
      title: "Google Deepmind",
      category: "Strategy, Brand + Comms, AI",
      description: "Pioneering AI experiences that bridge the gap between human intuition and machine intelligence.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Brand", "AI"]
    },
    {
      id: 3,
      title: "IKEA Circle",
      category: "Strategy, Product, Development, Brand + Comms, AI",
      description: "Creating circular economy solutions through innovative digital platforms and sustainable design.",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Product", "Development", "Brand", "AI"]
    },
    {
      id: 4,
      title: "CoinTracker",
      category: "Strategy, Website, Brand + Comms, Product",
      description: "Simplifying cryptocurrency portfolio tracking with intuitive design and powerful analytics.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
      image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Website", "Brand", "Product"]
    },
    {
      id: 5,
      title: "Phantom",
      category: "Strategy, Brand + Comms, Development",
      description: "Building the future of digital identity through secure, user-friendly authentication systems.",
      color: "from-indigo-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-indigo-50 to-purple-50",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Brand", "Development"]
    },
    {
      id: 6,
      title: "IKEA Studio",
      category: "Strategy, Product, Spatial, Brand + Comms",
      description: "Transforming home design through immersive spatial experiences and AI-powered visualization.",
      color: "from-teal-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-teal-50 to-blue-50",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center",
      tags: ["Strategy", "Product", "Spatial", "Brand"]
    }
  ];

  const categories = ["All", "Strategy", "Product", "Development", "Brand + Comms", "AI"];

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => 
        project.tags.some(tag => 
          tag.toLowerCase().includes(activeFilter.toLowerCase()) ||
          activeFilter.toLowerCase().includes(tag.toLowerCase())
        )
      );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <GeometricBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <GradientText
              text="Our work"
              gradient="from-blue-600 to-purple-600"
              className="text-6xl md:text-8xl font-bold tracking-tight mb-8"
              delay={0}
            />
            <RevealText
              direction="up"
              delay={0.2}
              className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              An overview of recent case studies, as well as a selection of our self-initiated projects.
            </RevealText>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <FilterButton
                key={category}
                label={category}
                isActive={activeFilter === category}
                onClick={() => setActiveFilter(category)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`h-64 ${project.bgColor} relative overflow-hidden`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  
                  {/* Floating Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {project.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700 backdrop-blur-sm`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      View Project
                    </motion.button>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">
                    {project.category}
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Target, value: "50+", label: "Projects Delivered" },
              { icon: Users, value: "25+", label: "Happy Clients" },
              { icon: Lightbulb, value: "100%", label: "Innovation Focus" },
              { icon: Zap, value: "5+", label: "Years Experience" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4 group-hover:shadow-xl transition-shadow">
                  <stat.icon className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              Ready to start your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">next project</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Let's create something extraordinary together. We're always excited to work on new challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors"
              >
                Get in touch
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white hover:text-black transition-all"
              >
                View our process
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
