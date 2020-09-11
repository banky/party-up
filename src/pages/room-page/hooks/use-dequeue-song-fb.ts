import { useCallback } from "react";
import { useFirebase } from "lib/firebase/hook";
import { useParams } from "react-router-dom";
import { Song } from "lib/music/types";
import Firebase from "lib/firebase";

export const useDequeueSongFb = () => {
  const firebase = useFirebase();
  const { roomKey } = useParams();

  return useCallback(async (): Promise<Song> => {
    const currentDjSnapshot = await firebase
      .database()
      .ref(`rooms/${roomKey}/currentDj`)
      .once("value");
    if (!currentDjSnapshot.exists())
      return Promise.reject("No current Dj found");
    const currentDj = currentDjSnapshot.val() as string;

    const djsSnapshot = await firebase
      .database()
      .ref(`rooms/${roomKey}/djs`)
      .once("value");
    if (!djsSnapshot.exists())
      return Promise.reject("No Djs found for the room");
    const djs = djsSnapshot.val();

    const nextDj = await getNextDj({ firebase, roomKey, djs, currentDj });
    await firebase.database().ref(`rooms/${roomKey}/currentDj`).set(nextDj);

    const songListSnapshot = await firebase
      .database()
      .ref(`rooms/${roomKey}/queues/${nextDj}`)
      .once("value");
    if (!songListSnapshot.exists())
      return Promise.reject("No song found for the current Dj");
    const songList = songListSnapshot.val();

    const songKeys = Object.keys(songList);
    const firstSongKey = songKeys[0];
    const currentSong = songList[firstSongKey];

    await firebase
      .database()
      .ref(`rooms/${roomKey}/queues/${nextDj}/${firstSongKey}`)
      .remove();

    return currentSong;
  }, [firebase, roomKey]);
};

type getNextDjProps = {
  firebase: Firebase;
  roomKey: string;
  djs: any;
  currentDj: string;
};

/**
 * Get the next DJ that is ready to play a song
 * @param param0
 */
const getNextDj = ({
  firebase,
  roomKey,
  djs,
  currentDj,
}: getNextDjProps): Promise<string> => {
  const firstUser = currentDj;

  const getNextDjRecursively = async ({
    firebase,
    roomKey,
    djs,
    currentDj,
  }: getNextDjProps): Promise<string> => {
    const keys = Object.keys(djs);
    const index = keys.indexOf(currentDj);
    const nextIndex = (index + 1) % keys.length;
    const nextUser = keys[nextIndex];

    // Stop recursion if we loop around
    if (nextUser === firstUser) {
      return firstUser;
    }

    const queuesSnapshot = await firebase
      .database()
      .ref(`rooms/${roomKey}/queues/${nextUser}`)
      .once("value");

    const nextUserIsDj = djs[nextUser] === true;
    const nextUserHasQueue = queuesSnapshot.exists();

    if (!nextUserIsDj || !nextUserHasQueue) {
      return getNextDjRecursively({
        firebase,
        roomKey,
        djs,
        currentDj: nextUser,
      });
    }

    return nextUser;
  };

  return getNextDjRecursively({
    firebase,
    roomKey,
    djs,
    currentDj,
  });
};
