// get the current username of doctor
import { getUsername } from "./doccurrent.js";

//firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-storage.js";

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

const sidenavlinks = document.querySelectorAll(".navlinks");

console.log(sidenavlinks);
sidenavlinks.forEach((navlinkact) => {
  navlinkact.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    navlinkact.classList.add("active");
  });
});

// USER DASHBOARD CONTENT
window.content = function (value) {
  document.getElementById("content-body").style.display = "flex";
  //consult
  if (value == 0) {
    document.getElementById(
      "content-body"
    ).innerHTML = `<div class="consult-container">
    <div class="consult-header">

    </div>
   <div class="input-consult-container">

    <div class="input-doctor">
        <label>TO:</label>
        <input type="text" style="background-color: white;" placeholder="Username" id="recipient">
    </div>

   </div>
   <div class="text-area-container">
    <textarea placeholder="Write your message here..." id="message"></textarea>
    <div class="send" id="sendmessage">
        <i class="fa-solid fa-right-long"></i>
    </div>
   </div>
</div>`;

    document
      .getElementById("sendmessage")
      .addEventListener("click", async function () {
        let username = usernameValue;
        let recipient = document
          .getElementById("recipient")
          .value.toUpperCase();
        let message = document.getElementById("message").value;

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
      });
    //video
  } else if (value == 1) {
    document.getElementById("content-body").innerHTML = `
    <div class="videomeet-container">
  <form class="form-meet" id="join-form">
    <h2>VIDEO MEET</h2>
    <input
      class="input-id"
      placeholder="ENTER CODE ID"
      type="text"
      name="invite_link"
      required
    />
    <input class="button-join" type="submit" value="Join Room" />
  </form>
</div>`;

    let form = document.getElementById("join-form");
    let user = "doctor";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let inviteCode = e.target.invite_link.value;
      window.location = `video.html?room=${inviteCode}&user=${user}`;
    });

    //Inbox
  } else if (value == 2) {
    document.getElementById("content-body").innerHTML = `
    <div class="inbox-container">
            <div class="inbox-header">
        
            </div>

            <div class="inbox-info-container" id="inboxinfo">
                <!--Inbox infos-->
                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: USERNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                 <!--End Inbox infos-->
            </div>
        </div>`;

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
        "content-body"
      ).innerHTML = `<div class="consult-container">
      <div class="consult-header">
      <button class="closebutton" onclick="window.closeconsults()">X</button>
      </div>
     <div class="input-consult-container">
  
      <div class="input-doctor">
          <label>FROM:</label>
          <input type="text" style="background-color: white;" placeholder="Username" id="recipient" disabled>
      </div>
  
     </div>
     <div class="text-area-container" >
      <textarea placeholder="Write your message here..." id="message" readonly></textarea>
     </div>
  </div>`;

      // Set the value of the docname input element
      document.getElementById("recipient").value = `${username}`;
      // Set the value of the message textarea element
      document.getElementById("message").value = `${message}`;

      // Display the containerbody
      document.getElementById("content-body").style.display = "flex";
    };
    window.closeconsults = function () {
      document.getElementById("content-body").style.display = "none";
      window.content(2);
    };
  } else {
    document.getElementById("content-body").innerHTML = `
    <div class="inbox-container">
            <div class="inbox-header">
        
            </div>

            <div class="inbox-info-container" id="sentinfo">
                <!--Inbox infos-->
                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: USERNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                 <!--End Inbox infos-->
            </div>
        </div>`;
    const sentInfoElement = document.getElementById("sentinfo");

    // Function to delete a message
    async function deleteMessage(messageId) {
      try {
        const messageRef = doc(db, "sent", messageId);
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
      getDocs(collection(db, "sent"))
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

            if (usernameValue === messageUsername) {
              const inboxInfoHTML = `
                      <div class="inbox-info">
                          <div class="inbox-from" onclick="window.sentview('${recipient}', '${message}')">
                            <p>TO: ${recipient}</p>
                          </div>
                          <div class="inbox-message" onclick="window.sentview('${recipient}', '${message}')">
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

    window.sentview = function (username, message) {
      document.getElementById(
        "content-body"
      ).innerHTML = `<div class="consult-container">
          <div class="consult-header">
          <button class="closebutton" onclick="window.closeconsultssent()">X</button>
          </div>
         <div class="input-consult-container">
      
          <div class="input-doctor">
              <label>TO:</label>
              <input type="text" style="background-color: white;" placeholder="Username" id="recipient" disabled>
          </div>
      
         </div>
         <div class="text-area-container" >
          <textarea placeholder="Write your message here..." id="message" readonly></textarea>
         </div>
      </div>`;

      // Set the value of the docname input element
      document.getElementById("recipient").value = `${username}`;
      // Set the value of the message textarea element
      document.getElementById("message").value = `${message}`;

      // Display the containerbody
      document.getElementById("content-body").style.display = "flex";
    };
    window.closeconsultssent = function () {
      document.getElementById("content-body").style.display = "none";
      window.content(3);
    };
  }
};
window.content(0);
const usernameValue = await getUsername(); // Assuming getUsername is asynchronous
