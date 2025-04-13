import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Clock } from 'lucide-react';

export function SecuritySection() {
  return (
    <div className="relative py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Security, Without Compromise
              </h2>
              <p className="text-lg font-semibold text-blue-600">
                SOC 2 Type 2 compliant
              </p>
              <p className="text-gray-600 text-lg">
                Nexbit meets the highest industry standards for data security, confidentiality, and integrity, giving you confidence in every audit engagement
              </p>
            </motion.div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Choose where data is stored
                  </h3>
                  <p className="text-gray-600">
                    Use Nexbit's cloud or bring your own storage solution for full control over data residency
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Data retention controls
                  </h3>
                  <p className="text-gray-600">
                    Automated data policies ensure client documents are properly disposed or retained post-engagement
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end -ml-[-9px]"
          >
            <img
              src="/images/soc.jpg"
              alt="AICPA SOC 2 Type 2 Compliance"
              className="w-[350px] h-[350px] object-contain"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
} 