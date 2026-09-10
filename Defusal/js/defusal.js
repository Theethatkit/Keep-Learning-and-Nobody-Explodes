// ===================================================================
// Bomb Defusal - Module 1 (Multiple Choice)
//
// Question data comes from data/module1-questions.js (loaded first,
// as a plain <script> tag), so this file's job is just the
// timer/strikes/scoring shell and the 4-shape-button multiple choice
// interaction.
// ===================================================================

// ------------------- Screens -------------------
const overviewScreen = document.getElementById("overviewScreen");
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

// ------------------- Overview screen elements -------------------
const module1Slot = document.getElementById("module1Slot");
const backToOverviewFromGame = document.getElementById("backToOverviewFromGame");
const overviewTimerDisplay = document.getElementById("overviewTimerDisplay");
const overviewDifficultyLabel = document.getElementById("overviewDifficultyLabel");

// ------------------- Setup screen elements -------------------
const difficultySelect = document.getElementById("difficultySelect");
const difficultyPreview = document.getElementById("difficultyPreview");
const practiceModeToggle = document.getElementById("practiceModeToggle");
const startButton = document.getElementById("startButton");

// ------------------- Game screen elements -------------------
const bombShell = document.getElementById("bombShell");
const timerDisplay = document.getElementById("timerDisplay");
const strikesDisplay = document.getElementById("strikesDisplay");
const progressDisplay = document.getElementById("progressDisplay");
const shapeButtons = document.querySelectorAll(".shape-button");
const questionTopic = document.getElementById("questionTopic");
const questionPrompt = document.getElementById("questionPrompt");
const optionList = document.getElementById("optionList");

// ------------------- Result screen elements -------------------
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultTime = document.getElementById("resultTime");
const resultStrikes = document.getElementById("resultStrikes");
const resultScore = document.getElementById("resultScore");
const retryButton = document.getElementById("retryButton");
const changeDifficultyButton = document.getElementById("changeDifficultyButton");

// ------------------- Question bank -------------------
// Provided by data/module1-questions.js, which is loaded via a plain
// <script> tag before this file - so this works straight from
// file://, no local server needed just to read the question data.
let questionBank = MODULE1_QUESTION_BANK;

// ------------------- Run state -------------------
let runState = null;

// shape order fixed to the sketch layout: circle (a), triangle (b),
// square (c), diamond (d)
const SHAPE_BY_OPTION_ID = {
    a: "circle",
    b: "triangle",
    c: "square",
    d: "diamond"
};

// ------------------- Set up the difficulty dropdown -------------------
populateDifficultyOptions();

// fill the difficulty <select> from the JSON config
function populateDifficultyOptions() {
    const difficultyIds = Object.keys(questionBank.difficulties);

    difficultyIds.forEach(function (difficultyId) {
        const difficulty = questionBank.difficulties[difficultyId];

        const option = document.createElement("option");
        option.value = difficultyId;
        option.textContent = difficulty.label;

        difficultySelect.appendChild(option);
    });

    renderDifficultyPreview();
}

// small "10:00 on the clock, 3 mistakes allowed" line under the select,
// so it's clear the timer length depends on the difficulty chosen
function renderDifficultyPreview() {
    const difficulty = questionBank.difficulties[difficultySelect.value];

    if (!difficulty) {
        return;
    }

    const minutes = Math.floor(difficulty.startingTimeSeconds / 60);
    const seconds = difficulty.startingTimeSeconds % 60;
    const paddedSeconds = seconds < 10 ? "0" + seconds : String(seconds);

    difficultyPreview.textContent =
        minutes + ":" + paddedSeconds + " on the clock \u00B7 " +
        difficulty.mistakesAllowed + " mistakes allowed \u00B7 " +
        difficulty.questionCount + " questions";
}

difficultySelect.addEventListener("change", renderDifficultyPreview);

// ------------------- Starting a run -------------------
startButton.addEventListener("click", function () {
    const difficultyId = difficultySelect.value;
    const isPracticeMode = practiceModeToggle.checked;

    startRun(difficultyId, isPracticeMode);
});

function startRun(difficultyId, isPracticeMode) {
    const difficulty = questionBank.difficulties[difficultyId];

    const questionPool = questionBank.questions.filter(function (question) {
        return question.difficulty === difficultyId;
    });

    const selectedQuestions = pickRandomQuestions(
        questionPool,
        difficulty.questionCount
    );

    runState = {
        difficultyId: difficultyId,
        difficulty: difficulty,
        isPracticeMode: isPracticeMode,
        questions: selectedQuestions,
        currentIndex: 0,
        correctCount: 0,
        strikesUsed: 0,
        timeRemaining: difficulty.startingTimeSeconds,
        timerId: null,
        isAnswerLocked: false
    };

    // Arm the bomb and show the whole thing, zoomed out. The clock
    // stays paused until the player actually zooms into a module.
    overviewDifficultyLabel.textContent = difficulty.label;

    renderStrikes();
    renderProgress();
    renderTimer();
    renderQuestion();

    showScreen(overviewScreen);
}

// ------------------- Timer start/stop (zoom in/out) -------------------

// Only counts down while the player is zoomed into a module; paused
// on the overview screen, and never runs at all in practice mode.
function resumeTimerIfNeeded() {
    if (runState.isPracticeMode || runState.timerId) {
        return;
    }

    runState.timerId = setInterval(tickTimer, 1000);
    renderTimer();
}

function pauseTimer() {
    if (runState && runState.timerId) {
        clearInterval(runState.timerId);
        runState.timerId = null;
        renderTimer();
    }
}

// pick N random, non-repeating questions from a pool
function pickRandomQuestions(pool, count) {
    const shuffled = pool.slice().sort(function () {
        return Math.random() - 0.5;
    });

    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ------------------- Timer -------------------
function tickTimer() {
    runState.timeRemaining -= 1;

    renderTimer();

    if (runState.timeRemaining <= 0) {
        runState.timeRemaining = 0;
        endRun(false); // ran out of time
    }
}

function renderTimer() {
    const minutes = Math.floor(runState.timeRemaining / 60);
    const seconds = runState.timeRemaining % 60;
    const paddedSeconds = seconds < 10 ? "0" + seconds : String(seconds);
    const text = minutes + ":" + paddedSeconds;

    const isRunning = !!runState.timerId;
    const isWarning = runState.timeRemaining <= 30 && !runState.isPracticeMode;

    // Both LCDs (the small one in-game, the big one on the overview
    // screen) always show the same value, so switching screens never
    // shows a stale time.
    [timerDisplay, overviewTimerDisplay].forEach(function (el) {
        el.textContent = text;
        el.classList.toggle("timer-running", isRunning);
        el.classList.toggle("timer-warning", isWarning);
    });
}

// ------------------- Strikes -------------------
function renderStrikes() {
    strikesDisplay.innerHTML = "";

    for (let i = 0; i < runState.difficulty.mistakesAllowed; i++) {
        const light = document.createElement("span");
        light.classList.add("strike-light");

        if (i < runState.strikesUsed) {
            light.classList.add("used");
        }

        strikesDisplay.appendChild(light);
    }
}

// ------------------- Progress -------------------
function renderProgress() {
    progressDisplay.textContent =
        runState.correctCount + " / " + runState.questions.length;
}

// ------------------- Rendering a question -------------------
function renderQuestion() {
    const question = runState.questions[runState.currentIndex];

    questionTopic.textContent = question.topic;
    questionPrompt.textContent = question.prompt;

    optionList.innerHTML = "";

    question.options.forEach(function (option) {
        const row = document.createElement("li");
        row.classList.add("option-row");

        // icon well, sized/positioned the same for every shape
        const iconWell = document.createElement("span");
        iconWell.classList.add(
            "option-shape-icon",
            "option-shape-" + option.shape
        );

        // the actual shape drawn inside the well (same technique as
        // the bomb face buttons, so it visually matches)
        const shape = document.createElement("span");
        shape.classList.add("shape");
        iconWell.appendChild(shape);

        // bold letter badge, so text and shape are both keyed to
        // the same "A/B/C/D" the bomb buttons use
        const letter = document.createElement("span");
        letter.classList.add("option-row-letter");
        letter.textContent = option.id.toUpperCase();

        const label = document.createElement("span");
        label.textContent = option.text;

        row.appendChild(letter);
        row.appendChild(iconWell);
        row.appendChild(label);
        optionList.appendChild(row);
    });

    // reset the shape buttons for the new question
    shapeButtons.forEach(function (button) {
        button.disabled = false;
        button.classList.remove("correct", "wrong");
    });

    runState.isAnswerLocked = false;
}

// ------------------- Answering -------------------
shapeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!runState || runState.isAnswerLocked) {
            return;
        }

        submitAnswer(button.dataset.optionId, button);
    });
});

function submitAnswer(selectedOptionId, buttonElement) {
    runState.isAnswerLocked = true;

    const question = runState.questions[runState.currentIndex];
    const isCorrect = selectedOptionId === question.correctOptionId;

    shapeButtons.forEach(function (button) {
        button.disabled = true;
    });

    if (isCorrect) {
        buttonElement.classList.add("correct");
        runState.correctCount += 1;
        renderProgress();
    } else {
        buttonElement.classList.add("wrong");
        registerStrike();
    }

    // small pause so the player can see the correct/wrong flash,
    // then move on
    setTimeout(function () {
        advanceAfterAnswer();
    }, 700);
}

function registerStrike() {
    bombShell.classList.remove("shake");
    // restart the animation
    void bombShell.offsetWidth;
    bombShell.classList.add("shake");

    if (runState.isPracticeMode) {
        return;
    }

    runState.strikesUsed += 1;
    renderStrikes();
}

function advanceAfterAnswer() {
    const isOutOfStrikes =
        !runState.isPracticeMode &&
        runState.strikesUsed >= runState.difficulty.mistakesAllowed;

    if (isOutOfStrikes) {
        endRun(false); // exploded
        return;
    }

    const isLastQuestion =
        runState.currentIndex >= runState.questions.length - 1;

    if (isLastQuestion) {
        const isDefused = runState.correctCount === runState.questions.length;
        endRun(isDefused);
        return;
    }

    runState.currentIndex += 1;
    renderQuestion();
}

// ------------------- Ending a run -------------------
function endRun(isDefused) {
    if (runState.timerId) {
        clearInterval(runState.timerId);
        runState.timerId = null;
    }

    const score = calculateScore(isDefused);

    renderResultScreen(isDefused, score);
    saveRunToHistory(isDefused, score);

    showScreen(resultScreen);
}

function calculateScore(isDefused) {
    const difficulty = runState.difficulty;

    const accuracyMultiplier =
        runState.correctCount / runState.questions.length;

    const timeBonus = runState.isPracticeMode
        ? 0
        : (runState.timeRemaining / difficulty.startingTimeSeconds) *
          difficulty.timeBonusCap;

    const rawScore =
        difficulty.baseScore * accuracyMultiplier + timeBonus;

    return Math.round(rawScore);
}

function renderResultScreen(isDefused, score) {
    resultTitle.textContent = isDefused ? "Defused!" : "Boom.";
    resultTitle.classList.toggle("defused", isDefused);
    resultTitle.classList.toggle("exploded", !isDefused);

    resultSubtitle.textContent = isDefused
        ? "Nice work, agent."
        : "The bomb got the better of you this time.";

    resultAccuracy.textContent =
        runState.correctCount + " / " + runState.questions.length;

    const minutes = Math.floor(runState.timeRemaining / 60);
    const seconds = runState.timeRemaining % 60;
    const paddedSeconds = seconds < 10 ? "0" + seconds : String(seconds);
    resultTime.textContent = runState.isPracticeMode
        ? "N/A (practice)"
        : minutes + ":" + paddedSeconds;

    resultStrikes.textContent = runState.isPracticeMode
        ? "N/A (practice)"
        : runState.strikesUsed + " / " + runState.difficulty.mistakesAllowed;

    resultScore.textContent = runState.isPracticeMode ? "N/A (practice)" : score;
}

// ------------------- Saving progress -------------------
function saveRunToHistory(isDefused, score) {
    // practice runs are not saved, per the "practice mode" idea of
    // going at your own pace without pressure
    if (runState.isPracticeMode) {
        return;
    }

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    const historyKey = loggedInUser
        ? "bombDefusalHistory_" + loggedInUser.username
        : "bombDefusalHistory_guest";

    const history = JSON.parse(localStorage.getItem(historyKey)) || [];

    history.push({
        module: "module1-multipleChoice",
        difficulty: runState.difficultyId,
        score: score,
        correctAnswers: runState.correctCount,
        totalQuestions: runState.questions.length,
        timeRemainingSeconds: runState.timeRemaining,
        strikesUsed: runState.strikesUsed,
        passed: isDefused,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem(historyKey, JSON.stringify(history));
}

// ------------------- Screen switching -------------------
function showScreen(screenToShow) {
    [overviewScreen, setupScreen, gameScreen, resultScreen].forEach(function (screen) {
        screen.classList.add("hidden");
    });

    screenToShow.classList.remove("hidden");
}

retryButton.addEventListener("click", function () {
    // Re-arms the bomb at the same difficulty and drops back to the
    // overview screen, paused, same as a fresh "Arm Bomb" would.
    startRun(runState.difficultyId, runState.isPracticeMode);
});

changeDifficultyButton.addEventListener("click", function () {
    showScreen(setupScreen);
});

// ------------------- Bomb overview navigation -------------------

// Zoom into Module 1 (the only module that's wired up so far) -
// this is what actually starts the clock ticking
module1Slot.addEventListener("click", function () {
    if (!runState) {
        return;
    }

    showScreen(gameScreen);
    resumeTimerIfNeeded();
});

// "Back to Bomb Overview" from mid-run - pause the clock while
// zoomed out, per the "Keep Talking" rule that only zoomed-in time
// counts against you
backToOverviewFromGame.addEventListener("click", function () {
    pauseTimer();
    showScreen(overviewScreen);
});
