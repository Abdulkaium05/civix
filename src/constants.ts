export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    title: 'Civix',
    home: 'হোম',
    survey: 'ডিজিটাল সার্ভে',
    land: 'জমির মাপ',
    estimate: 'এস্টিমেটিং',
    tests: 'মেটেরিয়াল টেস্ট',
    transport: 'ট্রান্সপোর্টেশন',
    chat: 'এআই অ্যাসিস্ট্যান্ট',
    welcome: 'Civix-এ স্বাগতম',
    subtitle: 'সিভিল ইঞ্জিনিয়ারদের জন্য আধুনিক সমাধান',
    latitude: 'অক্ষাংশ (Latitude)',
    longitude: 'দ্রাঘিমাংশ (Longitude)',
    elevation: 'রিডিউস লেভেল (RL)',
    startSurvey: 'সার্ভে শুরু করুন',
    stopSurvey: 'সার্ভে বন্ধ করুন',
    calculateLand: 'জমির মাপ গণনা',
    uploadPlan: 'প্ল্যান বা ছবি আপলোড করুন',
    estimateResult: 'এস্টিমেশন ফলাফল',
    cement: 'সিমেন্ট (ব্যাগ)',
    sand: 'বালু (CFT)',
    rod: 'রড (KG)',
    bricks: 'ইট (সংখ্যা)',
    cost: 'মোট খরচ (টাকা)',
    askAnything: 'যেকোনো প্রশ্ন করুন...',
    send: 'পাঠান',
    suggestion: 'এআই পরামর্শ',
    maxFootprint: 'সর্বোচ্চ বিল্ডিং এরিয়া',
    maxFloors: 'সর্বোচ্চ তলা',
    loading: 'অপেক্ষা করুন...',
  },
  en: {
    title: 'Civix',
    home: 'Home',
    survey: 'Digital Survey',
    land: 'Land Calc',
    estimate: 'Estimating',
    tests: 'Material Tests',
    transport: 'Transportation',
    chat: 'AI Assistant',
    welcome: 'Welcome to Civix',
    subtitle: 'Modern solutions for Civil Engineers',
    latitude: 'Latitude',
    longitude: 'Longitude',
    elevation: 'Reduced Level (RL)',
    startSurvey: 'Start Survey',
    stopSurvey: 'Stop Survey',
    calculateLand: 'Land Calculation',
    uploadPlan: 'Upload Plan or Image',
    estimateResult: 'Estimation Result',
    cement: 'Cement (Bags)',
    sand: 'Sand (CFT)',
    rod: 'Rod (KG)',
    bricks: 'Bricks (Nos)',
    cost: 'Total Cost (BDT)',
    askAnything: 'Ask anything...',
    send: 'Send',
    suggestion: 'AI Suggestion',
    maxFootprint: 'Max Building Footprint',
    maxFloors: 'Max Floors',
    loading: 'Loading...',
  }
};

export const KNOWLEDGE_BASE = [
  {
    q: "কিউরিং (Curing) কেন গুরুত্বপূর্ণ?",
    a: "কংক্রিটের শক্তি বৃদ্ধি এবং ফাটল রোধ করার জন্য কিউরিং অত্যন্ত জরুরি। এটি সিমেন্টের হাইড্রেশন প্রক্রিয়া সচল রাখে।"
  },
  {
    q: "১ ব্যাগ সিমেন্টের আয়তন কত?",
    a: "১ ব্যাগ সিমেন্টের আয়তন সাধারণত ১.২৫ ঘনফুট (cft) হয়।"
  },
  {
    q: "রডের ওভারল্যাপিং (Overlapping) দৈর্ঘ্য কত হওয়া উচিত?",
    a: "সাধারণত টেনশন জোনে 40D থেকে 50D এবং কমপ্রেশন জোনে 24D থেকে 30D ওভারল্যাপিং দেওয়া হয় (D = রডের ব্যাস)।"
  }
];
