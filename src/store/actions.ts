import { createAction } from "@reduxjs/toolkit";
import { Platform } from "../lib/music-interface/music";

export const updateName = createAction<string>("UPDATE_NAME");

export const updateSpotifyData = createAction<any>("UPDATE_SPOTIFY_DATA");
