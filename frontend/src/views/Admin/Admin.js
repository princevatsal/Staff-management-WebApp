import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

const Admin = (props) => {
  const { history } = props;
  const { userData, setGlobalUser } = useContext(UserContext);
  console.log(userData);

  if (!localStorage.token) {
    history.push("/sign-in");
  }

  const { checkUserData } = useContext(UserContext);
  useEffect(() => {
    checkUserData();
  }, [userData]);

  return (
    <div>
      <h1>Admin Page</h1>
    </div>
  );
};

Admin.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Admin);
