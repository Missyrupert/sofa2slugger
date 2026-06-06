"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw, RotateCw } from "lucide-react";

type IntroAudioPlayerProps = {
  src: string;
};

export function IntroAudioPlayer({ src }: IntroAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio(src);
    audio.preload = "metadata";
    audioRef.current = audio;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setPlaying(false);
      audio.currentTime = 0;
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  function seekBack() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 15);
    setCurrentTime(audio.currentTime);
  }

  function seekForward() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15);
    setCurrentTime(audio.currentTime);
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current;
    if (!audio) return;
    const value = parseFloat(e.target.value);
    audio.currentTime = value;
    setCurrentTime(value);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  function formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col gap-4 border border-white/5 bg-[var(--slugger-panel)] p-5 rounded shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Play/Pause Button & Track Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-12 w-12 items-center justify-center bg-[var(--slugger-brass)] text-[var(--slugger-black)] hover:bg-[var(--slugger-action-hot)] transition cursor-pointer rounded-full shadow-lg shadow-[var(--slugger-brass)]/15"
          >
            {playing ? (
              <Pause className="h-5 w-5" strokeWidth={2.5} />
            ) : (
              <Play className="ml-0.5 h-5 w-5" strokeWidth={2.5} fill="currentColor" />
            )}
          </button>
          <div>
            <p className="text-sm font-black uppercase text-[var(--slugger-bone)]">Course Intro</p>
            <p className="text-xs font-bold uppercase text-[var(--slugger-muted)]">
              {formatTime(currentTime)} / {formatTime(duration || 150)}
            </p>
          </div>
        </div>

        {/* Seek buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={seekBack}
            aria-label="Rewind 15 seconds"
            className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-[var(--slugger-bone)] hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-black)] transition cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={seekForward}
            aria-label="Forward 15 seconds"
            className="flex h-10 w-10 items-center justify-center border border-white/10 bg-white/[0.03] text-[var(--slugger-bone)] hover:bg-[var(--slugger-bone)] hover:text-[var(--slugger-black)] transition cursor-pointer"
          >
            <RotateCw className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Scrub range slider */}
      <div className="w-full">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleScrub}
          aria-label="Scrub position"
          className="h-1.5 w-full cursor-pointer appearance-none bg-white/10 rounded [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-[var(--slugger-bone)] [&::-webkit-slider-thumb]:rounded-full"
          style={{
            background: `linear-gradient(to right, var(--slugger-brass) 0%, var(--slugger-brass) ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
