import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import {
  CircularProgress,
  withStyles,
  TextField,
  Grid,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { userReducer } from "context/reducers";
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

const Admin = (props) => {
  const { history } = props;
  const { userData, setGlobalUser } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [DATA, setDATA] = useState([]);
  const [data, setdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  if (!localStorage.token) {
    window.location.href = "/sign-in";
  }

  const { checkUserData } = useContext(UserContext);
  useEffect(() => {
    // checkUserData();
    axios
      .get("/getallusers")
      .then((data) => {
        setDATA(data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div style={styles.topbar}>
        <input
          type="text"
          style={styles.search}
          placeholder="Search for a Employee"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            let data = DATA.filter((user) =>
              user.credentials.name
                .toUpperCase()
                .includes(e.target.value.toUpperCase())
            );
            if (e.target.value) setdata(data);
            else setdata([]);
          }}
        />
        <ul style={styles.searchList}>
          {data.map((user, index) => (
            <li
              style={styles.searchItems}
              key={index}
              onClick={(e) => {
                setdata([]);
                setSearchTerm("");
                axios
                  .get("/getUserInfo?uid=" + user.credentials.uid)
                  .then((data) => {
                    setSelectedUser(data.data);
                    console.log(data.data);
                  })
                  .catch((err) => alert("Error fetching user"));
              }}
            >
              {user.credentials.name}
            </li>
          ))}
        </ul>
        <p style={styles.info}>
          Name -{selectedUser ? selectedUser.user.credentials.name : " "} <br />
          DlNo -
          {selectedUser ? selectedUser.user.credentials.drivingLicenceNo : " "}
        </p>
      </div>
      {selectedUser && (
        <div style={styles.root}>
          <Grid container spacing={4}>
            <Grid item lg={4} md={6} xl={3} xs={12}>
              <UsersByDevice />
            </Grid>
            <Grid item lg={8} md={12} xl={9} xs={12}>
              <LatestOrders user={selectedUser} />
            </Grid>
          </Grid>
        </div>
      )}
    </div>
  );
};

const styles = {
  topbar: {
    display: "flex",
    background: "#5e72e4",
    width: "100%",
    height: "30vh",
    flexDirection: "column",
    padding: "30px",
    paddingTop: "20px",
  },
  search: {
    height: "50px",
    width: "70%",
    borderRadius: "25px",
    margin: "30px",
    marginLeft: "0px",
    padding: "9px",
    paddingLeft: "20px",
    fontFamily: "sans-serif",
    fontSize: "15px",
    border: 0,
    background: "#eff1fc",
  },
  info: {
    marginLeft: "15px",
    fontFamily: "sans-serif",
    color: "#fff",
    fontSize: "18px",
    letterSpacing: "2.5px",
    lineHeight: "25px",
  },
  root: {
    padding: "30px",
    width: "100%",
  },
  searchList: {
    background: "#eff1fc",
    position: "absolute",
    listStyleType: "none",
    top: "170px",
    borderRadius: "20px",
    boxShadow: "4px 4px 10px #9999",
  },
  searchItems: {
    fontFamily: "sans-serif",
    padding: "12px",
    paddingLeft: "30px",
    fontSize: "20px",
    width: "240px",
  },
};
Admin.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Admin);
