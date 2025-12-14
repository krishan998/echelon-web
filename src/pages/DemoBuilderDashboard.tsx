import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import React from 'react';

// Mock data - in production, this would come from an API
const mockAnalytics = {
  totalUsers: 1247,
  totalDemosWatched: 3421,
  totalBookings: 89,
  averageDemosPerUser: 2.74,
  completionRate: 68.5,
  dropOffPoints: [
    { time: '0:15', percentage: 12, demo: 'Platform Overview' },
    { time: '1:30', percentage: 8, demo: 'Pricing & Plans' },
    { time: '2:45', percentage: 15, demo: 'Integration Setup' },
    { time: '3:20', percentage: 6, demo: 'Advanced Features' },
  ],
  interestAreas: [
    { area: 'Pricing', engagement: 92, clicks: 1247 },
    { area: 'Integrations', engagement: 78, clicks: 892 },
    { area: 'Advanced Features', engagement: 65, clicks: 543 },
    { area: 'Platform Overview', engagement: 88, clicks: 1103 },
  ],
  heatmapData: [
    { demo: 'Platform Overview', pauses: [15, 45, 120], rewinds: [30, 90] },
    { demo: 'Pricing & Plans', pauses: [20, 60, 120], rewinds: [45, 100] },
    { demo: 'Integration Setup', pauses: [30, 90, 180], rewinds: [60, 150] },
    { demo: 'Advanced Features', pauses: [25, 120, 210], rewinds: [80, 180] },
  ],
  chatLogs: [
    { id: 1, timestamp: '2024-01-15 14:23', user: 'user@example.com', message: 'Tell me about pricing', response: 'Our pricing starts at...', demoSuggested: 'Pricing & Plans' },
    { id: 2, timestamp: '2024-01-15 14:45', user: 'user2@example.com', message: 'How do integrations work?', response: 'We integrate with...', demoSuggested: 'Integration Setup' },
    { id: 3, timestamp: '2024-01-15 15:12', user: 'user3@example.com', message: 'What are advanced features?', response: 'Advanced features include...', demoSuggested: 'Advanced Features' },
  ],
  abTests: [
    { id: 1, name: 'Demo Order Test', status: 'active', variantA: 'Standard Order', variantB: 'Pricing First', conversionA: 12.5, conversionB: 18.3 },
    { id: 2, name: 'CTA Button Test', status: 'active', variantA: 'Book Demo', variantB: 'Schedule Call', conversionA: 15.2, conversionB: 22.1 },
    { id: 3, name: 'Chatbot Prompt Test', status: 'completed', variantA: 'Welcome Message A', variantB: 'Welcome Message B', conversionA: 8.5, conversionB: 14.2 },
  ],
  userDemoStats: [
    { userId: 'user1', demosWatched: 3, booked: true, completionRate: 85, avgWatchTime: 145, totalWatchTime: 435, lastActive: '2024-01-15', chatMessages: 8 },
    { userId: 'user2', demosWatched: 1, booked: false, completionRate: 45, avgWatchTime: 68, totalWatchTime: 68, lastActive: '2024-01-14', chatMessages: 3 },
    { userId: 'user3', demosWatched: 4, booked: true, completionRate: 92, avgWatchTime: 198, totalWatchTime: 792, lastActive: '2024-01-15', chatMessages: 12 },
    { userId: 'user4', demosWatched: 2, booked: true, completionRate: 78, avgWatchTime: 112, totalWatchTime: 224, lastActive: '2024-01-13', chatMessages: 5 },
  ],
  demoPopularity: [
    { demo: 'Platform Overview', views: 1247, uniqueViewers: 892, avgCompletion: 88, bookings: 34 },
    { demo: 'Pricing & Plans', views: 1103, uniqueViewers: 756, avgCompletion: 92, bookings: 28 },
    { demo: 'Integration Setup', views: 892, uniqueViewers: 543, avgCompletion: 78, bookings: 18 },
    { demo: 'Advanced Features', views: 543, uniqueViewers: 312, avgCompletion: 65, bookings: 9 },
  ],
  userRetention: {
    day1: 78.5,
    day7: 45.2,
    day30: 22.8,
  },
  sessionMetrics: {
    avgSessionDuration: 12.5,
    avgDemosPerSession: 2.3,
    bounceRate: 18.5,
    returnUsers: 342,
  },
  conversionFunnel: [
    { stage: 'Visited Page', count: 1247, percentage: 100 },
    { stage: 'Watched 1+ Demo', count: 892, percentage: 71.5 },
    { stage: 'Watched 3+ Demos', count: 456, percentage: 36.6 },
    { stage: 'Interacted with Chat', count: 678, percentage: 54.4 },
    { stage: 'Booked Demo', count: 89, percentage: 7.1 },
  ],
  timeToBooking: {
    avgMinutes: 24.5,
    medianMinutes: 18,
    under15min: 45,
    over30min: 23,
  },
};

const demos = [
  { id: 0, title: 'Platform Overview', duration: 225 },
  { id: 1, title: 'Pricing & Plans', duration: 150 },
  { id: 2, title: 'Integration Setup', duration: 255 },
  { id: 3, title: 'Advanced Features', duration: 300 },
];

type SidebarItem = 'home' | 'analytics' | 'user-demos' | 'settings' | 'logs';

export function DemoBuilderDashboard() {
  const [selectedDemo, setSelectedDemo] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState<'heatmap' | 'engagement' | 'abtest' | 'chat' | 'metrics'>('metrics');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeSidebarItem, setActiveSidebarItem] = useState<SidebarItem>('home');

  const sidebarItems: { id: SidebarItem; label: string; icon: JSX.Element }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'user-demos',
      label: 'User Demos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'logs',
      label: 'Logs',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900">Demo Builder</h2>
            <p className="text-xs text-gray-500 mt-1">Dashboard</p>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSidebarItem(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSidebarItem === item.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Demo Builder Analytics</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
        </div>
      </header>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6">
            {/* Home View */}
            {activeSidebarItem === 'home' && (
              <div className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">+12.5% from last period</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demos Watched</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalDemosWatched.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-2">Avg: {mockAnalytics.averageDemosPerUser} per user</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Demo Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalBookings}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {((mockAnalytics.totalBookings / mockAnalytics.totalUsers) * 100).toFixed(1)}% conversion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.completionRate}%</p>
                <p className="text-xs text-gray-500 mt-2">Average across all demos</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveSidebarItem('analytics')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">View Analytics</p>
                          <p className="text-xs text-gray-500">Detailed metrics and insights</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveSidebarItem('user-demos')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">User Demos</p>
                          <p className="text-xs text-gray-500">Manage demo interactions</p>
                        </div>
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveSidebarItem('settings')}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Settings</p>
                          <p className="text-xs text-gray-500">Configure preferences</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics View */}
            {activeSidebarItem === 'analytics' && (
              <div className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalUsers.toLocaleString()}</p>
                        <p className="text-xs text-green-600 mt-2">+12.5% from last period</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Demos Watched</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalDemosWatched.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-2">Avg: {mockAnalytics.averageDemosPerUser} per user</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Demo Bookings</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.totalBookings}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {((mockAnalytics.totalBookings / mockAnalytics.totalUsers) * 100).toFixed(1)}% conversion rate
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockAnalytics.completionRate}%</p>
                        <p className="text-xs text-gray-500 mt-2">Average across all demos</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                  <div className="border-b border-gray-200">
                    <nav className="flex -mb-px px-6">
                      {[
                        { id: 'metrics', label: 'User Metrics' },
                        { id: 'heatmap', label: 'Heatmap Overlay' },
                        { id: 'engagement', label: 'Engagement Scorecard' },
                        { id: 'abtest', label: 'A/B Testing' },
                        { id: 'chat', label: 'Chat Logs' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedMetric(tab.id as any)}
                          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                            selectedMetric === tab.id
                              ? 'border-blue-500 text-blue-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  <div className="p-6">
            {/* User Metrics View */}
            {selectedMetric === 'metrics' && (
              <div className="space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Users Watched 1+ Demo</p>
                    <p className="text-2xl font-bold text-blue-900 mt-2">
                      {mockAnalytics.userDemoStats.filter(u => u.demosWatched >= 1).length}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {((mockAnalytics.userDemoStats.filter(u => u.demosWatched >= 1).length / mockAnalytics.userDemoStats.length) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 uppercase tracking-wide">Users Watched 3+ Demos</p>
                    <p className="text-2xl font-bold text-purple-900 mt-2">
                      {mockAnalytics.userDemoStats.filter(u => u.demosWatched >= 3).length}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      {((mockAnalytics.userDemoStats.filter(u => u.demosWatched >= 3).length / mockAnalytics.userDemoStats.length) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Users Booked Demo</p>
                    <p className="text-2xl font-bold text-green-900 mt-2">
                      {mockAnalytics.userDemoStats.filter(u => u.booked).length}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {((mockAnalytics.userDemoStats.filter(u => u.booked).length / mockAnalytics.userDemoStats.length) * 100).toFixed(1)}% conversion
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs font-medium text-orange-700 uppercase tracking-wide">Return Users</p>
                    <p className="text-2xl font-bold text-orange-900 mt-2">
                      {mockAnalytics.sessionMetrics.returnUsers}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {((mockAnalytics.sessionMetrics.returnUsers / mockAnalytics.totalUsers) * 100).toFixed(1)}% retention
                    </p>
                  </div>
                </div>

                {/* Conversion Funnel */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                  <div className="space-y-4">
                    {mockAnalytics.conversionFunnel.map((stage, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-gray-900">{stage.count.toLocaleString()}</span>
                            <span className="text-xs text-gray-500 w-12 text-right">{stage.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.percentage}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                            className={`h-3 rounded-full ${
                              idx === 0 ? 'bg-blue-500' :
                              idx === 1 ? 'bg-purple-500' :
                              idx === 2 ? 'bg-indigo-500' :
                              idx === 3 ? 'bg-pink-500' :
                              'bg-green-500'
                            }`}
                          />
                        </div>
                        {idx < mockAnalytics.conversionFunnel.length - 1 && (
                          <div className="text-center mt-2">
                            <span className="text-xs text-gray-400">
                              {((stage.count - mockAnalytics.conversionFunnel[idx + 1].count) / stage.count * 100).toFixed(1)}% drop-off
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demo Popularity */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Popularity & Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demo</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Views</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Viewers</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Completion</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conversion</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockAnalytics.demoPopularity.map((demo, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{demo.demo}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{demo.views.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{demo.uniqueViewers.toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${demo.avgCompletion}%` }}
                                  />
                                </div>
                                <span>{demo.avgCompletion}%</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{demo.bookings}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="font-semibold text-green-600">
                                {((demo.bookings / demo.uniqueViewers) * 100).toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Session Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Avg Session Duration</h4>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{mockAnalytics.sessionMetrics.avgSessionDuration} min</p>
                    <p className="text-xs text-gray-500 mt-2">Per user session</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Avg Demos Per Session</h4>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{mockAnalytics.sessionMetrics.avgDemosPerSession}</p>
                    <p className="text-xs text-gray-500 mt-2">Demos watched per visit</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-gray-700">Bounce Rate</h4>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{mockAnalytics.sessionMetrics.bounceRate}%</p>
                    <p className="text-xs text-gray-500 mt-2">Single-page sessions</p>
                  </div>
                </div>

                {/* User Retention */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Retention</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">Day 1</p>
                      <p className="text-3xl font-bold text-blue-900">{mockAnalytics.userRetention.day1}%</p>
                      <p className="text-xs text-blue-600 mt-1">Users return after 1 day</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-2">Day 7</p>
                      <p className="text-3xl font-bold text-purple-900">{mockAnalytics.userRetention.day7}%</p>
                      <p className="text-xs text-purple-600 mt-1">Users return after 7 days</p>
                    </div>
                    <div className="text-center p-4 bg-indigo-50 rounded-lg">
                      <p className="text-xs font-medium text-indigo-700 uppercase tracking-wide mb-2">Day 30</p>
                      <p className="text-3xl font-bold text-indigo-900">{mockAnalytics.userRetention.day30}%</p>
                      <p className="text-xs text-indigo-600 mt-1">Users return after 30 days</p>
                    </div>
                  </div>
                </div>

                {/* Time to Booking */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Time to Booking</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Average Time</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.timeToBooking.avgMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Median Time</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.timeToBooking.medianMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Under 15 min</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.timeToBooking.under15min}%</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Over 30 min</p>
                      <p className="text-2xl font-bold text-gray-900">{mockAnalytics.timeToBooking.over30min}%</p>
                    </div>
                  </div>
                </div>

                {/* Detailed User Table */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed User Statistics</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demos Watched</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Watch Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Watch Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chat Messages</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booked</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockAnalytics.userDemoStats.map((user, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.demosWatched}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.avgWatchTime ? `${Math.floor(user.avgWatchTime / 60)}:${(user.avgWatchTime % 60).toString().padStart(2, '0')}` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {user.totalWatchTime ? `${Math.floor(user.totalWatchTime / 60)}:${(user.totalWatchTime % 60).toString().padStart(2, '0')}` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <div className="flex items-center">
                                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${user.completionRate}%` }}
                                    />
                                  </div>
                                  <span>{user.completionRate}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.chatMessages || 0}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive || 'N/A'}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {user.booked ? (
                                  <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Yes</span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">No</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Heatmap Overlay View */}
            {selectedMetric === 'heatmap' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Heatmap - Pause & Rewind Points</h3>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700">Select Demo:</label>
                    <select
                      value={selectedDemo}
                      onChange={(e) => setSelectedDemo(Number(e.target.value))}
                      className="ml-3 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {demos.map((demo, idx) => (
                        <option key={idx} value={idx}>{demo.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-6 relative overflow-hidden">
                  <div className="relative" style={{ height: '400px' }}>
                    {/* Video Timeline Representation */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-2 bg-gray-700 rounded-full relative">
                        {/* Timeline markers */}
                        {Array.from({ length: Math.ceil(demos[selectedDemo].duration / 30) }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-0 bottom-0 w-px bg-gray-600"
                            style={{ left: `${(i * 30 / demos[selectedDemo].duration) * 100}%` }}
                          >
                            <span className="absolute -top-6 left-0 text-xs text-gray-400">
                              {Math.floor(i * 30 / 60)}:{(i * 30 % 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        ))}

                        {/* Pause points (red) */}
                        {mockAnalytics.heatmapData[selectedDemo].pauses.map((pause, idx) => (
                          <div
                            key={`pause-${idx}`}
                            className="absolute top-0 bottom-0 w-1 bg-red-500 rounded-full transform -translate-x-1/2"
                            style={{ left: `${(pause / demos[selectedDemo].duration) * 100}%` }}
                            title={`Pause at ${Math.floor(pause / 60)}:${(pause % 60).toString().padStart(2, '0')}`}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Pause ({Math.floor(pause / 60)}:{(pause % 60).toString().padStart(2, '0')})
                            </div>
                          </div>
                        ))}

                        {/* Rewind points (blue) */}
                        {mockAnalytics.heatmapData[selectedDemo].rewinds.map((rewind, idx) => (
                          <div
                            key={`rewind-${idx}`}
                            className="absolute top-0 bottom-0 w-1 bg-blue-500 rounded-full transform -translate-x-1/2"
                            style={{ left: `${(rewind / demos[selectedDemo].duration) * 100}%` }}
                            title={`Rewind at ${Math.floor(rewind / 60)}:${(rewind % 60).toString().padStart(2, '0')}`}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Rewind ({Math.floor(rewind / 60)}:{(rewind % 60).toString().padStart(2, '0')})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-6 flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-sm text-white">Pause Points</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm text-white">Rewind Points</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Top Pause Points</h4>
                    <ul className="space-y-2">
                      {mockAnalytics.heatmapData[selectedDemo].pauses.map((pause, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          {Math.floor(pause / 60)}:{(pause % 60).toString().padStart(2, '0')} - {Math.floor((pause / demos[selectedDemo].duration) * 100)}% through demo
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Top Rewind Points</h4>
                    <ul className="space-y-2">
                      {mockAnalytics.heatmapData[selectedDemo].rewinds.map((rewind, idx) => (
                        <li key={idx} className="text-sm text-gray-600">
                          {Math.floor(rewind / 60)}:{(rewind % 60).toString().padStart(2, '0')} - {Math.floor((rewind / demos[selectedDemo].duration) * 100)}% through demo
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Engagement Scorecard View */}
            {selectedMetric === 'engagement' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Scorecard</h3>
                  
                  {/* Completion Rate */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">Overall Completion Rate</h4>
                      <span className="text-2xl font-bold text-blue-600">{mockAnalytics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-600 h-4 rounded-full transition-all"
                        style={{ width: `${mockAnalytics.completionRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Drop-off Points */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Drop-off Points</h4>
                    <div className="space-y-4">
                      {mockAnalytics.dropOffPoints.map((point, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-medium text-gray-900">{point.demo}</span>
                              <span className="text-xs text-gray-500">{point.time}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${point.percentage}%` }}
                              />
                            </div>
                          </div>
                          <span className="ml-4 text-sm font-semibold text-red-600">{point.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interest Areas */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Interest Areas (Engagement)</h4>
                    <div className="space-y-4">
                      {mockAnalytics.interestAreas.map((area, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-900">{area.area}</span>
                              <span className="text-xs text-gray-500">{area.clicks} clicks</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${area.engagement}%` }}
                              />
                            </div>
                          </div>
                          <span className="ml-4 text-sm font-semibold text-green-600">{area.engagement}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* A/B Testing View */}
            {selectedMetric === 'abtest' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">A/B Testing Engine</h3>
                  
                  <div className="space-y-4">
                    {mockAnalytics.abTests.map((test) => (
                      <div key={test.id} className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{test.name}</h4>
                            <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium rounded ${
                              test.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {test.status}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Variant A</span>
                              <span className="text-xs text-gray-500">Control</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{test.variantA}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${(test.conversionA / Math.max(test.conversionA, test.conversionB)) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{test.conversionA}%</span>
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Variant B</span>
                              <span className={`text-xs font-medium ${
                                test.conversionB > test.conversionA ? 'text-green-600' : 'text-gray-500'
                              }`}>
                                {test.conversionB > test.conversionA ? 'Winner' : 'Test'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{test.variantB}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    test.conversionB > test.conversionA ? 'bg-green-500' : 'bg-purple-500'
                                  }`}
                                  style={{ width: `${(test.conversionB / Math.max(test.conversionA, test.conversionB)) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{test.conversionB}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Improvement</span>
                            <span className={`font-semibold ${
                              test.conversionB > test.conversionA ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {test.conversionB > test.conversionA ? '+' : ''}
                              {((test.conversionB - test.conversionA) / test.conversionA * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Logs View */}
            {selectedMetric === 'chat' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Messages Logs</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Message</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bot Response</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demo Suggested</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {mockAnalytics.chatLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{log.message}</td>
                              <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">{log.response}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                                  {log.demoSuggested}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
                  </div>
                </div>
              </div>
            )}

            {/* User Demos View */}
            {activeSidebarItem === 'user-demos' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">User Demo Interactions</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Demos Watched</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockAnalytics.userDemoStats.map((user, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.userId}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.demosWatched}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${user.completionRate}%` }}
                                  />
                                </div>
                                <span>{user.completionRate}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {user.booked ? (
                                <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Booked</span>
                              ) : (
                                <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">Active</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings View */}
            {activeSidebarItem === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">General Settings</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Enable Notifications</p>
                            <p className="text-xs text-gray-500">Receive alerts for important events</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Auto-refresh Data</p>
                            <p className="text-xs text-gray-500">Automatically update metrics every 30 seconds</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Demo Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Default Demo Duration (seconds)</label>
                          <input
                            type="number"
                            defaultValue={225}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Completion Threshold (%)</label>
                          <input
                            type="number"
                            defaultValue={80}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs View */}
            {activeSidebarItem === 'logs' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Filter
                      </button>
                      <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                        Export
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { level: 'info', message: 'User demo session started', timestamp: '2024-01-15 14:23:12', user: 'user@example.com' },
                      { level: 'info', message: 'Demo video playback completed', timestamp: '2024-01-15 14:25:45', user: 'user@example.com' },
                      { level: 'warning', message: 'High drop-off rate detected at 1:30', timestamp: '2024-01-15 14:28:33', user: 'user2@example.com' },
                      { level: 'info', message: 'Chat message sent', timestamp: '2024-01-15 14:30:21', user: 'user3@example.com' },
                      { level: 'success', message: 'Demo booking confirmed', timestamp: '2024-01-15 14:32:10', user: 'user@example.com' },
                      { level: 'error', message: 'Video playback error', timestamp: '2024-01-15 14:35:07', user: 'user4@example.com' },
                    ].map((log, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${
                          log.level === 'error' ? 'bg-red-50 border-red-200' :
                          log.level === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                          log.level === 'success' ? 'bg-green-50 border-green-200' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                                log.level === 'error' ? 'bg-red-100 text-red-800' :
                                log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                log.level === 'success' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {log.level.toUpperCase()}
                              </span>
                              <span className="text-xs text-gray-500">{log.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-900">{log.message}</p>
                            <p className="text-xs text-gray-500 mt-1">User: {log.user}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
