import { useEffect, useRef } from 'react';
import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import { useAudioStore } from '../store/useAudioStore';

let isSetup = false;

export const setupTrackPlayer = async () => {
  if (isSetup) return;
  try {
    await TrackPlayer.setupPlayer({
      autoHandleInterruptions: true,
    });
    await TrackPlayer.updateOptions({
      capabilities: [Capability.Play, Capability.Pause],
      compactCapabilities: [Capability.Play, Capability.Pause],
      android: {
        appKilledPlaybackBehavior: AppKilledPlaybackBehavior.ContinuePlayback,
      },
    });
    isSetup = true;
  } catch {
    isSetup = true;
  }
};

const TRACKS = {
  white: {
    url: require('../../assets/audio/white-noise.wav'),
    title: 'White Noise',
    artist: 'Zone',
  },
  pink: {
    url: require('../../assets/audio/pink-noise.wav'),
    title: 'Pink Noise',
    artist: 'Zone',
  },
  brown: {
    url: require('../../assets/audio/brown-noise.wav'),
    title: 'Brown Noise',
    artist: 'Zone',
  },
};

export const useAudioEngine = () => {
  const { isPlaying, masterVolume, activeNoiseType } = useAudioStore();
  const isInitialized = useRef(false);
  const currentNoiseType = useRef(activeNoiseType);

  // Setup player on mount
  useEffect(() => {
    const init = async () => {
      await setupTrackPlayer();
      // Load the initial track
      const track = TRACKS[activeNoiseType];
      await TrackPlayer.reset();
      await TrackPlayer.add({ ...track, isLiveStream: false });
      await TrackPlayer.setRepeatMode(2); // RepeatMode.Track
      isInitialized.current = true;
    };
    init();
  }, []);

  // Handle play/pause
  useEffect(() => {
    if (!isInitialized.current) return;
    if (isPlaying) {
      TrackPlayer.play();
    } else {
      TrackPlayer.pause();
    }
  }, [isPlaying]);

  // Handle noise type change — swap track with crossfade
  useEffect(() => {
    if (!isInitialized.current) return;
    if (currentNoiseType.current === activeNoiseType) return;
    currentNoiseType.current = activeNoiseType;

    const swap = async () => {
      const wasPlaying = isPlaying;
      await TrackPlayer.reset();
      await TrackPlayer.add({ ...TRACKS[activeNoiseType], isLiveStream: false });
      await TrackPlayer.setRepeatMode(2);
      if (wasPlaying) {
        await TrackPlayer.play();
      }
    };
    swap();
  }, [activeNoiseType, isPlaying]);

  // Handle volume
  useEffect(() => {
    if (!isInitialized.current) return;
    TrackPlayer.setVolume(masterVolume);
  }, [masterVolume]);

  return { isInitialized: isInitialized.current };
};
