import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";

import "./App.css";

function App() {
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
