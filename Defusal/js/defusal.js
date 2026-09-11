// ===================================================================
// Bomb Defusal - shared shell + Module 1 (Multiple Choice)
//                                + Module 2 (Fill in the Blanks)
//                                + Module 4 (True or False)
//
// Question data comes from data/moduleX-questions.js (loaded first,
// as plain <script> tags), so this file's job is the timer/strikes/
// scoring shell, plus each module's own answer-checking UI.
//
// Only one module can be zoomed into at a time, so there is a single
// `runState` that gets rebuilt fresh every time a module cell on the
// overview screen is tapped. Adding a future module (connect-the-
// dots, choose-the-answer) means: give it a data file + its own
// screen in the HTML, then add one more entry to MODULE_REGISTRY
// below with the same shape as module1/module2/module4.
// ===================================================================

// ------------------- Screens -------------------
const overviewScreen = document.getElementById("overviewScreen");
const setupScreen = document.getElementById("setupScreen");
const resultScreen = document.getElementById("resultScreen");

// ------------------- Overview screen elements -------------------
const overviewTimerDisplay = document.getElementById("overviewTimerDisplay");
const overviewDifficultyLabel = document.getElementById("overviewDifficultyLabel");
const overviewModulesSolvedLabel = document.getElementById("overviewModulesSolvedLabel");

// ------------------- Setup screen elements -------------------
const difficultySelect = document.getElementById("difficultySelect");
const difficultyPreview = document.getElementById("difficultyPreview");
const practiceModeToggle = document.getElementById("practiceModeToggle");
const startButton = document.getElementById("startButton");

// ------------------- Module 1 (Multiple Choice) elements -------------------
const shapeButtons = document.querySelectorAll(".shape-button");
const questionTopic = document.getElementById("questionTopic");
const questionPrompt = document.getElementById("questionPrompt");
const optionList = document.getElementById("optionList");

// ------------------- Module 2 (Fill in the Blanks) elements -------------------
const keypadKeys = document.querySelectorAll(".keypad-key");
const module2QuestionTopic = document.getElementById("module2QuestionTopic");
const module2QuestionPrompt = document.getElementById("module2QuestionPrompt");
const module2AnswerDisplay = document.getElementById("module2AnswerDisplay");

// ------------------- Module 4 (True/False) elements -------------------
const truefalseButtons = document.querySelectorAll(".truefalse-button");
const module4QuestionTopic = document.getElementById("module4QuestionTopic");
const module4QuestionPrompt = document.getElementById("module4QuestionPrompt");

// ------------------- Result screen elements -------------------
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultTime = document.getElementById("resultTime");
const resultStrikes = document.getElementById("resultStrikes");
const resultScore = document.getElementById("resultScore");
const retryButton = document.getElementById("retryButton");
const changeDifficultyButton = document.getElementById("changeDifficultyButton");

// shape order fixed to the sketch layout: circle (a), triangle (b),
// square (c), diamond (d) - only used by Module 1's option list
const SHAPE_BY_OPTION_ID = {
    a: "circle",
    b: "triangle",
    c: "square",
    d: "diamond"
};

// ------------------- Module registry -------------------
// Every playable module plugs in here: its own screen/DOM elements,
// its own question bank, and the two functions that know how to draw
// a question and reset its answer buttons. Everything else (timer,
// strikes, progress, scoring, screen switching) is shared.
const MODULE_REGISTRY = {
    module1: {
        moduleName: "module1-multipleChoice",
        label: "Module 1: Multiple Choice",
        slot: document.getElementById("module1Slot"),
        screen: document.getElementById("gameScreen"),
        bombShell: document.getElementById("bombShell"),
        timerDisplay: document.getElementById("timerDisplay"),
        strikesDisplay: document.getElementById("strikesDisplay"),
        progressDisplay: document.getElementById("progressDisplay"),
        backButton: document.getElementById("backToOverviewFromGame"),
        questionBank: MODULE1_QUESTION_BANK,
        renderQuestion: renderMultipleChoiceQuestion,
        resetInputs: resetMultipleChoiceButtons
    },
    module2: {
        moduleName: "module2-fillInTheBlank",
        label: "Module 2: Fill in the Blanks",
        slot: document.getElementById("module2Slot"),
        screen: document.getElementById("module2GameScreen"),
        bombShell: document.getElementById("module2BombShell"),
        timerDisplay: document.getElementById("module2TimerDisplay"),
        strikesDisplay: document.getElementById("module2StrikesDisplay"),
        progressDisplay: document.getElementById("module2ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule2"),
        questionBank: MODULE2_QUESTION_BANK,
        renderQuestion: renderFillBlankQuestion,
        resetInputs: resetFillBlankInputs
    },
    module4: {
        moduleName: "module4-trueFalse",
        label: "Module 4: True or False",
        slot: document.getElementById("module4Slot"),
        screen: document.getElementById("module4GameScreen"),
        bombShell: document.getElementById("module4BombShell"),
        timerDisplay: document.getElementById("module4TimerDisplay"),
        strikesDisplay: document.getElementById("module4StrikesDisplay"),
        progressDisplay: document.getElementById("module4ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule4"),
        questionBank: MODULE4_QUESTION_BANK,
        renderQuestion: renderTrueFalseQuestion,
        resetInputs: resetTrueFalseButtons
    }
};

// ------------------- Run state -------------------
// Rebuilt every time a module cell is tapped - there is only ever one
// active run, since only one module screen can be showing at once.
let runState = null;

// The difficulty + practice-mode choice made on the setup screen.
// This is bomb-wide; each module's own question bank then supplies
// its own concrete numbers (time, mistakes, score) for that
// difficulty id once you actually zoom into that module.
let armedConfig = null;

// ------------------- Set up the difficulty dropdown -------------------
// Difficulty ids/labels are the same set across every module bank
// (easy/intermediate/hard/expert), just with different numbers behind
// them, so Module 1's bank is as good a source as any for the list.
populateDifficultyOptions();

function populateDifficultyOptions() {
    const difficultyIds = Object.keys(MODULE1_QUESTION_BANK.difficulties);

    difficultyIds.forEach(function (difficultyId) {
        const difficulty = MODULE1_QUESTION_BANK.difficulties[difficultyId];

        const option = document.createElement("option");
        option.value = difficultyId;
        option.textContent = difficulty.label;

        difficultySelect.appendChild(option);
    });

    renderDifficultyPreview();
}

// small "10:00 on the clock, 3 mistakes allowed" line under the select,
// so it's clear the timer length depends on the difficulty chosen
// (numbers shown here are Module 1's - the module you actually zoom
// into may use slightly different numbers for the same difficulty id)
function renderDifficultyPreview() {
    const difficulty = MODULE1_QUESTION_BANK.difficulties[difficultySelect.value];

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

// ------------------- Arming the bomb -------------------
startButton.addEventListener("click", function () {
    const difficultyId = difficultySelect.value;
    const isPracticeMode = practiceModeToggle.checked;

    armBomb(difficultyId, isPracticeMode);
});

function armBomb(difficultyId, isPracticeMode) {
    const bombDifficulty = MODULE1_QUESTION_BANK.difficulties[difficultyId];

    // The countdown itself lives here, on armedConfig, not on the
    // per-module runState - that's what lets it keep running (or
    // stay paused at the same value) as the player moves between
    // modules, instead of resetting to a fresh 10:00 every time a
    // module cell is tapped.
    //
    // moduleResults is what the bomb-wide win condition is checked
    // against: it only gets an entry once a module's question set is
    // actually finished, and the bomb is only defused once every
    // module in MODULE_REGISTRY has one.
    armedConfig = {
        difficultyId: difficultyId,
        isPracticeMode: isPracticeMode,
        startingTimeSeconds: bombDifficulty.startingTimeSeconds,
        timeRemaining: bombDifficulty.startingTimeSeconds,
        timerId: null,
        moduleResults: {}
    };
    runState = null;

    resetModuleCellsVisual();

    overviewDifficultyLabel.textContent = bombDifficulty.label;
    renderTimer();
    renderModulesSolvedLabel();

    showScreen(overviewScreen);
}

// Clears the "solved" mark on every module cell, so a fresh arm (or a
// Retry) starts with all of them tappable again.
function resetModuleCellsVisual() {
    Object.keys(MODULE_REGISTRY).forEach(function (moduleId) {
        const moduleConfig = MODULE_REGISTRY[moduleId];

        moduleConfig.slot.disabled = false;
        moduleConfig.slot.classList.remove("solved");

        const hint = moduleConfig.slot.querySelector(".cell-hint");
        if (hint) {
            hint.textContent = "Tap to defuse";
        }
    });
}

function renderModulesSolvedLabel() {
    if (!armedConfig) {
        return;
    }

    const totalModules = Object.keys(MODULE_REGISTRY).length;
    const solvedModules = Object.keys(armedConfig.moduleResults).length;

    overviewModulesSolvedLabel.textContent =
        solvedModules + " / " + totalModules + " modules solved";
}

// ------------------- Entering a module -------------------
// This is what actually builds the run (random questions, starting
// time/strikes for THIS module's version of the chosen difficulty)
// and starts the clock ticking.
function enterModule(moduleId) {
    if (!armedConfig || armedConfig.moduleResults[moduleId]) {
        return;
    }

    const moduleConfig = MODULE_REGISTRY[moduleId];
    const difficulty = moduleConfig.questionBank.difficulties[armedConfig.difficultyId];

    const questionPool = moduleConfig.questionBank.questions.filter(function (question) {
        return question.difficulty === armedConfig.difficultyId;
    });

    const selectedQuestions = pickRandomQuestions(
        questionPool,
        difficulty.questionCount
    );

    runState = {
        moduleId: moduleId,
        difficultyId: armedConfig.difficultyId,
        difficulty: difficulty,
        isPracticeMode: armedConfig.isPracticeMode,
        questions: selectedQuestions,
        currentIndex: 0,
        correctCount: 0,
        strikesUsed: 0,
        isAnswerLocked: false
    };

    renderStrikes();
    renderProgress();
    renderTimer();
    renderCurrentQuestion();

    showScreen(moduleConfig.screen);
    resumeTimerIfNeeded();
}

// pick N random, non-repeating questions from a pool
function pickRandomQuestions(pool, count) {
    const shuffled = pool.slice().sort(function () {
        return Math.random() - 0.5;
    });

    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ------------------- Timer start/stop (zoom in/out) -------------------

// Only counts down while the player is zoomed into a module; paused
// on the overview screen, and never runs at all in practice mode.
// Lives on armedConfig (not runState) so it's the same clock no
// matter which module is currently zoomed in.
function resumeTimerIfNeeded() {
    if (!armedConfig || armedConfig.isPracticeMode || armedConfig.timerId) {
        return;
    }

    armedConfig.timerId = setInterval(tickTimer, 1000);
    renderTimer();
}

function pauseTimer() {
    if (armedConfig && armedConfig.timerId) {
        clearInterval(armedConfig.timerId);
        armedConfig.timerId = null;
        renderTimer();
    }
}

// ------------------- Timer -------------------
function tickTimer() {
    armedConfig.timeRemaining -= 1;

    renderTimer();

    if (armedConfig.timeRemaining <= 0) {
        armedConfig.timeRemaining = 0;
        finishBomb(false); // ran out of time
    }
}

function renderTimer() {
    if (!armedConfig) {
        return;
    }

    const minutes = Math.floor(armedConfig.timeRemaining / 60);
    const seconds = armedConfig.timeRemaining % 60;
    const paddedSeconds = seconds < 10 ? "0" + seconds : String(seconds);
    const text = minutes + ":" + paddedSeconds;

    const isRunning = !!armedConfig.timerId;
    const isWarning = armedConfig.timeRemaining <= 30 && !armedConfig.isPracticeMode;

    // The overview LCD always reflects the shared clock. The
    // in-module LCD only needs updating when a module is actually
    // active (e.g. right after arming, no module screen exists yet).
    const displaysToUpdate = [overviewTimerDisplay];

    if (runState) {
        displaysToUpdate.push(MODULE_REGISTRY[runState.moduleId].timerDisplay);
    }

    displaysToUpdate.forEach(function (el) {
        el.textContent = text;
        el.classList.toggle("timer-running", isRunning);
        el.classList.toggle("timer-warning", isWarning);
    });
}

// ------------------- Strikes -------------------
function renderStrikes() {
    const moduleConfig = MODULE_REGISTRY[runState.moduleId];
    const strikesDisplayEl = moduleConfig.strikesDisplay;

    strikesDisplayEl.innerHTML = "";

    for (let i = 0; i < runState.difficulty.mistakesAllowed; i++) {
        const light = document.createElement("span");
        light.classList.add("strike-light");

        if (i < runState.strikesUsed) {
            light.classList.add("used");
        }

        strikesDisplayEl.appendChild(light);
    }
}

// ------------------- Progress -------------------
function renderProgress() {
    const moduleConfig = MODULE_REGISTRY[runState.moduleId];

    moduleConfig.progressDisplay.textContent =
        runState.correctCount + " / " + runState.questions.length;
}

// ------------------- Rendering a question -------------------
function renderCurrentQuestion() {
    const moduleConfig = MODULE_REGISTRY[runState.moduleId];
    const question = runState.questions[runState.currentIndex];

    moduleConfig.renderQuestion(question);
    moduleConfig.resetInputs();

    runState.isAnswerLocked = false;
}

// ----- Module 1 (Multiple Choice) rendering -----
function renderMultipleChoiceQuestion(question) {
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
}

function resetMultipleChoiceButtons() {
    shapeButtons.forEach(function (button) {
        button.disabled = false;
        button.classList.remove("correct", "wrong");
    });
}

// ----- Module 2 (Fill in the Blanks) rendering -----
// Unlike the button-based modules, this one builds up an answer
// letter by letter as the keypad is clicked, so it needs its own bit
// of state for "what has the player typed so far".
let module2TypedAnswer = "";

function renderFillBlankQuestion(question) {
    module2QuestionTopic.textContent = question.topic;
    module2QuestionPrompt.textContent = question.prompt;
}

function resetFillBlankInputs() {
    module2TypedAnswer = "";
    renderModule2AnswerDisplay();

    keypadKeys.forEach(function (key) {
        key.disabled = false;
    });

    module2AnswerDisplay.classList.remove("correct", "wrong");
}

function renderModule2AnswerDisplay() {
    const hasTyped = module2TypedAnswer.length > 0;

    module2AnswerDisplay.textContent = hasTyped
        ? module2TypedAnswer
        : "type your answer...";

    module2AnswerDisplay.classList.toggle("answer-display-placeholder", !hasTyped);
}

// ----- Module 4 (True/False) rendering -----
function renderTrueFalseQuestion(question) {
    module4QuestionTopic.textContent = question.topic;
    module4QuestionPrompt.textContent = question.prompt;
}

function resetTrueFalseButtons() {
    truefalseButtons.forEach(function (button) {
        button.disabled = false;
        button.classList.remove("correct", "wrong");
    });
}

// ------------------- Answering -------------------
shapeButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!runState || runState.moduleId !== "module1" || runState.isAnswerLocked) {
            return;
        }

        const question = runState.questions[runState.currentIndex];
        const isCorrect = button.dataset.optionId === question.correctOptionId;

        submitAnswer(isCorrect, button, shapeButtons);
    });
});

truefalseButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        if (!runState || runState.moduleId !== "module4" || runState.isAnswerLocked) {
            return;
        }

        const question = runState.questions[runState.currentIndex];
        const selectedAnswer = button.dataset.answer === "true";
        const isCorrect = selectedAnswer === question.correctAnswer;

        submitAnswer(isCorrect, button, truefalseButtons);
    });
});

keypadKeys.forEach(function (key) {
    key.addEventListener("click", function () {
        if (!runState || runState.moduleId !== "module2" || runState.isAnswerLocked) {
            return;
        }

        const action = key.dataset.action;

        if (action === "backspace") {
            backspaceModule2Answer();
            return;
        }

        if (action === "space") {
            typeModule2Character(" ");
            return;
        }

        if (action === "submit") {
            submitFillBlankAnswer();
            return;
        }

        // a regular letter key
        typeModule2Character(key.dataset.letter);
    });
});

// A physical keyboard works the same as clicking the on-screen keys -
// same character set (letters + space), same Backspace/Enter actions.
document.addEventListener("keydown", function (event) {
    if (!runState || runState.moduleId !== "module2" || runState.isAnswerLocked) {
        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        submitFillBlankAnswer();
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        backspaceModule2Answer();
        return;
    }

    if (event.key === " ") {
        event.preventDefault(); // stop the page from scrolling
        typeModule2Character(" ");
        return;
    }

    if (/^[a-zA-Z]$/.test(event.key)) {
        typeModule2Character(event.key);
    }
});

function typeModule2Character(character) {
    module2TypedAnswer += character.toLowerCase();
    renderModule2AnswerDisplay();
}

function backspaceModule2Answer() {
    module2TypedAnswer = module2TypedAnswer.slice(0, -1);
    renderModule2AnswerDisplay();
}

function submitFillBlankAnswer() {
    const question = runState.questions[runState.currentIndex];
    const isCorrect =
        module2TypedAnswer.trim().toLowerCase() === question.answer.toLowerCase();

    keypadKeys.forEach(function (key) {
        key.disabled = true;
    });

    module2AnswerDisplay.classList.add(isCorrect ? "correct" : "wrong");

    if (!module2TypedAnswer.trim().length) {
        module2AnswerDisplay.textContent = "(no answer)";
        module2AnswerDisplay.classList.remove("answer-display-placeholder");
    }

    commitAnswer(isCorrect);
}

// shared by every module: flash the button that was pressed, count
// the answer, then move on
function submitAnswer(isCorrect, buttonElement, allButtonsForThisModule) {
    allButtonsForThisModule.forEach(function (button) {
        button.disabled = true;
    });

    buttonElement.classList.add(isCorrect ? "correct" : "wrong");

    commitAnswer(isCorrect);
}

// the part every module's submit function shares once its own answer
// UI has been locked/flashed: lock out further input, count the
// answer, wait for the flash to be visible, then move to the next
// question (or end the run)
function commitAnswer(isCorrect) {
    runState.isAnswerLocked = true;

    if (isCorrect) {
        runState.correctCount += 1;
        renderProgress();
    } else {
        registerStrike();
    }

    setTimeout(function () {
        advanceAfterAnswer();
    }, 700);
}

// Wrong answers cost time off the shared clock, on top of the strike
// itself - bigger bite on harder difficulties. Expert isn't listed
// here (penalty of 0): with only 1 mistake allowed on Expert, a
// wrong answer already ends the run via the strikes check, so a time
// penalty would never actually get the chance to apply.
const TIME_PENALTY_SECONDS_BY_DIFFICULTY = {
    easy: 30,
    intermediate: 60,
    hard: 90,
    expert: 0
};

function registerStrike() {
    const moduleConfig = MODULE_REGISTRY[runState.moduleId];

    moduleConfig.bombShell.classList.remove("shake");
    // restart the animation
    void moduleConfig.bombShell.offsetWidth;
    moduleConfig.bombShell.classList.add("shake");

    // Strikes are tracked per module (not shared) - runState is
    // rebuilt fresh every time a module is entered, so this only
    // ever counts mistakes made in the module you're currently in.
    runState.strikesUsed += 1;
    renderStrikes();

    applyWrongAnswerTimePenalty();
}

// The clock, on the other hand, IS shared - so this docks time off
// armedConfig regardless of which module the mistake happened in.
function applyWrongAnswerTimePenalty() {
    if (armedConfig.isPracticeMode) {
        return;
    }

    const penaltySeconds = TIME_PENALTY_SECONDS_BY_DIFFICULTY[armedConfig.difficultyId] || 0;

    if (penaltySeconds <= 0) {
        return;
    }

    armedConfig.timeRemaining = Math.max(0, armedConfig.timeRemaining - penaltySeconds);
    renderTimer();

    if (armedConfig.timeRemaining <= 0) {
        finishBomb(false); // the penalty burned through what was left
    }
}

function advanceAfterAnswer() {
    const isOutOfStrikes =
        !runState.isPracticeMode &&
        runState.strikesUsed >= runState.difficulty.mistakesAllowed;

    if (isOutOfStrikes) {
        finishBomb(false); // this module's mistakes blew the whole bomb
        return;
    }

    const isLastQuestion =
        runState.currentIndex >= runState.questions.length - 1;

    if (isLastQuestion) {
        // Reaching the last question without tripping the
        // isOutOfStrikes check above means every mistake so far was
        // within the allowed limit - that's a successful defusal of
        // THIS module. Same as "Keep Talking and Nobody Explodes",
        // it doesn't require a perfect run, just staying under the
        // strike limit.
        completeModule(runState.moduleId);
        return;
    }

    runState.currentIndex += 1;
    renderCurrentQuestion();
}

// Records this module as solved and checks whether that was the last
// one - the bomb as a whole only counts as defused once every module
// in MODULE_REGISTRY has been solved this same arm.
function completeModule(moduleId) {
    armedConfig.moduleResults[moduleId] = {
        correctCount: runState.correctCount,
        totalQuestions: runState.questions.length,
        strikesUsed: runState.strikesUsed,
        baseScore: runState.difficulty.baseScore,
        timeBonusCap: runState.difficulty.timeBonusCap
    };

    markModuleSolved(moduleId);
    pauseTimer();
    runState = null;

    renderModulesSolvedLabel();

    if (isBombFullyDefused()) {
        finishBomb(true);
        return;
    }

    // Still more modules to go - drop back to the overview so the
    // player can pick the next one, same as tapping "Back".
    showScreen(overviewScreen);
}

function isBombFullyDefused() {
    return Object.keys(MODULE_REGISTRY).every(function (moduleId) {
        return !!armedConfig.moduleResults[moduleId];
    });
}

function markModuleSolved(moduleId) {
    const moduleConfig = MODULE_REGISTRY[moduleId];

    moduleConfig.slot.disabled = true;
    moduleConfig.slot.classList.add("solved");

    const hint = moduleConfig.slot.querySelector(".cell-hint");
    if (hint) {
        hint.textContent = "Solved";
    }
}

// ------------------- Ending the bomb (defused or exploded) -------------------
function finishBomb(isDefused) {
    if (armedConfig.timerId) {
        clearInterval(armedConfig.timerId);
        armedConfig.timerId = null;
    }

    // If a module was mid-question when the bomb exploded, fold its
    // partial progress into the totals too, so the result screen
    // still reflects the work done in it.
    if (runState && !armedConfig.moduleResults[runState.moduleId]) {
        armedConfig.moduleResults[runState.moduleId] = {
            correctCount: runState.correctCount,
            totalQuestions: runState.questions.length,
            strikesUsed: runState.strikesUsed,
            baseScore: runState.difficulty.baseScore,
            timeBonusCap: runState.difficulty.timeBonusCap
        };
    }

    const score = calculateOverallScore();

    renderResultScreen(isDefused, score);
    saveRunToHistory(isDefused, score);

    showScreen(resultScreen);
}

// Adds up correctCount/totalQuestions/strikesUsed across every module
// that was played this arm (solved or, if the bomb exploded,
// in-progress at the time).
function getAggregatedResults() {
    let correctCount = 0;
    let totalQuestions = 0;
    let strikesUsed = 0;

    Object.keys(armedConfig.moduleResults).forEach(function (moduleId) {
        const result = armedConfig.moduleResults[moduleId];
        correctCount += result.correctCount;
        totalQuestions += result.totalQuestions;
        strikesUsed += result.strikesUsed;
    });

    return {
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        strikesUsed: strikesUsed
    };
}

// One combined score across every module played, each contributing
// its own baseScore*accuracy plus a share of the time bonus (using
// the same left-over-time fraction for all of them, since the clock
// itself is shared).
function calculateOverallScore() {
    if (armedConfig.isPracticeMode) {
        return 0;
    }

    const timeFraction = armedConfig.timeRemaining / armedConfig.startingTimeSeconds;
    let total = 0;

    Object.keys(armedConfig.moduleResults).forEach(function (moduleId) {
        const result = armedConfig.moduleResults[moduleId];
        const accuracy = result.totalQuestions > 0
            ? result.correctCount / result.totalQuestions
            : 0;

        total += result.baseScore * accuracy + timeFraction * result.timeBonusCap;
    });

    return Math.round(total);
}

function renderResultScreen(isDefused, score) {
    resultTitle.textContent = isDefused ? "Defused!" : "Boom.";
    resultTitle.classList.toggle("defused", isDefused);
    resultTitle.classList.toggle("exploded", !isDefused);

    resultSubtitle.textContent = isDefused
        ? "Nice work, agent - every module is clear."
        : "The bomb got the better of you this time.";

    const totals = getAggregatedResults();

    resultAccuracy.textContent = totals.correctCount + " / " + totals.totalQuestions;

    const minutes = Math.floor(armedConfig.timeRemaining / 60);
    const seconds = armedConfig.timeRemaining % 60;
    const paddedSeconds = seconds < 10 ? "0" + seconds : String(seconds);
    resultTime.textContent = armedConfig.isPracticeMode
        ? "N/A (practice)"
        : minutes + ":" + paddedSeconds;

    resultStrikes.textContent = armedConfig.isPracticeMode
        ? "N/A (practice)"
        : String(totals.strikesUsed);

    resultScore.textContent = armedConfig.isPracticeMode ? "N/A (practice)" : score;
}

// ------------------- Saving progress -------------------
function saveRunToHistory(isDefused, score) {
    // practice runs are not saved, per the "practice mode" idea of
    // going at your own pace without pressure
    if (armedConfig.isPracticeMode) {
        return;
    }

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    const historyKey = loggedInUser
        ? "bombDefusalHistory_" + loggedInUser.username
        : "bombDefusalHistory_guest";

    const history = JSON.parse(localStorage.getItem(historyKey)) || [];

    const totals = getAggregatedResults();

    const moduleBreakdown = {};
    Object.keys(armedConfig.moduleResults).forEach(function (moduleId) {
        const result = armedConfig.moduleResults[moduleId];
        moduleBreakdown[MODULE_REGISTRY[moduleId].moduleName] = {
            correctAnswers: result.correctCount,
            totalQuestions: result.totalQuestions,
            strikesUsed: result.strikesUsed
        };
    });

    history.push({
        difficulty: armedConfig.difficultyId,
        score: score,
        correctAnswers: totals.correctCount,
        totalQuestions: totals.totalQuestions,
        timeRemainingSeconds: armedConfig.timeRemaining,
        strikesUsed: totals.strikesUsed,
        modules: moduleBreakdown,
        passed: isDefused,
        timestamp: new Date().toISOString()
    });

    localStorage.setItem(historyKey, JSON.stringify(history));
}

// ------------------- Screen switching -------------------
// Grabs every element with class "screen" (overview, setup, result,
// and every module's own game screen), so a future module's screen
// is handled automatically as long as it has that class.
function showScreen(screenToShow) {
    document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.add("hidden");
    });

    screenToShow.classList.remove("hidden");
}

retryButton.addEventListener("click", function () {
    // Re-arms the bomb at the same difficulty and drops back to the
    // overview screen, paused, with every module unsolved again -
    // same as a fresh "Arm Bomb" would give you.
    armBomb(armedConfig.difficultyId, armedConfig.isPracticeMode);
});

changeDifficultyButton.addEventListener("click", function () {
    showScreen(setupScreen);
});

// ------------------- Bomb overview navigation -------------------
// Wire up every registered module's slot + back button the same way,
// so adding a new module to MODULE_REGISTRY is all that's needed.
Object.keys(MODULE_REGISTRY).forEach(function (moduleId) {
    const moduleConfig = MODULE_REGISTRY[moduleId];

    moduleConfig.slot.addEventListener("click", function () {
        enterModule(moduleId);
    });

    moduleConfig.backButton.addEventListener("click", function () {
        // "Back to Bomb Overview" mid-run - pause the clock while
        // zoomed out, per the "Keep Talking" rule that only zoomed-in
        // time counts against you. This module isn't solved, so its
        // progress (current question, strikes so far) is simply
        // dropped - re-entering it later starts that module over.
        pauseTimer();
        runState = null;
        showScreen(overviewScreen);
    });
});