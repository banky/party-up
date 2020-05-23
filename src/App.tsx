import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import store from "./store";
import Firebase, { FirebaseContext } from "./lib/firebase";
import Music, { MusicContext } from "./lib/music-interface";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";
import { SpotifyCallback } from "./pages/spotify-callback-page";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <FirebaseContext.Provider value={new Firebase()}>
        <MusicContext.Provider value={new Music("apple")}>
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
              <Route path="/">
                <LandingPage />
              </Route>
            </Switch>
          </BrowserRouter>
        </MusicContext.Provider>
      </FirebaseContext.Provider>
    </Provider>
  );
}

export default App;
