import React, { useState, useEffect, useContext } from "react";
import { CircularProgress } from "@material-ui/core";
const axios = require("axios");
const Loading = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!loading) {
      window.location.href = "/";
    } else {
      let token = localStorage.getItem("token");
      axios.get("/api/getUserInfo").then((data) => {});
    }
  }, [loading]);
  return (
    <div style={styles.container}>
      <CircularProgress />
    </div>
  );
};
const styles = {
  container: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};
export default Loading;
