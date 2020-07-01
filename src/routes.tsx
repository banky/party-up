import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LandingPage } from "./pages/landing-page/landing-page";
import { NamePage } from "./pages/name-page/name-page";
import { RoomPage } from "./pages/room-page/room-page";
import { SpotifyCallback } from "./pages/spotify-callback-page";
import { NotFoundPage } from "./pages/not-found-page/not-found-page";

export const Routes = () => {
  return (
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
  );
};
