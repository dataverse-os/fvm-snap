import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  ConnectButton,
  IntroSection,
  PageContainer,
  Text,
  TitleText,
} from "./styled";

import FvmSnapSvg from "@/assets/icons/fvm-snap.svg";
import { useSnap } from "@/hooks";

export const Login = () => {
  const { snapState, handleConnectSnap } = useSnap();
  const navigate = useNavigate();

  useEffect(() => {
    if (snapState.installedSnap && snapState.raasProvider.isProviderSet) {
      navigate("/home");
    }
  }, [snapState, snapState.raasProvider.isProviderSet]);

  return (
    <PageContainer>
      <IntroSection style={{ marginTop: "39px" }}>
        <img src={FvmSnapSvg} />
        <TitleText>Welcome to FVM-Snap</TitleText>
        <Text>FVM service and data management in metamask</Text>
      </IntroSection>
      <ConnectButton
        onClick={() => handleConnectSnap().then(() => navigate("/home"))}
      >
        Connect MetaMask
      </ConnectButton>
    </PageContainer>
  );
};
