import React, { useState } from "react";
import { Header } from "components/header/header.component";
import { RoomsPageSwitcher } from "./components/rooms-page-switcher";
import { useFirebase } from "lib/firebase/hooks";
import { RoomCards } from "./components/room-cards";

export const RoomsPage = () => {
  const [switcherValue, setSwitcherValue] = useState(0);

  return (
    <>
      <Header title="Rooms" />
      <RoomsPageSwitcher value={switcherValue} setValue={setSwitcherValue} />
      <RoomCards rooms={[]} />
    </>
  );
};

const AllRooms = () => {
  const firebase = useFirebase();
};
