import React from "react";
import styled from "styled-components";
export default function LoadingOverLay() {
  return <OverLay>LOADING</OverLay>;
}

const OverLay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: white;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(111, 111, 111, 0.5);
  z-index: 401; //this covers the map
`;
