import { create } from 'zustand';

export type TimerMode = 'countdown' | 'off';

interface TimerState {
  mode: TimerMode;
  duration: number; // minutes
  remaining: number; // seconds
  isRunning: boolean;
  playIndefinitely: boolean;
  endChime: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setMode: (m: TimerMode) => void;
  setDuration: (min: number) => void;
  setPlayIndefinitely: (v: boolean) => void;
  setEndChime: (v: boolean) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'off',
  duration: 25,
  remaining: 25 * 60,
  isRunning: false,
  playIndefinitely: false,
  endChime: true,

  startTimer: () => {
    const state = get();
    if (state.playIndefinitely || state.mode === 'off') return;
    if (state.remaining <= 0) {
      set({ remaining: state.duration * 60, isRunning: true });
    } else {
      set({ isRunning: true });
    }
  },

  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const state = get();
    set({ remaining: state.duration * 60, isRunning: false });
  },

  tickTimer: () => {
    const state = get();
    if (!state.isRunning || state.remaining <= 0) return;
    const newRemaining = state.remaining - 1;
    if (newRemaining <= 0) {
      set({ remaining: 0, isRunning: false });
    } else {
      set({ remaining: newRemaining });
    }
  },

  setMode: (m) => {
    const state = get();
    set({ mode: m, remaining: state.duration * 60, isRunning: false });
  },

  setDuration: (min) => {
    set({ duration: min, remaining: min * 60 });
  },

  setPlayIndefinitely: (v) => set({ playIndefinitely: v }),
  setEndChime: (v) => set({ endChime: v }),
}));
