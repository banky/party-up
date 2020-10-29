import Firebase from "lib/firebase";

/**
 * Create a room in Firebase
 */
export const createRoomFB = ({
  firebase,
  userId,
  title,
  genre,
}: {
  firebase: Firebase;
  userId: string;
  title: string;
  genre: string;
}) => {
  return firebase
    .database()
    .ref()
    .child("rooms")
    .push({
      title,
      genre,
      owner: userId,
      djs: {
        [userId]: true,
      },
      currentDj: userId,
      backgroundColor: {
        red: 255,
        green: 255,
        blue: 255,
      },
    }).key;
};
