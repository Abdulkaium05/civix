import React, { useState, useEffect } from 'react';
import { translations, Language } from '../constants';
import { BookOpen, HelpCircle, ArrowRight, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { askGemini, getDynamicHomeContent } from '../services/gemini';

export default function HomeTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [selectedTopic, setSelectedTopic] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [topics, setTopics] = useState<{ bn: string; en: string; key: string }[]>([]);
  const [qa, setQa] = useState<{ q: string; a: string }[]>([]);

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const data = await getDynamicHomeContent(lang);
      if (data.topics) setTopics(data.topics);
      if (data.qa) setQa(data.qa);
    } catch (err) {
      console.error("Error fetching dynamic content:", err);
    } finally {
      setContentLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [lang]);

  const handleTopicClick = async (topic: { bn: string; en: string }) => {
    const title = lang === 'bn' ? topic.bn : topic.en;
    setLoading(true);
    setSelectedTopic({ title, content: "" });
    
    try {
      const prompt = `Provide a brief, professional summary of the civil engineering topic: "${title}". Focus on key principles and importance for engineers in Bangladesh. Answer in ${lang === 'bn' ? 'Bengali' : 'English'}.`;
      const content = await askGemini(prompt);
      setSelectedTopic({ title, content: content || "Content not available." });
    } catch (err) {
      setSelectedTopic({ title, content: "Error loading content. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-12">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight"
        >
          {t.welcome}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-slate-500 max-w-2xl mx-auto"
        >
          {t.subtitle}
        </motion.p>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={fetchContent}
          disabled={contentLoading}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-full transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={contentLoading ? 'animate-spin' : ''} />
          {lang === 'bn' ? 'নতুন তথ্য লোড করুন' : 'Refresh Content'}
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 min-h-[300px]">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
            <BookOpen size={24} />
            <h3>{lang === 'bn' ? 'গুরুত্বপূর্ণ বিষয়' : 'Important Topics'}</h3>
          </div>
          
          {contentLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400">Loading topics...</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {topics.map((topic, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleTopicClick(topic)}
                  className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 cursor-pointer transition-colors group p-2 hover:bg-emerald-50 rounded-lg"
                >
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  <span className="font-medium">{lang === 'bn' ? topic.bn : topic.en}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 min-h-[300px]">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-lg">
            <HelpCircle size={24} />
            <h3>{lang === 'bn' ? 'জ্ঞানমূলক প্রশ্নোত্তর' : 'Knowledge Q&A'}</h3>
          </div>
          
          {contentLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-2">
              <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-slate-400">Loading Q&A...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {qa.map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-1 p-3 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <p className="font-semibold text-slate-800">{item.q}</p>
                  <p className="text-sm text-slate-600">{item.a}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Topic Detail Modal */}
      <AnimatePresence>
        {selectedTopic && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-600 text-white">
                <h3 className="text-xl font-bold">{selectedTopic.title}</h3>
                <button onClick={() => setSelectedTopic(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto prose prose-slate max-w-none">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">{t.loading}</p>
                  </div>
                ) : (
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedTopic.content}
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-colors"
                >
                  {lang === 'bn' ? 'বন্ধ করুন' : 'Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
