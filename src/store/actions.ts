import { createAction } from "@reduxjs/toolkit";
import { Platform } from "../lib/music-interface/music";

export const updateName = createAction<string>("UPDATE_NAME");

export const updateMusicPlatform = createAction<Platform>(
  "UPDATE_MUSIC_PLATFORM"
);

export const updateMusicAuthToken = createAction<string>(
  "UPDATE_MUSIC_AUTH_TOKEN"
);

export const updateUserId = createAction<string>("UPDATE_USER_ID");
