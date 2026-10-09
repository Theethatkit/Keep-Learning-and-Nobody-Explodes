// ===================================================================
// Bomb Defusal - shared shell + Identify (MC / True-False)
//                                + Operate (Fill in the Blanks)
//                                + Construct (Build an Operation Sequence)
//                                + Analyze (Trace + Typed Output)
//                                + Defuse (Scenario, single-select)
//
// Question data comes from data/*-questions.js (loaded first, as
// plain <script> tags), so this file's job is the timer/strikes/
// scoring shell, plus each module's own answer-checking UI.
//
// A module is not bound to exactly one question format: Identify
// renders whichever of MC or True/False a given question calls for
// (see createIdentifyStyleModule below). Analyze used to share that
// same engine, but its educational purpose ("determine what an
// algorithm does") is a poor fit for choosing between four
// pre-written answers - so it now has its own mechanic: the module
// face lists out a sequence of operations like a little trace/console
// log, and the player types the resulting value on a keypad (see the
// "Module 4 (Analyze)" section below, which mirrors Module 2's
// fill-in-the-blank input handling but keeps its own DOM/state so the
// two don't clobber each other). Operate/Trace/Defuse still each own
// a single format for now - the same createXStyleModule pattern is
// how a future module would gain more than one format.
//
// Only one module can be zoomed into at a time, so there is a single
// `runState` that gets rebuilt fresh every time a module cell on the
// overview screen is tapped. Adding a future module means: give it a
// data file + its own screen in the HTML, then add one more entry to
// MODULE_REGISTRY below with the same shape as the others.
// ===================================================================

// ------------------- Custom sound effects -------------------
// Swaps in real audio clips for a few key events; anything not
// listed here just keeps using SFX's built-in synthesized tone.
SFX.loadCustomSound("exploded", "../audio/explosion.mp3");
SFX.loadCustomSound("defused", "../audio/defused-fanfare.mp3");
SFX.loadSoundtrack("../audio/clock_is_ticking_benny_hawes.mp3", 0.6);

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

// Module 1 (Identify) elements are NOT declared here as flat consts,
// unlike the other modules - it owns its own copy of the MC/True-False
// widget pair (one shape-grid, one truefalse-grid), so its DOM lookups
// are scoped per-screen inside createIdentifyStyleModule() further
// down instead of one global querySelectorAll() that would grab both
// screens' nodes at once (Analyze used to share that same screen
// scoping trick; now that it has its own keypad-based mechanic, its
// elements are declared as flat consts below instead, same as
// Module 2's).

// ------------------- Module 2 (Fill in the Blanks) elements -------------------
const keypadKeys = document.querySelectorAll(".module2-keypad-key");
const module2TextInput = document.getElementById("module2TextInput");
const IS_TOUCH_DEVICE = window.matchMedia("(pointer: coarse)").matches;
const module2QuestionTopic = document.getElementById("module2QuestionTopic");
const module2QuestionPrompt = document.getElementById("module2QuestionPrompt");
const module2AnswerDisplay = document.getElementById("module2AnswerDisplay");

// ------------------- Module 4 (Analyze) elements -------------------
// Same keypad-driven input pattern as Module 2, but scoped to its own
// screen/keys (".module4-keypad-key" instead of ".module2-keypad-key")
// so the two modules' keydown/click handling never cross-fires, and
// with a trace list in place of Module 2's plain prompt text, since
// what the player needs to read here is a short sequence of
// operations rather than a single fill-in-the-blank sentence.
const module4KeypadKeys = document.querySelectorAll(".module4-keypad-key");
const module4TextInput = document.getElementById("module4TextInput");
const module4QuestionTopic = document.getElementById("module4QuestionTopic");
const module4TraceList = document.getElementById("module4TraceList");
const module4QuestionPrompt = document.getElementById("module4QuestionPrompt");
const module4AnswerDisplay = document.getElementById("module4AnswerDisplay");

// ------------------- Module 3 (Construct) elements -------------------
const module3QuestionTopic = document.getElementById("module3QuestionTopic");
const module3QuestionPrompt = document.getElementById("module3QuestionPrompt");
const module3CurrentDisplay = document.getElementById("module3CurrentDisplay");
const module3TargetDisplay = document.getElementById("module3TargetDisplay");
const module3BlockTray = document.getElementById("module3BlockTray");
const module3SequenceSlots = document.getElementById("module3SequenceSlots");
const module3SlotCounter = document.getElementById("module3SlotCounter");
const module3RuleText = document.getElementById("module3RuleText");
const module3ResultRow = document.getElementById("module3ResultRow");
const module3ResultLabel = document.getElementById("module3ResultLabel");
const module3ResultDisplay = document.getElementById("module3ResultDisplay");
const module3ResultNote = document.getElementById("module3ResultNote");
const module3ClearButton = document.getElementById("module3ClearButton");
const module3RunButton = document.getElementById("module3RunButton");

// ------------------- Module 5 (Scenario / Defuse) elements -------------------
// Single-select now, not multi: one scenario, pick the one best
// structure. Unlike Module 1's fixed A/B/C/D shape buttons, the
// option set here is text (structure names) that varies per
// question, so - same as Module 3's term/definition columns - the
// buttons are rebuilt fresh every question rather than looked up
// once as a fixed NodeList; module5OptionList is the container they
// get rendered into, and clicks are handled via delegation on it.
const module5OptionList = document.getElementById("module5OptionList");
const module5QuestionTopic = document.getElementById("module5QuestionTopic");
const module5QuestionPrompt = document.getElementById("module5QuestionPrompt");

// ------------------- Result screen elements -------------------
const resultTitle = document.getElementById("resultTitle");
const resultSubtitle = document.getElementById("resultSubtitle");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultTime = document.getElementById("resultTime");
const resultStrikes = document.getElementById("resultStrikes");
const resultScore = document.getElementById("resultScore");
const retryButton = document.getElementById("retryButton");
const changeDifficultyButton = document.getElementById("changeDifficultyButton");
const saveAttemptButton = document.getElementById("saveAttemptButton");
const viewExplanationsFromResultButton = document.getElementById("viewExplanationsFromResultButton");
const viewHistoryFromResultButton = document.getElementById("viewHistoryFromResultButton");

// ------------------- History screen elements -------------------
const historyScreen = document.getElementById("historyScreen");
const openHistoryButton = document.getElementById("openHistoryButton");
const openHistoryButtonSetup = document.getElementById("openHistoryButtonSetup");
const backToOverviewFromHistory = document.getElementById("backToOverviewFromHistory");
const historyEmptyMessage = document.getElementById("historyEmptyMessage");
const historyColumnHeader = document.getElementById("historyColumnHeader");
const historyAttemptList = document.getElementById("historyAttemptList");
const historyTopicChart = document.getElementById("historyTopicChart");

// ------------------- Review screen elements -------------------
// Shows every question from one run - either the run that just
// finished (from the result screen) or a saved past attempt (from
// the History screen) - with the player's answer, the correct one,
// and an explanation. See renderReviewScreen() further down.
const reviewScreen = document.getElementById("reviewScreen");
const reviewQuestionList = document.getElementById("reviewQuestionList");
const backFromReview = document.getElementById("backFromReview");

// ------------------- Achievements screen elements -------------------
// Persistent, cross-attempt progress (unlike History, which only
// keeps the last 5 runs) - see the "Achievements" section further
// down for the storage/tracking logic itself.
const achievementsScreen = document.getElementById("achievementsScreen");
const achievementList = document.getElementById("achievementList");
const openAchievementsButton = document.getElementById("openAchievementsButton");
const openAchievementsButtonSetup = document.getElementById("openAchievementsButtonSetup");
const backToOverviewFromAchievements = document.getElementById("backToOverviewFromAchievements");
const achievementToast = document.getElementById("achievementToast");
const achievementToastLabel = document.getElementById("achievementToastLabel");

// shape order fixed to the sketch layout: circle (a), triangle (b),
// square (c), diamond (d) - only used by Module 1's option list
const SHAPE_BY_OPTION_ID = {
    a: "circle",
    b: "triangle",
    c: "square",
    d: "diamond"
};

// ------------------- Identify / Analyze shared widget factory -------------------
// Both Identify and Analyze render whichever of MC or True/False a
// question calls for, on their own separate screens. Rather than
// giving each module its own copy of render/reset/click-handling
// logic (which is how Module 1 and Module 4 used to work), this
// factory builds one { renderQuestion, resetInputs } pair per module,
// scoped to that module's own screen - so the two modules share the
// exact same engine without sharing DOM elements or clobbering each
// other's button state.
//
// question.type selects the widget: "mc" needs options/correctOptionId,
// "trueFalse" needs correctAnswer (boolean). Both types share
// topic/prompt/difficulty, same as the old Module 1 / Module 4 banks did.
function createIdentifyStyleModule(moduleId, screenId) {
    const screen = document.getElementById(screenId);

    const shapeButtons = screen.querySelectorAll(".shape-button");
    const truefalseButtons = screen.querySelectorAll(".truefalse-button");
    const mcWidget = screen.querySelector('[data-widget="mc"]');
    const trueFalseWidget = screen.querySelector('[data-widget="trueFalse"]');
    const questionTopicEl = screen.querySelector(".question-topic");
    const questionPromptEl = screen.querySelector(".question-prompt");
    const optionListEl = screen.querySelector(".option-list");

    function showWidgetForType(type) {
        mcWidget.classList.toggle("hidden", type !== "mc");
        trueFalseWidget.classList.toggle("hidden", type !== "trueFalse");
    }

    function renderQuestion(question) {
        questionTopicEl.textContent = question.topic;
        questionPromptEl.textContent = question.prompt;

        showWidgetForType(question.type);

        if (question.type === "mc") {
            renderMultipleChoiceOptions(optionListEl, question);
        } else {
            // True/False has no option list - the popup just shows
            // the statement itself via questionPromptEl above.
            optionListEl.innerHTML = "";
        }
    }

    function resetInputs() {
        shapeButtons.forEach(function (button) {
            button.disabled = false;
            button.classList.remove("correct", "wrong");
        });

        truefalseButtons.forEach(function (button) {
            button.disabled = false;
            button.classList.remove("correct", "wrong");
        });
    }

    shapeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            if (!runState || runState.moduleId !== moduleId || runState.isAnswerLocked) {
                return;
            }

            const question = runState.questions[runState.currentIndex];
            const isCorrect = button.dataset.optionId === question.correctOptionId;

            const chosenOption = question.options.find(function (option) {
                return option.id === button.dataset.optionId;
            });
            const correctOption = question.options.find(function (option) {
                return option.id === question.correctOptionId;
            });

            submitAnswer(isCorrect, button, shapeButtons, {
                yourAnswerText: chosenOption ? chosenOption.text : "(no answer)",
                correctAnswerText: correctOption ? correctOption.text : ""
            });
        });
    });

    truefalseButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            if (!runState || runState.moduleId !== moduleId || runState.isAnswerLocked) {
                return;
            }

            const question = runState.questions[runState.currentIndex];
            const selectedAnswer = button.dataset.answer === "true";
            const isCorrect = selectedAnswer === question.correctAnswer;

            submitAnswer(isCorrect, button, truefalseButtons, {
                yourAnswerText: selectedAnswer ? "True" : "False",
                correctAnswerText: question.correctAnswer ? "True" : "False"
            });
        });
    });

    return { renderQuestion: renderQuestion, resetInputs: resetInputs };
}

const module1Widgets = createIdentifyStyleModule("identify", "module1GameScreen");

// ------------------- Module registry -------------------
// Every playable module plugs in here: its own screen/DOM elements,
// its own question bank, and the two functions that know how to draw
// a question and reset its answer buttons. Everything else (timer,
// strikes, progress, scoring, screen switching) is shared.
const MODULE_REGISTRY = {
    identify: {
        moduleName: "module1-identify",
        label: "Module 1: Identify",
        slot: document.getElementById("module1Slot"),
        screen: document.getElementById("module1GameScreen"),
        bombShell: document.getElementById("module1BombShell"),
        timerDisplay: document.getElementById("module1TimerDisplay"),
        strikesDisplay: document.getElementById("module1StrikesDisplay"),
        progressDisplay: document.getElementById("module1ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule1"),
        questionBank: IDENTIFY_QUESTION_BANK,
        renderQuestion: module1Widgets.renderQuestion,
        resetInputs: module1Widgets.resetInputs
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
    module3: {
        moduleName: "module3-construct",
        label: "Module 3: Construct",
        slot: document.getElementById("module3Slot"),
        screen: document.getElementById("module3GameScreen"),
        bombShell: document.getElementById("module3BombShell"),
        timerDisplay: document.getElementById("module3TimerDisplay"),
        strikesDisplay: document.getElementById("module3StrikesDisplay"),
        progressDisplay: document.getElementById("module3ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule3"),
        questionBank: MODULE3_QUESTION_BANK,
        renderQuestion: renderConstructQuestion,
        resetInputs: resetConstructInputs
    },
    analyze: {
        moduleName: "module4-analyze",
        label: "Module 4: Analyze",
        slot: document.getElementById("module4Slot"),
        screen: document.getElementById("module4GameScreen"),
        bombShell: document.getElementById("module4BombShell"),
        timerDisplay: document.getElementById("module4TimerDisplay"),
        strikesDisplay: document.getElementById("module4StrikesDisplay"),
        progressDisplay: document.getElementById("module4ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule4"),
        questionBank: ANALYZE_QUESTION_BANK,
        renderQuestion: renderModule4Question,
        resetInputs: resetModule4Inputs
    },
    module5: {
        moduleName: "module5-defuse",
        label: "Module 5: Defuse",
        slot: document.getElementById("module5Slot"),
        screen: document.getElementById("module5GameScreen"),
        bombShell: document.getElementById("module5BombShell"),
        timerDisplay: document.getElementById("module5TimerDisplay"),
        strikesDisplay: document.getElementById("module5StrikesDisplay"),
        progressDisplay: document.getElementById("module5ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule5"),
        questionBank: MODULE5_QUESTION_BANK,
        renderQuestion: renderScenarioQuestion,
        resetInputs: resetScenarioInputs
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

// Set by finishBomb() right before the result screen is shown; read by
// the "Save Attempt" button's click handler. Null for practice runs
// (nothing to save) and cleared again once a save actually happens, so
// a second click can't double-save the same attempt.
let pendingSaveResult = null;

// Which screen the review screen's "Back" button should return to -
// the result screen if opened via "View Explanations", or the History
// screen if opened via a saved attempt's "Review" button.
let reviewReturnScreen = null;

// Which screen the history screen's "Back" button should return to -
// the result screen, the bomb overview, or the setup screen,
// depending on where History was opened from.
let historyReturnScreen = null;

// ------------------- Set up the difficulty dropdown -------------------
// Difficulty ids/labels are the same set across every module bank
// (easy/intermediate/hard/expert), just with different numbers behind
// them, so Module 1's bank is as good a source as any for the list.
populateDifficultyOptions();

function populateDifficultyOptions() {
    const difficultyIds = Object.keys(IDENTIFY_QUESTION_BANK.difficulties);

    difficultyIds.forEach(function (difficultyId) {
        const difficulty = IDENTIFY_QUESTION_BANK.difficulties[difficultyId];

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
    const difficulty = IDENTIFY_QUESTION_BANK.difficulties[difficultySelect.value];

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
    SFX.stopSoundtrack();
    if (armedConfig && armedConfig.timerId) {
        clearInterval(armedConfig.timerId); // safety: never leave an old clock ticking
    }
    const bombDifficulty = IDENTIFY_QUESTION_BANK.difficulties[difficultyId];

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
        moduleResults: {},
        suspendedRuns: {},   // <-- new: modules left mid-run, keyed by moduleId

        // Correct/total counts per question topic, merged in from each
        // module's runState as it's completed (or captured mid-question
        // if the bomb explodes) - this is what feeds the History
        // screen's "topics to improve" chart.
        topicStats: {},
        // One entry per question answered this arm, across every
        // module, merged in the same way as topicStats - this is what
        // feeds the Explanations/review screen.
        answerLog: []
    };
    runState = null;
    resetAnswerStreak();

    resetModuleCellsVisual();

    overviewDifficultyLabel.textContent = bombDifficulty.label;
    renderTimer();
    renderModulesSolvedLabel();

    showScreen(overviewScreen);
    resumeTimerIfNeeded(); // the clock now runs from arming, including on the overview
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

    if (armedConfig.suspendedRuns[moduleId]) {
        // Resume exactly where the player left off
        runState = armedConfig.suspendedRuns[moduleId];
        delete armedConfig.suspendedRuns[moduleId];
    } else {
        const difficulty = moduleConfig.questionBank.difficulties[armedConfig.difficultyId];

        const questionPool = moduleConfig.questionBank.questions.filter(function (question) {
            return question.difficulty === armedConfig.difficultyId;
        });

        const selectedQuestions = pickRandomQuestions(questionPool, difficulty.questionCount);

        runState = {
            moduleId: moduleId,
            difficultyId: armedConfig.difficultyId,
            difficulty: difficulty,
            isPracticeMode: armedConfig.isPracticeMode,
            questions: selectedQuestions,
            currentIndex: 0,
            correctCount: 0,
            strikesUsed: 0,
            isAnswerLocked: false,
            topicStats: {},
            answerLog: []
        };
    }

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

    updateSoundtrack();
}

// Starts the looping soundtrack the moment the shared clock drops
// below 50s (so 0:49 and under). Called from renderTimer(), which
// also runs after wrong-answer penalties, so a big time dock that
// jumps the clock under 50 triggers it too. Stopped in armBomb() and
// finishBomb(). Never plays in practice mode (no clock there).
const SOUNDTRACK_THRESHOLD_SECONDS = 50;

function updateSoundtrack() {
    const shouldPlay =
        !armedConfig.isPracticeMode &&
        armedConfig.timeRemaining > 0 &&
        armedConfig.timeRemaining < SOUNDTRACK_THRESHOLD_SECONDS;

    if (shouldPlay) {
        SFX.startSoundtrack();
    }
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

// ----- MC option list rendering (shared by Identify and Analyze) -----
// Extracted from what used to be Module 1's own renderMultipleChoiceQuestion
// so createIdentifyStyleModule() can fill in whichever screen's option
// list belongs to the module currently being rendered.
function renderMultipleChoiceOptions(optionListEl, question) {
    optionListEl.innerHTML = "";

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
        optionListEl.appendChild(row);
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
        : (IS_TOUCH_DEVICE ? "tap here to type your answer..." : "type your answer...");

    module2AnswerDisplay.classList.toggle("answer-display-placeholder", !hasTyped);

    if (module2TextInput.value !== module2TypedAnswer) {
        module2TextInput.value = module2TypedAnswer;
    }
}

// ----- Module 4 (Analyze) rendering -----
// Unlike Module 2's single prompt sentence, Analyze's prompt is
// preceded by a short "trace" of operations (question.operations, an
// ordered array of strings like "push(A)") rendered as a numbered
// list, so the player can see the whole sequence at a glance before
// typing what it produces. Answer-typing itself reuses Module 2's
// approach (a separate bit of "what's been typed so far" state, kept
// under its own name so the two modules' state never collide).
let module4TypedAnswer = "";

function renderModule4Question(question) {
    module4QuestionTopic.textContent = question.topic;
    module4QuestionPrompt.textContent = question.prompt;

    module4TraceList.innerHTML = "";
    question.operations.forEach(function (operationLine) {
        const line = document.createElement("li");
        line.classList.add("trace-line");
        line.textContent = operationLine;
        module4TraceList.appendChild(line);
    });
}

function resetModule4Inputs() {
    module4TypedAnswer = "";
    renderModule4AnswerDisplay();

    module4KeypadKeys.forEach(function (key) {
        key.disabled = false;
    });

    module4AnswerDisplay.classList.remove("correct", "wrong");
}

function renderModule4AnswerDisplay() {
    const hasTyped = module4TypedAnswer.length > 0;

    module4AnswerDisplay.textContent = hasTyped
        ? module4TypedAnswer
        : (IS_TOUCH_DEVICE ? "tap here to type the result..." : "type the result...");

    module4AnswerDisplay.classList.toggle("answer-display-placeholder", !hasTyped);

    if (module4TextInput.value !== module4TypedAnswer) {
        module4TextInput.value = module4TypedAnswer;
    }
}

// ----- Module 3 (Construct) rendering + engine -----
// The player is shown a CURRENT state, a TARGET state and a limited
// tray of operation blocks (question.solution's ops plus a few
// decoys, shuffled fresh every time the question is shown). Clicking
// a tray block appends it to the sequence slots; clicking a placed
// block takes it back out. "Run Sequence" SIMULATES the sequence on
// the current state, so ANY sequence that reaches the target within
// the difficulty's constraints is accepted, not just the authored
// one. Constraints scale per difficulty (see module3-questions.js):
//   slackSlots      - spare slots beyond the optimal length
//   distractorCount - decoy blocks mixed into the tray
//   exactCount      - must fill exactly every slot
//   livePreview     - shows the running result while building
//
// Every structure is an array with index 0 = top / front / head, so
// one small op set (reverse, delHead, insTail, rotate, swap...) covers
// stacks, queues, linked lists and arrays; `kind` only changes how
// ops are labelled and how the state is drawn.

const CONSTRUCT_KIND_CAPTION = {
    stack: "Stack \u00B7 top first",
    queue: "Queue \u00B7 front first",
    list: "Linked list \u00B7 head first",
    array: "Array \u00B7 index 0 first"
};

let module3CurrentQuestion = null;
let module3Blocks = [];      // [{ id, op, label }] - the tray
let module3Sequence = [];    // block ids, in the order the player placed them
let module3MaxOps = 0;
let module3IsExact = false;
let module3ShowPreview = false;

// ---- the simulator ----
function parseConstructOp(opString) {
    const colonIndex = opString.indexOf(":");
    return colonIndex === -1
        ? { name: opString, arg: "" }
        : { name: opString.slice(0, colonIndex), arg: opString.slice(colonIndex + 1) };
}

// Returns the new state, or null if the op can't run on this state
// (e.g. deleting from an empty structure, swapping a missing index).
function applyConstructOp(state, opString) {
    const op = parseConstructOp(opString);
    const size = state.length;

    switch (op.name) {
        case "reverse":
            return state.slice().reverse();
        case "delHead":
            return size > 0 ? state.slice(1) : null;
        case "delTail":
            return size > 0 ? state.slice(0, -1) : null;
        case "insHead":
            return [op.arg].concat(state);
        case "insTail":
            return state.concat([op.arg]);
        case "rotate":
            return size > 0 ? state.slice(1).concat([state[0]]) : null;
        case "dup":
            return size > 0 ? [state[0]].concat(state) : null;
        case "swap": {
            const pair = op.arg.split(",").map(Number);
            if (pair.length !== 2 || pair[0] < 0 || pair[1] < 0 || pair[0] >= size || pair[1] >= size) {
                return null;
            }
            const copy = state.slice();
            const held = copy[pair[0]];
            copy[pair[0]] = copy[pair[1]];
            copy[pair[1]] = held;
            return copy;
        }
    }

    return null;
}

// Runs every op in order. { ok, state, failedAt } - when an op can't
// run, state is whatever it was just before that op.
function runConstructSequence(startState, ops) {
    let state = startState.slice();

    for (let i = 0; i < ops.length; i++) {
        const next = applyConstructOp(state, ops[i]);
        if (!next) {
            return { ok: false, state: state, failedAt: i };
        }
        state = next;
    }

    return { ok: true, state: state, failedAt: -1 };
}

// ---- labels / formatting ----
function constructOpLabel(opString, kind) {
    const op = parseConstructOp(opString);

    switch (op.name) {
        case "reverse":
            return "REVERSE";
        case "delHead":
            return kind === "stack" ? "POP"
                : kind === "queue" ? "DEQUEUE"
                : kind === "array" ? "REMOVE FIRST"
                : "DELETE HEAD";
        case "delTail":
            return kind === "array" ? "REMOVE LAST" : "DELETE TAIL";
        case "insHead":
            return kind === "stack" ? "PUSH " + op.arg
                : kind === "array" ? "PREPEND " + op.arg
                : "INSERT HEAD " + op.arg;
        case "insTail":
            return kind === "queue" ? "ENQUEUE " + op.arg
                : kind === "array" ? "APPEND " + op.arg
                : "INSERT TAIL " + op.arg;
        case "rotate":
            return kind === "array" ? "ROTATE LEFT" : "HEAD \u2192 TAIL";
        case "dup":
            return kind === "stack" ? "DUP TOP" : "DUPLICATE HEAD";
        case "swap": {
            const pair = op.arg.split(",");
            return kind === "stack" && op.arg === "0,1"
                ? "SWAP TOP 2"
                : "SWAP " + pair[0] + " \u2194 " + pair[1];
        }
    }

    return opString;
}

// Plain-text version, used by the review screen.
function formatConstructState(state, kind) {
    if (kind === "list") {
        return state.length ? state.join(" \u2192 ") + " \u2192 NULL" : "NULL";
    }
    return state.length ? "[" + state.join(", ") + "]" : "(empty)";
}

function shuffleCopy(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const held = copy[i];
        copy[i] = copy[j];
        copy[j] = held;
    }
    return copy;
}

// Draws a state as a row of chips (arrows between them for linked lists).
function renderConstructState(containerEl, state, kind) {
    containerEl.innerHTML = "";

    const caption = document.createElement("span");
    caption.classList.add("construct-state-caption");
    caption.textContent = CONSTRUCT_KIND_CAPTION[kind] || "";
    containerEl.appendChild(caption);

    function addChip(text, extraClass) {
        const chip = document.createElement("span");
        chip.classList.add("construct-chip");
        if (extraClass) {
            chip.classList.add(extraClass);
        }
        chip.textContent = text;
        containerEl.appendChild(chip);
    }

    function addArrow() {
        const arrow = document.createElement("span");
        arrow.classList.add("construct-chip-arrow");
        arrow.textContent = "\u2192";
        containerEl.appendChild(arrow);
    }

    if (!state.length) {
        addChip(kind === "list" ? "NULL" : "(empty)", "construct-chip-empty");
        return;
    }

    state.forEach(function (value, index) {
        if (kind === "list" && index > 0) {
            addArrow();
        }
        addChip(value);
    });

    if (kind === "list") {
        addArrow();
        addChip("NULL", "construct-chip-empty");
    }
}

function getConstructBlock(blockId) {
    return module3Blocks.find(function (block) {
        return block.id === blockId;
    });
}

function getConstructSequenceOps() {
    return module3Sequence.map(function (blockId) {
        return getConstructBlock(blockId).op;
    });
}

// ---- rendering a question ----
function renderConstructQuestion(question) {
    const difficulty = runState.difficulty;
    module3CurrentQuestion = question;

    module3QuestionTopic.textContent = question.topic;
    module3QuestionPrompt.textContent = question.prompt;

    renderConstructState(module3CurrentDisplay, question.current, question.kind);
    renderConstructState(module3TargetDisplay, question.target, question.kind);

    // What the Explanations screen shows as the question text - the
    // prompt alone wouldn't say what the states were.
    question.reviewPrompt = question.prompt +
        " (Current: " + formatConstructState(question.current, question.kind) +
        " | Target: " + formatConstructState(question.target, question.kind) + ")";

    // The tray: every op the solution needs (duplicates stay separate
    // blocks) plus this difficulty's number of decoys, shuffled.
    const decoys = shuffleCopy(question.distractors).slice(0, difficulty.distractorCount);
    module3Blocks = shuffleCopy(question.solution.concat(decoys)).map(function (op, index) {
        return { id: "blk" + index, op: op, label: constructOpLabel(op, question.kind) };
    });

    module3MaxOps = question.solution.length + difficulty.slackSlots;
    module3IsExact = !!difficulty.exactCount;
    module3ShowPreview = !!difficulty.livePreview;
    module3Sequence = [];

    module3RuleText.textContent = module3IsExact
        ? "Use exactly " + module3MaxOps + " operations. " + module3Blocks.length +
          " blocks in the tray, each usable once - some are decoys."
        : "Use at most " + module3MaxOps + " operations. " + module3Blocks.length +
          " blocks in the tray, each usable once" +
          (module3Blocks.length > question.solution.length ? " - some are decoys." : ".");
}

function resetConstructInputs() {
    module3Sequence = [];

    module3BlockTray.classList.remove("construct-locked");
    module3SequenceSlots.classList.remove("construct-locked");
    module3ResultRow.classList.remove("correct", "wrong");
    module3ClearButton.disabled = false;
    module3RunButton.disabled = false;

    redrawConstructBoard();
}

function redrawConstructBoard() {
    // tray
    module3BlockTray.innerHTML = "";
    module3Blocks.forEach(function (block) {
        const isUsed = module3Sequence.indexOf(block.id) !== -1;

        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("construct-block");
        button.classList.toggle("used", isUsed);
        button.disabled = isUsed;
        button.dataset.blockId = block.id;
        button.textContent = block.label;
        module3BlockTray.appendChild(button);
    });

    // slots
    module3SequenceSlots.innerHTML = "";
    for (let i = 0; i < module3MaxOps; i++) {
        const slot = document.createElement("div");
        slot.classList.add("construct-slot");

        const number = document.createElement("span");
        number.classList.add("construct-slot-number");
        number.textContent = String(i + 1);
        slot.appendChild(number);

        const blockId = module3Sequence[i];
        if (blockId) {
            const placed = document.createElement("button");
            placed.type = "button";
            placed.classList.add("construct-block", "placed");
            placed.dataset.seqIndex = String(i);
            placed.textContent = getConstructBlock(blockId).label;
            slot.classList.add("filled");
            slot.appendChild(placed);
        } else {
            const empty = document.createElement("span");
            empty.classList.add("construct-slot-empty");
            empty.textContent = "empty";
            slot.appendChild(empty);
        }

        module3SequenceSlots.appendChild(slot);
    }

    module3SlotCounter.textContent = module3Sequence.length + " / " + module3MaxOps;
    module3RunButton.disabled = module3Sequence.length === 0;

    updateConstructPreview();
}

// Easy/Intermediate only: shows what the sequence built so far would
// produce, so the player can build incrementally. Hard/Expert hide it,
// leaving the player to simulate in their head (and a wrong Run costs
// a strike).
function updateConstructPreview() {
    if (!module3ShowPreview) {
        module3ResultRow.classList.add("hidden");
        return;
    }

    const result = runConstructSequence(module3CurrentQuestion.current, getConstructSequenceOps());

    module3ResultRow.classList.remove("hidden");
    module3ResultLabel.textContent = "Preview";
    renderConstructState(module3ResultDisplay, result.state, module3CurrentQuestion.kind);

    module3ResultNote.textContent = result.ok
        ? ""
        : "Step " + (result.failedAt + 1) + " can't run here - the structure is too small for that block.";
}

// ---- input handling (delegated, since tray/slots are rebuilt on every change) ----
function isConstructInputOpen() {
    return runState && runState.moduleId === "module3" && !runState.isAnswerLocked;
}

module3BlockTray.addEventListener("click", function (event) {
    if (!isConstructInputOpen()) {
        return;
    }

    const button = event.target.closest(".construct-block");
    if (!button || button.disabled) {
        return;
    }

    if (module3Sequence.length >= module3MaxOps) {
        return; // slots are full - take a block back out first
    }

    SFX.playKeyTap();
    module3Sequence.push(button.dataset.blockId);
    redrawConstructBoard();
});

module3SequenceSlots.addEventListener("click", function (event) {
    if (!isConstructInputOpen()) {
        return;
    }

    const placed = event.target.closest(".construct-block.placed");
    if (!placed) {
        return;
    }

    SFX.playKeyTap();
    module3Sequence.splice(Number(placed.dataset.seqIndex), 1);
    redrawConstructBoard();
});

module3ClearButton.addEventListener("click", function () {
    if (!isConstructInputOpen() || !module3Sequence.length) {
        return;
    }

    SFX.playKeyTap();
    module3Sequence = [];
    redrawConstructBoard();
});

module3RunButton.addEventListener("click", function () {
    if (!isConstructInputOpen() || !module3Sequence.length) {
        return;
    }

    runState.isAnswerLocked = true;
    submitConstructAnswer();
});

// ---- grading ----
// Correct = the simulated result equals the target AND the sequence
// obeys the count rule (at most N, or exactly N on Expert).
function submitConstructAnswer() {
    const question = module3CurrentQuestion;
    const ops = getConstructSequenceOps();
    const labels = module3Sequence.map(function (blockId) {
        return getConstructBlock(blockId).label;
    });

    const result = runConstructSequence(question.current, ops);
    const reachedTarget = result.ok && result.state.join("|") === question.target.join("|");
    const countOk = module3IsExact
        ? ops.length === module3MaxOps
        : ops.length > 0 && ops.length <= module3MaxOps;
    const isCorrect = reachedTarget && countOk;

    // lock the board
    module3BlockTray.classList.add("construct-locked");
    module3SequenceSlots.classList.add("construct-locked");
    module3ClearButton.disabled = true;
    module3RunButton.disabled = true;

    // show what actually happened
    let note;
    if (!result.ok) {
        note = "Step " + (result.failedAt + 1) + " (" + labels[result.failedAt] +
            ") couldn't run - the structure was too small at that point.";
    } else if (!reachedTarget) {
        note = "That sequence ends at a different state than the target.";
    } else if (!countOk) {
        note = "Right state, wrong length: this bomb demands exactly " + module3MaxOps + " operations.";
    } else {
        note = "Target reached.";
    }

    module3ResultRow.classList.remove("hidden");
    module3ResultRow.classList.add(isCorrect ? "correct" : "wrong");
    module3ResultLabel.textContent = "Result";
    renderConstructState(module3ResultDisplay, result.state, question.kind);
    module3ResultNote.textContent = note;

    module3SequenceSlots.querySelectorAll(".construct-slot.filled").forEach(function (slot, index) {
        if (isCorrect) {
            slot.classList.add("correct");
        } else if (!result.ok) {
            if (index === result.failedAt) {
                slot.classList.add("wrong");
            }
        } else {
            slot.classList.add("wrong");
        }
    });

    const solutionLabels = question.solution.map(function (op) {
        return constructOpLabel(op, question.kind);
    });

    commitAnswer(isCorrect, {
        yourAnswerText: labels.join(" \u2192 ") + " \u21D2 " +
            (result.ok ? formatConstructState(result.state, question.kind) : "(invalid sequence)"),
        correctAnswerText: solutionLabels.join(" \u2192 ") + " (one valid solution)"
    });
}

// Dev safety net: warns in the console if a question's own authored
// solution doesn't actually reach its target, or if the pool is too
// small for a difficulty's question count.
(function validateConstructBank() {
    const poolSizes = {};

    MODULE3_QUESTION_BANK.questions.forEach(function (question) {
        poolSizes[question.difficulty] = (poolSizes[question.difficulty] || 0) + 1;

        const result = runConstructSequence(question.current, question.solution);
        if (!result.ok || result.state.join("|") !== question.target.join("|")) {
            console.warn("[Construct] solution does not reach target:", question.id);
        }
    });

    Object.keys(MODULE3_QUESTION_BANK.difficulties).forEach(function (difficultyId) {
        const needed = MODULE3_QUESTION_BANK.difficulties[difficultyId].questionCount;
        if ((poolSizes[difficultyId] || 0) < needed) {
            console.warn("[Construct] not enough questions for", difficultyId);
        }
    });
})();

// Module 4 (Analyze) rendering is handled entirely by
// createIdentifyStyleModule() above - it shares Identify's MC/True-False
// engine rather than having its own render/reset functions here.

// ----- Module 5 (Defuse / scenario) rendering -----
// Single-select: one scenario, one best structure, clicking a button
// locks the answer in immediately - no separate Confirm step, same
// as Identify's MC buttons. The option set (structure names) is
// different every question though, so - like Module 3's term/
// definition nodes - the buttons themselves are rebuilt fresh each
// question rather than being a fixed A/B/C/D NodeList.
function renderScenarioQuestion(question) {
    module5QuestionTopic.textContent = question.topic;
    module5QuestionPrompt.textContent = question.prompt;

    module5OptionList.innerHTML = "";

    question.options.forEach(function (option) {
        const button = document.createElement("button");
        button.type = "button";
        button.classList.add("scenario-button");
        button.dataset.optionId = option.id;

        const letter = document.createElement("span");
        letter.classList.add("scenario-button-letter");
        letter.textContent = option.id.toUpperCase();

        const label = document.createElement("span");
        label.classList.add("scenario-button-label");
        label.textContent = option.text;

        button.appendChild(letter);
        button.appendChild(label);
        module5OptionList.appendChild(button);
    });
}

// The buttons are already freshly built (enabled, no feedback
// classes) by renderScenarioQuestion just before this runs - this is
// mostly a defensive no-op, kept for symmetry with every other
// module's resetInputs and in case a future retry path re-renders
// without rebuilding the list.
function resetScenarioInputs() {
    module5OptionList.querySelectorAll(".scenario-button").forEach(function (button) {
        button.disabled = false;
        button.classList.remove("correct", "wrong");
    });
}

// ------------------- Answering -------------------
// Identify's MC/True-False click handlers are wired up inside
// createIdentifyStyleModule() above, scoped to its own screen - see
// module1Widgets. Analyze's keypad handlers are wired up in
// its own "Module 4 (Analyze) answering" section further down.
//
// Module 5's buttons are rebuilt every question (see
// renderScenarioQuestion above), so - like Module 3's term/definition
// clicks - this is a single delegated listener on the container
// rather than a per-button listener that would need re-attaching
// every time the buttons are rebuilt.
module5OptionList.addEventListener("click", function (event) {
    if (!runState || runState.moduleId !== "module5" || runState.isAnswerLocked) {
        return;
    }

    const button = event.target.closest(".scenario-button");
    if (!button) {
        return;
    }

    const question = runState.questions[runState.currentIndex];
    const isCorrect = button.dataset.optionId === question.correctOptionId;
    const allButtons = module5OptionList.querySelectorAll(".scenario-button");

    const chosenOption = question.options.find(function (option) {
        return option.id === button.dataset.optionId;
    });
    const correctOption = question.options.find(function (option) {
        return option.id === question.correctOptionId;
    });

    submitAnswer(isCorrect, button, allButtons, {
        yourAnswerText: chosenOption ? chosenOption.text : "(no answer)",
        correctAnswerText: correctOption ? correctOption.text : ""
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
    if (event.target === module2TextInput) {
        return; // the text input has its own handlers below
    }

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
    SFX.playKeyTap();
    module2TypedAnswer += character.toLowerCase();
    renderModule2AnswerDisplay();
}

function backspaceModule2Answer() {
    SFX.playKeyTap();
    module2TypedAnswer = module2TypedAnswer.slice(0, -1);
    renderModule2AnswerDisplay();
}

// ----- Module 2: real text input (phone soft keyboard) -----
// Feeds the same module2TypedAnswer the on-screen keypad uses, so
// grading (submitFillBlankAnswer) doesn't care which one was used.
// Same character set as the keypad: letters + space.
module2TextInput.addEventListener("input", function () {
    const isInputOpen = runState && runState.moduleId === "module2" && !runState.isAnswerLocked;

    if (!isInputOpen) {
        module2TextInput.value = module2TypedAnswer; // locked: undo whatever was typed
        return;
    }

    module2TypedAnswer = module2TextInput.value
        .replace(/[^a-zA-Z ]/g, "")
        .toLowerCase();
    renderModule2AnswerDisplay();
});

// Tapping the answer box opens the phone keyboard (focus() has to happen
// inside the tap handler for mobile browsers to allow it). The box lights
// up while the input has focus.
module2AnswerDisplay.addEventListener("click", function () {
    if (runState && runState.moduleId === "module2" && !runState.isAnswerLocked) {
        module2TextInput.focus();
    }
});

module2TextInput.addEventListener("focus", function () {
    module2AnswerDisplay.classList.add("answer-display-focused");
});

module2TextInput.addEventListener("blur", function () {
    module2AnswerDisplay.classList.remove("answer-display-focused");
});

module2TextInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();

    if (runState && runState.moduleId === "module2" && !runState.isAnswerLocked) {
        submitFillBlankAnswer();
    }
});

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

    commitAnswer(isCorrect, {
        yourAnswerText: module2TypedAnswer.trim() || "(no answer)",
        correctAnswerText: question.answer
    });
}

// ------------------- Module 4 (Analyze) answering -------------------
// Same keypad-typing pattern as Module 2 above (on-screen keys, a
// matching physical-keyboard listener, backspace/submit), duplicated
// rather than shared so Analyze's answers can include digits (trace
// results are often numbers, e.g. a sum or a count) without Module 2's
// letter-only fill-in-the-blank keys picking up digit input too.
module4KeypadKeys.forEach(function (key) {
    key.addEventListener("click", function () {
        if (!runState || runState.moduleId !== "analyze" || runState.isAnswerLocked) {
            return;
        }

        const action = key.dataset.action;

        if (action === "backspace") {
            backspaceModule4Answer();
            return;
        }

        if (action === "submit") {
            submitModule4Answer();
            return;
        }

        // a regular letter/digit key
        typeModule4Character(key.dataset.letter);
    });
});

document.addEventListener("keydown", function (event) {
    if (event.target === module4TextInput) {
        return; // the text input has its own handlers below
    }

    if (!runState || runState.moduleId !== "analyze" || runState.isAnswerLocked) {
        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        submitModule4Answer();
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        backspaceModule4Answer();
        return;
    }

    if (/^[a-zA-Z0-9]$/.test(event.key)) {
        typeModule4Character(event.key);
    }
});

// ----- Module 4: real text input (phone soft keyboard) -----
// Same idea as Module 2's input, but digits are allowed too since
// trace results are often numbers.
module4TextInput.addEventListener("input", function () {
    const isInputOpen = runState && runState.moduleId === "analyze" && !runState.isAnswerLocked;

    if (!isInputOpen) {
        module4TextInput.value = module4TypedAnswer; // locked: undo whatever was typed
        return;
    }

    module4TypedAnswer = module4TextInput.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
    renderModule4AnswerDisplay();
});

// Tapping the answer box opens the phone keyboard (focus() has to happen
// inside the tap handler for mobile browsers to allow it). The box lights
// up while the input has focus.
module4AnswerDisplay.addEventListener("click", function () {
    if (runState && runState.moduleId === "analyze" && !runState.isAnswerLocked) {
        module4TextInput.focus();
    }
});

module4TextInput.addEventListener("focus", function () {
    module4AnswerDisplay.classList.add("answer-display-focused");
});

module4TextInput.addEventListener("blur", function () {
    module4AnswerDisplay.classList.remove("answer-display-focused");
});

module4TextInput.addEventListener("keydown", function (event) {
    if (event.key !== "Enter") {
        return;
    }

    event.preventDefault();

    if (runState && runState.moduleId === "analyze" && !runState.isAnswerLocked) {
        submitModule4Answer();
    }
});

function typeModule4Character(character) {
    module4TypedAnswer += character.toLowerCase();
    renderModule4AnswerDisplay();
    SFX.playKeyTap()
}

function backspaceModule4Answer() {
    module4TypedAnswer = module4TypedAnswer.slice(0, -1);
    renderModule4AnswerDisplay();
    SFX.playKeyTap()
}

function submitModule4Answer() {
    const question = runState.questions[runState.currentIndex];
    const isCorrect =
        module4TypedAnswer.trim().toLowerCase() === question.answer.toLowerCase();

    module4KeypadKeys.forEach(function (key) {
        key.disabled = true;
    });

    module4AnswerDisplay.classList.add(isCorrect ? "correct" : "wrong");

    if (!module4TypedAnswer.trim().length) {
        module4AnswerDisplay.textContent = "(no answer)";
        module4AnswerDisplay.classList.remove("answer-display-placeholder");
    }

    commitAnswer(isCorrect, {
        yourAnswerText: module4TypedAnswer.trim() || "(no answer)",
        correctAnswerText: question.answer
    });
}

// shared by every button-based module (Identify's shape/true-false
// buttons, Module 5's scenario buttons): flash the button that was
// pressed, count the answer, then move on
function submitAnswer(isCorrect, buttonElement, allButtonsForThisModule, answerDetails) {
    allButtonsForThisModule.forEach(function (button) {
        button.disabled = true;
    });

    buttonElement.classList.add(isCorrect ? "correct" : "wrong");

    commitAnswer(isCorrect, answerDetails);
}

// the part every module's submit function shares once its own answer
// UI has been locked/flashed: lock out further input, count the
// answer, log it for the review screen, wait for the flash to be
// visible, then move to the next question (or end the run).
//
// answerDetails is optional (module-specific submit functions build
// it right before calling commitAnswer/submitAnswer) and, when given,
// should be { yourAnswerText, correctAnswerText } - plain strings
// describing what the player picked/typed and what the right answer
// was, for the Explanations/review screen. A question's own
// `explanation` field (if the data file provides one) is read here,
// not passed in, since every module shares the same fallback text.
function commitAnswer(isCorrect, answerDetails) {
    runState.isAnswerLocked = true;

      if (isCorrect) {
        SFX.playCorrect();
    } else {
        SFX.playWrong();
    }

    const question = runState.questions[runState.currentIndex];

    const topic = question.topic;
    if (!runState.topicStats[topic]) {
        runState.topicStats[topic] = { correct: 0, total: 0 };
    }
    runState.topicStats[topic].total += 1;
    if (isCorrect) {
        runState.topicStats[topic].correct += 1;
    }

    runState.answerLog.push({
        moduleLabel: MODULE_REGISTRY[runState.moduleId].label,
        topic: topic,
        prompt: question.reviewPrompt || question.prompt,
        isCorrect: isCorrect,
        yourAnswerText: answerDetails && answerDetails.yourAnswerText
            ? answerDetails.yourAnswerText
            : "(no answer)",
        correctAnswerText: answerDetails ? answerDetails.correctAnswerText || "" : "",
        explanation: question.explanation || "No explanation was provided for this question."
    });

    if (isCorrect) {
        runState.correctCount += 1;
        renderProgress();
    } else {
        registerStrike();
    }

    // Achievements only track real (non-practice) attempts - see the
    // "Achievements" section above for why practice mode is excluded
    // entirely rather than just excluded from unlocking.
    if (!armedConfig.isPracticeMode) {
        updateAchievementStats(question, runState.moduleId, isCorrect);
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
    if (!runState || !armedConfig) {
        return; // the bomb already ended (e.g. time penalty hit 0) or the player left
    }

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

// Folds one module's per-topic correct/total counts into the
// bomb-wide tally on armedConfig, so topics seen across several
// modules in the same arm add up instead of overwriting each other.
function mergeTopicStats(source) {
    Object.keys(source).forEach(function (topic) {
        if (!armedConfig.topicStats[topic]) {
            armedConfig.topicStats[topic] = { correct: 0, total: 0 };
        }
        armedConfig.topicStats[topic].correct += source[topic].correct;
        armedConfig.topicStats[topic].total += source[topic].total;
    });
}

// Appends one module's answered questions onto the bomb-wide log, in
// the order they were answered within that module (modules themselves
// are already in whatever order the player tackled them).
function mergeAnswerLog(source) {
    armedConfig.answerLog = armedConfig.answerLog.concat(source);
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
    mergeTopicStats(runState.topicStats);
    mergeAnswerLog(runState.answerLog);

    markModuleSolved(moduleId);
    SFX.playModuleSolved();

    if (!armedConfig.isPracticeMode) {
        updateModuleAchievementStats(moduleId, runState.correctCount === runState.questions.length);
    }

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
    SFX.stopSoundtrack();
     if (isDefused) {
        SFX.playDefused();
    } else {
        SFX.playExploded();
    }
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
        mergeTopicStats(runState.topicStats);
        mergeAnswerLog(runState.answerLog);
    }

    if (!armedConfig.isPracticeMode) {
        updateBombLevelAchievementStats(isDefused, armedConfig.difficultyId, {
            strikesUsed: getAggregatedResults().strikesUsed,
            timeRemaining: armedConfig.timeRemaining,
            startingTimeSeconds: armedConfig.startingTimeSeconds
        });
    }

    const score = calculateOverallScore();

    // The attempt isn't written to history until the player presses
    // "Save Attempt" on the result screen - stash what that button
    // needs here rather than saving automatically.
    pendingSaveResult = armedConfig.isPracticeMode
        ? null
        : { isDefused: isDefused, score: score, answerLog: armedConfig.answerLog };

    renderResultScreen(isDefused, score);
    resetSaveAttemptButton();

    runState = null;

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

// Puts the "Save Attempt" button back into its default, clickable
// state whenever a fresh result screen is shown. Practice runs have
// nothing to save, so the button is hidden rather than disabled.
function resetSaveAttemptButton() {
    if (armedConfig.isPracticeMode) {
        saveAttemptButton.classList.add("hidden");
        return;
    }

    saveAttemptButton.classList.remove("hidden");
    saveAttemptButton.disabled = false;
    saveAttemptButton.textContent = "Save Attempt";
}

// Shared by the result screen's own Save Attempt button and the
// History screen's inline save button, so whichever one the player
// used, the other reflects "already saved" if they end up back there.
function markAttemptSaved() {
    saveAttemptButton.disabled = true;
    saveAttemptButton.textContent = "Saved!";
}

// ------------------- Saving progress -------------------
// Attempts are namespaced per logged-in user (or "guest"), same as
// the rest of the site's saved data.
function getHistoryStorageKey() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    return loggedInUser
        ? "bombDefusalHistory_" + loggedInUser.username
        : "bombDefusalHistory_guest";
}

function getSavedHistory() {
    const historyKey = getHistoryStorageKey();
    return JSON.parse(localStorage.getItem(historyKey)) || [];
}

// Only the 5 most recent attempts are kept, per the "past 5 attempts"
// history view - older ones fall off the end.
const MAX_HISTORY_ENTRIES = 5;

function saveRunToHistory(isDefused, score) {
    // practice runs are not saved, per the "practice mode" idea of
    // going at your own pace without pressure
    if (armedConfig.isPracticeMode) {
        return;
    }

    const historyKey = getHistoryStorageKey();
    const history = getSavedHistory();

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

    // Per-topic correct/total, e.g. { "Linked Lists": { correct: 3,
    // total: 4 } } - this is what the History screen's chart reads to
    // show which topics the player is solid on vs. still missing.
    const topicBreakdown = {};
    Object.keys(armedConfig.topicStats).forEach(function (topic) {
        topicBreakdown[topic] = {
            correct: armedConfig.topicStats[topic].correct,
            total: armedConfig.topicStats[topic].total
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
        topics: topicBreakdown,
        // The full per-question answer log, so a saved attempt can
        // still be opened on the Explanations/review screen later -
        // see buildHistoryRow()'s "Review" button.
        answerLog: armedConfig.answerLog,
        passed: isDefused,
        timestamp: new Date().toISOString()
    });

    const trimmedHistory = history.slice(-MAX_HISTORY_ENTRIES);

    localStorage.setItem(historyKey, JSON.stringify(trimmedHistory));
}

// ------------------- History screen -------------------

// If the player just finished a non-practice run and hasn't pressed
// "Save Attempt" yet, this builds a preview row for it so the History
// screen can offer to save it directly - without one, that run's data
// is only reachable from the result screen.
function buildPendingHistoryPreview() {
    if (!pendingSaveResult || !armedConfig) {
        return null;
    }

    const totals = getAggregatedResults();

    const topics = {};
    Object.keys(armedConfig.topicStats).forEach(function (topic) {
        topics[topic] = {
            correct: armedConfig.topicStats[topic].correct,
            total: armedConfig.topicStats[topic].total
        };
    });

    return {
        isPending: true,
        difficulty: armedConfig.difficultyId,
        score: pendingSaveResult.score,
        correctAnswers: totals.correctCount,
        totalQuestions: totals.totalQuestions,
        passed: pendingSaveResult.isDefused,
        topics: topics,
        answerLog: pendingSaveResult.answerLog
    };
}

function formatHistoryTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);
    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
        " " +
        date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

// Builds one <li> for the history list. Saved attempts show their
// date; the one still-pending attempt (if any) shows a Save button in
// that same spot instead, immediately to the left of where its date
// will appear once it's actually saved.
function buildHistoryRow(attempt) {
    const row = document.createElement("li");
    row.className =
        "history-row" +
        (attempt.passed ? " passed" : " failed") +
        (attempt.isPending ? " pending" : "");

    // Older saved attempts (from before this screen existed) won't
    // have an answerLog at all - only offer Review when there's
    // actually something to show.
    const reviewButtonHtml = (attempt.answerLog && attempt.answerLog.length)
        ? '<button class="history-review-button" type="button">Review</button>'
        : "";

    const actionAndDateHtml = attempt.isPending
        ? '<span class="history-row-action">' +
              '<button class="history-save-button" type="button">Save</button>' +
              reviewButtonHtml +
          "</span>" +
          '<span class="history-row-date history-row-date-pending">Not saved yet</span>'
        : '<span class="history-row-action">' + reviewButtonHtml + "</span>" +
          '<span class="history-row-date">' + formatHistoryTimestamp(attempt.timestamp) + "</span>";

    row.innerHTML =
        '<span class="history-row-status">' + (attempt.passed ? "Defused" : "Boom") + "</span>" +
        '<span class="history-row-difficulty">' + attempt.difficulty + "</span>" +
        '<span class="history-row-accuracy">' + attempt.correctAnswers + " / " + attempt.totalQuestions + "</span>" +
        '<span class="history-row-score">' + (attempt.score || 0) + " pts</span>" +
        actionAndDateHtml;

    if (attempt.isPending) {
        row.querySelector(".history-save-button").addEventListener("click", function () {
            saveRunToHistory(pendingSaveResult.isDefused, pendingSaveResult.score);
            pendingSaveResult = null;
            markAttemptSaved();
            renderHistoryScreen(); // redraw: the pending row is now a normal saved one
        });
    }

    const reviewButton = row.querySelector(".history-review-button");
    if (reviewButton) {
        reviewButton.addEventListener("click", function () {
            renderReviewScreen(attempt.answerLog, historyScreen);
            showScreen(reviewScreen);
        });
    }

    return row;
}

function renderHistoryScreen() {
    const savedHistory = getSavedHistory().slice().reverse(); // most recent first
    const pendingPreview = buildPendingHistoryPreview();
    const rows = pendingPreview ? [pendingPreview].concat(savedHistory) : savedHistory;

    historyAttemptList.innerHTML = "";
    historyTopicChart.innerHTML = "";

    if (!rows.length) {
        historyEmptyMessage.classList.remove("hidden");
        historyColumnHeader.classList.add("hidden");
        historyAttemptList.classList.add("hidden");
        historyTopicChart.classList.add("hidden");
        return;
    }

    historyEmptyMessage.classList.add("hidden");
    historyColumnHeader.classList.remove("hidden");
    historyAttemptList.classList.remove("hidden");

    rows.forEach(function (attempt) {
        historyAttemptList.appendChild(buildHistoryRow(attempt));
    });

    renderTopicChart(rows);
}

// Aggregates per-topic correct/total across every attempt currently
// shown on the History screen - up to 5 saved ones, plus the pending
// unsaved run if there is one - then draws one horizontal bar per
// topic, weakest accuracy first, so the topics most worth reviewing
// show up at the top.
function renderTopicChart(attempts) {
    const combined = {};

    attempts.forEach(function (attempt) {
        const topics = attempt.topics || {};
        Object.keys(topics).forEach(function (topic) {
            if (!combined[topic]) {
                combined[topic] = { correct: 0, total: 0 };
            }
            combined[topic].correct += topics[topic].correct;
            combined[topic].total += topics[topic].total;
        });
    });

    const topicNames = Object.keys(combined);

    if (!topicNames.length) {
        historyTopicChart.classList.add("hidden");
        return;
    }

    historyTopicChart.classList.remove("hidden");

    const rows = topicNames
        .map(function (topic) {
            const stats = combined[topic];
            const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
            return { topic: topic, stats: stats, accuracy: accuracy };
        })
        .sort(function (a, b) {
            return a.accuracy - b.accuracy; // weakest topics first
        });

    rows.forEach(function (row) {
        const percent = Math.round(row.accuracy * 100);
        const level = percent >= 80 ? "strong" : percent >= 50 ? "medium" : "weak";

        const barRow = document.createElement("div");
        barRow.className = "topic-bar-row";
        barRow.innerHTML =
            '<span class="topic-bar-label">' + row.topic + "</span>" +
            '<div class="topic-bar-track">' +
            '<div class="topic-bar-fill ' + level + '" style="width: ' + percent + '%"></div>' +
            "</div>" +
            '<span class="topic-bar-value">' + percent + "% (" + row.stats.correct + "/" + row.stats.total + ")</span>";

        historyTopicChart.appendChild(barRow);
    });
}

// ------------------- Achievements -------------------
// Cumulative, cross-attempt progress toward each entry in
// ACHIEVEMENT_REGISTRY (achievements-data.js). Deliberately separate
// from History's localStorage entry: History only keeps the most
// recent 5 attempts (MAX_HISTORY_ENTRIES), but achievement progress
// has to survive forever, so it gets its own key and its own
// incremental-update model instead of being derived from History.
//
// Practice-mode runs never call into any of this - see the
// `!armedConfig.isPracticeMode` guards at each call site
// (commitAnswer() and finishBomb()) - so nothing here needs its own
// practice-mode check.

// Namespaced per logged-in user (or guest), same pattern as
// getHistoryStorageKey().
function getAchievementsStorageKey() {
    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser") || "null"
    );

    return loggedInUser
        ? "bombDefusalAchievements_" + loggedInUser.username
        : "bombDefusalAchievements_guest";
}

// The persisted shape matches the `progress` object described at the
// top of achievements-data.js. Missing/corrupt storage just starts
// fresh rather than throwing.
function pushUnique(list, value) {
    if (list.indexOf(value) === -1) {
        list.push(value);
    }
}

function loadAchievementProgress() {
    const raw = localStorage.getItem(getAchievementsStorageKey());
    let saved = null;

    try {
        saved = raw ? JSON.parse(raw) : null;
    } catch (e) {
        saved = null;
    }

    const defusedDifficulties = (saved && saved.defusedDifficulties) || [];
    if (saved && saved.hasDefusedExpertBomb) {
        pushUnique(defusedDifficulties, "expert"); // old save format
    }

    return {
        categoryStats: (saved && saved.categoryStats) || {},
        completedQuestionKeys: (saved && saved.completedQuestionKeys) || [],
        unlockedAchievementIds: (saved && saved.unlockedAchievementIds) || [],
        defusedDifficulties: defusedDifficulties,
        flawlessDifficulties: (saved && saved.flawlessDifficulties) || [],
        fastDifficulties: (saved && saved.fastDifficulties) || [],
        explodedDifficulties: (saved && saved.explodedDifficulties) || [],
        perfectModules: (saved && saved.perfectModules) || [],
        bombsDefused: (saved && saved.bombsDefused) || 0,
        bombsExploded: (saved && saved.bombsExploded) || 0,
        bestStreak: (saved && saved.bestStreak) || 0,
        hadPhotoFinish: !!(saved && saved.hadPhotoFinish),
        hasDefusedAfterExploding: !!(saved && saved.hasDefusedAfterExploding)
    };
}

function saveAchievementProgress(progress) {
    localStorage.setItem(getAchievementsStorageKey(), JSON.stringify(progress));
}

// Every question, from every module's question bank, tagged by its
// `category` field (stack/queue/linkedList/tree/hash/graph/sorting/
// array - see achievements-data.js's header comment). This is the
// denominator for "complete every X question" achievements like
// Pointer Technician and Tree Navigator - built once by walking
// MODULE_REGISTRY rather than hand-maintained, so it stays correct
// automatically as questions are added to any bank.
//
// A question's tracking key is "moduleId:questionId" rather than just
// its own id, since ids are only guaranteed unique within a single
// bank, not across all five.
let questionCatalogByCategory = null;

// Normalizes a question's `category` field to an array, so data files
// can write either a single string (category: "stack") or several
// (category: ["stack", "queue"]) for a question that genuinely spans
// more than one structure - e.g. a Connect-the-Dots round whose pairs
// mix a stack operation with a queue operation. Unknown/invalid
// category names are silently dropped rather than throwing, so a typo
// in a data file just means that tag doesn't count toward anything.
function getQuestionCategories(question) {
    const raw = question.category;
    if (!raw) {
        return [];
    }

    const list = Array.isArray(raw) ? raw : [raw];
    return list.filter(function (category) {
        return CATEGORY_NAMES.indexOf(category) !== -1;
    });
}

const CATEGORY_NAMES = [
    "stack", "queue", "linkedList", "tree", "hash", "graph", "sorting", "array"
];

function buildQuestionCatalog() {
    const catalog = {
        stack: [], queue: [], linkedList: [], tree: [],
        hash: [], graph: [], sorting: [], array: []
    };

    Object.keys(MODULE_REGISTRY).forEach(function (moduleId) {
        const bank = MODULE_REGISTRY[moduleId].questionBank;

        bank.questions.forEach(function (question) {
            const key = moduleId + ":" + question.id;

            // A multi-category question (e.g. category: ["stack",
            // "queue"]) is added to every one of its categories'
            // catalogs, since "complete all linked-list questions"
            // should count it whether linkedList is its only tag or
            // one of several.
            getQuestionCategories(question).forEach(function (category) {
                catalog[category].push(key);
            });
        });
    });

    return catalog;
}

function getQuestionCatalog() {
    if (!questionCatalogByCategory) {
        questionCatalogByCategory = buildQuestionCatalog();
    }
    return questionCatalogByCategory;
}

// Called from commitAnswer() for every answered question outside
// practice mode. Updates the running correct/total count for every
// category the question is tagged with - a question tagged with more
// than one category (e.g. a Connect-the-Dots round mixing a stack
// pair and a queue pair) counts toward each of them, since answering
// it correctly genuinely demonstrates both. On a correct answer, the
// question is also marked completed once (a single "moduleId:id" key
// works across every one of its categories - see buildQuestionCatalog()).
let answerStreak = 0; // in-memory, per bomb
function resetAnswerStreak() { answerStreak = 0; }

function updateAchievementStats(question, moduleId, isCorrect) {
    const progress = loadAchievementProgress();

    answerStreak = isCorrect ? answerStreak + 1 : 0;
    progress.bestStreak = Math.max(progress.bestStreak, answerStreak);
    const categories = getQuestionCategories(question);

    categories.forEach(function (category) {
        if (!progress.categoryStats[category]) {
            progress.categoryStats[category] = { correct: 0, total: 0 };
        }
        progress.categoryStats[category].total += 1;
        if (isCorrect) {
            progress.categoryStats[category].correct += 1;
        }
    });

    if (isCorrect && categories.length) {
        const key = moduleId + ":" + question.id;
        if (progress.completedQuestionKeys.indexOf(key) === -1) {
            progress.completedQuestionKeys.push(key);
        }
    }

    saveAchievementProgress(progress);
    checkAchievements(progress);
}

// Called from finishBomb() outside practice mode. Only Master Defuser
// currently depends on the bomb's overall outcome rather than a
// per-question stat, but this is the natural place for any future
// achievement like it (e.g. a full-bomb no-strikes run).
function updateBombLevelAchievementStats(isDefused, difficultyId, details) {
    const progress = loadAchievementProgress();

    if (isDefused) {
        progress.bombsDefused += 1;
        pushUnique(progress.defusedDifficulties, difficultyId);

        if (details.strikesUsed === 0) {
            pushUnique(progress.flawlessDifficulties, difficultyId);
        }
        if (details.timeRemaining / details.startingTimeSeconds >= ACH_FAST_FRACTION) {
            pushUnique(progress.fastDifficulties, difficultyId);
        }
        if (details.timeRemaining > 0 && details.timeRemaining <= ACH_PHOTO_FINISH_SECONDS) {
            progress.hadPhotoFinish = true;
        }
        if (progress.explodedDifficulties.indexOf(difficultyId) !== -1) {
            progress.hasDefusedAfterExploding = true;
        }
    } else {
        progress.bombsExploded += 1;
        pushUnique(progress.explodedDifficulties, difficultyId);
    }

    saveAchievementProgress(progress);
    checkAchievements(progress);
}

function updateModuleAchievementStats(moduleId, wasPerfect) {
    if (!wasPerfect) {
        return;
    }
    const progress = loadAchievementProgress();
    pushUnique(progress.perfectModules, moduleId);
    saveAchievementProgress(progress);
    checkAchievements(progress);
}

// Runs every achievement's check() against the current progress
// snapshot, saves any newly-crossed unlocks, and pops a toast for
// each one - so an achievement is only ever announced once, the
// moment it first becomes true, not every time this function re-runs.
function checkAchievements(progress) {
    const catalog = getQuestionCatalog();
    let didUnlockSomething = false;

    Object.keys(ACHIEVEMENT_REGISTRY).forEach(function (achievementId) {
        if (progress.unlockedAchievementIds.indexOf(achievementId) !== -1) {
            return; // already unlocked previously
        }

        const achievement = ACHIEVEMENT_REGISTRY[achievementId];
        if (achievement.isAvailable && !achievement.isAvailable(progress, catalog)) {
            return;
        }
        if (achievement.check(progress, catalog)) {
            progress.unlockedAchievementIds.push(achievementId);
            didUnlockSomething = true;
            showAchievementToast(achievement);
        }
    });

    if (didUnlockSomething) {
        saveAchievementProgress(progress);
    }
}

// Brief on-screen banner when an achievement unlocks mid-run, reusing
// the same pulsing-green "cell-hint" visual language as the bomb
// overview's "Tap to defuse" labels. Auto-hides itself; a second
// unlock arriving while one is still showing just restarts the timer
// with the new label rather than queuing a stack of banners.
let achievementToastTimeoutId = null;

function showAchievementToast(achievement) {
    achievementToastLabel.textContent = "Achievement unlocked: " + achievement.label;
    achievementToast.classList.remove("hidden");
    achievementToast.classList.remove("achievement-toast-visible");
    void achievementToast.offsetWidth; // restart the CSS transition
    achievementToast.classList.add("achievement-toast-visible");

    SFX.playModuleSolved();

    if (achievementToastTimeoutId) {
        clearTimeout(achievementToastTimeoutId);
    }
    achievementToastTimeoutId = setTimeout(function () {
        achievementToast.classList.remove("achievement-toast-visible");
    }, 3200);
}

// Builds one row per registered achievement: unlocked ones show a
// green "Unlocked" state, locked ones show their progress text (e.g.
// "7 / 10 attempted") from the achievement's own getProgressText().
function renderAchievementsScreen() {
    const progress = loadAchievementProgress();
    const catalog = getQuestionCatalog();

    achievementList.innerHTML = "";

    const idsByGroup = {};
    const groupOrder = [];

    Object.keys(ACHIEVEMENT_REGISTRY).forEach(function (achievementId) {
        const achievement = ACHIEVEMENT_REGISTRY[achievementId];
        if (achievement.isAvailable && !achievement.isAvailable(progress, catalog)) {
            return;
        }
        const groupName = achievement.group || "Other";
        if (!idsByGroup[groupName]) {
            idsByGroup[groupName] = [];
            groupOrder.push(groupName);
        }
        idsByGroup[groupName].push(achievementId);
    });

    groupOrder.forEach(function (groupName) {
        const ids = idsByGroup[groupName];
        const unlockedCount = ids.filter(function (id) {
            return progress.unlockedAchievementIds.indexOf(id) !== -1;
        }).length;

        const heading = document.createElement("h3");
        heading.className = "section-heading";
        heading.textContent = groupName + " \u00B7 " + unlockedCount + " / " + ids.length;
        achievementList.appendChild(heading);

        ids.forEach(function (achievementId) {
            const achievement = ACHIEVEMENT_REGISTRY[achievementId];
            const isUnlocked = progress.unlockedAchievementIds.indexOf(achievementId) !== -1;

            const card = document.createElement("div");
            card.className = "achievement-card" + (isUnlocked ? " achievement-unlocked" : " achievement-locked");

            const statusText = isUnlocked
                ? "Unlocked"
                : achievement.getProgressText(progress, catalog);

            card.innerHTML =
                '<p class="achievement-card-label">' + achievement.label + "</p>" +
                '<p class="achievement-card-description">' + achievement.description + "</p>" +
                '<p class="achievement-card-status">' + statusText + "</p>";

            achievementList.appendChild(card);
        });
    });
}

openAchievementsButton.addEventListener("click", function () {
    renderAchievementsScreen();
    showScreen(achievementsScreen);
});

openAchievementsButtonSetup.addEventListener("click", function () {
    renderAchievementsScreen();
    showScreen(achievementsScreen);
});

const cameFromProfile =
    new URLSearchParams(window.location.search).get("view") === "achievements";

if (cameFromProfile) {
    backToOverviewFromAchievements.textContent = "\u2190 Back to Profile";
}

backToOverviewFromAchievements.addEventListener("click", function () {
    if (cameFromProfile && !armedConfig) {
        window.location.href = "profile.html";
        return;
    }
    showScreen(armedConfig ? overviewScreen : setupScreen);
});

// ------------------- Review screen (answer explanations) -------------------
// answerLog is an array of { moduleLabel, topic, prompt, isCorrect,
// yourAnswerText, correctAnswerText, explanation } entries - either
// the just-finished run's armedConfig.answerLog, or a saved attempt's
// own answerLog pulled out of localStorage. returnScreen is which
// screen element the Back button on this screen should go back to.
function renderReviewScreen(answerLog, returnScreen) {
    reviewReturnScreen = returnScreen;
    reviewQuestionList.innerHTML = "";

    if (!answerLog || !answerLog.length) {
        reviewQuestionList.innerHTML =
            '<p class="review-empty-message">No question details were saved for this attempt.</p>';
        return;
    }

    answerLog.forEach(function (entry, index) {
        const card = document.createElement("div");
        card.className = "review-card " + (entry.isCorrect ? "review-card-correct" : "review-card-wrong");

        const correctAnswerRow = entry.isCorrect
            ? ""
            : '<p class="review-card-answer-row"><span class="review-card-answer-label">Correct answer:</span> ' +
              entry.correctAnswerText + "</p>";

        card.innerHTML =
            '<p class="review-card-module">' + entry.moduleLabel + " \u00B7 " + entry.topic + "</p>" +
            '<p class="review-card-prompt">' + (index + 1) + ". " + entry.prompt + "</p>" +
            '<p class="review-card-answer-row"><span class="review-card-answer-label">Your answer:</span> ' +
            entry.yourAnswerText + "</p>" +
            correctAnswerRow +
            '<p class="review-card-explanation">' + entry.explanation + "</p>";

        reviewQuestionList.appendChild(card);
    });
}

viewExplanationsFromResultButton.addEventListener("click", function () {
    renderReviewScreen(armedConfig.answerLog, resultScreen);
    showScreen(reviewScreen);
});

backFromReview.addEventListener("click", function () {
    showScreen(reviewReturnScreen || (armedConfig ? overviewScreen : setupScreen));
});

// ------------------- Screen switching -------------------
// Grabs every element with class "screen" (overview, setup, result,
// and every module's own game screen), so a future module's screen
// is handled automatically as long as it has that class.
function showScreen(screenToShow) {
    // drop focus from the hidden answer inputs so the phone keyboard
    // closes when leaving a module (or the run ending)
    module2TextInput.blur();
    module4TextInput.blur();

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

saveAttemptButton.addEventListener("click", function () {
    if (!pendingSaveResult) {
        return; // already saved, or nothing to save (practice mode)
    }

    saveRunToHistory(pendingSaveResult.isDefused, pendingSaveResult.score);
    pendingSaveResult = null;
    markAttemptSaved();
});

function openHistoryScreen(returnScreen) {
    historyReturnScreen = returnScreen;

    backToOverviewFromHistory.textContent =
        returnScreen === resultScreen ? "\u2190 Back to Results"
        : returnScreen === setupScreen ? "\u2190 Back to Setup"
        : "\u2190 Back to Bomb Overview";

    renderHistoryScreen();
    showScreen(historyScreen);
}

viewHistoryFromResultButton.addEventListener("click", function () {
    openHistoryScreen(resultScreen);
});

openHistoryButton.addEventListener("click", function () {
    openHistoryScreen(overviewScreen);
});

openHistoryButtonSetup.addEventListener("click", function () {
    openHistoryScreen(setupScreen);
});

backToOverviewFromHistory.addEventListener("click", function () {
    showScreen(historyReturnScreen || (armedConfig ? overviewScreen : setupScreen));
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
        // Ignore Back during the short pause after an answer: that answer is
        // already counted and the move to the next question is still pending.
        if (!runState || runState.isAnswerLocked) {
            return;
        }

        // Park the run so re-entering resumes it (strikes included)
        armedConfig.suspendedRuns[runState.moduleId] = runState;
        runState = null;

        const hint = moduleConfig.slot.querySelector(".cell-hint");
        if (hint) {
            hint.textContent = "Tap to resume";
        }

        showScreen(overviewScreen);
    });
});

// ------------------- Deep link: profile page -> Achievements -------------------
// profile.html links to defusal.html?view=achievements. The Achievements
// screen is just a section on this page, so open it directly if that
// param is present. Must run last, after every element/function above
// is defined and after the setup screen is the default visible screen.
if (new URLSearchParams(window.location.search).get("view") === "achievements") {
    renderAchievementsScreen();
    showScreen(achievementsScreen);
}