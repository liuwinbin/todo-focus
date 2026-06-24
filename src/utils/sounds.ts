// ============================================================
// 音效 & 白噪音播放工具（expo-av，懒加载）
// ============================================================
// expo-av 在 Expo Go 中可能原生模块未链接，故懒加载避免顶层静态 import 崩溃

// AVPlaybackSource 仅作类型使用
import type { AVPlaybackSource } from 'expo-av';

/** 懒加载 expo-av Audio 模块，不可用时返回 null */
async function getAudio() {
  try {
    const mod = await import('expo-av');
    return mod.Audio;
  } catch {
    return null;
  }
}

export type { AVPlaybackSource };

// ---- 白噪音音轨定义 ----
export interface NoiseTrack {
  id: string;
  name: string;
  emoji: string;
  category: 'nature' | 'ambient' | 'melodic';
  /** 资源引用 — 文件不存在时为 null */
  source: AVPlaybackSource | null;
}

// ---- 8 首白噪音音轨 ----
// 音频文件放在 assets/sounds/ 下
// 当前文件均未放入，source 全为 null，UI 可正常显示但无声音
const trackSources: Record<string, AVPlaybackSource | null> = {
  rain: null,       // require('../../assets/sounds/rain.mp3')
  forest: null,     // require('../../assets/sounds/forest.mp3')
  ocean: null,      // require('../../assets/sounds/ocean.mp3')
  cafe: null,       // require('../../assets/sounds/cafe.mp3')
  lofi: null,       // require('../../assets/sounds/lofi.mp3')
  fireplace: null,  // require('../../assets/sounds/fireplace.mp3')
  thunder: null,    // require('../../assets/sounds/thunder.mp3')
  wind: null,       // require('../../assets/sounds/wind.mp3')
};

export const NOISE_TRACKS: NoiseTrack[] = [
  { id: 'rain',       name: '雨声',     emoji: '🌧️',  category: 'nature',   source: trackSources.rain },
  { id: 'forest',     name: '森林',     emoji: '🌲',  category: 'nature',   source: trackSources.forest },
  { id: 'ocean',      name: '海浪',     emoji: '🌊',  category: 'nature',   source: trackSources.ocean },
  { id: 'cafe',       name: '咖啡馆',   emoji: '☕',  category: 'ambient',  source: trackSources.cafe },
  { id: 'fireplace',  name: '壁炉',     emoji: '🔥',  category: 'ambient',  source: trackSources.fireplace },
  { id: 'thunder',    name: '雷雨',     emoji: '⛈️',  category: 'nature',   source: trackSources.thunder },
  { id: 'wind',       name: '风声',     emoji: '🍃',  category: 'nature',   source: trackSources.wind },
  { id: 'lofi',       name: 'Lofi',     emoji: '🎧',  category: 'melodic', source: trackSources.lofi },
];

// ---- 单例白噪音播放器 ----
let noiseSound: any = null;  // Audio.Sound | null
let currentTrackId: string | null = null;
let noiseVolume = 0.5;

/** 初始化 Audio 模式（APP 启动时调用一次即可） */
export async function initAudio(): Promise<void> {
  try {
    const Audio = await getAudio();
    if (!Audio) return;
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  } catch {
    // 静默失败
  }
}

/** 播放白噪音音轨 */
export async function playNoiseTrack(trackId: string): Promise<boolean> {
  try {
    // 如果播放的是同一首，不重复播放
    if (currentTrackId === trackId && noiseSound) {
      const status = await noiseSound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) return true;
    }

    // 先停止当前
    await stopNoise();

    const track = NOISE_TRACKS.find((t) => t.id === trackId);
    if (!track || !track.source) {
      // 无音频文件 — 静默成功（UI 上显示播放状态）
      currentTrackId = trackId;
      return true;
    }

    const Audio = await getAudio();
    if (!Audio) {
      currentTrackId = trackId;
      return true;
    }

    const { sound } = await Audio.Sound.createAsync(track.source, {
      isLooping: true,
      volume: noiseVolume,
      shouldPlay: true,
    });

    noiseSound = sound;
    currentTrackId = trackId;
    return true;
  } catch {
    // 播放失败 — 仍然标记为播放中
    currentTrackId = trackId;
    return true;
  }
}

/** 暂停白噪音 */
export async function pauseNoise(): Promise<void> {
  try {
    if (noiseSound) {
      await noiseSound.pauseAsync();
    }
  } catch {
    // 静默失败
  }
}

/** 恢复白噪音 */
export async function resumeNoise(): Promise<void> {
  try {
    if (noiseSound) {
      await noiseSound.playAsync();
    }
  } catch {
    // 静默失败
  }
}

/** 停止白噪音 */
export async function stopNoise(): Promise<void> {
  try {
    if (noiseSound) {
      await noiseSound.stopAsync().catch(() => {});
      await noiseSound.unloadAsync().catch(() => {});
      noiseSound = null;
    }
  } catch {
    // 静默失败
  }
  currentTrackId = null;
}

/** 设置白噪音音量 (0-1) */
export async function setNoiseVolume(volume: number): Promise<void> {
  noiseVolume = Math.max(0, Math.min(1, volume));
  try {
    if (noiseSound) {
      await noiseSound.setVolumeAsync(noiseVolume);
    }
  } catch {
    // 静默失败
  }
}

/** 获取当前音量 */
export function getNoiseVolume(): number {
  return noiseVolume;
}

/** 获取当前播放音轨 ID */
export function getCurrentTrackId(): string | null {
  return currentTrackId;
}

// ---- 完成提示音 ----
let completeSound: any = null;  // Audio.Sound | null

/** 播放完成铃音 */
export async function playCompletionSound(): Promise<void> {
  try {
    if (completeSound) {
      await completeSound.replayAsync().catch(async () => {
        await completeSound?.unloadAsync().catch(() => {});
        completeSound = null;
      });
    }

    if (!completeSound) {
      // 无自定义音频文件时静默 — 后续可替换为 require('../../assets/sounds/complete.wav')
    }
  } catch {
    // 音效不是核心功能，静默失败
  }
}

/** 卸载所有音频资源 */
export async function unloadAllSounds(): Promise<void> {
  try {
    await stopNoise();
    if (completeSound) {
      await completeSound.unloadAsync().catch(() => {});
      completeSound = null;
    }
  } catch {
    // 静默失败
  }
}
