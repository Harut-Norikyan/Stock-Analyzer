import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./Css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import { BrowserRouter } from "react-router-dom";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./helper/translation";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<RouterProvider router={router} />
		<ToastContainer autoClose={5000} />
	</Provider>,
);
