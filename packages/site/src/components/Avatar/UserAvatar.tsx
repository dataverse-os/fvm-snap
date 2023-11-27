import React from "react";

import styled from "styled-components";

import AvatarAddressIsKnown from "./AvatarAddressIsKnown";

import { addressAbbreviation } from "@/utils";

export const UserAvatar = ({ address }: { address: string }) => {
  return (
    <Container>
      <AvatarAddressIsKnown address={address} className='avatar' />
      <span>{addressAbbreviation(address)}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  column-gap: 0.5rem;
  border-radius: 8px;
  background-color: #ffffff;
  padding: 4px 10px 4px 10px;

  .avatar {
    width: 30px;
    height: 30px;
  }

  span {
    font-family: Inter-Medium;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
  }
`;
