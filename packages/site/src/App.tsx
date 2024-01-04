import React from "react";

import { RouterProvider } from "react-router-dom";
import "@arco-design/web-react/dist/css/arco.min.css";

import { router } from "./router";
import { Frame, GlobalStyle } from "./styled";

const App: React.FC = () => {
  return (
    <Frame>
      <GlobalStyle />
      <RouterProvider router={router} />
    </Frame>
  );
};

export default App;
