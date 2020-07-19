import Firebase from "lib/firebase";
import { Platform } from "lib/music/music";

export const roomNameFromOwner = (ownerName: string) => {
  const endsWithS = ownerName[ownerName.length - 1] === "s";
  if (endsWithS) {
    return `${ownerName}' Room`;
  }
  return `${ownerName}'s Room`;
};

/**
 * Create a user in Firebase
 * @param firebase
 * @param userId
 * @param name
 * @param platform
 */
export const createUserFB = (
  firebase: Firebase,
  userId: string,
  name: string,
  platform: Platform
) => {
  firebase.database().ref("users").child(userId).set({
    userId: userId,
    name: name,
    platform: platform,
  });
};

/**
 * Create a room in Firebase
 * @param firebase
 * @param userId
 * @param name
 */
export const createRoomFB = (
  firebase: Firebase,
  userId: string,
  name: string
) => {
  const roomName = roomNameFromOwner(name);

  const newRoomKey = firebase
    .database()
    .ref()
    .child("rooms")
    .push({
      name: roomName,
      owner: userId,
      djs: {
        [userId]: true,
      },
    }).key;

  if (!newRoomKey) {
    return; // TODO: Show user an error state
  }

  return newRoomKey;
};
