import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, CircularProgress } from "@material-ui/core";
import PropTypes from "prop-types";
import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  LatestSales,
  UsersByDevice,
  LatestProducts,
  LatestOrders,
} from "./components";
import { withRouter } from "react-router-dom";

// Global User Context
import { UserContext } from "context/userContext";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const Dashboard = (props) => {
  const { checkUserData, userData } = useContext(UserContext);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { history } = props;
  useEffect(() => {
    checkUserData();
    if (userData && userData.user.credentials.name) {
      setLoading(false);
    } else if (userData && !userData.user.credentials.name) {
      history.push("/");
    } else {
      setLoading(true);
    }
  }, [userData]);
  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className={classes.root}>
      <Grid container spacing={4}>
        {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
          <Budget />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalUsers />
        </Grid>
        <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TasksProgress />
        </Grid> */}
        {/* <Grid item lg={3} sm={6} xl={3} xs={12}>
          <TotalProfit />
        </Grid> */}
        <Grid item lg={4} md={6} xl={3} xs={12}>
          <UsersByDevice />
        </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <LatestOrders />
        </Grid>
        {/* <Grid item lg={4} md={6} xl={3} xs={12}>
          <LatestProducts />
        </Grid>
        <Grid item lg={8} md={12} xl={9} xs={12}>
          <LatestSales />
        </Grid> */}
      </Grid>
    </div>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object,
};
export default withRouter(Dashboard);
