import React from "react";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Chart } from "react-chartjs-2";
import { ThemeProvider } from "@material-ui/styles";
import validate from "validate.js";

import jwtDecode from "jwt-decode";
import axios from "axios";

import { chartjs } from "./helpers";
import theme from "./theme";
import "react-perfect-scrollbar/dist/css/styles.css";
import "./assets/scss/index.scss";
import validators from "./common/validators";
import Routes from "./Routes";

// Global User Provider
import { UserProvider } from "./context/userContext";

const browserHistory = createBrowserHistory();

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw,
});

validate.validators = {
  ...validate.validators,
  ...validators,
};

// Setting up User
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    // store.dispatch(logoutUser());
    localStorage.removeItem("token");
    window.location.href = "/sign-in";
  } else {
    // store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    // store.dispatch(getUserData());
  }
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Router history={browserHistory}>
          <Routes />
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
