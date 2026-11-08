import React, { useState, useRef, useEffect } from 'react';
import { Disc, Play, Plus, Trash2, RotateCcw, Sparkles, Trophy, Utensils, Gamepad2, Flame, Compass, History } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DecisionWheel({ wheelPresets, onTriggerSound }) {
  // Preset state
  const [selectedPresetId, setSelectedPresetId] = useState(wheelPresets[0]?.id || 'food');
  const [options, setOptions] = useState(() => {
    return wheelPresets[0]?.options || [
      { text: "Tacos 🌮", color: "#f97316" },
      { text: "Sushi 🍣", color: "#ec4899" },
      { text: "Burgers 🍔", color: "#eab308" },
      { text: "Pizza 🍕", color: "#ef4444" }
    ];
  });

  const [newOptionText, setNewOptionText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [spinHistory, setSpinHistory] = useState([]);

  // Canvas ref & rotation angle
  const canvasRef = useRef(null);
  const currentAngleRef = useRef(0);
  const spinAnimationRef = useRef(null);

  // Switch preset
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setOptions(preset.options);
    setWinner(null);
  };

  // Add custom option
  const handleAddOption = (e) => {
    e.preventDefault();
    if (!newOptionText.trim()) return;

    const vibrantPalette = [
      '#06ffa5', '#ff007f', '#00f0ff', '#ffe600', 
      '#9d4edd', '#ff7700', '#10b981', '#3b82f6', '#f43f5e'
    ];
    const randomColor = vibrantPalette[options.length % vibrantPalette.length];

    setOptions([...options, { text: newOptionText.trim(), color: randomColor }]);
    setNewOptionText('');
  };

  // Remove option
  const handleRemoveOption = (indexToRemove) => {
    if (options.length <= 2) {
      alert("You need at least 2 options to spin!");
      return;
    }
    setOptions(options.filter((_, idx) => idx !== indexToRemove));
  };

  // Draw the wheel on the HTML5 Canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;
    const numOptions = options.length;
    const arcAngle = (2 * Math.PI) / numOptions;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentAngleRef.current);

    // Draw slices
    for (let i = 0; i < numOptions; i++) {
      const sliceStart = i * arcAngle;
      const sliceEnd = sliceStart + arcAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, sliceStart, sliceEnd);
      ctx.closePath();

      ctx.fillStyle = options[i].color || '#3b82f6';
      ctx.fill();

      // Border between slices
      ctx.strokeStyle = '#030712';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw label inside slice
      ctx.save();
      ctx.rotate(sliceStart + arcAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px Outfit, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.fillText(options[i].text, radius - 24, 6);
      ctx.restore();
    }

    ctx.restore();

    // Outer Glowing Ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 2, 0, 2 * Math.PI);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Center Hub Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner center icon / text
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);
  };

  useEffect(() => {
    drawWheel();
  }, [options]);

  // Spin the wheel
  const handleSpin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    if (onTriggerSound) {
      onTriggerSound('laser');
    }

    // Number of full rotations (5-8 turns) + random stop
    const extraTurns = 5 + Math.random() * 3;
    const randomAngle = Math.random() * 2 * Math.PI;
    const targetTotalAngle = currentAngleRef.current + extraTurns * 2 * Math.PI + randomAngle;
    const duration = 4000; // 4 seconds
    const startAngle = currentAngleRef.current;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      currentAngleRef.current = startAngle + (targetTotalAngle - startAngle) * easeOut;

      drawWheel();

      if (progress < 1) {
        spinAnimationRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);

        // Calculate winner
        // Pointer is at the right (0 radians or 3 o'clock).
        const normalizedAngle = (currentAngleRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const arc = (2 * Math.PI) / options.length;
        // Slice under the pointer:
        const winningIndex = Math.floor((2 * Math.PI - normalizedAngle) / arc) % options.length;
        const chosen = options[winningIndex];

        setWinner(chosen);
        setSpinHistory(prev => [
          { text: chosen.text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...prev.slice(0, 4)
        ]);

        if (onTriggerSound) {
          onTriggerSound('win');
        }

        // Fire celebration confetti!
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    };

    spinAnimationRef.current = requestAnimationFrame(animate);
  };

  return (
    <section id="wheel" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-900">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest mb-3">
          <Disc className="w-3.5 h-3.5" />
          <span>The Dispute Settler</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase font-display">
          The Decision <span className="text-amber-400">Wheel</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 mt-2">
          End 45-minute group debates instantly. Pick a category or customize the slices, then spin to let fate decide.
        </p>
      </div>

      {/* Preset Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {wheelPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedPresetId === preset.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 scale-105'
                : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span>{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Main Wheel Grid: Interactive Wheel + Controls & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
        
        {/* Left Column: Interactive Wheel Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
            
            {/* Pointer arrow pointing at the right side of the wheel */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
              <div className="w-0 h-0 border-y-[14px] border-y-transparent border-r-[28px] border-r-amber-400 transform rotate-180" />
            </div>

            <canvas
              ref={canvasRef}
              width={420}
              height={420}
              className="w-full h-full cursor-pointer rounded-full"
              onClick={handleSpin}
            />
          </div>

          {/* Spin Trigger Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSpin}
              disabled={isSpinning || options.length < 2}
              className="flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:brightness-110 text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-wider"
            >
              <Play className={`w-5 h-5 fill-slate-950 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Spinning The Wheel...' : 'Spin The Wheel!'}</span>
            </button>
          </div>

          {/* Winner Celebration Banner */}
          {winner && (
            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 border-2 border-amber-400 text-center animate-bounce-subtle w-full max-w-md shadow-xl">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>The Wheel Has Spoken!</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {winner.text}
              </h3>
            </div>
          )}
        </div>

        {/* Right Column: Option Editor & History */}
        <div className="lg:col-span-5 bg-slate-900/80 p-6 rounded-3xl border border-slate-800/80 shadow-xl space-y-6">
          
          {/* Add Option Form */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-2 flex items-center justify-between">
              <span>Wheel Slices ({options.length})</span>
              <span className="text-[11px] text-slate-400 font-normal">Min 2 required</span>
            </h4>
            
            <form onSubmit={handleAddOption} className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom option (e.g. Boba 🧋)"
                value={newOptionText}
                onChange={(e) => setNewOptionText(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </form>
          </div>

          {/* List of current options */}
          <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
            {options.map((opt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: opt.color }}
                  />
                  <span className="font-medium text-slate-200">{opt.text}</span>
                </div>
                <button
                  onClick={() => handleRemoveOption(idx)}
                  className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                  title="Remove slice"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Spin History */}
          {spinHistory.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Wheel Verdicts</span>
              </div>
              <div className="space-y-1.5">
                {spinHistory.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-slate-300 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-850">
                    <span className="font-semibold text-amber-300">🎉 {item.text}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
