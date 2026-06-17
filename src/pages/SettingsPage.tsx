import { ShieldCheck, Trash2, Database } from "lucide-react";
import React, { useState } from "react";
import Button from "../shared/ui/Button";

const SettingsPage = () => {
  const [cleared, setCleared] = useState(false);

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to delete all local history and preferences? This cannot be undone.")) {
      localStorage.clear();
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  };

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
              <strong>Data Storage:</strong> VideoTube prioritizes your privacy. We do not store any of your watch history, search queries, or watch later playlists on external servers. 
              All personal data generated during your session is saved strictly locally within your browser using <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code>.
            </p>
            <p>
              <strong>YouTube API:</strong> This application utilizes the official YouTube Data API v3 to fetch videos, comments, and channel details. By using this application, you agree to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">YouTube Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Google Privacy Policy</a>.
            </p>
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
