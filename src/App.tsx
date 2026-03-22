import React, { useState, useEffect } from 'react';
import { translations, Language, KNOWLEDGE_BASE } from './constants';
import { Home, Map, Ruler, Calculator, MessageSquare, Globe, Menu, X, Sun, Moon, FlaskConical, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeTab from './components/HomeTab';
import SurveyTab from './components/SurveyTab';
import LandTab from './components/LandTab';
import EstimateTab from './components/EstimateTab';
import TestsTab from './components/TestsTab';
import TransportationTab from './components/TransportationTab';
import ChatTab from './components/ChatTab';

export default function App() {
  const [lang, setLang] = useState<Language>('bn');
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = translations[lang];

  const tabs = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'survey', label: t.survey, icon: Map },
    { id: 'land', label: t.land, icon: Ruler },
    { id: 'estimate', label: t.estimate, icon: Calculator },
    { id: 'tests', label: t.tests, icon: FlaskConical },
    { id: 'transport', label: t.transport, icon: Truck },
    { id: 'chat', label: t.chat, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-slate-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Calculator className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-emerald-800">{t.title}</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-100 text-emerald-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
            <button
              onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')}
              className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Globe size={16} />
              <span className="text-sm font-medium uppercase">{lang}</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setLang(lang === 'bn' ? 'en' : 'bn')} className="p-2">
              <Globe size={20} />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-[65px] z-40 bg-white border-b border-slate-200 shadow-xl p-4"
          >
            <div className="flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    activeTab === tab.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && <HomeTab lang={lang} />}
            {activeTab === 'survey' && <SurveyTab lang={lang} />}
            {activeTab === 'land' && <LandTab lang={lang} />}
            {activeTab === 'estimate' && <EstimateTab lang={lang} />}
            {activeTab === 'tests' && <TestsTab lang={lang} />}
            {activeTab === 'transport' && <TransportationTab lang={lang} />}
            {activeTab === 'chat' && <ChatTab lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2026 Civix. All rights reserved.</p>
      </footer>
    </div>
  );
}
