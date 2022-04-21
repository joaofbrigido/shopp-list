import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Menu } from "./components/Menu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.scss";

const isLoginPage = window.location.pathname === "/" ? true : false;

ReactDOM.render(
  <React.StrictMode>
    {isLoginPage ? (
      <App />
    ) : (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Menu />
        <App />
      </>
    )}
  </React.StrictMode>,
  document.getElementById("root")
);
