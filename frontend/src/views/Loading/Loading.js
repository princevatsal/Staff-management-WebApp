import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { CircularProgress, withStyles } from "@material-ui/core";
import { UserContext } from "../../context/userContext";
import axios from "axios";

const ColorCircularProgress = withStyles({
  root: {
    color: "white",
  },
})(CircularProgress);

const Loading = (props) => {
  const { userData, setUserData } = useContext(UserContext);
  const { history } = props;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history.push("/sign-in");
      return;
    }
    axios
      .get("/getUserInfoByToken")
      .then((data) => {
        setUserData(data.data);
        if (data.data.user.isAdmin) history.push("/admin");
        else history.push("/dashboard");
      })
      .catch((err) => alert("unable to fetch user"));
  }, []);
  return (
    <div style={styles.container}>
      <ColorCircularProgress />
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
