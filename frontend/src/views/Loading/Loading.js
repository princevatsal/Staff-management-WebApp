import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { UserContext } from "../../context/userContext";
import jwtDecode from "jwt-decode";
const axios = require("axios");
const Loading = (props) => {
  const [loading, setLoading] = useState(true);
  //global user
  const { userData, setGlobalUser } = useContext(UserContext);
  const { history } = props;
  // console.log();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/sign-in");
      return null;
    }
    var token = localStorage.getItem("token");
    //handling token expiery
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        // axios.defaults.headers.common["Authorization"] = token;
      }
    }
    //
    axios({
      method: "get",
      url:
        "http://localhost:5000/staff-management-753e4/asia-northeast1/api/getUserInfoByToken",
      params: {
        token: localStorage.getItem("token"),
      },
    })
      .then((data) => {
        console.log(data);
        setGlobalUser(data.data);
        setLoading(false);
        if (data.data.user.isAdmin) history.push("/admin");
        else history.push("/dashboard");
      })
      .catch((err) => alert("unable to fetch user"));
    console.log("userData:-", userData);
  }, []);
  return (
    <div style={styles.container}>
      <CircularProgress />
    </div>
  );
};
const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
Loading.propTypes = {
  history: PropTypes.object,
};
export default withRouter(Loading);
