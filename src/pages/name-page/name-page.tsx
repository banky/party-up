import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Header } from "components/header/header.component";
import { Input } from "components/input/input.component";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { useSetUserInFirebase } from "hooks/set-user-firebase";
import { RootState } from "store/reducers";

export const NamePage = () => {
  const [name, setName] = useState("");
  const setUserInFirebase = useSetUserInFirebase();
  const platform = useSelector((state: RootState) => state.musicPlatform);
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();

  const onClick = useCallback(() => {
    setUserInFirebase(userId, name, platform);
    history.push("");
  }, [history, name, platform, userId, setUserInFirebase]);

  return (
    <>
      <Header title="Name" />
      <div>
        <StyledInput
          placeholder="Enter you rname"
          value={name}
          aria-label="name input"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <PrimaryButton disabled={name.length === 0} onClick={onClick}>
        Enter
      </PrimaryButton>
    </>
  );
};

const StyledInput = styled(Input)`
  margin: 80px 0;
`;
