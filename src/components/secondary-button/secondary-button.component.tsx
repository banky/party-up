import styled from "styled-components";
import { PrimaryButton } from "../primary-button/primary-button.component";

export const SecondaryButton = styled(PrimaryButton)`
  background: none;
  color: #484d6d;
  &:disabled {
    background: none;
    color: #d8d8d8;
    cursor: auto;
    &:hover {
      color: #d8d8d8;
      background: none;
    }
  }
  &:hover {
    background: none;
    color: #ee6352;
  }
`;
