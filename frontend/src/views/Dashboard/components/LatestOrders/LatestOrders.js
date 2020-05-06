import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
// import moment from 'moment';
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  TableSortLabel,
} from "@material-ui/core";
import { UserContext } from "context/userContext";
import mockData from "./data";

const useStyles = makeStyles((theme) => ({
  root: {},
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 800,
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  status: {
    marginRight: theme.spacing(1),
  },
  actions: {
    justifyContent: "flex-end",
  },
}));

const statusColors = {
  delivered: "success",
  pending: "info",
  refunded: "danger",
};

//Formatting Date
const formatDate = (firestoreDate) => {
  var jsDate = new Date(firestoreDate._seconds * 1000);
  var time = jsDate.toLocaleTimeString({}, { hour12: false });
  time = tConv24(time);
  return time;
};

//formatting 12 hours
function tConv24(time24) {
  var ts = time24;
  var H = +ts.substr(0, 2);
  var h = H % 12 || 12;
  h = h < 10 ? "0" + h : h; // leading 0 at the left for 1 digit hours
  var ampm = H < 12 ? " AM" : " PM";
  ts = h + ts.substr(2, 3) + ampm;
  return ts;
}
//filter today by given Date
const filterTask = (tasklist, finaldate) =>
  tasklist.filter((task) => {
    let today = finaldate.toLocaleDateString();
    let date = new Date(task.start._seconds * 1000).toLocaleDateString();
    if (today === date) return true;
  });

const LatestOrders = (props) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const [orders] = useState(mockData);
  const { dates, userData } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [tempTasks, setTempTasks] = useState([]);
  const [sin, setSIN] = useState("");
  useEffect(() => {
    var filteredTasks = userData.tasks
      ? filterTask(userData.tasks.taskList, dates.date)
      : [];
    let temp = filteredTasks.map((task) => {
      let StartTime = formatDate(task.start);
      let EndTime = formatDate(task.end);
      return {
        time: StartTime + "--" + EndTime,
        details: task.details,
        sinNumber: task.sinNumber ? task.sinNumber : "",
      };
    });
    setTasks(temp);
    setTempTasks(temp);
  }, [dates]);

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <CardHeader
        title="Latest Tasks"
        action={
          <div style={{ paddingRight: "20px", paddingTop: "10px" }}>
            <h3 style={{ fontFamily: "sans-serif" }}>{dates.show}</h3>
          </div>
        }
        subheader={
          <div style={{ paddingRight: "20px", paddingTop: "10px" }}>
            <TextField
              label="Enter SIN No."
              value={sin}
              onChange={(e) => {
                console.log(e.target.value);
                setSIN(e.target.value);
                let temp = tasks.filter((task) =>
                  task.sinNumber.startsWith(e.target.value)
                );
                if (e.target.value) setTempTasks(temp);
                else setTempTasks(tasks);
              }}
            />
          </div>
        }
      />
      <Divider />
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Task No</TableCell>
                  <TableCell>Task Details </TableCell>
                  <TableCell>Timing</TableCell>
                  <TableCell>SIN Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tempTasks.map((task, index) => (
                  <TableRow hover key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{task.details}</TableCell>
                    <TableCell>{task.time}</TableCell>
                    <TableCell>{task.sinNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <Divider />
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string,
};

export default LatestOrders;
