import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { CircularProgress, withStyles } from "@material-ui/core";
import { UserContext } from "../../context/userContext";
import axios from "axios";

const Loading = (props) => {
  const { userData, setUserData } = useContext(UserContext);
  const { history } = props;

  useEffect(() => {
    if (!localStorage.token) {
      history.push("/sign-in");
      return;
    }
    if (localStorage.token && !userData) {
      axios
        .get("https://asia-northeast1-staff-management-a6803.cloudfunctions.net/api/getUserInfoByToken")
        .then((res) => {
          setUserData(res.data);
          console.log(res);
          if (res.data.user.isAdmin) history.push("/admin");
          else history.push("/dashboard");
        })
        .catch((err) => alert("unable to fetch user"));
      return;
    }
    if (userData.isAdmin) history.push("/admin");
    else history.push("/dashboard");
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
