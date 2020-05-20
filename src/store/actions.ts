import { createAction } from "@reduxjs/toolkit";

export const updateName = createAction<string>("UPDATE_NAME");

export const updateSpotifyData = createAction<any>("UPDATE_SPOTIFY_DATA");
