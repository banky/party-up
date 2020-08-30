import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { Header } from "components/header/header.component";
import { Input } from "components/input/input.component";
import { PrimaryButton } from "components/primary-button/primary-button.component";
import { useUpdateUserInFirebase } from "hooks/use-update-user-firebase";
import { RootState } from "store/reducers";

export const NamePage = () => {
  const [name, setName] = useState("");
  const updateUserInFirebase = useUpdateUserInFirebase();
  const userId = useSelector((state: RootState) => state.userId);
  const history = useHistory();

  const onClick = useCallback(() => {
    updateUserInFirebase({ userId, name });
    history.push("");
  }, [history, name, userId, updateUserInFirebase]);

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
