import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { configure } from "./lib/music-interface";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";

function App() {
  useEffect(() => {
    configure("apple");
  }, []);

  return (
    <div>
      <Switch>
        <Route path="/landing">
          <LandingPage />
        </Route>
        <Route path="/name">
          <NamePage />
        </Route>
        <Route path="/">
          <RoomPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
