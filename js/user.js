const sidenavlinks = document.querySelectorAll(".navlinks");

console.log(sidenavlinks);
sidenavlinks.forEach((navlinkact) => {
  navlinkact.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    navlinkact.classList.add("active");
  });
});

// USER DASHBOARD CONTENT
content(0);
function content(value) {
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
        <select>
        <option value="doctor">Dr.Nicole Abbatiello</option>
        <option value="nurse">Dr.Nicholas Bankhead</option>
        <option value="patient">Dr.Russell Ballard</option>
        <option value="patient">Dr.Maurice Barger</option>
        </select>
    </div>

    <div class="input-profession">
        <label>PROFESSION:</label>
        <select>
            <option value="pediatrician">PEDIATRICIAN</option>
            <option value="neurologist">NEUROLOGIST</option>
            <option value="ob/gyn">OB/GYN</option>
            <option value="pulmonologist">PULMONOLOGIST</option>
        </select>
    </div>

    <div class="input-schedule">
        <label>SET SCHEDULE:</label>
        <input type="date" style="background-color: white;">
    </div>
   </div>
   <div class="text-area-container">
    <textarea placeholder="Write your message here..."></textarea>
    <div class="send">
        <i class="fa-solid fa-right-long"></i>
    </div>
   </div>
</div>`;

    //video
  } else if (value == 1) {
    document.getElementById("content-body").innerHTML = `
    <div class="form-box">
            <form>
                <div class="input-group">
                    <div class="input-field">
                        <input type="username" placeholder="USERNAME">
                    </div>
                        <div class="input-field">
                            <input type="meeting-id" placeholder="MEETING - ID">
                        </div>
                        <div class="join-container">
            <input type="submit" value="JOIN" class="join-btn">
        </div> 
                </div>
            </form>
        </div>`;

    //Inbox
  } else if (value == 2) {
    document.getElementById("content-body").innerHTML = `
    <div class="inbox-container">
            <div class="inbox-header">
        
            </div>

            <div class="inbox-info-container">
                <!--Inbox infos-->
                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>FROM: Dr. F. LASTNAME</p>
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
    //sent message
  } else {
    document.getElementById("content-body").innerHTML = `
    <div class="inbox-container">
            <div class="inbox-header">
        
            </div>

            <div class="inbox-info-container">
                <!--Inbox infos-->
                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: Dr. F. LASTNAME</p>
                    </div>
                    <div class="inbox-message">
                        <p> lorem ipsum dolor sit amet, consecte turfdsfsdfsffsfsdfsd adcisdfsffsfsdfsdsfng elit. Proinelitelidfdfftelitelit </p>
                    </div>
                    <div class="inbox-delete">
                        <i class="fa-regular fa-trash-can"></i>
                    </div>
                </div>

                <div class="inbox-info">
                    <div class="inbox-from">
                        <p>TO: Dr. F. LASTNAME</p>
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
  }
}
