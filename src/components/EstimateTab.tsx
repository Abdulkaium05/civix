import React, { useState } from 'react';
import { translations, Language } from '../constants';
import { Calculator, Upload, Loader2, FileText, DollarSign, Package, Trash2 } from 'lucide-react';
import { estimateMaterials } from '../services/gemini';
import { motion } from 'motion/react';

interface Estimation {
  cement: number;
  sand: number;
  rod: number;
  bricks: number;
  totalCost: number;
  explanation: string;
}

export default function EstimateTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Estimation | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setPreview(base64);
      setLoading(true);
      try {
        const data = await estimateMaterials(base64, file.type);
        setResult(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const clear = () => {
    setPreview(null);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t.estimate}</h2>
          <p className="text-slate-500">{lang === 'bn' ? 'প্ল্যান বা ছবি থেকে ম্যাটেরিয়াল এস্টিমেশন' : 'Material estimation from plans or images'}</p>
        </div>
        {result && (
          <button 
            onClick={clear}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            {lang === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all bg-white">
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-md" />
              ) : (
                <div className="space-y-4">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Upload size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-700">{t.uploadPlan}</p>
                    <p className="text-sm text-slate-400">JPG, PNG or PDF (Image)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <div className="text-blue-600 shrink-0">
              <FileText size={24} />
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              {lang === 'bn' 
                ? 'আপনার বাড়ির ড্রয়িং বা সাইটের ছবি আপলোড করুন। এআই স্বয়ংক্রিয়ভাবে প্রয়োজনীয় মালামালের হিসাব করে দেবে।' 
                : 'Upload your house drawing or site photo. AI will automatically calculate the required materials.'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-12 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-emerald-600" size={48} />
              <p className="text-slate-500 font-medium">{t.loading}</p>
            </div>
          ) : result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
            >
              <div className="bg-emerald-600 p-6 text-white">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Package size={24} />
                  {t.estimateResult}
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase">{t.cement}</p>
                    <p className="text-2xl font-bold text-slate-800">{result.cement}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase">{t.sand}</p>
                    <p className="text-2xl font-bold text-slate-800">{result.sand}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase">{t.rod}</p>
                    <p className="text-2xl font-bold text-slate-800">{result.rod}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase">{t.bricks}</p>
                    <p className="text-2xl font-bold text-slate-800">{result.bricks}</p>
                  </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-700">
                    <DollarSign size={28} />
                    <span className="text-lg font-bold">{t.cost}</span>
                  </div>
                  <p className="text-3xl font-black text-emerald-600">
                    ৳ {result.totalCost.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-sm text-slate-600 italic leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400">
              <Calculator size={48} className="mb-4 opacity-20" />
              <p>{lang === 'bn' ? 'ফলাফল দেখতে ফাইল আপলোড করুন' : 'Upload a file to see results'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
