// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query, // Add the missing import
  where,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const storage = getStorage(app);
const auth = getAuth(app);

window.changeform = function (value) {
  if (value == "doctorlog") {
    document.getElementById("formcontent").innerHTML = `
        <h2>Doctor Login</h2>
    <label>EMAIL:</label>
    <input type="email" id="docemail"  placeholder="Enter your email"/>
    <label>PASSWORD:</label>
    <input type="password" id="dpass" placeholder="Enter your password"/>
    <button id="dlogin">Login</button>
    <p>
      Don't have an account?
  
      <span onclick="window.changeform('docsign')">Sign Up</span>
    </p>
    <div class="containerbutton">
    <button class="but" onclick="window.changeform('userlog')">Are you a User?</button></div>
        `;

    //doctor log in
    document.getElementById("dlogin").addEventListener("click", function () {
      let email = document.getElementById("docemail").value;
      let password = document.getElementById("dpass").value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("success");
          window.location.href = "doctordash.html";
          // ...
        })
        .catch((error) => {
          console.log("password error");
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    });
  } else if (value == "userlog") {
    document.getElementById("formcontent").innerHTML = `
        <h2>User Login</h2>
    <label>EMAIL:</label>
    <input
      type="email"
      id="useremail"
      placeholder="Enter your email"
      required
    />
    <label>PASSWORD:</label>
    <input
      type="password"
      id="userpassword"
      placeholder="Enter your password"
      required
    />
    <button id="login">Login</button>
    <p>
      Don't have an account?
  
      <span onclick="window.changeform('usersign')">Sign Up</span>
    </p>
    <div class="containerbutton">
    <button class="but" onclick="window.changeform('doctorlog')">Are you a Doctor?</button></div>
        `;

    //login function
    document
      .getElementById("login")
      .addEventListener("click", async function () {
        let email = document.getElementById("useremail").value;
        let password = document.getElementById("userpassword").value;
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log("success");
            window.location.href = "userpage.html";
            // ...
          })
          .catch((error) => {
            console.log("password error");
            const errorCode = error.code;
            const errorMessage = error.message;
          });
      });
  } else if (value == "docsign") {
    document.getElementById("formcontent").innerHTML = `
      <h2>Doctor Sign Up</h2>
        <label>Username:</label>
  <input type="name" id="doctorname" placeholder="FULLNAME" />
  <label>Email:</label>
  <input type="email" id="doctoremail" placeholder="EMAIL" />
  <label>Password:</label>
  <input type="password" id="docpassword" placeholder="PASSWORD" />
  <label>Profession: </label>
  <select id="specialist">
  <option>NEUROLOGIST</option>
  <option>PULMONOLOGIST</option>
  <option>GYNECOLOGIST</option>
  <option>DERMATOLOGIST</option>
  <option>OPHTHALMOLOGIST</option>
  <option>CARDIOLOGIST</option>
  <option>ENDOCRINOLOGIST</option>
  <option>ONCOLOGIST</option>
  <option>UROLOGIST</option>
  </select>
  <label>Add Picture</label>
  <input type="file" id="docimage" />
  <button id="dcreate">Sign Up</button>
  <p>
    Already have an account?
  
    <span onclick="window.changeform('doctorlog')">Log In</span></p>
        `;

    //doctor account
    document
      .getElementById("dcreate")
      .addEventListener("click", async function () {
        //get the value sa register form
        let username = document
          .getElementById("doctorname")
          .value.toUpperCase();
        let email = document.getElementById("doctoremail").value;
        let password = document.getElementById("docpassword").value;
        let specialist = document.getElementById("specialist").value;
        let fileimg = document.getElementById("docimage").files[0];

        // Check for duplicate username in userAccount
        const usernameUserQuery = await getDocs(
          query(
            collection(db, "userAccount"),
            where("username", "==", username)
          )
        );
        if (!usernameUserQuery.empty) {
          alert("Username already exists in userAccount");
          return; // Stop execution if username exists
        }

        // Check for duplicate email in userAccount
        const emailUserQuery = await getDocs(
          query(collection(db, "userAccount"), where("email", "==", email))
        );
        if (!emailUserQuery.empty) {
          alert("Email already exists in userAccount");
          return; // Stop execution if email exists
        }

        // Check for duplicate username in doctorAccount
        const usernameDoctorQuery = await getDocs(
          query(
            collection(db, "doctorAccount"),
            where("username", "==", username)
          )
        );
        if (!usernameDoctorQuery.empty) {
          alert("Username already exists in doctorAccount");
          return; // Stop execution if username exists
        }

        // Check for duplicate email in doctorAccount
        const emailDoctorQuery = await getDocs(
          query(collection(db, "doctorAccount"), where("email", "==", email))
        );
        if (!emailDoctorQuery.empty) {
          alert("Email already exists in doctorAccount");
          return; // Stop execution if email exists
        }

        // ilagay sa database userAccount
        const docRef = await addDoc(collection(db, "doctorAccount"), {
          username: `${username}`,
          email: `${email}`,
          password: `${password}`,
          specialist: `${specialist}`,
        });

        // ilagay ang image sa firebase storage
        uploadBytes(ref(storage, email), fileimg).then((snapshot) => {
          alert("Uploaded a blob or file!");
        });

        // create email and password
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            alert("Doctor signed up!");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
          });
      });
  } else {
    document.getElementById("formcontent").innerHTML = `
      <h2>User Sign Up</h2>
        <label>Username:</label>
        <input type="name" id="username" placeholder="USERNAME" />
        <label>Email:</label>
        <input type="email" id="email" placeholder="EMAIL" />
        <label>Password:</label>
        <input type="password" id="password" placeholder="PASSWORD" />
        <label>Add a Picture: </label>
        <input type="file" id="image" />
        <button id="create">Sign Up</button>
        <p>
    Already have an account?
  
    <span onclick="window.changeform('userlog')">Log In</span></p>
        `;

    //usersign firebase
    document
      .getElementById("create")
      .addEventListener("click", async function () {
        //get the value sa register form
        let username = document.getElementById("username").value.toUpperCase();
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        let fileimg = document.getElementById("image").files[0];

        // Check for duplicate username in userAccount
        const usernameUserQuery = await getDocs(
          query(
            collection(db, "userAccount"),
            where("username", "==", username)
          )
        );
        if (!usernameUserQuery.empty) {
          alert("Username already exists in userAccount");
          return; // Stop execution if username exists
        }

        // Check for duplicate email in userAccount
        const emailUserQuery = await getDocs(
          query(collection(db, "userAccount"), where("email", "==", email))
        );
        if (!emailUserQuery.empty) {
          alert("Email already exists in userAccount");
          return; // Stop execution if email exists
        }

        // Check for duplicate username in doctorAccount
        const usernameDoctorQuery = await getDocs(
          query(
            collection(db, "doctorAccount"),
            where("username", "==", username)
          )
        );
        if (!usernameDoctorQuery.empty) {
          alert("Username already exists in doctorAccount");
          return; // Stop execution if username exists
        }

        // Check for duplicate email in doctorAccount
        const emailDoctorQuery = await getDocs(
          query(collection(db, "doctorAccount"), where("email", "==", email))
        );
        if (!emailDoctorQuery.empty) {
          alert("Email already exists in doctorAccount");
          return; // Stop execution if email exists
        }

        // ilagay sa database userAccount
        const userDocRef = await addDoc(collection(db, "userAccount"), {
          username: `${username}`,
          email: `${email}`,
          password: `${password}`,
        });

        // ilagay ang image sa firebase storage
        uploadBytes(ref(storage, email), fileimg).then((snapshot) => {
          alert("Uploaded a blob or file!");
        });

        // create email and password
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up
            const user = userCredential.user;
            alert("User signed up!");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Error: ${errorMessage}`);
          });
      });
  }
};

window.changeform("userlog");
