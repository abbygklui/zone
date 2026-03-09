import { create } from 'zustand';

export type TimerMode = 'pomodoro' | 'countdown' | 'off';
export type TimerPhase = 'focus' | 'break';

interface TimerState {
  mode: TimerMode;
  focusDuration: number;
  breakDuration: number;
  phase: TimerPhase;
  remaining: number;
  isRunning: boolean;
  sessionsCompleted: number;
  endChime: boolean;
  autoPauseOnBreak: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setMode: (m: TimerMode) => void;
  setFocusDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;
  setEndChime: (v: boolean) => void;
  setAutoPauseOnBreak: (v: boolean) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'off',
  focusDuration: 25,
  breakDuration: 5,
  phase: 'focus',
  remaining: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,
  endChime: true,
  autoPauseOnBreak: false,

  startTimer: () => {
    const state = get();
    if (state.mode === 'off') return;
    if (state.remaining <= 0) {
      const duration =
        state.phase === 'focus' ? state.focusDuration : state.breakDuration;
      set({ remaining: duration * 60, isRunning: true });
    } else {
      set({ isRunning: true });
    }
  },

  pauseTimer: () => set({ isRunning: false }),

  resetTimer: () => {
    const state = get();
    const duration =
      state.phase === 'focus' ? state.focusDuration : state.breakDuration;
    set({ remaining: duration * 60, isRunning: false });
  },

  tickTimer: () => {
    const state = get();
    if (!state.isRunning || state.remaining <= 0) return;

    const newRemaining = state.remaining - 1;
    if (newRemaining <= 0) {
      if (state.mode === 'pomodoro') {
        const nextPhase: TimerPhase =
          state.phase === 'focus' ? 'break' : 'focus';
        const nextDuration =
          nextPhase === 'focus' ? state.focusDuration : state.breakDuration;
        const newSessions =
          state.phase === 'focus'
            ? state.sessionsCompleted + 1
            : state.sessionsCompleted;
        set({
          phase: nextPhase,
          remaining: nextDuration * 60,
          isRunning: !state.autoPauseOnBreak || nextPhase === 'focus',
          sessionsCompleted: newSessions,
        });
      } else {
        set({ remaining: 0, isRunning: false });
      }
    } else {
      set({ remaining: newRemaining });
    }
  },

  setMode: (m) => {
    const state = get();
    const duration = state.focusDuration;
    set({ mode: m, remaining: duration * 60, isRunning: false, phase: 'focus' });
  },

  setFocusDuration: (min) => {
    const state = get();
    set({
      focusDuration: min,
      remaining: state.phase === 'focus' ? min * 60 : state.remaining,
    });
  },

  setBreakDuration: (min) => {
    const state = get();
    set({
      breakDuration: min,
      remaining: state.phase === 'break' ? min * 60 : state.remaining,
    });
  },

  setEndChime: (v) => set({ endChime: v }),
  setAutoPauseOnBreak: (v) => set({ autoPauseOnBreak: v }),
}));
