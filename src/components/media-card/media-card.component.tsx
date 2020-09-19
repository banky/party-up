import React from "react";
import styled from "styled-components";
import { PlusIcon } from "components/plus-icon/plus-icon.component";
import { MinusIcon } from "components/minus-icon/minus-icon.component";

type MediaCardProps = {
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  actionIcon: "plus" | "minus";
  actionDisabled: boolean;
  onClickActionIcon?: VoidFunction;
};

export const MediaCard = ({
  title,
  subtitle,
  imageUrl,
  imageAlt,
  actionIcon,
  actionDisabled,
  onClickActionIcon,
}: MediaCardProps) => {
  return (
    <MediaCardWrapper>
      <MediaCardImage src={imageUrl} alt={imageAlt} />
      <MediaTitle>{title}</MediaTitle>
      <MediaSubtitle>{subtitle}</MediaSubtitle>
      {actionIcon === "plus" ? (
        <StyledPlusIcon disabled={actionDisabled} onClick={onClickActionIcon} />
      ) : (
        <StyledMinusIcon
          disabled={actionDisabled}
          onClick={onClickActionIcon}
        />
      )}
    </MediaCardWrapper>
  );
};

const actionIconStyles = `
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5%;
`;

const StyledPlusIcon = styled(PlusIcon)`
  ${actionIconStyles}
`;

const StyledMinusIcon = styled(MinusIcon)`
  ${actionIconStyles}
`;

const MediaCardWrapper = styled.div`
  height: 80px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 1);
  position: relative;
  text-align: left;
`;

const MediaCardImage = styled.img`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1%;
  height: 60px;
  margin-left: 2%;
  border-radius: 5px;
`;

const MediaTitle = styled.div`
  position: absolute;
  left: 90px;
  top: 4px;
  font-size: 1.5em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
`;

const MediaSubtitle = styled.div`
  position: absolute;
  left: 90px;
  top: 46px;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 75%;
`;
