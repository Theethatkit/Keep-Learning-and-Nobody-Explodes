document.addEventListener("DOMContentLoaded", function () {

    /* ================= Elements ================= */

    const profileUsername =
        document.getElementById("profileUsername");

    const profileEmail =
        document.getElementById("profileEmail");

    const avatarLetter =
        document.getElementById("avatarLetter");

    const completedNumber =
        document.getElementById("completedNumber");

    const totalNumber =
        document.getElementById("totalNumber");

    const progressFill =
        document.getElementById("progressFill");

    const progressPercentage =
        document.getElementById("progressPercentage");

    const logoutButton =
        document.getElementById("logoutButton");

    const lessonCards =
        document.querySelectorAll(".lesson-card");


    /* ================= Check Login ================= */

    const user = getCurrentUser();

    if (!user) {
        alert("Please log in before accessing your profile.");
        window.location.href = "login.html";
        return;
    }


    /* ================= Profile Information ================= */

    let username;
    let email;

    if (typeof user === "string") {
        username = user;
        email = "No email information";
    } else {
        username = user.username || "Student";
        email = user.email || "No email information";
    }

    profileUsername.textContent = username;
    profileEmail.textContent = email;

    avatarLetter.textContent =
        username.charAt(0).toUpperCase();


    /* ================= Lesson Progress ================= */

    const completedLessons = getCompletedLessons();

    let completedCount = 0;

    lessonCards.forEach(function (card) {
        const lessonName = card.dataset.lesson;

        const status =
            card.querySelector(".lesson-status");

        if (completedLessons.includes(lessonName)) {
            card.classList.add("completed");
            status.textContent = "Completed";
            completedCount++;
        } else {
            card.classList.remove("completed");
            status.textContent = "Not completed";
        }
    });

    const totalLessons = lessonCards.length;

    const percentage =
        totalLessons === 0
            ? 0
            : Math.round(
                (completedCount / totalLessons) * 100
            );

    completedNumber.textContent = completedCount;
    totalNumber.textContent = totalLessons;

    progressFill.style.width = percentage + "%";

    progressPercentage.textContent =
        percentage + "% completed";


    /* ================= Logout ================= */

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "../index.html";
    });

});