import React, { useState } from 'react';
import initialSquadData from './data/squadData.json';
import { playSynthesizedSound } from './utils/audioSynth';

import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SquadRoster from './components/SquadRoster';
import MemberDetailModal from './components/MemberDetailModal';
import QuoteWall from './components/QuoteWall';
import DecisionWheel from './components/DecisionWheel';
import Soundboard from './components/Soundboard';
import DataCustomizerModal from './components/DataCustomizerModal';
import Footer from './components/Footer';

export default function App() {
  const [data, setData] = useState(initialSquadData);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  
  // Audio state
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [activePlayingSound, setActivePlayingSound] = useState(null);

  // Play sound effect (synthesizer or audio file)
  const handlePlaySound = (soundObjOrType) => {
    // If it's just a synthType string
    if (typeof soundObjOrType === 'string') {
      playSynthesizedSound(soundObjOrType, masterVolume);
      setActivePlayingSound(soundObjOrType);
      setTimeout(() => setActivePlayingSound(null), 600);
      return;
    }

    const sound = soundObjOrType;
    setActivePlayingSound(sound.id);

    // If custom audio file URL is supplied
    if (sound.audioUrl) {
      const audio = new Audio(sound.audioUrl);
      audio.volume = masterVolume;
      audio.play().catch(e => console.warn("Audio playback error:", e));
      audio.onended = () => setActivePlayingSound(null);
    } else {
      // Use synthesized sound
      playSynthesizedSound(sound.synthType, masterVolume);
      setTimeout(() => setActivePlayingSound(null), 600);
    }
  };

  // Add new quote to the collection
  const handleAddQuote = (newQuote) => {
    setData(prev => ({
      ...prev,
      quotes: [newQuote, ...prev.quotes]
    }));
    handlePlaySound('level_up');
  };

  // Update whole squad dataset
  const handleUpdateData = (newData) => {
    setData(newData);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Navigation */}
      <Navbar
        squadInfo={data.squadInfo}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section: Crew name, animated title, bold group banner */}
        <HeroSection
          squadInfo={data.squadInfo}
          members={data.members}
          onTriggerSound={handlePlaySound}
        />

        {/* 2. Squad Roster: Grid of character-style cards */}
        <SquadRoster
          members={data.members}
          onSelectMember={(member) => setSelectedMember(member)}
        />

        {/* 3. The Quote Wall: Filterable cards of iconic quotes */}
        <QuoteWall
          quotes={data.quotes}
          quoteCategories={data.quoteCategories}
          members={data.members}
          onAddQuote={handleAddQuote}
        />

        {/* 4. The Decision Wheel: Interactive spinning wheel */}
        <DecisionWheel
          wheelPresets={data.wheelPresets}
          onTriggerSound={handlePlaySound}
        />

        {/* 5. Soundboard: Grid of styled buttons ready for short audio clips */}
        <Soundboard
          sounds={data.sounds}
          onPlaySound={handlePlaySound}
          activePlayingSound={activePlayingSound}
          masterVolume={masterVolume}
          onChangeVolume={setMasterVolume}
        />
      </main>

      {/* Footer */}
      <Footer squadInfo={data.squadInfo} />

      {/* Member Dossier Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          quotes={data.quotes}
          onClose={() => setSelectedMember(null)}
          onTriggerSound={handlePlaySound}
        />
      )}

      {/* Data Customizer / JSON Exporter Modal */}
      {isCustomizerOpen && (
        <DataCustomizerModal
          squadData={data}
          onUpdateData={handleUpdateData}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}

    </div>
  );
}
