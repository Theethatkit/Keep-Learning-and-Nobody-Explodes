// ===================================================================
// Bomb Defusal - shared shell + Identify (MC / True-False)
//                                + Operate (Fill in the Blanks)
//                                + Trace (Connect the Dots)
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
const module2QuestionTopic = document.getElementById("module2QuestionTopic");
const module2QuestionPrompt = document.getElementById("module2QuestionPrompt");
const module2AnswerDisplay = document.getElementById("module2AnswerDisplay");

// ------------------- Module 4 (Analyze) elements -------------------
// Same keypad-driven input pattern as Module 2, but scoped to its own
// screen/keys (".analyze-keypad-key" instead of ".module2-keypad-key")
// so the two modules' keydown/click handling never cross-fires, and
// with a trace list in place of Module 2's plain prompt text, since
// what the player needs to read here is a short sequence of
// operations rather than a single fill-in-the-blank sentence.
const analyzeKeypadKeys = document.querySelectorAll(".analyze-keypad-key");
const analyzeQuestionTopic = document.getElementById("analyzeQuestionTopic");
const analyzeTraceList = document.getElementById("analyzeTraceList");
const analyzeQuestionPrompt = document.getElementById("analyzeQuestionPrompt");
const analyzeAnswerDisplay = document.getElementById("analyzeAnswerDisplay");

// ------------------- Module 3 (Connect the Dots) elements -------------------
const module3QuestionTopic = document.getElementById("module3QuestionTopic");
const module3QuestionPrompt = document.getElementById("module3QuestionPrompt");
const module3ConnectBoard = document.getElementById("module3ConnectBoard");
const module3TermsColumn = document.getElementById("module3TermsColumn");
const module3DefinitionsColumn = document.getElementById("module3DefinitionsColumn");
const module3ConnectLinesSvg = document.getElementById("module3ConnectLinesSvg");
const module3CheckButton = document.getElementById("module3CheckButton");

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

const identifyModuleWidgets = createIdentifyStyleModule("identify", "identifyGameScreen");

// ------------------- Module registry -------------------
// Every playable module plugs in here: its own screen/DOM elements,
// its own question bank, and the two functions that know how to draw
// a question and reset its answer buttons. Everything else (timer,
// strikes, progress, scoring, screen switching) is shared.
const MODULE_REGISTRY = {
    identify: {
        moduleName: "module1-identify",
        label: "Module 1: Identify",
        slot: document.getElementById("moduleIdentifySlot"),
        screen: document.getElementById("identifyGameScreen"),
        bombShell: document.getElementById("identifyBombShell"),
        timerDisplay: document.getElementById("identifyTimerDisplay"),
        strikesDisplay: document.getElementById("identifyStrikesDisplay"),
        progressDisplay: document.getElementById("identifyProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromIdentify"),
        questionBank: IDENTIFY_QUESTION_BANK,
        renderQuestion: identifyModuleWidgets.renderQuestion,
        resetInputs: identifyModuleWidgets.resetInputs
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
        moduleName: "module3-connectTheDots",
        label: "Module 3: Connect the Dots",
        slot: document.getElementById("module3Slot"),
        screen: document.getElementById("module3GameScreen"),
        bombShell: document.getElementById("module3BombShell"),
        timerDisplay: document.getElementById("module3TimerDisplay"),
        strikesDisplay: document.getElementById("module3StrikesDisplay"),
        progressDisplay: document.getElementById("module3ProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromModule3"),
        questionBank: MODULE3_QUESTION_BANK,
        renderQuestion: renderConnectQuestion,
        resetInputs: resetConnectInputs
    },
    analyze: {
        moduleName: "module4-analyze",
        label: "Module 4: Analyze",
        slot: document.getElementById("moduleAnalyzeSlot"),
        screen: document.getElementById("analyzeGameScreen"),
        bombShell: document.getElementById("analyzeBombShell"),
        timerDisplay: document.getElementById("analyzeTimerDisplay"),
        strikesDisplay: document.getElementById("analyzeStrikesDisplay"),
        progressDisplay: document.getElementById("analyzeProgressDisplay"),
        backButton: document.getElementById("backToOverviewFromAnalyze"),
        questionBank: ANALYZE_QUESTION_BANK,
        renderQuestion: renderAnalyzeQuestion,
        resetInputs: resetAnalyzeInputs
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
        isAnswerLocked: false,
        topicStats: {},
        answerLog: []
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
        : "type your answer...";

    module2AnswerDisplay.classList.toggle("answer-display-placeholder", !hasTyped);
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

function renderAnalyzeQuestion(question) {
    analyzeQuestionTopic.textContent = question.topic;
    analyzeQuestionPrompt.textContent = question.prompt;

    analyzeTraceList.innerHTML = "";
    question.operations.forEach(function (operationLine) {
        const line = document.createElement("li");
        line.classList.add("trace-line");
        line.textContent = operationLine;
        analyzeTraceList.appendChild(line);
    });
}

function resetAnalyzeInputs() {
    module4TypedAnswer = "";
    renderAnalyzeAnswerDisplay();

    analyzeKeypadKeys.forEach(function (key) {
        key.disabled = false;
    });

    analyzeAnswerDisplay.classList.remove("correct", "wrong");
}

function renderAnalyzeAnswerDisplay() {
    const hasTyped = module4TypedAnswer.length > 0;

    analyzeAnswerDisplay.textContent = hasTyped
        ? module4TypedAnswer
        : "type the result...";

    analyzeAnswerDisplay.classList.toggle("answer-display-placeholder", !hasTyped);
}

// ----- Module 3 (Connect the Dots) rendering -----
// Unlike the button-based modules, the "answer buttons" here are
// rebuilt fresh every question (the number of terms/definitions
// varies with the round), so clicks are handled with delegated
// listeners on the two columns rather than a fixed NodeList.
//
// module3Pairings maps a term's pair id to whichever definition's
// pair id it's currently connected to. Since a term and its correct
// definition share the same underlying pair id, a connection is
// correct exactly when module3Pairings[pairId] === pairId.
let module3Pairings = {};
let module3ActiveTermId = null;

function renderConnectQuestion(question) {
    module3QuestionTopic.textContent = question.topic;
    module3QuestionPrompt.textContent = question.prompt;

    const shuffledPairsForDefinitions = question.pairs.slice().sort(function () {
        return Math.random() - 0.5;
    });

    module3TermsColumn.innerHTML = "";
    question.pairs.forEach(function (pair, index) {
        module3TermsColumn.appendChild(
            buildConnectNode("term", pair.id, pair.term, String(index + 1))
        );
    });

    module3DefinitionsColumn.innerHTML = "";
    shuffledPairsForDefinitions.forEach(function (pair, index) {
        const badgeLetter = String.fromCharCode(65 + index); // A, B, C...
        module3DefinitionsColumn.appendChild(
            buildConnectNode("definition", pair.id, pair.definition, badgeLetter)
        );
    });
}

function buildConnectNode(kind, pairId, labelText, badgeText) {
    const node = document.createElement("button");
    node.type = "button";
    node.classList.add("connect-node", "connect-" + kind);

    if (kind === "term") {
        node.dataset.termId = pairId;
    } else {
        node.dataset.definitionId = pairId;
    }

    const badge = document.createElement("span");
    badge.classList.add("connect-node-badge");
    badge.textContent = badgeText;

    const label = document.createElement("span");
    label.classList.add("connect-node-label");
    label.textContent = labelText;

    const dot = document.createElement("span");
    dot.classList.add("connect-dot-marker");

    node.appendChild(badge);
    node.appendChild(label);
    node.appendChild(dot);

    return node;
}

function resetConnectInputs() {
    module3Pairings = {};
    module3ActiveTermId = null;

    module3ConnectBoard.classList.remove("connect-board-locked");
    module3CheckButton.disabled = false;

    redrawConnectLines();
}

// A term click arms/disarms it as "waiting for a definition". A
// definition click, while a term is armed, connects the two (bumping
// off any previous connection either one had) and disarms.
module3TermsColumn.addEventListener("click", function (event) {
    if (!runState || runState.moduleId !== "module3" || runState.isAnswerLocked) {
        return;
    }

    const node = event.target.closest(".connect-term");
    if (!node) {
        return;
    }

    const termId = node.dataset.termId;
    module3ActiveTermId = module3ActiveTermId === termId ? null : termId;

    updateConnectSelectionVisuals();
});

module3DefinitionsColumn.addEventListener("click", function (event) {
    if (!runState || runState.moduleId !== "module3" || runState.isAnswerLocked) {
        return;
    }

    const node = event.target.closest(".connect-definition");
    if (!node || !module3ActiveTermId) {
        return;
    }

    const definitionId = node.dataset.definitionId;

    // a definition can only be used once - stealing it from whatever
    // term it was previously connected to
    Object.keys(module3Pairings).forEach(function (existingTermId) {
        if (module3Pairings[existingTermId] === definitionId) {
            delete module3Pairings[existingTermId];
        }
    });

    module3Pairings[module3ActiveTermId] = definitionId;
    module3ActiveTermId = null;

    updateConnectSelectionVisuals();
    redrawConnectLines();
});

module3CheckButton.addEventListener("click", function () {
    if (!runState || runState.moduleId !== "module3" || runState.isAnswerLocked) {
        return;
    }

    runState.isAnswerLocked = true;
    submitConnectAnswer();
});

// Reflects "armed" (active) and "already connected" (paired) states -
// purely cosmetic, no correct/wrong judgement until Check is pressed.
function updateConnectSelectionVisuals() {
    module3TermsColumn.querySelectorAll(".connect-term").forEach(function (node) {
        const termId = node.dataset.termId;
        node.classList.toggle("active", termId === module3ActiveTermId);
        node.classList.toggle("paired", !!module3Pairings[termId]);
    });

    const connectedDefinitionIds = Object.keys(module3Pairings).map(function (termId) {
        return module3Pairings[termId];
    });

    module3DefinitionsColumn.querySelectorAll(".connect-definition").forEach(function (node) {
        node.classList.toggle(
            "paired",
            connectedDefinitionIds.indexOf(node.dataset.definitionId) !== -1
        );
    });
}

// Draws one line per current pairing, from the term's dot marker to
// its connected definition's dot marker, in coordinates relative to
// the connect-board container (so it still lines up if the board
// scrolls or the window resizes).
function redrawConnectLines() {
    module3ConnectLinesSvg.innerHTML = "";

    if (!runState || runState.moduleId !== "module3") {
        return;
    }

    const boardRect = module3ConnectBoard.getBoundingClientRect();

    Object.keys(module3Pairings).forEach(function (termId) {
        const definitionId = module3Pairings[termId];

        const termDot = module3TermsColumn.querySelector(
            '.connect-term[data-term-id="' + termId + '"] .connect-dot-marker'
        );
        const definitionDot = module3DefinitionsColumn.querySelector(
            '.connect-definition[data-definition-id="' + definitionId + '"] .connect-dot-marker'
        );

        if (!termDot || !definitionDot) {
            return;
        }

        const line = drawConnectLine(termDot, definitionDot, boardRect);
        line.dataset.termId = termId;
        line.dataset.definitionId = definitionId;
        module3ConnectLinesSvg.appendChild(line);
    });
}

function drawConnectLine(fromDotEl, toDotEl, boardRect) {
    const fromRect = fromDotEl.getBoundingClientRect();
    const toRect = toDotEl.getBoundingClientRect();

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList.add("connect-line");
    line.setAttribute("x1", fromRect.left + fromRect.width / 2 - boardRect.left);
    line.setAttribute("y1", fromRect.top + fromRect.height / 2 - boardRect.top);
    line.setAttribute("x2", toRect.left + toRect.width / 2 - boardRect.left);
    line.setAttribute("y2", toRect.top + toRect.height / 2 - boardRect.top);

    return line;
}

// Redraw on resize too, so lines stay anchored to their dots if the
// layout reflows (e.g. rotating a phone) while a round is active.
window.addEventListener("resize", function () {
    redrawConnectLines();
});

// Checks every pair at once: correct only if the term ended up
// connected to the definition sharing its own pair id. Colors every
// node (and line) green/red for feedback, then hands off to the
// shared commitAnswer() just like every other module.
function submitConnectAnswer() {
    const question = runState.questions[runState.currentIndex];

    const isCorrect = question.pairs.every(function (pair) {
        return module3Pairings[pair.id] === pair.id;
    });

    module3ConnectBoard.classList.add("connect-board-locked");
    module3CheckButton.disabled = true;

    question.pairs.forEach(function (pair) {
        const connectedDefinitionId = module3Pairings[pair.id];
        const wasConnectedCorrectly = connectedDefinitionId === pair.id;
        const feedbackClass = wasConnectedCorrectly ? "correct" : "wrong";

        const termNode = module3TermsColumn.querySelector(
            '.connect-term[data-term-id="' + pair.id + '"]'
        );
        if (termNode) {
            termNode.classList.add(feedbackClass);
        }

        if (connectedDefinitionId) {
            const definitionNode = module3DefinitionsColumn.querySelector(
                '.connect-definition[data-definition-id="' + connectedDefinitionId + '"]'
            );
            if (definitionNode) {
                definitionNode.classList.add(feedbackClass);
            }
        }
    });

    module3ConnectLinesSvg.querySelectorAll(".connect-line").forEach(function (line) {
        const wasConnectedCorrectly = line.dataset.termId === line.dataset.definitionId;
        line.classList.add(wasConnectedCorrectly ? "correct" : "wrong");
    });

    // Multiple pairs per question, so the "answer" is a summary line
    // per term rather than one value - each term with whatever
    // definition the player connected it to (or "(unanswered)").
    const yourAnswerText = question.pairs.map(function (pair) {
        const connectedDefinitionId = module3Pairings[pair.id];
        const connectedPair = question.pairs.find(function (candidate) {
            return candidate.id === connectedDefinitionId;
        });
        return pair.term + " \u2192 " + (connectedPair ? connectedPair.definition : "(unanswered)");
    }).join("; ");

    const correctAnswerText = question.pairs.map(function (pair) {
        return pair.term + " \u2192 " + pair.definition;
    }).join("; ");

    commitAnswer(isCorrect, {
        yourAnswerText: yourAnswerText,
        correctAnswerText: correctAnswerText
    });
}

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
// identifyModuleWidgets. Analyze's keypad handlers are wired up in
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
analyzeKeypadKeys.forEach(function (key) {
    key.addEventListener("click", function () {
        if (!runState || runState.moduleId !== "analyze" || runState.isAnswerLocked) {
            return;
        }

        const action = key.dataset.action;

        if (action === "backspace") {
            backspaceAnalyzeAnswer();
            return;
        }

        if (action === "submit") {
            submitAnalyzeAnswer();
            return;
        }

        // a regular letter/digit key
        typeAnalyzeCharacter(key.dataset.letter);
    });
});

document.addEventListener("keydown", function (event) {
    if (!runState || runState.moduleId !== "analyze" || runState.isAnswerLocked) {
        return;
    }

    if (event.key === "Enter") {
        event.preventDefault();
        submitAnalyzeAnswer();
        return;
    }

    if (event.key === "Backspace") {
        event.preventDefault();
        backspaceAnalyzeAnswer();
        return;
    }

    if (/^[a-zA-Z0-9]$/.test(event.key)) {
        typeAnalyzeCharacter(event.key);
    }
});

function typeAnalyzeCharacter(character) {
    module4TypedAnswer += character.toLowerCase();
    renderAnalyzeAnswerDisplay();
}

function backspaceAnalyzeAnswer() {
    module4TypedAnswer = module4TypedAnswer.slice(0, -1);
    renderAnalyzeAnswerDisplay();
}

function submitAnalyzeAnswer() {
    const question = runState.questions[runState.currentIndex];
    const isCorrect =
        module4TypedAnswer.trim().toLowerCase() === question.answer.toLowerCase();

    analyzeKeypadKeys.forEach(function (key) {
        key.disabled = true;
    });

    analyzeAnswerDisplay.classList.add(isCorrect ? "correct" : "wrong");

    if (!module4TypedAnswer.trim().length) {
        analyzeAnswerDisplay.textContent = "(no answer)";
        analyzeAnswerDisplay.classList.remove("answer-display-placeholder");
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
        prompt: question.prompt,
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

    const score = calculateOverallScore();

    // The attempt isn't written to history until the player presses
    // "Save Attempt" on the result screen - stash what that button
    // needs here rather than saving automatically.
    pendingSaveResult = armedConfig.isPracticeMode
        ? null
        : { isDefused: isDefused, score: score, answerLog: armedConfig.answerLog };

    renderResultScreen(isDefused, score);
    resetSaveAttemptButton();

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

viewHistoryFromResultButton.addEventListener("click", function () {
    renderHistoryScreen();
    showScreen(historyScreen);
});

openHistoryButton.addEventListener("click", function () {
    renderHistoryScreen();
    showScreen(historyScreen);
});

openHistoryButtonSetup.addEventListener("click", function () {
    renderHistoryScreen();
    showScreen(historyScreen);
});

backToOverviewFromHistory.addEventListener("click", function () {
    // No bomb armed yet (came here from the setup screen) - go back
    // there instead of to an overview with nothing armed on it.
    showScreen(armedConfig ? overviewScreen : setupScreen);
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