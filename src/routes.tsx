import React from "react";
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

  return (
    <FirebaseContext.Provider value={new Firebase()}>
      <MusicContext.Provider value={new Music(musicPlatform, musicAuthToken)}>
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
    </FirebaseContext.Provider>
  );
};
