import { createReducer } from "@reduxjs/toolkit";
import { updateName, updateSpotifyData } from "./actions";

const initialState = {
  name: "",
  spotifyData: {
    access_token: "",
  },
};

export const rootReducer = createReducer(initialState, {
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
  [updateSpotifyData.type]: (state, action) => {
    state.spotifyData = action.payload;
  },
});

export type RootState = ReturnType<typeof rootReducer>;
