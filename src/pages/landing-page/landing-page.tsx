import React from "react";
import { authorize } from "../../lib/music-interface";

export const LandingPage = () => {
  return (
    <div>
      <h2>Landing Page</h2>
      <button
        onClick={() => {
          authorize("apple");
        }}
      >
        Apple Music Sign In
      </button>
    </div>
  );
};
