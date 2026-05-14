// Reference: https://firebase.google.com/docs/cloud-messaging/send/admin-sdk
// Server app.js file
const registrationToken = "YOUR_TOKEN";

const message = {
  data: {
    score: "850",
    time: "2:45",
  },
  token: registrationToken,
};

getMessaging()
  .send(message)
  .then((response) => {
    console.log("Successfully sent message:", response);
  })
  .catch((error) => {
    console.log("Error sending message:", error);
  });
