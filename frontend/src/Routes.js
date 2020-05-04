import React from "react";
import { Switch, Redirect } from "react-router-dom";

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

  const { setUserData } = React.useContext(UserContext);

  React.useEffect(() => {
    if (!localStorage.getItem("token")) {
      return;
    }

    axios
      .get("/getUserInfoByToken")
      .then((data) => {
        setUserData(data.data);
        if (data.data.user.isAdmin) {
          setAdminState(true);
        }
      })
      .catch((err) => alert("unable to fetch user"));
  }, []);

  return (
    <Switch>
      <Redirect exact from="/" to="/loading" />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/users"
      />
      <RouteWithLayout
        component={Loading}
        exact
        layout={Loading}
        path="/loading"
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
      {adminState && (
        <RouteWithLayout
          component={Admin}
          exact
          layout={MainLayout}
          path="/admin"
        />
      )}
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
