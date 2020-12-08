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
  Modal,
  Button,
} from "@material-ui/core";
import { UserContext } from "context/userContext";
import mockData from "./data";

const useStyles = makeStyles((theme) => ({
  detailCardContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif",
    fontSize: 20,
  },
  detailCard: {
    width: 375,
    height: 325,
    padding: 40,
  },
  cardDate: {
    fontSize: 20,
    marginBottom: 12,
    color: "#555",
  },
  cardTime: {
    marginBottom: 12,
    color: "#555",
  },
  cardDetails: {
    fontSize: 20,
  },
  cardButton: {
    display: "flex",
    bottom: -120,
  },
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
const filterTask = (tasklist, finaldate) => {
  // changes for showing past seven days tasks
  var dates = [];
  for (var i = 0; i < 4; i++) {
    let temp = new Date(finaldate.getTime() - i * 24 * 60 * 60 * 1000);
    dates.push(temp);
  }
  for (var i = 1; i <= 3; i++) {
    let temp = new Date(finaldate.getTime() + i * 24 * 60 * 60 * 1000);
    dates.push(temp);
  }
  //
  return tasklist.filter((task) => {
    //let today = finaldate.toLocaleDateString();
    let date = new Date(task.start._seconds * 1000).toLocaleDateString();
    let flag = false;
    dates.forEach((dat) => {
      if (date === dat.toLocaleDateString()) flag = true;
    });
    return flag;
  });
};
const LatestOrders = (props) => {
  const { className, sinNUM, enterSin, ...rest } = props;
  const classes = useStyles();
  const [orders] = useState(mockData);
  const { dates, userData } = useContext(UserContext);
  const [tasks, setTasks] = useState([]);
  const [tempTasks, setTempTasks] = useState([]);
  const [sin, setSIN] = useState("");
  const [modal, setModal] = useState(false);
  const initModalData = {
    date: "",
    time: "",
    details: "",
  };
  const [modalData, setModalData] = useState(initModalData);
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
        date: new Date(task.start._seconds * 1000),
      };
    });
    setTasks(temp);
    setTempTasks(temp);
    //
    // let temp2 = tasks.filter((task) => task.sinNumber === sinNUM);
    // if (sinNUM) setTempTasks(temp2);
    // else setTempTasks([]);
    //
  }, [dates, sinNUM]);

  return (
    <Card {...rest} className={clsx(className)}>
      <Modal
        open={modal}
        className={classes.detailCardContainer}
        onClose={() => {
          setModal(false);
          setModalData(initModalData);
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Card className={classes.detailCard}>
          <h2 className={classes.cardDate}>Date: {modalData.date}</h2>
          <h3 className={classes.cardTime}>Time: {modalData.time}</h3>
          <h3 className={classes.cardDetails}>Details: {modalData.details}</h3>
          <Button
            className={classes.cardButton}
            variant="contained"
            color="secondary"
            onClick={() => {
              setModal(false);
              setModalData(initModalData);
            }}
          >
            OK
          </Button>
        </Card>
      </Modal>
      <CardHeader
        title="Latest Tasks"
        action={
          <div style={{ paddingRight: "20px", paddingTop: "10px" }}>
            <h3 style={{ fontFamily: "sans-serif" }}>{dates.show}</h3>
          </div>
        }
        subheader={
          <div style={{ paddingRight: "20px", paddingTop: "10px" }}>
            <Button
              onClick={() => {
                enterSin();
              }}
            >
              ReEnter SIN{" "}
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
                  <TableCell>Date </TableCell>
                  <TableCell>Timing</TableCell>
                  <TableCell>SIN Number</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tempTasks.map((task, index) => (
                  <TableRow
                    hover
                    key={index}
                    style={
                      dates.date.toLocaleDateString() ===
                      task.date.toLocaleDateString()
                        ? { borderBottom: "50px" }
                        : { background: "#eee" }
                    }
                    onClick={(e) => {
                      var tr = e.target.parentElement;
                      setModalData({
                        date: tr.children[1].innerHTML,
                        time: tr.children[2].innerHTML,
                        details: tr.children[4].innerHTML,
                      });
                      setModal(true);
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{task.date.toLocaleDateString()}</TableCell>
                    <TableCell>{task.time}</TableCell>
                    <TableCell>{task.sinNumber}</TableCell>
                    <TableCell>{task.details}</TableCell>
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
