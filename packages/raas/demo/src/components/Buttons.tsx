import { ComponentProps } from "react";

import styled from "styled-components";

import { ReactComponent as FlaskFox } from "../assets/flask_fox.svg";
import { MetamaskState } from "../hooks";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { shouldDisplayReconnectButton } from "../utils";

const Link = styled.a`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.small};
  border-radius: ${props => props.theme.radii.button};
  border: 1px solid ${props => props.theme.colors.background.inverse};
  background-color: ${props => props.theme.colors.background.inverse};
  color: ${props => props.theme.colors.text.inverse};
  text-decoration: none;
  font-weight: bold;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: transparent;
    border: 1px solid ${props => props.theme.colors.background.inverse};
    color: ${props => props.theme.colors.text.default};
  }

  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
    box-sizing: border-box;
  }
`;

const Button = styled.button`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  ${({ theme }) => theme.mediaQueries.small} {
    width: 100%;
  }
`;

const ButtonText = styled.span`
  margin-left: 1rem;
`;

const ConnectedContainer = styled.div`
  display: flex;
  align-self: flex-start;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.theme.fontSizes.small};
  border-radius: ${props => props.theme.radii.button};
  border: 1px solid ${props => props.theme.colors.background.inverse};
  background-color: ${props => props.theme.colors.background.inverse};
  color: ${props => props.theme.colors.text.inverse};
  font-weight: bold;
  padding: 1.2rem;
`;

const ConnectedIndicator = styled.div`
  content: " ";
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: green;
`;

export const InstallFlaskButton = () => (
  <Link href='https://metamask.io/flask/' target='_blank'>
    <FlaskFox />
    <ButtonText>Install MetaMask Flask</ButtonText>
  </Link>
);

export const ConnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <FlaskFox />
      <ButtonText>Connect</ButtonText>
    </Button>
  );
};

export const ReconnectButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button {...props}>
      <FlaskFox />
      <ButtonText>Reconnect</ButtonText>
    </Button>
  );
};

export const SendHelloButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Send message</Button>;
};

export const UploadButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Upload file</Button>;
};

export const DownloadButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Download file</Button>;
};

export const LoadAllUploadsButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Load all uploads</Button>;
};

export const SubmitCidToContractButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Submit cid to contract</Button>;
};

export const SubmitTaskToRaasBackendButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Submit cid to raas backend</Button>;
};

export const QueryProofByCidButton = (props: ComponentProps<typeof Button>) => {
  return <Button {...props}>Query proof by cid</Button>;
};

export const QueryDealStatusByCidButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Query deal status by cid</Button>;
};

export const GetAllDealsFromContractButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Get all deals</Button>;
};

export const GetActiveDealsFromContractButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Get active deals</Button>;
};

export const GetExpiringDealsFromContractButton = (
  props: ComponentProps<typeof Button>,
) => {
  return <Button {...props}>Get expiring deals</Button>;
};

export const HeaderButtons = ({
  state,
  onConnectClick,
}: {
  state: MetamaskState;
  onConnectClick(): unknown;
}) => {
  if (!state.isFlask && !state.installedSnap) {
    return <InstallFlaskButton />;
  }

  if (!state.installedSnap) {
    return <ConnectButton onClick={onConnectClick} />;
  }

  if (shouldDisplayReconnectButton(state.installedSnap)) {
    return <ReconnectButton onClick={onConnectClick} />;
  }

  return (
    <ConnectedContainer>
      <ConnectedIndicator />
      <ButtonText>Connected</ButtonText>
    </ConnectedContainer>
  );
};
