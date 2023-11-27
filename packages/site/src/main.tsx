import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import rootStore from "./state/store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={rootStore.store}>
    <App />
  </Provider>,
);
