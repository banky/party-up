import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Music from "../../lib/music-interface";
import { RootState } from "store/reducers";

export const useMusicLoading = () => {
  const musicPlatform = useSelector((state: RootState) => state.musicPlatform);
  const musicAuthToken = useSelector(
    (state: RootState) => state.musicAuthToken
  );

  const [musicLoading, setMusicLoading] = useState(true);
  const musicInstance = useRef(new Music(musicPlatform, musicAuthToken));

  useEffect(() => {
    musicInstance.current.configure().then(() => {
      setMusicLoading(false);
    });
  }, [musicInstance]);

  return { musicInstance: musicInstance.current, musicLoading };
};
