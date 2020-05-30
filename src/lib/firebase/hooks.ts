import { useContext, useState, useEffect, useCallback } from "react";
import FirebaseContext from "./context";

export const useFirebase = () => {
  const firebaseContext = useContext(FirebaseContext);
  if (firebaseContext === null) {
    throw new Error(
      "useFirebase must be used within a FirebaseContext.Provider"
    );
  }
  return firebaseContext;
};

/**
 * Wrapper around React useState to rerender with firebase realtime database updates
 * @param defaultValue Default state
 * @param reference Firebase database reference
 * @param callback Called on every update of Firebase state
 */
export const useFirebaseState = <T>(
  defaultValue: T,
  reference: string,
  callback: (snapshot: firebase.database.DataSnapshot) => void
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(defaultValue);
  const firebase = useFirebase();
  const memoizedCallback = useCallback(callback, []);

  useEffect(() => {
    firebase
      .database()
      .ref(reference)
      .on("value", (snapshot) => {
        setState(snapshot.val() as T);
        memoizedCallback(snapshot);
      });
  }, [firebase, reference, memoizedCallback]);

  useEffect(() => {
    if (state === null) return;

    firebase.database().ref(reference).set(state);
  }, [firebase, reference, state]);

  return [state, setState];
};
