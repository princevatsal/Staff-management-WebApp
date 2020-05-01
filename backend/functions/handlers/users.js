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
    confirmPassword: req.body.confirmPassword,
    dlNo: req.body.dlNo,
  };

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
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: err.message });
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
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, Please try again" });
      } else {
        return res.status(500).json({ general: "User may not be registered" });
      }
    });
};
exports.getUserInfo = (req, res) => {};
