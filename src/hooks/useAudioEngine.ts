import { useEffect, useRef } from 'react';
import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';
import { useAudioStore } from '../store/useAudioStore';
import { useSceneStore } from '../store/useSceneStore';

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
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.ContinuePlayback,
      },
    });
    isSetup = true;
  } catch (e) {
    // Player may already be initialized
    isSetup = true;
  }
};

export const useAudioEngine = () => {
  const { isPlaying, volumes, masterVolume, activeAmbientLayer, activeNoiseType } =
    useAudioStore();
  const { activeSceneId, presets, custom } = useSceneStore();
  const isInitialized = useRef(false);

  useEffect(() => {
    const init = async () => {
      await setupTrackPlayer();
      isInitialized.current = true;
    };
    init();
  }, []);

  useEffect(() => {
    if (!isInitialized.current) return;

    const updatePlayback = async () => {
      try {
        const scene = [...presets, ...custom].find(
          (s) => s.id === activeSceneId
        );
        const sceneName = scene?.name ?? 'Zone';

        await TrackPlayer.updateNowPlayingMetadata({
          title: sceneName,
          artist: 'Zone',
        });

        if (isPlaying) {
          // Add tracks based on active volumes
          await TrackPlayer.reset();

          const tracks: { url: any; title: string; artist: string }[] = [];

          if (volumes.white > 0) {
            tracks.push({
              url: require('../../assets/audio/white-noise.mp3'),
              title: 'White Noise',
              artist: 'Zone',
            });
          }
          if (volumes.pink > 0) {
            tracks.push({
              url: require('../../assets/audio/pink-noise.mp3'),
              title: 'Pink Noise',
              artist: 'Zone',
            });
          }
          if (volumes.brown > 0) {
            tracks.push({
              url: require('../../assets/audio/brown-noise.mp3'),
              title: 'Brown Noise',
              artist: 'Zone',
            });
          }

          if (tracks.length > 0) {
            await TrackPlayer.add(tracks[0]);
            await TrackPlayer.updateNowPlayingMetadata({
              title: sceneName,
              artist: 'Zone',
            });
            await TrackPlayer.setVolume(masterVolume);
            await TrackPlayer.play();
          }
        } else {
          await TrackPlayer.pause();
        }
      } catch (e) {
        // Handle gracefully
      }
    };

    updatePlayback();
  }, [isPlaying, volumes, masterVolume, activeAmbientLayer, activeSceneId, activeNoiseType, presets, custom]);

  return { isInitialized: isInitialized.current };
};
