import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  CircularProgress,
  Modal,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
} from "@material-ui/core";
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
import { tr } from "date-fns/locale";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
  formRoot: {
    padding: theme.spacing(3),
  },
  cardRoot: {
    minWidth: 275,
    width: "30%",
    height: "40%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  cardActions: {
    display: "flex",
    justifyContent: "center",
  },
  cardContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}));

const Dashboard = (props) => {
  const { checkUserData, userData } = useContext(UserContext);
  const { history } = props;
  const [sin, setSin] = useState("");
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [sinModal, setSinModal] = useState(true);

  if (!localStorage.token) window.location.href = "/";
  useEffect(() => {
    checkUserData();
    if (userData && userData.user.credentials.name) {
      setLoading(false);
    } else if (userData && !userData.user.credentials.name) {
      window.location.href = "/";
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
      {/* <Modal
        open={sinModal}
        className={classes.cardContainer}
        onClose={() => {
          setSinModal(false);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card className={classes.cardRoot}>
          <CardContent>
            <form className={classes.formRoot} noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Enter SIN Number"
                error={false}
                helperText={false ? "error" : ""}
                value={sin}
                onChange={(e) => {
                  setSin(e.target.value);
                }}
              />
            </form>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Button
              variant="contained"
              color="primary"
              fl
              onClick={() => {
                setSinModal(false);
                console.log(sin);
              }}
            >
              Enter
            </Button>
          </CardActions>
        </Card>
      </Modal> */}
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
          <LatestOrders sinNUM={sin} enterSin={() => setSinModal(true)} />
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
