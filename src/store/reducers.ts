import { createReducer } from "@reduxjs/toolkit";
import { updateName } from "./actions";

const initialState = {
  name: "",
};

export const rootReducer = createReducer(initialState, {
  [updateName.type]: (state, action) => {
    state.name = action.payload;
  },
});

export type RootState = ReturnType<typeof rootReducer>;
