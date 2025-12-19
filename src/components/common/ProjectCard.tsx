import React from 'react';
import { motion } from 'framer-motion';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  color: string;
  bgColor: string;
  index: number;
  onClick?: () => void;
}

export function ProjectCard({
  title,
  category,
  description,
  image,
  tags,
  color,
  bgColor,
  index,
  onClick
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className={`h-64 ${bgColor} relative overflow-hidden`}>
        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Floating Tags */}
        <motion.div 
          className="absolute top-4 left-4 flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.2 }}
        >
          {tags.slice(0, 2).map((tag, tagIndex) => (
            <motion.span
              key={tag}
              className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-700 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>

        {/* Hover Overlay */}
        <motion.div 
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-6 py-3 rounded-full font-medium flex items-center gap-2"
          >
            <span>View Project</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-6">
        <motion.h3 
          className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#201636] transition-colors"
          whileHover={{ x: 4 }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-500 mb-4 font-medium"
          whileHover={{ x: 4 }}
        >
          {category}
        </motion.p>
        
        <motion.p 
          className="text-gray-600 leading-relaxed mb-6"
          whileHover={{ x: 4 }}
        >
          {description}
        </motion.p>
        
        {/* Action Area */}
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2 text-[#201636] font-medium"
            whileHover={{ x: 4 }}
          >
            <span>Learn more</span>
            <motion.div
              whileHover={{ x: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </motion.div>
          
          <motion.div
            whileHover={{ rotate: 45 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2016361A] to-purple-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
    </motion.div>
  );
}

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}

export function FilterButton({ label, isActive, onClick, index }: FilterButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
        isActive 
          ? "bg-black text-white shadow-lg" 
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </motion.button>
  );
}
