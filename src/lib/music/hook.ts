import { useContext } from "react";
import MusicContext from "./context";

export const useMusic = () => {
  const musicContext = useContext(MusicContext);
  if (musicContext === null) {
    throw new Error("useMusic must be used within a MusicContext.Provider");
  }

  return musicContext;
};
