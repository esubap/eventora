import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Filter, Upload, Music, Radio, Play, Sliders } from 'lucide-react';

export default function Soundboard({ sounds, onPlaySound, activePlayingSound, masterVolume, onChangeVolume }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customAudioUrl, setCustomAudioUrl] = useState('');
  const [customSoundName, setCustomSoundName] = useState('');
  const [customSounds, setCustomSounds] = useState([]);

  const categories = ['All', 'Memes', 'Gaming', 'Drama', 'Reactions'];

  // Handle keyboard shortcuts (1-9, 0, G, B)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const pressedKey = e.key.toUpperCase();
      const matchedSound = [...sounds, ...customSounds].find(s => s.shortcut?.toUpperCase() === pressedKey);
      if (matchedSound) {
        e.preventDefault();
        onPlaySound(matchedSound);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sounds, customSounds, onPlaySound]);

  // Handle custom audio file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newCustom = {
        id: `custom-${Date.now()}`,
        name: customSoundName || file.name.replace(/\.[^/.]+$/, ""),
        emoji: "🎵",
        category: "Custom",
        audioUrl: url,
        color: "from-pink-500 to-rose-600",
        shortcut: `${customSounds.length + 1}`,
        description: "User uploaded audio clip"
      };
      setCustomSounds([...customSounds, newCustom]);
      setCustomSoundName('');
    }
  };

  const allDisplaySounds = [...sounds, ...customSounds].filter(sound => {
    return selectedCategory === 'All' || sound.category === selectedCategory;
  });

  return (
    <section id="soundboard" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-900">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 uppercase tracking-widest mb-3">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voice Chat Weaponry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-display">
            The Squad <span className="text-pink-400">Soundboard</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
            Instant sound effects synthesized live in your browser. Press buttons or use keyboard number keys 1–9.
          </p>
        </div>

        {/* Volume & Waveform Bar */}
        <div className="flex items-center gap-4 bg-slate-900/80 px-5 py-3 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={masterVolume}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-pink-500 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-300 w-8">
              {Math.round(masterVolume * 100)}%
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-end gap-1 h-6 pl-2 border-l border-slate-800">
            {[40, 75, 100, 60, 90, 50, 80].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  activePlayingSound ? 'bg-pink-400 animate-pulse' : 'bg-slate-700'
                }`}
                style={{
                  height: activePlayingSound ? `${(h * masterVolume)}%` : '20%'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        <Filter className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
        {customSounds.length > 0 && (
          <button
            onClick={() => setSelectedCategory('Custom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'Custom'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Custom Uploads ({customSounds.length})
          </button>
        )}
      </div>

      {/* Sound Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allDisplaySounds.map((sound) => {
          const isPlaying = activePlayingSound === sound.id;

          return (
            <button
              key={sound.id}
              onClick={() => onPlaySound(sound)}
              className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 overflow-hidden flex flex-col justify-between hover:-translate-y-1 active:scale-95 ${
                isPlaying
                  ? 'bg-slate-850 border-pink-400 shadow-xl shadow-pink-500/25 ring-2 ring-pink-400/50 scale-[1.02]'
                  : 'bg-slate-900/90 border-slate-800/90 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              {/* Subtle gradient corner accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${sound.color || 'from-pink-500 to-purple-600'} opacity-10 group-hover:opacity-25 rounded-bl-full pointer-events-none transition-opacity`}
              />

              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                  {sound.emoji}
                </span>

                {sound.shortcut && (
                  <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-700 text-[11px] font-mono font-bold text-slate-400 group-hover:text-pink-400 group-hover:border-pink-500/40 shadow-inner">
                    Key: {sound.shortcut}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-pink-300 transition-colors">
                  {sound.name}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                  {sound.description}
                </p>
              </div>

              {/* Playing indicator strip */}
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-mono uppercase text-[10px]">
                  {sound.category}
                </span>
                {isPlaying ? (
                  <span className="text-pink-400 font-bold flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3" /> Playing
                  </span>
                ) : (
                  <span className="text-slate-400 group-hover:text-slate-300 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Tap
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Upload Custom Audio Clip Banner */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">
              Want to add your own real voice clips or MP3 memes?
            </h4>
            <p className="text-xs text-slate-400">
              Select any audio file from your computer to test it on the board right now, or edit squadData.json to add permanent links!
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-bold text-xs cursor-pointer transition-colors shrink-0">
          <Upload className="w-4 h-4 text-pink-400" />
          <span>Upload Audio Clip (.mp3 / .wav)</span>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

    </section>
  );
}
