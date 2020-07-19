import { createAction } from "@reduxjs/toolkit";
import { Platform } from "lib/music/music";

export const updateName = createAction<string>("UPDATE_NAME");

export const updateMusicPlatform = createAction<Platform>(
  "UPDATE_MUSIC_PLATFORM"
);

export const updateUserId = createAction<string>("UPDATE_USER_ID");

export const updateDestinationRoomKey = createAction<string | undefined>(
  "UPDATE_DESTINATION_ROOM_KEY"
);
