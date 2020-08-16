import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { LoginPage } from "pages/login-page/login-page";
import { CreateRoomPage } from "pages/create-room-page/create-room-page";
import { RoomPage } from "pages/room-page/room-page";
import { SpotifyCallback } from "pages/spotify-callback-page";
import { NotFoundPage } from "pages/not-found-page/not-found-page";
import { RoomsPage } from "pages/rooms-page/rooms-page";

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
        <Route path="/create-room">
          <CreateRoomPage />
        </Route>
        <Route path="/spotify-callback">
          <SpotifyCallback />
        </Route>
        <Route path="/not-found">
          <NotFoundPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/">
          <RoomsPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
