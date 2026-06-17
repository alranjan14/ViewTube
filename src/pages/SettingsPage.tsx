import { ShieldCheck, Trash2, Database, Settings, Activity } from "lucide-react";
import React, { useState } from "react";
import { useLocalStorage } from "../shared/hooks/useLocalStorage";
import Button from "../shared/ui/Button";

const SettingsPage = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all local history and preferences? This cannot be undone.")) {
      localStorage.clear();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
      window.location.reload();
    }
  };

  const [region, setRegion] = useLocalStorage('yt_clone_region', 'IN');
  const [language, setLanguage] = useLocalStorage('yt_clone_language', 'en');
  const [theme, setTheme] = useLocalStorage('yt_clone_theme', 'light');
  const [autoplay, setAutoplay] = useLocalStorage('yt_clone_autoplay', true);

  const isMockApi = import.meta.env.VITE_USE_MOCK_API === 'true';

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Settings & Privacy</h1>
      </div>

      <div className="flex flex-col gap-8">
        {/* Privacy & Data Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <ShieldCheck className="text-blue-600" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">Privacy & Data Compliance</h2>
          </div>
          <div className="p-5 space-y-4 text-sm text-slate-600">
            <p>
              <strong>Data Storage:</strong> ViewTube prioritizes your privacy. We do not store any of your watch history, search queries, or watch later playlists on external servers. 
              All personal data generated during your session is saved strictly locally within your browser using <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code>.
            </p>
            <p>
              <strong>YouTube API:</strong> This application utilizes the official YouTube Data API v3 to fetch videos, comments, and channel details. By using this application, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Google Privacy Policy</a>.
            </p>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Settings className="text-slate-700" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">Preferences</h2>
          </div>
          <div className="p-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-900">Region Location</h3>
                <p className="text-sm text-slate-500">Select your default region for trending videos.</p>
              </div>
              <select 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="US">United States</option>
                <option value="IN">India</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-900">Language</h3>
                <p className="text-sm text-slate-500">Select your preferred application language.</p>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English (US)</option>
                <option value="hi">Hindi</option>
                <option value="es">Spanish</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-900">Theme</h3>
                <p className="text-sm text-slate-500">Choose your visual aesthetic.</p>
              </div>
              <select 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)}
                className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="light">Light Theme</option>
                <option value="dark" disabled>Dark Theme (Coming Soon)</option>
                <option value="system">Device Default</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <div>
                <h3 className="font-medium text-slate-900">Autoplay Next Video</h3>
                <p className="text-sm text-slate-500">Automatically play the next related video.</p>
              </div>
              <button 
                onClick={() => setAutoplay(!autoplay)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoplay ? 'bg-blue-600' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoplay ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Diagnostics Section */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Activity className="text-green-600" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">Diagnostics</h2>
          </div>
          <div className="p-5 text-sm text-slate-600 space-y-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-medium">API Provider</span>
              <span className={isMockApi ? 'text-yellow-600 font-bold' : 'text-green-600 font-bold'}>
                {isMockApi ? 'MOCK API (Offline Mode)' : 'YOUTUBE DATA API (Live)'}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2 pt-2">
              <span className="font-medium">Version</span>
              <span>v1.0.0</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-medium">Environment</span>
              <span>{import.meta.env.MODE}</span>
            </div>
          </div>
        </section>

        {/* Local Storage Management */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <Database className="text-red-600" size={24} />
            <h2 className="text-lg font-semibold text-slate-800">Manage Local Data</h2>
          </div>
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-600 max-w-xl">
              <p>
                You can instantly delete all locally stored preferences, watch history, and playlists from this browser. This action is irreversible.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                variant="primary" 
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 size={18} />
                Clear All Local Data
              </Button>
            </div>
          </div>
          {cleared && (
            <div className="px-5 py-3 bg-green-50 border-t border-green-100 text-green-700 text-sm font-medium animate-in fade-in">
              Successfully cleared all local data!
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
