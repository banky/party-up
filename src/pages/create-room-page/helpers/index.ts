import Firebase from "lib/firebase";

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
