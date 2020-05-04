import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

// Global User
import { UserContext } from "context/userContext";

const AuthRoute = (props) => {
  const { layout: Layout, component: Component, ...rest } = props;

  const { user } = React.useContext(UserContext);

  return (
    <Route
      {...rest}
      render={(matchProps) =>
        user.authenticated === true ? (
          <Redirect to="/dashboard" />
        ) : (
          <Layout>
            <Component {...matchProps} />
          </Layout>
        )
      }
    />
  );
};

AuthRoute.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
};

export default AuthRoute;
