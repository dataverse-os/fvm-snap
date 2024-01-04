import styled from "styled-components";

export const PageContainer = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 57px;
  align-items: center;
`;

export const IntroSection = styled.section`
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: 23px;
  align-items: center;
`;

export const TitleText = styled.h1`
  font-family: Inter-Medium;
  font-size: 24px;
  font-weight: 500;
  line-height: 29px;
  letter-spacing: 0em;
  text-align: left;
  color: #232325;
`;

export const Text = styled.p`
  font-family: Inter-Medium;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  color: #232325;
`;

export const ConnectButton = styled.button`
  padding: 12px 22px;
  border-radius: 8px;
  background-color: #4383f7;
  /* font */
  font-family: Inter;
  font-size: 16px;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
  color: #ffffff;
`;
