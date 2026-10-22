// import admin from "firebase-admin";

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID as string,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY
//     ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
//     : undefined,
// };

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// export default admin;

import "dotenv/config";
import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Firebase env variables missing. Check your .env file.");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });
}

export default admin;
