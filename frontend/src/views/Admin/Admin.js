import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { UserContext } from "../../context/userContext";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Admin = (props) => {
  const { history } = props;
  const { userData, setGlobalUser } = useContext(UserContext);
  console.log(userData);

  if (!userData.user.isAdmin) {
    history.push("/");
  }

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <h1>Admin Page</h1>
    </div>
  );
};
Admin.propTypes = {
  history: PropTypes.object,
};
export default withRouter(Admin);
