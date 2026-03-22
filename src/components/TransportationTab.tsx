import React, { useState } from 'react';
import { translations, Language } from '../constants';
import { Truck, Route, Activity, Info, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransportTopic {
  id: string;
  name: string;
  bnName: string;
  description: string;
  bnDescription: string;
  details: {
    title: string;
    bnTitle: string;
    content: string[];
    bnContent: string[];
    image: string;
  }[];
}

const TRANSPORT_TOPICS: TransportTopic[] = [
  {
    id: 'pavement',
    name: 'Pavement Materials',
    bnName: 'পেভমেন্ট ম্যাটেরিয়ালস',
    description: 'Tests and properties of materials used in road construction.',
    bnDescription: 'রাস্তা নির্মাণে ব্যবহৃত মালামালের পরীক্ষা এবং বৈশিষ্ট্য।',
    details: [
      {
        title: 'Bitumen Penetration Test',
        bnTitle: 'বিটুমিন পেনিট্রেশন টেস্ট',
        content: [
          'To determine the hardness or softness of bitumen.',
          'A standard needle (100g) is allowed to penetrate for 5 seconds at 25°C.',
          'Penetration is measured in 1/10th of a mm.',
          'Common grades in BD: 60/70 and 80/100.'
        ],
        bnContent: [
          'বিটুমিনের কঠিনতা বা নমনীয়তা নির্ণয় করা।',
          'একটি স্ট্যান্ডার্ড নিডল (১০০ গ্রাম) ২৫°C তাপমাত্রায় ৫ সেকেন্ডের জন্য প্রবেশ করতে দেওয়া হয়।',
          'পেনিট্রেশন ১/১০ মিমি এককে পরিমাপ করা হয়।',
          'বাংলাদেশে সাধারণ গ্রেড: ৬০/৭০ এবং ৮০/১০০।'
        ],
        image: 'https://picsum.photos/seed/bitumen-test/600/400'
      },
      {
        title: 'CBR Test (California Bearing Ratio)',
        bnTitle: 'সিবিআর টেস্ট',
        content: [
          'To evaluate the strength of subgrade soil and base materials.',
          'Measures the pressure required to penetrate soil with a standard plunger.',
          'Used to determine the thickness of pavement layers.',
          'Higher CBR value means stronger soil.'
        ],
        bnContent: [
          'সাবগ্রেড মাটি এবং বেস ম্যাটেরিয়ালের শক্তি মূল্যায়ন করা।',
          'একটি স্ট্যান্ডার্ড প্লাঞ্জার দিয়ে মাটিতে প্রবেশের জন্য প্রয়োজনীয় চাপ পরিমাপ করে।',
          'পেভমেন্ট স্তরের পুরুত্ব নির্ণয় করতে ব্যবহৃত হয়।',
          'বেশি সিবিআর ভ্যালু মানে শক্তিশালী মাটি।'
        ],
        image: 'https://picsum.photos/seed/cbr-test/600/400'
      }
    ]
  },
  {
    id: 'traffic',
    name: 'Traffic Engineering',
    bnName: 'ট্রাফিক ইঞ্জিনিয়ারিং',
    description: 'Study of traffic flow, signs, and road safety.',
    bnDescription: 'ট্রাফিক প্রবাহ, সংকেত এবং সড়ক নিরাপত্তা বিষয়ক পড়াশোনা।',
    details: [
      {
        title: 'Traffic Volume Study',
        bnTitle: 'ট্রাফিক ভলিউম স্টাডি',
        content: [
          'To determine the number of vehicles crossing a section of road per unit time.',
          'Helps in designing road width and intersections.',
          'Can be done manually or using automatic counters.',
          'Expressed in PCU (Passenger Car Unit).'
        ],
        bnContent: [
          'একটি নির্দিষ্ট সময়ে রাস্তার একটি অংশ দিয়ে কতগুলো যানবাহন চলাচল করে তা নির্ণয় করা।',
          'রাস্তার প্রশস্ততা এবং ইন্টারসেকশন ডিজাইনে সাহায্য করে।',
          'ম্যানুয়ালি বা অটোমেটিক কাউন্টার দিয়ে করা যায়।',
          'পিসিইউ (PCU) এককে প্রকাশ করা হয়।'
        ],
        image: 'https://picsum.photos/seed/traffic-flow/600/400'
      }
    ]
  }
];

export default function TransportationTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [activeTopic, setActiveTopic] = useState<TransportTopic>(TRANSPORT_TOPICS[0]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{t.transport}</h2>
          <p className="text-slate-500">
            {lang === 'bn' 
              ? 'ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং এবং সড়ক নির্মাণ বিষয়ক তথ্য' 
              : 'Transportation engineering and road construction information'}
          </p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {TRANSPORT_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => setActiveTopic(topic)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
              activeTopic.id === topic.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {topic.id === 'pavement' ? <Route size={20} /> : <Activity size={20} />}
            {lang === 'bn' ? topic.bnName : topic.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-1 gap-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTopic.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-900">
                  {lang === 'bn' ? activeTopic.bnName : activeTopic.name}
                </h3>
                <p className="text-blue-700">
                  {lang === 'bn' ? activeTopic.bnDescription : activeTopic.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {activeTopic.details.map((detail, i) => (
                <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={detail.image} 
                      alt={detail.title} 
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <h4 className="text-lg font-bold text-slate-900">
                      {lang === 'bn' ? detail.bnTitle : detail.title}
                    </h4>
                    <ul className="space-y-2">
                      {(lang === 'bn' ? detail.bnContent : detail.content).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h4 className="text-xl font-bold">{lang === 'bn' ? 'আরো জানতে চান?' : 'Need more info?'}</h4>
          <p className="text-slate-400">
            {lang === 'bn' 
              ? 'আমাদের এআই অ্যাসিস্ট্যান্টকে ট্রান্সপোর্টেশন ইঞ্জিনিয়ারিং নিয়ে যেকোনো প্রশ্ন করুন।' 
              : 'Ask our AI Assistant any questions about Transportation Engineering.'}
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition-colors ml-auto">
          {lang === 'bn' ? 'এআই চ্যাট' : 'AI Chat'}
        </button>
      </div>
    </div>
  );
}
