const functions = require("firebase-functions");
const app = require("express")();

//middleware
const MiddleWare = require("./middlewares/auth");

// For Cross Origin Requests
const cors = require("cors");
app.use(cors());

// DB Reference
const { db } = require("./utils/admin");

// Handlers
const {
  signup,
  login,
  getUserInfo,
  getUserInfoByToken,
  getAllUsers,
  updateUserLocation,
} = require("./handlers/users");

// Auth Routes
app.post("/signup", signup);
app.post("/login", login);

// User Routes
app.get("/getUserInfo", getUserInfo);
app.get("/getUserInfoByToken", MiddleWare, getUserInfoByToken);
app.get("/getallusers", getAllUsers);
app.post("/updateUserLocation", MiddleWare, updateUserLocation);

// API FORMAT : https://baseurl.com/api/
exports.api = functions.region("asia-northeast1").https.onRequest(app);
