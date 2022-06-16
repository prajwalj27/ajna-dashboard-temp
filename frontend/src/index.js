import "./polyfills";
import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from "./serviceWorker";
import './index.css'
import { HashRouter } from "react-router-dom";
import "./assets/base.scss";
import 'antd/dist/antd.css';
import "react-toastify/dist/ReactToastify.css";
import Main from "./DemoPages/Main";
import  { store, persistor } from "./config/configureStore";
import { createBrowserHistory } from "history";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

const hist = createBrowserHistory();
const rootElement = document.getElementById("root");

const renderApp = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
    <PersistGate persistor={persistor}>

      <HashRouter history={hist}>
        <Component />
      </HashRouter>
      </PersistGate>
    </Provider>,
    rootElement
  );
};

renderApp(Main);

if (module.hot) {
  module.hot.accept("./DemoPages/Main", () => {
    const NextApp = require("./DemoPages/Main").default;
    renderApp(NextApp);
  });
}
serviceWorker.unregister();
