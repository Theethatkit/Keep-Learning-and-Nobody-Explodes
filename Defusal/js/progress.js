function getCurrentUser() {
    const savedUser = localStorage.getItem("loggedInUser");

    if (!savedUser) {
        return null;
    }

    try {
        return JSON.parse(savedUser);
    } catch (error) {
        return savedUser;
    }
}

function getProgressKey() {
    const user = getCurrentUser();

    if (!user) {
        return null;
    }

    /*
        แยก Progress ของแต่ละบัญชี

        ถ้า loggedInUser เป็น object:
        ใช้ email หรือ username

        ถ้าเป็น string:
        ใช้ค่านั้นโดยตรง
    */

    const userId =
        typeof user === "string"
            ? user
            : user.email || user.username;

    return "completedLessons_" + userId;
}

function getCompletedLessons() {
    const progressKey = getProgressKey();

    if (!progressKey) {
        return [];
    }

    const savedProgress =
        localStorage.getItem(progressKey);

    if (!savedProgress) {
        return [];
    }

    try {
        return JSON.parse(savedProgress);
    } catch (error) {
        return [];
    }
}

function completeLesson(lessonName) {
    const progressKey = getProgressKey();

    if (!progressKey) {
        alert("Please log in before saving progress.");
        return false;
    }

    const completedLessons = getCompletedLessons();

    if (!completedLessons.includes(lessonName)) {
        completedLessons.push(lessonName);

        localStorage.setItem(
            progressKey,
            JSON.stringify(completedLessons)
        );
    }

    return true;
}

function isLessonCompleted(lessonName) {
    const completedLessons = getCompletedLessons();

    return completedLessons.includes(lessonName);
}