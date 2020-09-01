import { useContext } from "react";
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
