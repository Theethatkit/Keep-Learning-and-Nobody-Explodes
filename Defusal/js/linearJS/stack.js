document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const LESSON_ID = "stack";
    const CAPACITY = 7;
    const initialStack = [10, 20, 30];

    let stack = [...initialStack];

    /* ================= Authentication ================= */

    try {
        if (localStorage.getItem("loggedInUser")) {
            $("authButton").textContent = "Profile";
            $("authButton").href = "../profile.html";
        }
    } catch (error) {
        console.warn("Login state could not be read.", error);
    }

    /* ================= Stack Display ================= */

    function displayStack(highlightTop = false) {
        const container = $("stackContainer");

        container.replaceChildren();

        if (stack.length === 0) {
            const empty = document.createElement("p");

            empty.className = "empty-stack";
            empty.textContent = "Empty Stack";

            container.append(empty);
        } else {
            for (
                let index = stack.length - 1;
                index >= 0;
                index--
            ) {
                const node = document.createElement("div");

                node.className = "stack-node";
                node.textContent = stack[index];

                if (
                    highlightTop &&
                    index === stack.length - 1
                ) {
                    node.classList.add("selected");
                }

                container.append(node);
            }
        }

        const topIndex = stack.length - 1;
        const topValue =
            stack.length > 0
                ? stack[topIndex]
                : "none";

        $("stackState").textContent =
            `Size: ${stack.length}/${CAPACITY} · ` +
            `Top index: ${topIndex} · ` +
            `Top value: ${topValue} · ` +
            `isEmpty: ${stack.length === 0} · ` +
            `isFull: ${stack.length === CAPACITY}`;
    }

    /* ================= Messages ================= */

    function showResult(message, type = "") {
        const result = $("visualizationResult");

        result.textContent = message;
        result.className = "visualization-result";

        if (type === "success") {
            result.classList.add("result-success");
        }

        if (type === "error") {
            result.classList.add("result-error");
        }
    }

    function addHistory(message) {
        const item = document.createElement("li");

        item.textContent = message;
        $("operationHistory").prepend(item);

        if ($("operationHistory").children.length > 12) {
            $("operationHistory").lastElementChild.remove();
        }
    }

    function report(message, type = "") {
        showResult(message, type);
        addHistory(message);
        displayStack(type === "success");
    }

    /* ================= Validation ================= */

    function getValue() {
        const raw = $("valueInput").value.trim();
        const value = Number(raw);

        if (
            raw === "" ||
            !Number.isInteger(value) ||
            value < -999 ||
            value > 999
        ) {
            $("valueInput").focus();

            throw new Error(
                "Enter a whole number from −999 to 999."
            );
        }

        return value;
    }

    /* ================= Operations ================= */

    function pushElement() {
        if (stack.length === CAPACITY) {
            report(
                `Overflow: capacity ${CAPACITY} is full. ` +
                "Pop an item before pushing. No data changed.",
                "error"
            );

            return;
        }

        const value = getValue();
        const oldTop =
            stack.length > 0
                ? stack[stack.length - 1]
                : "none";

        stack.push(value);

        report(
            `Push(${value}): ${value} became the new Top. ` +
            `Previous Top: ${oldTop}. Size is now ${stack.length}.`,
            "success"
        );

        $("valueInput").value = "";
        $("valueInput").focus();
    }

    function popElement() {
        if (stack.length === 0) {
            report(
                "Underflow: the stack is empty. " +
                "There is no Top value to remove.",
                "error"
            );

            return;
        }

        const removed = stack.pop();
        const newTop =
            stack.length > 0
                ? stack[stack.length - 1]
                : "none";

        report(
            `Pop() returned ${removed}. ` +
            `New Top: ${newTop}. Size is now ${stack.length}.`,
            "success"
        );
    }

    function peekElement() {
        if (stack.length === 0) {
            report(
                "Peek is unavailable because the stack is empty.",
                "error"
            );

            return;
        }

        const top = stack[stack.length - 1];

        report(
            `Peek() returned ${top}. ` +
            `The value was not removed; Size remains ${stack.length}.`,
            "success"
        );
    }

    function checkIsEmpty() {
        const empty = stack.length === 0;

        report(
            `isEmpty() returned ${empty}. ` +
            `The stack contains ${stack.length} element(s).`,
            "success"
        );
    }

    function checkIsFull() {
        const full = stack.length === CAPACITY;

        report(
            `isFull() returned ${full}. ` +
            `${CAPACITY - stack.length} slot(s) remain.`,
            "success"
        );
    }

    function resetStack() {
        stack = [...initialStack];

        $("valueInput").value = "";
        $("operationHistory").replaceChildren();

        addHistory(
            "Initial stack: bottom [10, 20, 30] top."
        );

        displayStack();

        showResult(
            "Reset to bottom [10, 20, 30] top.",
            "success"
        );
    }

    /* ================= Main Events ================= */

    const actions = {
        pushButton: pushElement,
        popButton: popElement,
        peekButton: peekElement,
        isEmptyButton: checkIsEmpty,
        isFullButton: checkIsFull,
        resetButton: resetStack
    };

    Object.entries(actions).forEach(([id, action]) => {
        $(id).addEventListener("click", function () {
            try {
                action();
            } catch (error) {
                report(error.message, "error");
            }
        });
    });

    $("valueInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            try {
                pushElement();
            } catch (error) {
                report(error.message, "error");
            }
        }
    });

    /* ================= Practice ================= */

    const questions = {
        sequence: {
            correct: 2,

            feedback: [
                "4 remains at the bottom. After Pop removes 7, " +
                "Push(9) makes 9 the Top.",

                "7 was removed by Pop, so it cannot be returned by Peek.",

                "Correct. The final stack is bottom [4, 9] top."
            ]
        },

        peek: {
            correct: 2,

            feedback: [
                "Push adds a new value rather than reading the current Top.",

                "Pop returns 30 but also removes it, reducing Size.",

                "Correct. Peek returns 30 without changing the stack."
            ]
        },

        overflow: {
            correct: 1,

            feedback: [
                "Overwriting the Top would destroy stored data.",

                "Correct. Reject the Push and preserve all seven items.",

                "Removing the Bottom is not a valid stack operation."
            ]
        }
    };

    const solved = new Set();

    document.querySelectorAll(".question-card").forEach(card => {
        const questionId = card.dataset.question;
        const data = questions[questionId];

        const buttons =
            card.querySelectorAll("[data-answer]");

        const feedback =
            card.querySelector(".question-feedback");

        buttons.forEach(button => {
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", function () {
                const answer =
                    Number(this.dataset.answer);

                const correct =
                    answer === data.correct;

                buttons.forEach(item => {
                    item.setAttribute(
                        "aria-pressed",
                        "false"
                    );
                });

                this.setAttribute(
                    "aria-pressed",
                    "true"
                );

                feedback.textContent =
                    data.feedback[answer];

                feedback.className =
                    "question-feedback " +
                    (
                        correct
                            ? "result-success"
                            : "result-error"
                    );

                if (correct) {
                    solved.add(questionId);
                }

                $("practiceStatus").textContent =
                    `Questions solved: ${solved.size} / 3`;
            });
        });
    });

    /* ================= Reverse Challenge ================= */

    let incoming = ["A", "B", "C"];
    let challengeStack = [];
    let output = [];
    let challengeFinished = false;

    function displayChallenge() {
        $("incomingSignal").textContent =
            incoming.join(" → ") || "Empty";

        $("challengeStack").textContent =
            challengeStack.join(" → ") || "Empty";

        $("signalOutput").textContent =
            output.join(" → ") || "Empty";

        $("signalPushButton").disabled =
            challengeFinished || incoming.length === 0;

        $("signalPopButton").disabled =
            challengeFinished || challengeStack.length === 0;
    }

    function challengeMessage(message, type = "") {
        const result = $("challengeResult");

        result.textContent = message;
        result.className = "visualization-result";

        if (type === "success") {
            result.classList.add("result-success");
        }

        if (type === "error") {
            result.classList.add("result-error");
        }
    }

    function pushSignal() {
        if (challengeFinished || incoming.length === 0) {
            return;
        }

        const symbol = incoming.shift();

        challengeStack.push(symbol);

        challengeMessage(
            `Pushed ${symbol}. It is now the Top.`
        );

        displayChallenge();
    }

    function popSignal() {
        if (
            challengeFinished ||
            challengeStack.length === 0
        ) {
            return;
        }

        const symbol = challengeStack.pop();

        output.push(symbol);

        const target = "CBA";

        if (
            output.join("") !==
            target.slice(0, output.length)
        ) {
            challengeFinished = true;

            challengeMessage(
                `${symbol} was removed too early. ` +
                "The output can no longer become C → B → A. Restart.",
                "error"
            );
        } else if (output.length === 3) {
            challengeFinished = true;

            challengeMessage(
                "Solved! Push A, B and C, then Pop C, B and A. " +
                "LIFO reversed the sequence.",
                "success"
            );
        } else {
            challengeMessage(
                `Popped ${symbol}. The output is correct so far.`,
                "success"
            );
        }

        displayChallenge();
    }

    function resetChallenge() {
        incoming = ["A", "B", "C"];
        challengeStack = [];
        output = [];
        challengeFinished = false;

        challengeMessage(
            "Challenge restarted. Make C the first output."
        );

        displayChallenge();
    }

    $("signalPushButton").addEventListener(
        "click",
        pushSignal
    );

    $("signalPopButton").addEventListener(
        "click",
        popSignal
    );

    $("challengeResetButton").addEventListener(
        "click",
        resetChallenge
    );

    /* ================= Progress ================= */

    const completeButton =
        $("completeLessonButton");

    function setCompleted() {
        completeButton.textContent = "Completed ✓";
        completeButton.classList.add("completed");
        completeButton.disabled = true;
    }

    try {
        if (
            typeof isLessonCompleted === "function" &&
            isLessonCompleted(LESSON_ID)
        ) {
            setCompleted();
        }
    } catch (error) {
        console.warn("Completion could not be read.", error);
    }

    completeButton.addEventListener("click", async function () {
        if (typeof completeLesson !== "function") {
            $("completionMessage").textContent =
                "Progress is unavailable. Check progress.js.";
            return;
        }

        completeButton.disabled = true;

        try {
            const saved =
                await completeLesson(LESSON_ID);

            if (saved) {
                setCompleted();

                $("completionMessage").textContent =
                    "Stack lesson completion saved.";
            } else {
                completeButton.disabled = false;

                $("completionMessage").textContent =
                    "Completion was not saved. Check your login.";
            }
        } catch (error) {
            completeButton.disabled = false;

            $("completionMessage").textContent =
                "Completion could not be saved.";

            console.warn(error);
        }
    });

    /* ================= Initial Display ================= */

    displayStack();
    displayChallenge();
});