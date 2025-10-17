"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause } from "lucide-react";

interface MusicPlayerProps {
  src: string;
  title?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Lecture / Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Mise à jour de la barre de progression
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  };

  // Fonction de changement manuel (clic ou touch)
  const updateProgressFromPosition = (clientX: number) => {
    if (!audioRef.current || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const width = rect.width;
    const newTime = (clickX / width) * audioRef.current.duration;

    audioRef.current.currentTime = newTime;
    setProgress((clickX / width) * 100);
  };

    // Clic (ordinateur)
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    updateProgressFromPosition(e.clientX);
  };


  // Touch (mobile)
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) updateProgressFromPosition(touch.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) updateProgressFromPosition(touch.clientX);
  };

  // Réinitialiser quand le son est fini
  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-secondary/30 backdrop-blur-sm rounded-2xl shadow-lg">
      <CardContent className="p-3 flex items-center h-2 w-60 gap-3">
        {title && <h4 className="text-lg font-semibold text-center">{title}</h4>}

        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePlay}
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-6 w-6" />}
          </Button>
        </div>

        {/* Barre de progression interactive */}
        <div
          ref={progressBarRef}
          onClick={handleProgressClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="relative w-full h-2 bg-gray-300 rounded-full cursor-pointer group"
        >
          <div
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-150"
            style={{ width: `${progress}%` }}
          ></div>
          {/* petit rond qui suit la progression */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `calc(${progress}% - 8px)` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
