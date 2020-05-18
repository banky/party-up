import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import store from "./store";
import Firebase, { FirebaseContext } from "./lib/firebase";
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
      <FirebaseContext.Provider value={new Firebase()}>
        <BrowserRouter>
          <Switch>
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
      </FirebaseContext.Provider>
    </Provider>
  );
}

export default App;
