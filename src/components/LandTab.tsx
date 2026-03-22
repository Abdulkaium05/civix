import React, { useState, useEffect } from 'react';
import { translations, Language } from '../constants';
import { Ruler, Map as MapIcon, Info, Loader2, Building2, Trash2, MousePointer2 } from 'lucide-react';
import { getLandSuggestion } from '../services/gemini';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Area calculation utility (Spherical area)
function calculatePolygonArea(latlngs: L.LatLng[]) {
  if (latlngs.length < 3) return 0;
  const radius = 6378137; // Earth radius in meters
  let area = 0;
  for (let i = 0; i < latlngs.length; i++) {
    const j = (i + 1) % latlngs.length;
    const p1 = latlngs[i];
    const p2 = latlngs[j];
    area += (p2.lng - p1.lng) * (2 + Math.sin(p1.lat * Math.PI / 180) + Math.sin(p2.lat * Math.PI / 180));
  }
  area = area * radius * radius / 2;
  return Math.abs(area * Math.PI / 180);
}

function MapEvents({ onMapClick }: { onMapClick: (latlng: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

export default function LandTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const [area, setArea] = useState<number | null>(null);
  const [suggestion, setSuggestion] = useState<{ footprint: string; floors: string; reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMapClick = (latlng: L.LatLng) => {
    setPoints([...points, latlng]);
  };

  const calculateArea = () => {
    if (points.length < 3) return;
    const realArea = calculatePolygonArea(points);
    setArea(realArea);
    getAISuggestion(realArea);
  };

  const getAISuggestion = async (areaValue: number) => {
    setLoading(true);
    try {
      const res = await getLandSuggestion(areaValue, 'square meters');
      setSuggestion(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setPoints([]);
    setArea(null);
    setSuggestion(null);
  };

  const removeLastPoint = () => {
    setPoints(points.slice(0, -1));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t.land}</h2>
          <p className="text-slate-500">{lang === 'bn' ? 'ম্যাপ থেকে জমি চিহ্নিত করে এর পরিমাপ বের করুন' : 'Select land from the map to calculate its area'}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={removeLastPoint} 
            disabled={points.length === 0}
            className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={16} />
            {lang === 'bn' ? 'আগের পয়েন্ট মুছুন' : 'Undo'}
          </button>
          <button 
            onClick={clear} 
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} />
            {lang === 'bn' ? 'সব মুছুন' : 'Reset'}
          </button>
          <button 
            onClick={calculateArea}
            disabled={points.length < 3}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2"
          >
            <Ruler size={18} />
            {lang === 'bn' ? 'পরিমাপ করুন' : 'Calculate'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] bg-slate-200 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative group">
          <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-xl text-sm font-bold text-slate-700 border border-slate-200 shadow-sm flex items-center gap-2">
            <MousePointer2 size={16} className="text-emerald-600" />
            {lang === 'bn' ? 'জমির সীমানা চিহ্নিত করতে ম্যাপে ক্লিক করুন' : 'Click on map to mark land boundaries'}
          </div>
          
          <MapContainer center={[23.8103, 90.4125]} zoom={13} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onMapClick={handleMapClick} />
            {points.map((p, i) => (
              <Marker key={i} position={p} />
            ))}
            {points.length >= 3 && (
              <Polygon 
                positions={points} 
                pathOptions={{ fillColor: '#10b981', fillOpacity: 0.3, color: '#059669', weight: 3 }} 
              />
            )}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <Ruler size={24} />
              <h3 className="font-bold">{lang === 'bn' ? 'পরিমাপ ফলাফল' : 'Measurement Result'}</h3>
            </div>
            
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-1">{lang === 'bn' ? 'মোট এরিয়া' : 'Total Area'}</p>
              <p className="text-4xl font-black text-emerald-700">
                {area ? area.toFixed(2) : '0.00'} <span className="text-xl font-normal">m²</span>
              </p>
              {area && (
                <div className="mt-4 pt-4 border-t border-emerald-100 grid grid-cols-2 gap-2 text-xs text-emerald-600 font-medium">
                  <div className="bg-white/50 p-2 rounded-lg">{(area * 10.7639).toFixed(2)} sqft</div>
                  <div className="bg-white/50 p-2 rounded-lg">{(area * 0.000247105).toFixed(4)} Acre</div>
                  <div className="bg-white/50 p-2 rounded-lg">{(area / 40.468).toFixed(2)} Shotok</div>
                  <div className="bg-white/50 p-2 rounded-lg">{(area / 6.689).toFixed(2)} Katha</div>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <Loader2 className="animate-spin text-emerald-600" size={40} />
              <p className="text-slate-400 font-medium">{t.loading}</p>
            </div>
          )}

          <AnimatePresence>
            {suggestion && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl space-y-5 border border-slate-800"
              >
                <div className="flex items-center gap-3 text-emerald-400">
                  <div className="bg-emerald-400/10 p-2 rounded-lg">
                    <Building2 size={24} />
                  </div>
                  <h3 className="font-bold text-lg">{t.suggestion}</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.maxFootprint}</p>
                    <p className="text-lg font-bold text-emerald-400">{suggestion.footprint}</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">{t.maxFloors}</p>
                    <p className="text-lg font-bold text-emerald-400">{suggestion.floors}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-sm text-slate-400 leading-relaxed italic">
                      {suggestion.reasoning}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
