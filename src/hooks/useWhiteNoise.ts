// ============================================================
// useWhiteNoise — 白噪音播放管理 Hook
// ============================================================
import { useState, useCallback, useEffect } from 'react';
import {
  playNoiseTrack,
  pauseNoise,
  resumeNoise,
  stopNoise,
  setNoiseVolume,
  getNoiseVolume,
  getCurrentTrackId,
  NOISE_TRACKS,
  type NoiseTrack,
} from '../utils/sounds';

export function useWhiteNoise() {
  const [activeTrackId, setActiveTrackId] = useState<string | null>(getCurrentTrackId());
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(getNoiseVolume());

  // 同步初始状态
  useEffect(() => {
    const current = getCurrentTrackId();
    setActiveTrackId(current);
    if (current) setIsPlaying(true);
  }, []);

  const play = useCallback(async (trackId: string) => {
    const ok = await playNoiseTrack(trackId);
    if (ok) {
      setActiveTrackId(trackId);
      setIsPlaying(true);
    }
  }, []);

  const pause = useCallback(async () => {
    await pauseNoise();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(async () => {
    await resumeNoise();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(async () => {
    await stopNoise();
    setActiveTrackId(null);
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(
    async (trackId: string) => {
      if (activeTrackId === trackId && isPlaying) {
        await pause();
      } else if (activeTrackId === trackId && !isPlaying) {
        await resume();
      } else {
        await play(trackId);
      }
    },
    [activeTrackId, isPlaying, play, pause, resume],
  );

  const changeVolume = useCallback(async (vol: number) => {
    await setNoiseVolume(vol);
    setVolumeState(vol);
  }, []);

  // 组件卸载时停止
  useEffect(() => {
    return () => {
      // 不自动停止 — 保持后台播放
      // 若需要停止，取消下面注释：
      // stopNoise().catch(() => {});
    };
  }, []);

  return {
    tracks: NOISE_TRACKS,
    activeTrackId,
    isPlaying,
    volume,
    play,
    pause,
    resume,
    stop,
    toggle,
    changeVolume,
  };
}
