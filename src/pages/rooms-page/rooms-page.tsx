import React, { useState, useMemo } from "react";
import { Header } from "components/header/header.component";
import { RoomsPageSwitcher } from "./components/rooms-page-switcher";
import { AllRooms, YourRooms } from "./room-lists";

export const RoomsPage = () => {
  const [switcherValue, setSwitcherValue] = useState(0);
  const Rooms = useMemo(() => [AllRooms, YourRooms][switcherValue], [
    switcherValue,
  ]);

  return (
    <>
      <Header title="Rooms" />
      <RoomsPageSwitcher value={switcherValue} setValue={setSwitcherValue} />
      <Rooms />
    </>
  );
};
