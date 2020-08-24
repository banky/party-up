import styled from "styled-components";

export const Input = styled.input`
  width: 50%;
  height: 2em;
  font-size: 1em;
  font-family: "Muli";
  padding-left: 20px;
  padding-right: 20px;
  border: none;
  background: none;
  border-bottom: solid #484d6d 3px;
  border-radius: 0;
  text-align: center;
  outline: none;
  &:focus {
    border-bottom: solid #ee6352 3px;
  }
`;
