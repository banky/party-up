import { useCallback } from "react";
import { useFirebase } from "lib/firebase/hooks";
import { Platform } from "lib/music/music";

export const useSetUserInFirebase = () => {
  const firebase = useFirebase();

  const setUserInFirebase = useCallback(
    (userId: string, name: string, platform: Platform) => {
      firebase.database().ref("users").child(userId).set({
        name,
        platform,
      });
    },
    [firebase]
  );

  return setUserInFirebase;
};
