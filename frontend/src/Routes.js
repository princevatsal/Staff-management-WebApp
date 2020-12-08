import React from "react";
import { Switch, Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { RouteWithLayout } from "./components";
import { Main as MainLayout, Minimal as MinimalLayout } from "./layouts";

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  Typography as TypographyView,
  Icons as IconsView,
  Account as AccountView,
  Settings as SettingsView,
  SignUp as SignUpView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  Admin,
  Loading,
} from "./views";
import axios from "axios";
import { UserContext } from "context/userContext";

const Routes = () => {
  const [adminState, setAdminState] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { userData, setUserData } = React.useContext(UserContext);
  const token = localStorage.token;
  React.useEffect(() => {
    if (token && !userData) {
      axios
        .get("https://asia-northeast1-staff-management-a6803.cloudfunctions.net/api/getUserInfoByToken")
        .then((res) => {
          setUserData(res.data);
          console.log("ress:-",res.data)
          res.data.user.credentials.isAdmin && setAdminState(true);
          setLoading(false);
        })
        .catch((err) => alert("Unable to fetch user err : ", err));
    } else if (token && userData) {
      userData.isAdmin && setAdminState(true);
    } else {
      setLoading(false);
    }
  }, []);

  return loading ? (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <Switch>
      {token ? (
        <Redirect exact from="/" to={adminState ? "/admin" : "/dashboard"} />
      ) : (
        <Redirect exact from="/" to="/sign-in" />
      )}
      {adminState ? (
        <RouteWithLayout
          component={Admin}
          exact
          layout={MainLayout}
          path="/admin"
        />
      ) : (
        <RouteWithLayout
          component={DashboardView}
          exact
          layout={MainLayout}
          path="/dashboard"
        />
      )}
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/products"
      />
      <RouteWithLayout
        component={TypographyView}
        exact
        layout={MainLayout}
        path="/typography"
      />
      <RouteWithLayout
        component={IconsView}
        exact
        layout={MainLayout}
        path="/icons"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        layout={MainLayout}
        path="/account"
      />
      <RouteWithLayout
        component={SettingsView}
        exact
        layout={MainLayout}
        path="/settings"
      />
      <RouteWithLayout
        component={SignUpView}
        exact
        layout={MinimalLayout}
        path="/sign-up"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
