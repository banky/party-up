import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Firebase, { FirebaseContext } from "./lib/firebase";
import Music, { MusicContext } from "./lib/music-interface";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";
import { SpotifyCallback } from "./pages/spotify-callback-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";
import { useSelector } from "react-redux";
import { RootState } from "store/reducers";

export const Routes = () => {
  const musicPlatform = useSelector((state: RootState) => state.musicPlatform);
  const musicAuthToken = useSelector(
    (state: RootState) => state.musicAuthToken
  );

  const [musicConfigureLoading, setMusicConfigureLoading] = useState(true);
  const musicInstance = useRef(new Music(musicPlatform, musicAuthToken));

  useEffect(() => {
    musicInstance.current.configure().then(() => {
      setMusicConfigureLoading(false);
    });
  }, [musicInstance]);

  return (
    <FirebaseContext.Provider value={new Firebase()}>
      {musicConfigureLoading ? (
        <div>Loading</div>
      ) : (
        <MusicContext.Provider value={musicInstance.current}>
          <BrowserRouter>
            <Switch>
              <Route path="/room/:roomKey">
                <RoomPage />
              </Route>
              <Route path="/room">
                <RoomPage />
              </Route>
              <Route path="/name">
                <NamePage />
              </Route>
              <Route path="/spotify-callback">
                <SpotifyCallback />
              </Route>
              <Route path="/not-found">
                <NotFoundPage />
              </Route>
              <Route path="/">
                <LandingPage />
              </Route>
            </Switch>
          </BrowserRouter>
        </MusicContext.Provider>
      )}
    </FirebaseContext.Provider>
  );
};
