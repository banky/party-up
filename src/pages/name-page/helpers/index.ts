import Firebase from "lib/firebase";
import { Platform } from "lib/music-interface/music";

export const roomNameFromOwner = (ownerName: string) => {
  const endsWithS = ownerName[ownerName.length - 1] === "s";
  if (endsWithS) {
    return `${ownerName}' Room`;
  }
  return `${ownerName}'s Room`;
};

/**
 * Create a room in Firebase
 * @param firebase
 * @param name
 * @param platform
 * @param userId
 */
export const createRoom = (
  firebase: Firebase,
  name: string,
  platform: Platform,
  userId: string
) => {
  const roomName = roomNameFromOwner(name);

  firebase.database().ref("users").child(userId).set({
    name: name,
    platform: platform,
  });

  const newRoomKey = firebase
    .database()
    .ref()
    .child("rooms")
    .push({
      name: roomName,
      creator: userId,
      djs: {
        [userId]: true,
      },
    }).key;

  if (!newRoomKey) {
    return; // TODO: Show user an error state
  }

  return newRoomKey;
};
