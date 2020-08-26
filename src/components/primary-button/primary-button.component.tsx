import styled from "styled-components";

export const PrimaryButton = styled.button`
  font-size: 1em;
  background: #484d6d;
  border-radius: 15px;
  color: white;
  padding: 10px 20px;
  &:disabled {
    background: #d8d8d8;
    cursor: auto;
    &:hover {
      background: #d8d8d8;
    }
  }
  &:hover {
    background: #ee6352;
  }
`;
