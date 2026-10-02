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

    const achievementsUnlockedNumber =
        document.getElementById("achievementsUnlockedNumber");

    const achievementsTotalNumber =
        document.getElementById("achievementsTotalNumber");

    const achievementBadgeRow =
        document.getElementById("achievementBadgeRow");


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


    /* ================= Achievements ================= */
    // Reads the same localStorage entry defusal.js writes to - see
    // getAchievementsStorageKey() there. Reproduced here (rather than
    // imported/shared) since this is a separate page; both copies
    // must derive the exact same key string, or achievements earned
    // on the bomb-defusal page won't show up here.
    function getAchievementsStorageKey() {
        const loggedInUser = JSON.parse(
            localStorage.getItem("loggedInUser") || "null"
        );

        return loggedInUser
            ? "bombDefusalAchievements_" + loggedInUser.username
            : "bombDefusalAchievements_guest";
    }

    // ACHIEVEMENT_REGISTRY comes from data/achievements-data.js,
    // loaded in profile.html just before this script - guarded in
    // case that script tag is ever missing, so a badly-ordered
    // <script> doesn't throw and break the rest of the profile page.
    if (typeof ACHIEVEMENT_REGISTRY !== "undefined") {
        const achievementIds = Object.keys(ACHIEVEMENT_REGISTRY);

        let unlockedIds = [];
        try {
            const raw = localStorage.getItem(getAchievementsStorageKey());
            const parsed = raw ? JSON.parse(raw) : null;
            unlockedIds = (parsed && parsed.unlockedAchievementIds) || [];
        } catch (e) {
            unlockedIds = [];
        }

        achievementsUnlockedNumber.textContent = achievementIds.filter(
            function (id) {
                return unlockedIds.indexOf(id) !== -1;
            }
        ).length;

        achievementsTotalNumber.textContent = achievementIds.length;

        achievementBadgeRow.innerHTML = "";

        achievementIds.forEach(function (id) {
            const achievement = ACHIEVEMENT_REGISTRY[id];
            const isUnlocked = unlockedIds.indexOf(id) !== -1;

            // A simple lettered badge (first letter of the
            // achievement's label) - locked/unlocked is what actually
            // carries the meaning visually; the letter just gives
            // each badge a distinct look at a glance. The full name
            // and lock state are in the title tooltip.
            const badge = document.createElement("span");
            badge.className = "achievement-badge" + (isUnlocked ? " unlocked" : "");
            badge.title = achievement.label + (isUnlocked ? " \u2014 Unlocked" : " \u2014 Locked");
            badge.textContent = achievement.label.charAt(0).toUpperCase();

            achievementBadgeRow.appendChild(badge);
        });
    }


    /* ================= Logout ================= */

    logoutButton.addEventListener("click", function () {
        localStorage.removeItem("loggedInUser");
        window.location.href = "../index.html";
    });

});