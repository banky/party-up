import { createReducer } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  updateName,
  updateMusicPlatform,
  updateUserId,
  updateDestinationRoomKey,
} from "./actions";
import { Platform } from "../lib/music-interface/music";

const initialState: {
  destinationRoomKey?: string;
  musicPlatform: Platform;
  name: string;
  userId: string;
} = {
  destinationRoomKey: undefined,
  musicPlatform: "apple",
  name: "",
  userId: "",
};

export const rootReducer = createReducer(initialState, {
  [updateDestinationRoomKey.type]: (state, action) => {
    state.destinationRoomKey = action.payload;
  },
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
  [updateMusicPlatform.type]: (state, action) => {
    state.musicPlatform = action.payload;
  },
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
  [updateUserId.type]: (state, action) => {
    state.userId = action.payload;
  },
});

const persistConfig = {
  key: "root",
  storage,
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export type RootState = ReturnType<typeof persistedReducer>;
