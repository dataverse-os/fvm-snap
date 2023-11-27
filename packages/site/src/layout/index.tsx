import React, { useEffect } from "react";

// import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";

import { Container, BodyWrapper, Note } from "./styled";

import closeIcon from "@/assets/icons/close.png";

const Layout: React.FC = (): React.ReactElement => {
  const [showNote, setShowNote] = React.useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/home")) {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  }, [location]);

  return (
    <Container>
      {/* <Header /> */}
      {showNote ? (
        <Note>
          <span>
            Fvm-Snap is on testnet currently. You can get the faucet{" "}
            <a
              href='https://faucet.calibration.fildev.network/'
              target='_blank'
              rel='noreferrer'
            >
              here
            </a>
            .
          </span>
          <img
            className='closeIcon'
            onClick={() => {
              setShowNote(false);
            }}
            src={closeIcon}
          />
        </Note>
      ) : (
        <></>
      )}
      <BodyWrapper>
        <Outlet />
      </BodyWrapper>
    </Container>
  );
};

export default Layout;
