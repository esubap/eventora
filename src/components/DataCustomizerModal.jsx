import React, { useState } from 'react';
import { X, Copy, Check, FileJson, Info, Sparkles, RefreshCw, Download } from 'lucide-react';

export default function DataCustomizerModal({ squadData, onUpdateData, onClose }) {
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' | 'editor'
  const [jsonText, setJsonText] = useState(() => JSON.stringify(squadData, null, 2));
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.members || !parsed.quotes || !parsed.squadInfo) {
        throw new Error("JSON must include squadInfo, members, and quotes arrays!");
      }
      onUpdateData(parsed);
      setErrorMsg('');
      setSuccessMsg('Successfully loaded updated data into the hub!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(`Invalid JSON format: ${err.message}`);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'squadData.json';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileJson className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Squad Data & Customization</h3>
              <p className="text-xs text-slate-400">Swap in your real friend group photos, names, stats & quotes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 px-6 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>How To Swap Your Real Data</span>
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'editor'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Live JSON Viewer & Editor</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'guide' ? (
            <div className="space-y-6 text-sm text-slate-300">
              
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  📁 File Location
                </span>
                <p className="font-mono text-emerald-300 text-xs sm:text-sm bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 inline-block">
                  src/data/squadData.json
                </p>
                <p className="text-xs text-slate-400">
                  All squad members, roles, stats, quotes, wheel options, and sound clips are stored in this clean JSON file!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Real Photos</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Drop images into the <code className="text-emerald-300">/public</code> folder and set <code className="text-cyan-300">"avatar": "/photo.jpg"</code>, or paste direct URLs (Imgur, Discord, etc).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Funny Stats</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Customize funny stat meters per person: <code className="text-purple-300">"Coffee Dependency: 99%"</code>, <code className="text-purple-300">"Punctuality: 10%"</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">Iconic Quotes</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Add new quotes directly in the app with the <strong className="text-white">+ Add Quote</strong> button or bulk edit them in the JSON file.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="text-xs text-cyan-200">
                  <strong>Live Preview Available:</strong> You can edit the JSON right in the "Live JSON Viewer" tab and click "Apply Changes" to see your updates reflected instantly without rebuilding!
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Edit JSON below and click Apply Changes:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={16}
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                className="w-full font-mono text-xs p-4 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 focus:outline-none focus:border-cyan-400 leading-relaxed"
              />

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 font-mono">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 font-mono">
                  {successMsg}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Changes persist in browser memory or can be saved to src/data/squadData.json
          </span>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
            >
              Close
            </button>
            {activeTab === 'editor' && (
              <button
                onClick={handleApplyJson}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Apply Changes Live</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
