const accountButton = document.getElementById("accountButton");
const loggedInUser = localStorage.getItem("loggedInUser");

if (loggedInUser) {
    accountButton.textContent = "Profile";
    accountButton.href = "html/profile.html";
} else {
    accountButton.textContent = "Login";
    accountButton.href = "html/login.html";
}