import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import store from "./store";

import { configure } from "./lib/music-interface";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";
import { SpotifyCallback } from "./pages/spotify-callback-page";

function App() {
  useEffect(() => {
    configure("apple");
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/landing">
            <LandingPage />
          </Route>
          <Route path="/name">
            <NamePage />
          </Route>
          <Route path="/spotify-callback">
            <SpotifyCallback />
          </Route>
          <Route path="/">
            <RoomPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
