const admin = require("firebase-admin");

// Initialize admin sdk
admin.initializeApp();

// DB Reference
const db = admin.firestore();

module.exports = { admin, db };
