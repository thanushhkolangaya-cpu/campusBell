import { NotificationSound } from '../types';

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playNotificationSound(sound: NotificationSound, volume = 0.8): void {
  if (sound === 'none') return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.01, Math.min(volume, 1.0)), now);
    masterGain.connect(ctx.destination);

    switch (sound) {
      case 'chime': {
        // High pleasant harmonic chord (C5, E5, G5, C6)
        const freqs = [523.25, 659.25, 783.99, 1046.50];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);

          noteGain.gain.setValueAtTime(0, now + idx * 0.08);
          noteGain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.9);

          osc.connect(noteGain);
          noteGain.connect(masterGain);

          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 1.0);
        });
        break;
      }

      case 'bell': {
        // Resonant campus bell tone
        const fundamental = 880; // A5
        const partials = [1, 2.01, 3.02, 4.2];
        const amps = [0.4, 0.2, 0.1, 0.05];

        partials.forEach((mult, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(fundamental * mult, now);

          g.gain.setValueAtTime(amps[i], now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 - i * 0.2);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(now);
          osc.stop(now + 1.3);
        });
        break;
      }

      case 'marimba': {
        // Warm wooden pulse
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + i * 0.06);

          g.gain.setValueAtTime(0, now + i * 0.06);
          g.gain.linearRampToValueAtTime(0.35, now + i * 0.06 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.45);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.5);
        });
        break;
      }

      case 'ping': {
        // Modern crisp double ping
        [1200, 1600].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = now + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          g.gain.setValueAtTime(0.3, start);
          g.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);

          osc.connect(g);
          g.connect(masterGain);

          osc.start(start);
          osc.stop(start + 0.35);
        });
        break;
      }
    }
  } catch (err) {
    console.error('Audio playback failed', err);
  }
}
