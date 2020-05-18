import { createReducer } from "@reduxjs/toolkit";
import { updateName, updateSpotifyData, updatePlatform } from "./actions";
import { Platform } from "../lib/music-interface";

const initialState: {
  name: string;
  platform: Platform;
  spotifyData: {
    access_token: string;
  };
} = {
  name: "",
  platform: "apple",
  spotifyData: {
    access_token: "",
  },
};

export const rootReducer = createReducer(initialState, {
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
  [updatePlatform.type]: (state, action) => {
    state.platform = action.payload;
  },
  [updateSpotifyData.type]: (state, action) => {
    state.spotifyData = action.payload;
  },
});

export type RootState = ReturnType<typeof rootReducer>;
