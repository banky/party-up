import React from "react";
import { MusicContext } from "lib/music";
import { useMusicLoading } from "./use-music-loading";

type MusicContextWrapperProps = {
  children: React.ReactNode;
};

// This allows us to provide a loading state while Music is initializing
export const MusicContextWrapper = ({ children }: MusicContextWrapperProps) => {
  const { musicInstance, musicLoading } = useMusicLoading();

  return musicLoading ? (
    <div>Loading</div>
  ) : (
    <MusicContext.Provider value={musicInstance}>
      {children}
    </MusicContext.Provider>
  );
};
