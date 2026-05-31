"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { markSessionComplete } from "@/lib/storage";

const STORAGE_KEY_PREFIX = "s2s_playback_";
const PLAYBACK_RATE_STORAGE_KEY = "s2s_playback_rate";
const SEEK_AMOUNT = 15;
const RING_SIZE = 200;
const RING_STROKE = 5;
const RING_R = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const PLAYBACK_RATES = [0.85, 0.9, 1, 1.05];

type AudioPlayerProps = {
  src: string;
  sessionId: number;
  onComplete?: () => void;
};

export function AudioPlayer({ src, sessionId, onComplete }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playbackRateRef = useRef(1);
  const playStartedTrackedRef = useRef(false);

  const localStorageKey = `${STORAGE_KEY_PREFIX}${sessionId}`;

  const savePosition = useCallback(
    (pos: number) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(localStorageKey, String(Math.floor(pos)));
        }
      } catch {
        /* ignore */
      }
    },
    [localStorageKey]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = document.createElement("audio");
    audio.src = src;
    audio.preload = "metadata";
    applyPlaybackRate(audio, playbackRateRef.current);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlayStarted = () => {
      if (playStartedTrackedRef.current) return;
      playStartedTrackedRef.current = true;
      trackEvent("Audio play started", {
        session_id: sessionId,
        source: src,
        audio_type: "session_audio",
      });
    };
    const handleEnded = () => {
      setPlaying(false);
      markSessionComplete(sessionId);
      onComplete?.();
    };
    const handleLoadedData = () => {
      try {
        const stored = parseInt(
          window.localStorage.getItem(localStorageKey) ?? "0",
          10
        );
        if (stored > 0 && stored < audio.duration) {
          audio.currentTime = stored;
          setCurrentTime(stored);
        }
      } catch {
        /* ignore */
      }
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlayStarted);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadeddata", handleLoadedData);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlayStarted);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadeddata", handleLoadedData);
      if (audio.currentTime > 0) savePosition(audio.currentTime);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, sessionId, localStorageKey, savePosition, onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;
    try {
      const stored = Number(
        window.localStorage.getItem(PLAYBACK_RATE_STORAGE_KEY)
      );
      if (PLAYBACK_RATES.includes(stored)) {
        frame = window.requestAnimationFrame(() => setPlaybackRate(stored));
      }
    } catch {
      /* ignore */
    }
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
    const audio = audioRef.current;
    if (!audio) return;
    applyPlaybackRate(audio, playbackRate);
  }, [playbackRate]);

  /* Save position every 5s while playing */
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      const audio = audioRef.current;
      if (audio && audio.currentTime > 0) {
        savePosition(audio.currentTime);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [playing, savePosition]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      savePosition(audio.currentTime);
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }

  function seekBack() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - SEEK_AMOUNT);
    setCurrentTime(audio.currentTime);
    savePosition(audio.currentTime);
  }

  function seekForward() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(
      audio.duration,
      audio.currentTime + SEEK_AMOUNT
    );
    setCurrentTime(audio.currentTime);
    savePosition(audio.currentTime);
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const v = parseFloat(e.target.value);
    audio.currentTime = v;
    setCurrentTime(v);
    savePosition(v);
  }

  function handleRingClick(e: React.MouseEvent<SVGSVGElement>) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const x = e.clientX - rect.left - cx;
    const y = e.clientY - rect.top - cy;
    let angle = Math.atan2(x, -y);
    if (angle < 0) angle += 2 * Math.PI;
    const fraction = angle / (2 * Math.PI);
    const newTime = fraction * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    savePosition(newTime);
  }

  function handlePlaybackRateChange(rate: number) {
    setPlaybackRate(rate);
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(PLAYBACK_RATE_STORAGE_KEY, String(rate));
      }
    } catch {
      /* ignore */
    }
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - progress / 100);

  return (
    <div className="flex flex-col items-center gap-7">
      <div className="relative flex items-center justify-center">
        <img
          src="/images/app-icon.png"
          alt="Sofa2Slugger Logo"
          className="absolute h-[190px] w-[190px] rounded-full object-cover opacity-18 pointer-events-none"
        />
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          className="-rotate-90 cursor-pointer"
          onClick={handleRingClick}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={RING_STROKE}
          />
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_R}
            fill="none"
            stroke="var(--slugger-brass)"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={ringOffset}
            className="transition-[stroke-dashoffset] duration-300"
          />
        </svg>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? "Pause" : "Play"}
          className="slugger-phone-pulse absolute flex h-24 w-24 items-center justify-center bg-[var(--slugger-brass)] text-[var(--slugger-bone)] shadow-2xl shadow-[var(--slugger-brass)]/25 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--slugger-bone)] focus:ring-offset-2 focus:ring-offset-[var(--slugger-ink)]"
        >
          {playing ? (
            <Pause className="h-10 w-10" strokeWidth={2.5} />
          ) : (
            <Play
              className="ml-1 h-10 w-10"
              strokeWidth={2.5}
              fill="currentColor"
            />
          )}
        </button>
      </div>

      <span className="border border-white/10 bg-white/8 px-4 py-2 font-mono text-lg text-white/72">
        {formatTime(currentTime)} / {formatTime(duration || 0)}
      </span>

      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={seekBack}
          aria-label="Rewind 15 seconds"
          className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/8 text-white/70 transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-ink)]"
        >
          <RotateCcw className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={seekForward}
          aria-label="Forward 15 seconds"
          className="flex h-12 w-12 items-center justify-center border border-white/15 bg-white/8 text-white/70 transition hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-ink)]"
        >
          <RotateCw className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div
        className="flex items-center gap-1 border border-white/10 bg-white/8 p-1"
        aria-label="Playback pace"
      >
        {PLAYBACK_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            onClick={() => handlePlaybackRateChange(rate)}
            aria-label={`Set pace to ${rate}x`}
            aria-pressed={playbackRate === rate}
            className={`h-9 min-w-14 px-3 text-sm font-bold transition ${
              playbackRate === rate
                ? "bg-[var(--slugger-bone)] text-[var(--slugger-ink)]"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            {rate === 1 ? "1x" : `${rate}x`}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md px-2">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={1}
          value={currentTime}
          onChange={handleScrub}
          aria-label="Scrub position"
          className="h-2 w-full cursor-pointer appearance-none bg-white/10 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[var(--slugger-bone)]"
          style={{
            background: `linear-gradient(to right, var(--slugger-brass) 0%, var(--slugger-brass) ${progress}%, rgba(255,255,255,0.12) ${progress}%, rgba(255,255,255,0.12) 100%)`,
          }}
        />
      </div>
    </div>
  );
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function applyPlaybackRate(audio: HTMLAudioElement, rate: number) {
  audio.playbackRate = rate;
  audio.defaultPlaybackRate = rate;
  const pitchSafeAudio = audio as HTMLAudioElement & {
    preservesPitch?: boolean;
  };
  if ("preservesPitch" in pitchSafeAudio) {
    pitchSafeAudio.preservesPitch = true;
  }
}
