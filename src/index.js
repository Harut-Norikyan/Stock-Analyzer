import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./Css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter } from "react-router-dom";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
