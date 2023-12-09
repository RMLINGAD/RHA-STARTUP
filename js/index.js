const login_signup = document.querySelector(".login_signup");
const registerLink = document.querySelector(".register-link");
const loginLink = document.querySelector(".login-link");
const navelement = document.querySelector("nav ul");
const iconelement = document.querySelector(".icon");
function togglenav() {
  navelement.classList.toggle("show");
  iconelement.classList.toggle("active");
}

// registerLink.onclick = () => {
//   login_signup.classList.add("active");
// };
// loginLink.onclick = () => {
//   login_signup.classList.remove("active");
// };

//active class navbar

const navlinks = document.querySelectorAll(".navlink");

navlinks.forEach((navlinkact) => {
  navlinkact.addEventListener("click", () => {
    document.querySelector(".active")?.classList.remove("active");
    navlinkact.classList.add("active");
  });
});
console.log(navlinks);
