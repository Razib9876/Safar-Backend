import admin from "firebase-admin";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID as string,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
  privateKey: process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    : undefined,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
