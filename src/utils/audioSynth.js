// Web Audio API Synthesizer for Squad Soundboard
// Produces instant, zero-dependency, punchy sound effects right in the browser!

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSynthesizedSound(synthType, masterVolume = 0.8) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(masterVolume, now);
    masterGain.connect(ctx.destination);

    switch (synthType) {
      case 'airhorn': {
        // Multi-frequency punchy horn bursts
        const freqs = [311.13, 370.0, 466.16]; // Eb4, F#4, Bb4
        const bursts = [0, 0.14, 0.28];
        bursts.forEach(startTime => {
          freqs.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, now + startTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.05, now + startTime + 0.1);

            gain.gain.setValueAtTime(0, now + startTime);
            gain.gain.linearRampToValueAtTime(0.18, now + startTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, now + startTime + 0.12);

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now + startTime);
            osc.stop(now + startTime + 0.13);
          });
        });
        break;
      }

      case 'trombone_fail': {
        // Sad trombone 4 notes: D4 -> C#4 -> C4 -> B3 with slide
        const notes = [
          { f: 293.66, t: 0, d: 0.28 },
          { f: 277.18, t: 0.32, d: 0.28 },
          { f: 261.63, t: 0.64, d: 0.28 },
          { f: 246.94, t: 0.96, d: 0.75, slide: 200 }
        ];
        notes.forEach(({ f, t, d, slide }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(f, now + t);
          if (slide) {
            osc.frequency.exponentialRampToValueAtTime(slide, now + t + d);
          }

          gain.gain.setValueAtTime(0, now + t);
          gain.gain.linearRampToValueAtTime(0.25, now + t + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + t);
          osc.stop(now + t + d);
        });
        break;
      }

      case 'bonk': {
        // High impact hollow pitch drop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }

      case 'level_up': {
        // Ascending sparkle arpeggio
        const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        arpeggio.forEach((f, idx) => {
          const t = idx * 0.06;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + t);

          gain.gain.setValueAtTime(0, now + t);
          gain.gain.linearRampToValueAtTime(0.3, now + t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.35);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + t);
          osc.stop(now + t + 0.36);
        });
        break;
      }

      case 'win': {
        // 8-Bit retro victory fanfare
        const notes = [
          { f: 523.25, t: 0.0, d: 0.1 },
          { f: 523.25, t: 0.12, d: 0.1 },
          { f: 523.25, t: 0.24, d: 0.1 },
          { f: 659.25, t: 0.36, d: 0.25 },
          { f: 587.33, t: 0.64, d: 0.15 },
          { f: 783.99, t: 0.82, d: 0.45 }
        ];
        notes.forEach(({ f, t, d }) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(f, now + t);

          gain.gain.setValueAtTime(0.2, now + t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now + t);
          osc.stop(now + t + d);
        });
        break;
      }

      case 'dramatic_boom': {
        // Deep sub impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(28, now + 0.9);

        gain.gain.setValueAtTime(0.9, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.2);
        break;
      }

      case 'laser': {
        // Fast laser sweep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1600, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'coin': {
        // Mario coin chime (B5 -> E6)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

        osc2.frequency.setValueAtTime(987.77 * 2, now);
        osc2.frequency.setValueAtTime(1318.51 * 2, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.48);
        osc2.stop(now + 0.48);
        break;
      }

      case 'buzzer': {
        // Dissonant wrong answer buzz
        [150, 155].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.36);
        });
        break;
      }

      case 'applause': {
        // Noise burst with clapping rhythm
        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 2.0;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        noise.start(now);
        noise.stop(now + 0.85);
        break;
      }

      case 'glitch': {
        // Random pitch stepped matrix glitch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';

        const steps = [400, 800, 200, 1200, 300, 950, 150];
        steps.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        });

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'bruh_fall': {
        // Resonant bruh vocal-like drop
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.4);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(120, now + 0.4);
        filter.Q.value = 4.0;

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }

      default: {
        // Generic crisp click / pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }
    }
  } catch (err) {
    console.warn('Audio synthesis failed:', err);
  }
}
