import { getUsername } from "./currentuser.js";

// Use the getUsername function to get the username value
const usernameValue = getUsername();

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {
  getFirestore,
  collection,
  getDocs,
  serverTimestamp,
  addDoc,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const doctorAccountCollection = collection(db, "doctorAccount");

// Get all documents in the collection
const querySnapshot = await getDocs(doctorAccountCollection);

const cardElement = document.getElementById("cardcontainer");

window.choices = function (specialist) {
  cardElement.innerHTML = "";
  const schoice = specialist;
  console.log(schoice);
  const neurologyDoctors = querySnapshot.docs.filter(
    (doc) => doc.data().specialist === `${schoice}`
  );

  // If there are doctors for the selected specialist, display them
  if (neurologyDoctors.length > 0) {
    neurologyDoctors.forEach(async (doc) => {
      const doctorData = doc.data();

      try {
        const url = await getDownloadURL(ref(storage, doctorData.email));

        // Create HTML content for each doctor and append it to the card element
        cardElement.innerHTML += `
          <div class="doctor" onclick="window.alertdoctorname('${doctorData.username}')">
              <div class="doc-image">
                  <img class="doc-prof" src="${url}">
              </div>
              <div class="doc-info">
                  <p>Dr. ${doctorData.username}</p>
                  <p>${doctorData.specialist}</p>
              </div>
          </div>
        `;
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    });
  } else {
    // If there are no doctors for the selected specialist, display a message
    cardElement.innerHTML = `
      <div class="no-doctors-message">
        <h2 class="displaymessage">There is no available "${schoice}" right now</h2>
      </div>
    `;
  }
};

// Call the window.choices function with a specific specialist (e.g., "NEUROLOGIST")
window.choices("NEUROLOGIST");
window.alertdoctorname = function (doctorName) {
  // Set the content of containerbody and define the docname input element
  document.getElementById(
    "containerbody"
  ).innerHTML = `<div class="consult-container">
      <div class="consult-header">
          <button class="closebutton" onclick="window.closeconsult()">X</button>
      </div>
      <div class="input-consult-container">
          <div class="input-doctor">
              <label>TO:</label>
              <input id="docname" disabled>
          </div>
      </div>
      <div class="text-area-container" id="message">
          <textarea placeholder="Write your message here..." id="messageContent"></textarea>
          <div class="send" id="sendmessage">
              <i class="fa-solid fa-right-long"></i>
          </div>
      </div>
  </div>`;

  // Set the value of the docname input element
  document.getElementById("docname").value = `${doctorName}`;

  // Display the containerbody
  document.getElementById("containerbody").style.display = "flex";

  // Add click event listener to the "Send" button
  document
    .getElementById("sendmessage")
    .addEventListener("click", async function () {
      let username = usernameValue;
      let recipient = document.getElementById("docname").value;
      let message = document.getElementById("messageContent").value;

      // Add the message to Firebase
      const docRef = await addDoc(collection(db, "messages"), {
        username: username,
        recipient: recipient,
        message: message,
        timestamp: serverTimestamp(),
      });

      const docRef1 = await addDoc(collection(db, "sent"), {
        username: username,
        recipient: recipient,
        message: message,
        timestamp: serverTimestamp(),
      });

      // Optionally, you can close the container or perform other actions after sending
      // window.closeconsult(); // assuming you have this function
    });
};

window.closeconsult = function () {
  document.getElementById("containerbody").style.display = "none";
};
const icons = document.querySelectorAll(".material-symbols-outlined");

icons.forEach((iconact) => {
  iconact.addEventListener("click", () => {
    const currentlyActive = document.querySelector(
      ".material-symbols-outlined.actives"
    );
    if (currentlyActive) {
      currentlyActive.classList.remove("actives");
    }
    iconact.classList.add("actives");
  });
});
