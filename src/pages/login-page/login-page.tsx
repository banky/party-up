import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { useMusic } from "lib/music/hook";
import { updateMusicPlatform, updateUserId } from "store/actions";
import { PlatformIcon } from "./components/platform-icon.component";
import { Platform } from "lib/music/music";
import { useFirebase } from "lib/firebase/hook";
import { useUpdateUserInFirebase } from "hooks/use-update-user-firebase";

const PlatformIconsContainer = styled.div`
  display: flex;
`;

export const LoginPage = () => {
  const history = useHistory();
  const music = useMusic();
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const updateUserInFirebase = useUpdateUserInFirebase();

  const onAuthorize = (platform: Platform) => async () => {
    dispatch(updateMusicPlatform(platform));
    try {
      const userCredentials = await firebase.auth().signInAnonymously();
      const userId = userCredentials.user?.uid || "";
      // TODO: Fix this by pulling the entire user and only updating the name field
      const nameSnapshot = await firebase
        .database()
        .ref(`users/${userId}/name`)
        .once("value");
      const name = nameSnapshot.val() ?? "";

      updateUserInFirebase({ userId, name, platform });
      dispatch(updateUserId(userId));
      name === "" ? history.push("/name") : history.push("/");
    } catch (error) {
      console.error(
        "Error authenticating. Code:",
        error.code,
        ". Message:",
        error.message
      );
    }
  };

  return (
    <div>
      <h1>
        <span role="img" aria-labelledby="party">
          🎉
        </span>
        Party Up{" "}
      </h1>
      <p>
        Create a room, start the party. But first, what platform do you use?
      </p>
      <PlatformIconsContainer>
        <PlatformIcon
          platform="apple"
          onClick={() => {
            music.platform = "apple";
            music
              .authorize()
              .then(onAuthorize("apple"))
              .catch(() => {});
          }}
        />
        <PlatformIcon
          platform="spotify"
          onClick={() => {
            music.platform = "spotify";
            music
              .authorize()
              .then(onAuthorize("spotify"))
              .catch((err) => {});
          }}
        />
      </PlatformIconsContainer>
    </div>
  );
};
