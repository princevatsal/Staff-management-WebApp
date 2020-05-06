import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";
// import moment from 'moment';
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Input,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DateFnsUtils from "@date-io/date-fns";
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { UserContext } from "context/userContext";
import mockData from "./data";
import axios from "axios";
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
  sinNumber: {
    marginLeft: theme.spacing(4),
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
const initInfo = {
  start: new Date(),
  end: new Date(),
  details: "",
  sinNumber: "",
};
const LatestOrders = (props) => {
  const { className, user, ...rest } = props;
  const classes = useStyles();
  const [orders] = useState(mockData);
  const { dates, userData } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [model, setModel] = useState(false);
  const [info, setInfo] = useState(initInfo);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    let tasklist = user.tasks ? user.tasks.taskList : [];
    var filteredTasks = filterTask(tasklist, dates.date);
    setTasks(
      filteredTasks.map((task) => {
        let StartTime = formatDate(task.start);
        let EndTime = formatDate(task.end);
        return {
          time: StartTime + "--" + EndTime,
          details: task.details,
          sinNumber: task.sinNumber ? task.sinNumber : "",
        };
      })
    );
    //
    let localtime = new Date();
    localtime.setDate(dates.date.getDate());
    localtime.setMonth(dates.date.getMonth());
    localtime.setFullYear(dates.date.getFullYear());
    setInfo({ start: localtime, end: localtime, details: "", sinNumber: "" });
    //
  }, [dates, user, refresh]);

  return (
    <Card>
      <Dialog aria-labelledby="simple-dialog-title" open={model}>
        <DialogTitle id="simple-dialog-title">Add New Task </DialogTitle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div style={{ padding: "20px" }}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Choose Start Time"
              value={info.start}
              onChange={(e) => {
                let localtime = new Date(e);
                localtime.setDate(dates.date.getDate());
                localtime.setMonth(dates.date.getMonth());
                localtime.setFullYear(dates.date.getFullYear());
                console.log("Seee it : ", localtime);
                setInfo({ ...info, start: localtime });
              }}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Choose End Time"
              value={info.end}
              onChange={(e) => {
                let localtime = new Date(e);
                localtime.setDate(dates.date.getDate());
                localtime.setMonth(dates.date.getMonth());
                localtime.setFullYear(dates.date.getFullYear());
                console.log("Seee it : ", localtime);
                setInfo({ ...info, end: localtime });
              }}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </div>
          <div style={{ padding: "20px" }}>
            <Input
              placeholder="Enter Task Details"
              value={info.details}
              onChange={(e) => setInfo({ ...info, details: e.target.value })}
            />

            <Input
              className={classes.sinNumber}
              placeholder="Enter SIN Number"
              value={info.sinNumber}
              onChange={(e) => setInfo({ ...info, sinNumber: e.target.value })}
            />
          </div>
          <div style={{ padding: "20px" }}>
            <Button
              styles={styles.addbtn}
              onClick={() => {
                setModel(false);
                console.log(info, user.user);
                axios({
                  method: "post",
                  url: "/addtask",
                  data: {
                    task: info,
                    uid: user.user.credentials.uid,
                    old: user.tasks ? user.tasks.taskList : [],
                  },
                })
                  .then((data) => {
                    console.log(data.data);
                    if (user.tasks) user.tasks.taskList.push(data.data);
                    else user.tasks = { taskList: [data.data] };
                    console.log(user);
                    setRefresh(!refresh);
                  })
                  .catch((err) => console.log(err));
              }}
            >
              Add
            </Button>
            <Button
              styles={styles.addbtn}
              onClick={() => {
                setModel(false);
                setInfo(initInfo);
              }}
            >
              Cancel
            </Button>
          </div>
        </MuiPickersUtilsProvider>
      </Dialog>
      <CardHeader
        title="Latest Tasks "
        action={
          <div style={{ display: "flex" }}>
            <div
              style={{
                paddingRight: "20px",
                paddingTop: "10px",
              }}
            >
              <h3 style={{ fontFamily: "sans-serif" }}>{dates.show}</h3>
            </div>
            <Button
              variant="contained"
              color="primary"
              href="#contained-buttons"
              onClick={() => {
                setModel(true);
              }}
            >
              Add New
            </Button>
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
                {tasks.map((task, index) => (
                  <TableRow hover key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{task.details}</TableCell>
                    <TableCell>{task.time}</TableCell>
                    <TableCell>
                      {task.sinNumber ? task.sinNumber : "none"}
                    </TableCell>
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
const styles = {
  addbtn: {
    border: 0,
    background: "#fff",
    padding: "20px",
    fontFamily: "sans-serif",
  },
  details: {},
  addbtn: {},
};
LatestOrders.propTypes = {
  className: PropTypes.string,
};

export default LatestOrders;
