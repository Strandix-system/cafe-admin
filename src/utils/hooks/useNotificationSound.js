import { useEffect, useRef } from "react";

export const useNotificationSound = () => {
  const audioRef = useRef(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/new-order.wav");
    audioRef.current.volume = 0.8;
  }, []);

  // 🔓 unlock on first user interaction
  useEffect(() => {
    const unlock = () => {
      if (!audioRef.current || unlockedRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          unlockedRef.current = true;
        })
        .catch(() => {});

      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };

    window.addEventListener("click", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const play = () => {
    if (!audioRef.current || !unlockedRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  return play;
};