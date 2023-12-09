// Import necessary functions and modules
import { getUsername } from "./currentuser.js";
import {
  doc,
  collection,
  getFirestore,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";

// Firebase configuration
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
const db = getFirestore(app);
const sentInfoElement = document.getElementById("inboxinfo");

// Function to delete a message
async function deleteMessage(messageId) {
  try {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);

    // Refresh the UI or perform any necessary updates
    displayInboxMessages(); // Retrieve and display the updated messages
  } catch (error) {
    console.error("Error deleting message:", error);
  }
}

// Function to display inbox messages
function displayInboxMessages() {
  // Clear the existing content
  sentInfoElement.innerHTML = "";

  // Get messages from Firestore
  getDocs(collection(db, "messages"))
    .then((querySnapshot) => {
      const messagesArray = querySnapshot.docs.map((doc) => ({
        messageId: doc.id,
        ...doc.data(),
      }));
      messagesArray.sort((a, b) => a.timestamp - b.timestamp);

      let hasMessages = false;

      // Iterate through messages and display in inbox
      messagesArray.forEach((data) => {
        const messageUsername = data.username;
        const recipient = data.recipient;
        const message = data.message;
        const messageId = data.messageId;

        if (usernameValue === recipient) {
          const inboxInfoHTML = `
          <div class="inbox-info">
              <div class="inbox-from" onclick="window.inboxview('${messageUsername}', '${message}')">
                <p>FROM: ${messageUsername}</p>
              </div>
              <div class="inbox-message" onclick="window.inboxview('${messageUsername}', '${message}')">
                <p>${message}</p>
              </div>
              <div class="inbox-delete" data-message-id="${messageId}">
                <i class="fa-regular fa-trash-can"></i>
              </div>
            </div>`;

          // Append the new HTML to the existing content
          sentInfoElement.insertAdjacentHTML("beforeend", inboxInfoHTML);

          hasMessages = true;
        }
      });

      // Display a message if there are no messages
      if (!hasMessages) {
        sentInfoElement.innerHTML = `<h2 class="nomessage">There's no message</h2>`;
      }
    })
    .catch((error) => {
      console.error("Error retrieving messages:", error);
    });
}

// Use the getUsername function to get the username value
const usernameValue = getUsername();

// Display sent messages
displayInboxMessages();

// Event delegation for delete buttons
sentInfoElement.addEventListener("click", (event) => {
  const target = event.target;
  const deleteButton = target.closest(".inbox-delete");

  if (deleteButton) {
    const messageId = deleteButton.getAttribute("data-message-id");
    if (messageId) {
      deleteMessage(messageId);
    }
  }
});

window.inboxview = function (username, message) {
  document.getElementById(
    "containerbodyview"
  ).innerHTML = `<div class="consult-container">
    <div class="consult-header">
      <button class="closebutton" onclick="window.closeconsults()">X</button>
    </div>
    <div class="input-consult-container">
      <div class="input-doctor">
        <label>FROM:</label>
        <input id="docname" disabled>
      </div>
    </div>
    <div class="text-area-container" id="message">
      <textarea placeholder="Write your message here..." id="messageContents" readonly></textarea>
    </div>
  </div>`;

  // Set the value of the docname input element
  document.getElementById("docname").value = `${username}`;
  // Set the value of the message textarea element
  document.getElementById("messageContents").value = `${message}`;

  // Display the containerbody
  document.getElementById("containerbodyview").style.display = "flex";
};
window.closeconsults = function () {
  document.getElementById("containerbodyview").style.display = "none";
};
