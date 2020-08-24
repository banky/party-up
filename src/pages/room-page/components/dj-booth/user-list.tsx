import React, { useCallback } from "react";
import styled from "styled-components";
import { User } from "types/user";
import { useFirebase } from "lib/firebase/hooks";
import { useParams } from "react-router-dom";
import { UpgradeIcon } from "./components/upgrade-icon";
import { DowngradeIcon } from "./components/downgrade-icon";
import { DjActiveIcon } from "./components/dj-active-icon";
import { DjInactiveIcon } from "./components/dj-inactive-icon";

type UserListProps = {
  djs: User[];
  listeners: User[];
  ownerId: string;
  currentUserId: string;
};

export const UserList = ({
  djs,
  listeners,
  ownerId,
  currentUserId,
}: UserListProps) => {
  const firebase = useFirebase();
  const { roomKey } = useParams();

  const onPressDjUpgrade = useCallback(
    (user: User) => {
      firebase.database().ref(`rooms/${roomKey}/djs/${user.userId}`).set(true);
    },
    [firebase, roomKey]
  );

  const onPressDjDowngrade = useCallback(
    (user: User) => {
      firebase.database().ref(`rooms/${roomKey}/djs/${user.userId}`).set(false);
    },
    [firebase, roomKey]
  );

  return (
    <UserListWrapper>
      {listeners.map((member) => {
        const isDj = djs.some((dj) => member.userId === dj.userId);
        const onPressAction = isDj ? onPressDjDowngrade : onPressDjUpgrade;

        return (
          <li key={member.userId}>
            <UserCard
              user={member}
              isDj={isDj}
              isOwner={ownerId === member.userId}
              showActionIcon={ownerId === currentUserId}
              onPressAction={onPressAction}
            />
          </li>
        );
      })}
    </UserListWrapper>
  );
};

type UserCardProps = {
  user: User;
  isDj: boolean;
  isOwner: boolean;
  showActionIcon: boolean;
  onPressAction: (user: User) => void;
};

const UserCard = ({
  user,
  isDj,
  isOwner,
  showActionIcon,
  onPressAction,
}: UserCardProps) => {
  const ActionButton = isDj ? StyledDowngradeIcon : StyledUpgradeIcon;

  return (
    <UserCardWrapper>
      <UserName>{user.name}</UserName>
      <UserPlatform>{user.platform}</UserPlatform>
      {!isOwner && showActionIcon ? (
        <ActionButton onClick={() => onPressAction(user)} />
      ) : null}
      {isDj ? <StyledDjActiveIcon /> : <StyledDjInactiveIcon />}
    </UserCardWrapper>
  );
};

const UserListWrapper = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: auto;
  margin-bottom: 100px;
`;

const UserCardWrapper = styled.div`
  height: 80px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 1);
  margin: 15px 0;
  position: relative;
  text-align: left;
`;

const UserName = styled.div`
  position: absolute;
  left: 10px;
  top: 4px;
  font-size: 1.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
`;

const UserPlatform = styled.div`
  position: absolute;
  left: 10px;
  top: 46px;
  font-size: 1em;
`;

const actionIconStyles = `
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
`;

const StyledUpgradeIcon = styled(UpgradeIcon)`
  ${actionIconStyles}
`;

const StyledDowngradeIcon = styled(DowngradeIcon)`
  ${actionIconStyles}
`;

const djIconStyles = `
position: absolute;
top: 50%;
transform: translateY(-50%);
right: 40px;
`;

const StyledDjActiveIcon = styled(DjActiveIcon)`
  ${djIconStyles}
`;

const StyledDjInactiveIcon = styled(DjInactiveIcon)`
  ${djIconStyles}
`;
