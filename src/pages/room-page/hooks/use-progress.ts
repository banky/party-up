import { useState, useEffect } from "react";
import { useMusic } from "lib/music/hook";

export const useProgress = () => {
  const [progress, setProgress] = useState(0);
  const music = useMusic();

  useEffect(() => {
    const cleanup = music.progress(setProgress);

    return cleanup;
  }, [music]);

  return progress;
};
