const profileUsername = document.getElementById("profileUsername");
const profileEmail = document.getElementById("profileEmail");
const avatarLetter = document.getElementById("avatarLetter");

const completedNumber = document.getElementById("completedNumber");
const totalNumber = document.getElementById("totalNumber");
const progressFill = document.getElementById("progressFill");
const progressPercentage = document.getElementById("progressPercentage");

const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
});


const lessonCards = document.querySelectorAll(".lesson-card");

function getLoggedInUser() {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
        window.location.href = "login.html";
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        console.error("Cannot read user information:", error);
        window.location.href = "login.html";
        return null;
    }
}

function getCompletedLessons() {
    const savedLessons = localStorage.getItem("completedLessons");

    if (!savedLessons) {
        return [];
    }

    try {
        return JSON.parse(savedLessons);
    } catch (error) {
        console.error("Cannot read lesson progress:", error);
        return [];
    }
}

function displayProfile(user) {
    const username = user.username || "Student";
    const email = user.email || "No email information";

    profileUsername.textContent = username;
    profileEmail.textContent = email;
    avatarLetter.textContent = username.charAt(0).toUpperCase();
}

function displayProgress() {
    const completedLessons = getCompletedLessons();
    const totalLessons = lessonCards.length;

    let completedCount = 0;

    lessonCards.forEach(function (card) {
        const lessonName = card.dataset.lesson;
        const status = card.querySelector(".lesson-status");

        if (completedLessons.includes(lessonName)) {
            card.classList.add("completed");
            status.textContent = "Completed";
            completedCount++;
        } else {
            card.classList.remove("completed");
            status.textContent = "Not completed";
        }
    });

    const percentage =
        totalLessons === 0
            ? 0
            : Math.round((completedCount / totalLessons) * 100);

    completedNumber.textContent = completedCount;
    totalNumber.textContent = totalLessons;
    progressFill.style.width = percentage + "%";
    progressPercentage.textContent = percentage + "% completed";
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

const currentUser = getLoggedInUser();

if (currentUser) {
    displayProfile(currentUser);
    displayProgress();
}

logoutButton.addEventListener("click", logout);