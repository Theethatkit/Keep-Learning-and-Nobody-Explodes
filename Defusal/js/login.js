const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // receive input values from the form
    const email = document
        .getElementById("email")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("password")
        .value;

    // checl if any field is empty
    if (email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    // pull the list of existing users, or use an empty array if none exist
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // find the user with the matching email and password
    const matchedUser = users.find(function (user) {
        return user.email === email && user.password === password;
    });

    // if no matching user is found, alert the user and return
    if (!matchedUser) {
        alert("Incorrect Gmail or password.");
        return;
    }

    // remove the password from the matched user object before storing it in localStorage
    const loggedInUser = {
        username: matchedUser.username,
        email: matchedUser.email
    };

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(loggedInUser)
    );

    alert("Login successful!");

    // send the user to the index page
    window.location.href = "../index.html";
});