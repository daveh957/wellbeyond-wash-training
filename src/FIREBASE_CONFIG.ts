export const firebaseConfig = process.env.NODE_ENV === 'production' ? {
  apiKey: "AIzaSyBOZ-rANGB1rL4g_v6zqyJpJpdMxQREORs",
  authDomain: "wellbeyond-wash-training.firebaseapp.com",
  databaseURL: "https://wellbeyond-wash-training.firebaseio.com",
  projectId: "wellbeyond-wash-training",
  storageBucket: "wellbeyond-wash-training.appspot.com",
  messagingSenderId: "654062401402",
  appId: "1:654062401402:web:661b992be5876685e9c8c3",
  measurementId: "G-S3PTGDTSPJ"
} : {
  apiKey: "AIzaSyDMGiTaLTg9wMsB4cKdlUzf4WYT6qbl_sA",
  authDomain: "wellbeyond-development.firebaseapp.com",
  databaseURL: "https://wellbeyond-development.firebaseio.com",
  projectId: "wellbeyond-development",
  storageBucket: "wellbeyond-development.appspot.com",
  messagingSenderId: "580218664538",
  appId: "1:580218664538:web:70d70df7b060994693ca63",
  measurementId: "G-4MWLG9EX11"
};
