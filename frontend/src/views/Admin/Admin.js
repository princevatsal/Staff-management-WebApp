import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { UserContext } from "../../context/userContext";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { CircularProgress, withStyles, TextField } from "@material-ui/core";
import { userReducer } from "context/reducers";

const Admin = (props) => {
  const { history } = props;
  const [loading, setLoading] = useState(true);
  const { userData, setGlobalUser } = useContext(UserContext);
  console.log(userData);

  if (!localStorage.token) {
    history.push("/sign-in");
  }

  const { checkUserData } = useContext(UserContext);
  useEffect(() => {
    checkUserData();
    if (userData && userData.user.isAdmin) {
      setLoading(false);
    } else if (userData && !userData.user.isAdmin) {
      history.push("/");
    } else {
      setLoading(true);
    }
  }, [userData]);

  return loading ? (
    <CircularProgress color="primary" />
  ) : (
    <div>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      <h1>Admin Page</h1>
    </div>
  );
};
Admin.propTypes = {
  history: PropTypes.object,
};
export default withRouter(Admin);
