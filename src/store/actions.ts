import { createAction } from "@reduxjs/toolkit";
import { Platform } from "../lib/music-interface";

export const updateName = createAction<string>("UPDATE_NAME");

export const updatePlatform = createAction<Platform>("UPDATE_PLATFORM");

export const updateSpotifyData = createAction<any>("UPDATE_SPOTIFY_DATA");
