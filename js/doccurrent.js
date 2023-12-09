let usernameValue = null;

export function setUsername(username) {
  usernameValue = username;
}

export function getUsername() {
  return usernameValue;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBrU0m9w-02EOGuEdjWhpTtQDa-uSVX3lU",
  authDomain: "rha-startup.firebaseapp.com",
  projectId: "rha-startup",
  storageBucket: "rha-startup.appspot.com",
  messagingSenderId: "538026484468",
  appId: "1:538026484468:web:a85635d8fc00351ed1b4a1",
  measurementId: "G-V5X6933RCP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const querySnapshot = await getDocs(collection(db, "doctorAccount"));
const storage = getStorage();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const email = user.email;
    querySnapshot.forEach((doc) => {
      const username = doc.data().username;
      const useremail = doc.data().email;
      //get the username
      if (email === useremail) {
        console.log(username);
        setUsername(username);
        document.getElementById("docusername").innerText = `${username}`;
      }
    });

    //image profile
    getDownloadURL(ref(storage, email))
      .then((url) => {
        const img = document.getElementById("myimg");
        img.setAttribute("src", url);
      })
      .catch((error) => {
        // Handle any errors
      });
  } else {
    // User is signed out
    // ...
    window.location.href = "index.html";
  }
});

document.getElementById("signout").addEventListener("click", function () {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      // An error happened.
    });
});
