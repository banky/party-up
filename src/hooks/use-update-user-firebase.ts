import { useCallback } from "react";
import { useFirebase } from "lib/firebase/hooks";
import { Platform } from "lib/music/music";

// Just a black image
const DEFAULT_IMAGE_URL =
  "https://image.flaticon.com/icons/png/512/37/37232.png";

export const useUpdateUserInFirebase = () => {
  const firebase = useFirebase();

  const updateUserInFirebase = useCallback(
    ({
      userId,
      name,
      platform,
      imageUrl,
    }: {
      userId: string;
      name: string;
      platform?: Platform;
      imageUrl?: string;
    }) => {
      firebase
        .database()
        .ref(`users/${userId}`)
        .update({
          name,
          ...(platform && { platform }),
          imageUrl: imageUrl || DEFAULT_IMAGE_URL,
        });
    },
    [firebase]
  );

  return updateUserInFirebase;
};
