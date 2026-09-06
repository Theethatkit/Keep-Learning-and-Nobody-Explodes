const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    //receive input values from the form
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    // cheack if any field is empty
    if (username === "" || email === "" || password === "") {
        alert("Please fill in all fields.");
        return;
    }

    // check if the email is a valid Gmail address
    if (!email.endsWith("@gmail.com")) {
        alert("Please enter a valid Gmail address.");
        return;
    }

    // check if the password is at least 6 characters long
    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    // receive the list of existing users, or use an empty array if none exist
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // check if the email is already registered
    const emailAlreadyExists = users.some(function (user) {
        return user.email === email;
    });

    if (emailAlreadyExists) {
        alert("This Gmail address is already registered.");
        return;
    }

    // create a new user object
    const newUser = {
        username: username,
        email: email,
        password: password
    };

    // add the new user to the list and save it back to localStorage
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration successful");

    // send the user to the Login page
    window.location.href = "login.html";
});