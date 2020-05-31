import Firebase from "lib/firebase";
import { Platform } from "lib/music-interface/music";

export const roomNameFromOwner = (ownerName: string) => {
  const endsWithS = ownerName[ownerName.length - 1] === "s";
  if (endsWithS) {
    return `${ownerName}' Room`;
  }
  return `${ownerName}'s Room`;
};

export const createRoom = (
  firebase: Firebase,
  name: string,
  platform: Platform
) => {
  const roomName = roomNameFromOwner(name);

  const newUserKey = firebase.database().ref().child("users").push({
    name: name,
    platform: platform,
  }).key;

  if (!newUserKey) {
    return; // TODO: Show user an error state
  }

  const newRoomKey = firebase
    .database()
    .ref()
    .child("rooms")
    .push({
      name: roomName,
      creator: newUserKey,
      djs: {
        [newUserKey]: true,
      },
      users: {
        [newUserKey]: true,
      },
    }).key;

  if (!newRoomKey) {
    return; // TODO: Show user an error state
  }

  return newRoomKey;
};
