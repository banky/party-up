import React, { useState } from "react";
import { Header } from "components/header/header.component";
import { RoomsPageSwitcher } from "./components/rooms-page-switcher";
import { useFirebase } from "lib/firebase/hooks";
import { RoomCard } from "./components/room-card";

export const RoomsPage = () => {
  const [switcherValue, setSwitcherValue] = useState(0);

  return (
    <>
      <Header title="Rooms" />
      <RoomsPageSwitcher value={switcherValue} setValue={setSwitcherValue} />
      <RoomCard
        roomId="dojasRoom"
        roomName="Grooving 🔥"
        genre="R and B Hits"
        roomImageUrl="https://i.scdn.co/image/ab67616d00001e0282b243023b937fd579a35533"
        nowPlayingSong="Blinding Lights"
        nowPlayingArtist="The Weeknd"
        numListeners={5}
        numDjs={2}
      />
      <RoomCard
        roomId="weekndRoom"
        roomName="Grooving 🔥"
        genre="R and B Hits"
        roomImageUrl="https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36"
        nowPlayingSong="Blinding Lights"
        nowPlayingArtist="The Weeknd"
        numListeners={5}
        numDjs={2}
      />
      <RoomCard
        roomId="fireboyRoom"
        roomName="Grooving 🔥"
        genre="R and B Hits"
        roomImageUrl="https://i.scdn.co/image/ab67616d00001e0287c40ea5d9e6d2362374ed36"
        nowPlayingSong="Blinding Lights"
        nowPlayingArtist="The Weeknd"
        numListeners={5}
        numDjs={2}
      />
      <RoomCard
        roomId="weezerRoom"
        roomName="Grooving 🔥"
        genre="R and B Hits"
        roomImageUrl="https://i.scdn.co/image/ab67616d00001e02962ce52e166e5e1dd7c2f4a3"
        nowPlayingSong="Blinding Lights"
        nowPlayingArtist="The Weeknd"
        numListeners={5}
        numDjs={2}
      />
    </>
  );
};

const AllRooms = () => {
  const firebase = useFirebase();
};
