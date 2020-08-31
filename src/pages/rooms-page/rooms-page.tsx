import React, { useState, useMemo } from "react";
import { Header } from "components/header/header.component";
import { TabSwitcher } from "components/tab-switcher/tab-switcher";
import { AllRooms, YourRooms, SearchRooms } from "./room-lists";
import { useUserAuthorized } from "hooks/use-user-authorized";

const TABS = {
  "Top Rooms": AllRooms,
  "Your Rooms": YourRooms,
  Search: SearchRooms,
};

export const RoomsPage = () => {
  useUserAuthorized();

  const [switcherValue, setSwitcherValue] = useState(0);
  const Rooms = useMemo(() => Object.values(TABS)[switcherValue], [
    switcherValue,
  ]);

  return (
    <>
      <Header title="Rooms" />
      <TabSwitcher
        tabs={Object.keys(TABS)}
        value={switcherValue}
        setValue={setSwitcherValue}
      />
      <Rooms />
    </>
  );
};
