import { createReducer } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  updateName,
  updateMusicPlatform,
  updateMusicAuthToken,
} from "./actions";
import { Platform } from "../lib/music-interface/music";

const initialState: {
  name: string;
  musicPlatform: Platform;
  musicAuthToken: string;
} = {
  name: "",
  musicPlatform: "apple",
  musicAuthToken: "",
};

const rootReducer = createReducer(initialState, {
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
  [updateMusicPlatform.type]: (state, action) => {
    state.musicPlatform = action.payload;
  },
  [updateMusicAuthToken.type]: (state, action) => {
    state.musicAuthToken = action.payload;
  },
});

const persistConfig = {
  key: "root",
  storage,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedReducer>;
