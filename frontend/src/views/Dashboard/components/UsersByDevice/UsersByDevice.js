import React from "react";
import { Doughnut } from "react-chartjs-2";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Divider,
  Typography,
} from "@material-ui/core";
import LaptopMacIcon from "@material-ui/icons/LaptopMac";
import PhoneIphoneIcon from "@material-ui/icons/PhoneIphone";
import RefreshIcon from "@material-ui/icons/Refresh";
import TabletMacIcon from "@material-ui/icons/TabletMac";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { UserContext } from "context/userContext";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  chartContainer: {
    position: "relative",
    height: "300px",
  },
  stats: {
    marginTop: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
  },
  device: {
    textAlign: "center",
    padding: theme.spacing(1),
  },
  deviceIcon: {
    color: theme.palette.icon,
  },
}));

const UsersByDevice = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const theme = useTheme();
  const { setDate } = React.useContext(UserContext);

  var today = new Date();
  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        // action={
        //   <IconButton size="small">
        //     <RefreshIcon />
        //   </IconButton>
        // }
        title="Choose One Date"
      />
      <Divider />
      <CardContent>
        <Calendar
          onChange={(e) => {
            setDate(e);
          }}
          value={today}
        />
      </CardContent>
    </Card>
  );
};

UsersByDevice.propTypes = {
  className: PropTypes.string,
};

export default UsersByDevice;
