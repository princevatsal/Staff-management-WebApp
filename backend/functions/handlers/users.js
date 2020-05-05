const firebase = require("firebase");
const { admin, db } = require("../utils/admin");

// INITIALIZE FIREBASE CLIENT
const config = require("../utils/config");
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
  console.log(newUser);

  // Validate Data
  const { valid, errors } = validateSignupData(newUser);
  if (!valid) return res.status(400).json(errors);

  // Set temp variables
  const noImg = "no-img.png";
  let token, userId;

  // Sign up and return access token
  firebase
    .auth()
    .createUserWithEmailAndPassword(newUser.email, newUser.password)
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
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
      return res.status(201).json({ token });
    })
    .catch((err) => {
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
      console.log(data.user.getRefreshToken);
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
  console.log(uid, geo, timestamp);

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
