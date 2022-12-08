const functions = require("firebase-functions");
// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Import admin for use in creating a function for making a user an admin
const admin = require("firebase-admin");
// Initialize the input on the server end
admin.initializeApp();
// Export the function for use in the app assign to callback function for use
exports.addAdminRole = functions.https.onCall((data, context) => {
  // get the user and add a custome claim to that user (admin)
  return admin.auth().getUserByEmail(data.email).then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
  }).then(() => {
    return {
      message: `Success! ${data.email} has been made an admin`,
    };
  }).catch((err) => {
    return err;
  });
});
