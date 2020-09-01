import { useState, useEffect } from "react";
import { User } from "types/user";
import { useFirebase } from "lib/firebase/hook";

export const useUserList = (ref: string) => {
  const firebase = useFirebase();
  const [userIds, setUserIds] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Grab user ids at the ref
  useEffect(() => {
    firebase
      .database()
      .ref(ref)
      .on("value", (snapshot) => {
        if (!snapshot.exists()) return;

        setUserIds(
          Object.keys(snapshot.val()).filter(
            (key) => snapshot.val()[key] === true
          )
        );
      });

    return () => firebase.database().ref(ref).off();
  }, [firebase, ref]);

  /*
    Right now, it seems to make sense to pull all the user IDs requested
    And then request the full user data for only those users. This results
    in multiple firebase.once calls, but I think it's more efficient
    if we start to have large numbers of users. Instead of fetching all 
    the users and filtering them in memory
  */
  useEffect(() => {
    let isCancelled = false;
    const promises = userIds.map((userId) => {
      return firebase.database().ref(`users/${userId}`).once("value");
    }, []);

    Promise.all(promises)
      .then((snapshots) => {
        if (!isCancelled) {
          setUsers(
            snapshots
              .map((snapshot) => ({ userId: snapshot.key, ...snapshot.val() }))
              .filter((val) => val !== null)
          );
        }
      })
      .catch((err) => {
        console.warn(err);
      });

    return () => {
      isCancelled = true;
      userIds.map((userId) => {
        return firebase.database().ref(`users/${userId}`).off();
      });
    };
  }, [firebase, userIds]);

  return users;
};
