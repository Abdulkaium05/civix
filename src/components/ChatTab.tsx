import React, { useState, useRef, useEffect } from 'react';
import { translations, Language } from '../constants';
import { Send, Bot, User, Loader2, Image as ImageIcon, Paperclip, X } from 'lucide-react';
import { askGemini, askGeminiMultimodal, generateExampleImage } from '../services/gemini';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  role: 'user' | 'bot';
  text: string;
  image?: string;
  userImage?: string;
}

export default function ChatTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: lang === 'bn' ? 'হ্যালো! আমি আপনার সিভিল ইঞ্জিনিয়ারিং অ্যাসিস্ট্যান্ট। আমি আপনাকে কীভাবে সাহায্য করতে পারি?' : 'Hello! I am your Civil Engineering assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return;

    const userMsg = input;
    const userImg = selectedImage;
    const mime = imageMimeType;

    setInput('');
    setSelectedImage(null);
    setImageMimeType(null);
    
    setMessages(prev => [...prev, { role: 'user', text: userMsg || (lang === 'bn' ? 'ছবি বিশ্লেষণ করুন' : 'Analyze this image'), userImage: userImg || undefined }]);
    setLoading(true);

    try {
      const systemPrompt = `You are a helpful Civil Engineering Assistant for Bangladeshi engineers. Answer in ${lang === 'bn' ? 'Bengali' : 'English'}. If the user provides an image, analyze it from a civil engineering perspective. If they ask for a practical example or image, provide a detailed description.`;
      
      let response = '';
      if (userImg && mime) {
        response = await askGeminiMultimodal(userMsg || (lang === 'bn' ? 'এই ছবিটি বিশ্লেষণ করুন' : 'Analyze this image'), userImg, mime, systemPrompt) || '';
      } else {
        response = await askGemini(userMsg, systemPrompt) || '';
      }
      
      let exampleImage = undefined;
      // Check if user wants an example/image or if AI thinks it should generate one
      const lowerMsg = userMsg.toLowerCase();
      if (lowerMsg.includes('উদাহরণ') || lowerMsg.includes('চিত্র') || lowerMsg.includes('example') || lowerMsg.includes('image')) {
        exampleImage = await generateExampleImage(userMsg) || undefined;
      }

      setMessages(prev => [...prev, { role: 'bot', text: response, image: exampleImage }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error occurred. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold">{t.chat}</h3>
          <p className="text-xs text-emerald-100">Online | AI Powered</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-emerald-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.userImage && (
                  <div className="rounded-2xl overflow-hidden border-4 border-white shadow-md max-w-xs">
                    <img src={msg.userImage} alt="User upload" className="w-full h-auto" />
                  </div>
                )}
                <div className={`p-4 rounded-2xl shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  <div className="prose prose-sm max-w-none prose-p:leading-relaxed">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.image && (
                  <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg max-w-xs">
                    <img src={msg.image} alt="Example" className="w-full h-auto" />
                    <div className="bg-white p-2 text-[10px] text-slate-400 flex items-center gap-1">
                      <ImageIcon size={10} />
                      AI Generated Example
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-emerald-600" size={16} />
              <span className="text-sm text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100 space-y-4">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative inline-block"
            >
              <img src={selectedImage} alt="Selected" className="h-20 w-20 object-cover rounded-xl border-2 border-emerald-500" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200 transition-all"
          >
            <Paperclip size={24} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.askAnything}
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-3 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedImage) || loading}
            className="bg-emerald-600 text-white p-3 rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
