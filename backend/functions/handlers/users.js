const firebase = require("firebase");
const { admin, db } = require("../utils/admin");

// INITIALIZE FIREBASE CLIENT
const config = require("../utils/config").config;
firebase.initializeApp(config);

// VALIDATORS
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validators");

// SIGN UP THE USER
exports.signup = (req, res) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    dlNo: req.body.dlNo,
  };
  console.log("signing up user")
  // Validate Data
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);
  console.log("here")
  // Set temp variables
  const noImg = "no-img.png";
  let token, userId;

  // Sign up and return access token
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      console.log("here first")
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      console.log("in first then")
      token = idToken;
      const userCredentials = {
        name: newUser.name,
        email: newUser.email,
        dlNo: newUser.dlNo,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        isAdmin: false,
        uid: userId,
      };
      return db
        .doc(`/users/${userCredentials.uid}`)
        .set({ credentials: userCredentials });
    })
    .then(() => {
      console.log("in second then ")
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.log("in this catch")
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ general: err.message });
      } else if (err.code === "auth/weak-password") {
        return res.status(400).json({ general: err.message });
      } else {
        return res.status(500).json({ general: err });
      }
    });
};

// LOGIN THE USER
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  // Validate data
  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  // Login the user and return access token
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => res.json({ token }))
    .catch((err) => {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        return res
          .status(403)
          .json({ general: "Wrong credentials, Please try again" });
      } else {
        return res.status(500).json({ general: "User may not be registered" });
      }
    });
};

// UPDATE USER LOCATION
exports.updateUserLocation = (req, res) => {
  const uid = req.user.uid;
  const geo = req.body.geo;
  const timestamp = req.body.timestamp;

  db.collection("user-activity")
    .doc(uid)
    .set({ [timestamp]: { geo } }, { merge: true })
    .then(() => res.json({ message: "Location Updated Successfully" }))
    .catch((err) => res.status(500).json({ message: err }));
};

// GET USER INFO
exports.getUserInfo = (req, res) => {
  const uid = req.query.uid;
  var obj = {};
  var someFetched = false;
  db.collection("users")
    .doc(uid)
    .get()
    .then((user) => {
      obj.user = user.data();
      return db.collection("tasks").doc(uid).get();
    })
    .then((tasks) => {
      obj.tasks = tasks.data();
      return db.collection("user-activity").doc(uid).get();
    })
    .then((loc) => {
      obj.userActivity = loc.data();
      console.log("in final obg:-", obj);
      res.json(obj);
    })
    .catch((err) => {
      console.log(err);

      res.json(obj);
      res.status(400).send("Error Fetching User");
    });
};

exports.getUserInfoByToken = (req, res) => {
  const uid = req.user.uid;
  var obj = {};
  db.collection("users")
    .doc(uid)
    .get()
    .then((user) => {
      obj.user = user.data();
      return db.collection("tasks").doc(uid).get();
    })
    .then((tasks) => {
      obj.tasks = tasks.data();
      res.json(obj);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("Error Fetching User");
    });
};
exports.getAllUsers = (req, res) => {
  db.collection("users")
    .get()
    .then((data) => res.json(data.docs.map((data) => data.data())))
    .catch((err) => res.status(404).send(err));
};

exports.addTask = (req, res) => {
  const info = req.body.task;
  const uid = req.body.uid;
  const old = req.body.old;

  info.start = new Date(info.start);
  info.end = new Date(info.end);

  const newTask = {
    start: {
      _seconds: firebase.firestore.Timestamp.fromDate(info.start).seconds,
      _nanoseconds: firebase.firestore.Timestamp.fromDate(info.start)
        .nanoseconds,
    },
    end: {
      _seconds: firebase.firestore.Timestamp.fromDate(info.end).seconds,
      _nanoseconds: firebase.firestore.Timestamp.fromDate(info.end).nanoseconds,
    },
    details: info.details,
    sinNumber: info.sinNumber,
  };

  old.push(newTask);
  db.collection("tasks")
    .doc(uid)
    .set({ taskList: old })
    .then(() => res.json(newTask))
    .catch(() => res.send(400));
};
