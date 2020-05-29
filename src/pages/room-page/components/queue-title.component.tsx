import React from "react";
import styled from "styled-components";
import { PlusIcon } from "../../../components/plus-icon/plus-icon.component";

const QueueTitleWrapper = styled.div`
  width: 700px;
  height: 50px;
  margin: 0 auto;
  position: relative;
`;

const StyledPlusIcon = styled(PlusIcon)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 5%;
`;

type QueueTitleProps = {
  onClickSearch: VoidFunction;
};

export const QueueTitle = ({ onClickSearch }: QueueTitleProps) => {
  return (
    <QueueTitleWrapper>
      <StyledPlusIcon onClick={onClickSearch} />
    </QueueTitleWrapper>
  );
};
