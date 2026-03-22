import React, { useState, useEffect } from 'react';
import { translations, Language } from '../constants';
import { MapPin, Navigation, Layers, Play, Square } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icon issue
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

export default function SurveyTab({ lang }: { lang: Language }) {
  const t = translations[lang];
  const [location, setLocation] = useState<{ lat: number; lng: number; alt: number | null } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watchId: number;
    if (isTracking) {
      if ("geolocation" in navigator) {
        watchId = navigator.geolocation.watchPosition(
          (pos) => {
            setLocation({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              alt: pos.coords.altitude
            });
            setError(null);
          },
          (err) => {
            setError(err.message);
            setIsTracking(false);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setError("Geolocation not supported");
      }
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t.survey}</h2>
          <p className="text-slate-500">{lang === 'bn' ? 'রিয়েল-টাইম লোকেশন এবং সার্ভে তথ্য' : 'Real-time location and survey data'}</p>
        </div>
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            isTracking 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
          }`}
        >
          {isTracking ? <Square size={20} /> : <Play size={20} />}
          {isTracking ? t.stopSurvey : t.startSurvey}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 h-[400px] bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <MapContainer center={[23.8103, 90.4125]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {location && (
              <>
                <ChangeView center={[location.lat, location.lng]} />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    You are here. <br /> Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                  </Popup>
                </Marker>
              </>
            )}
          </MapContainer>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-emerald-600">
              <Navigation size={24} />
              <h3 className="font-bold">{lang === 'bn' ? 'লোকেশন ডেটা' : 'Location Data'}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.latitude}</p>
                <p className="text-lg font-mono font-bold text-slate-700">
                  {location ? location.lat.toFixed(6) : '--.------'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.longitude}</p>
                <p className="text-lg font-mono font-bold text-slate-700">
                  {location ? location.lng.toFixed(6) : '--.------'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{t.elevation}</p>
                <p className="text-lg font-mono font-bold text-slate-700">
                  {location?.alt ? `${location.alt.toFixed(2)} m` : 'N/A'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <Layers size={20} />
              <h4>{lang === 'bn' ? 'সার্ভে টিপস' : 'Survey Tips'}</h4>
            </div>
            <p className="text-sm text-emerald-600 leading-relaxed">
              {lang === 'bn' 
                ? 'সঠিক রিডিউস লেভেল (RL) পেতে বেঞ্চমার্ক (BM) থেকে লেভেল ট্রান্সফার করুন।' 
                : 'Transfer levels from a Benchmark (BM) to get accurate Reduced Level (RL).'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
