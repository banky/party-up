import React from "react";
import { MusicContext } from "lib/music";
import { useMusicLoading } from "./use-music-loading";
import { LoadingSpinner } from "components/loading-spinner/loading-spinner";

type MusicContextWrapperProps = {
  children: React.ReactNode;
};

// This allows us to provide a loading state while Music is initializing
export const MusicContextWrapper = ({ children }: MusicContextWrapperProps) => {
  const { musicInstance, musicLoading } = useMusicLoading();

  return musicLoading ? (
    <LoadingSpinner />
  ) : (
    <MusicContext.Provider value={musicInstance}>
      {children}
    </MusicContext.Provider>
  );
};
