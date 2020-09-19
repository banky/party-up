import React, { useEffect } from "react";
import { useMusic } from "lib/music/hook";

export const Playlists = () => {
  const music = useMusic();

  useEffect(() => {
    music
      .getPlaylists()
      .then((playlists) => console.log("playlists: ", playlists));
  }, []);

  return <div></div>;
};
