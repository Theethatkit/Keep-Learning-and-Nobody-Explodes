document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const LESSON_ID = "queue";
    const CAPACITY = 7;
    const initialValues = [10, 20, 30];

    let slots;
    let front;
    let rear;
    let size;

    /* ================= Authentication ================= */

    try {
        if (localStorage.getItem("loggedInUser")) {
            $("authButton").textContent = "Profile";
            $("authButton").href = "../profile.html";
        }
    } catch (error) {
        console.warn("Login state could not be read.", error);
    }

    /* ================= Queue State ================= */

    function initializeQueue() {
        slots = Array(CAPACITY).fill(null);
        front = 0;
        rear = 0;
        size = 0;

        initialValues.forEach(function (value) {
            slots[rear] = value;
            rear = (rear + 1) % CAPACITY;
            size++;
        });
    }

    function logicalValues() {
        const values = [];

        for (let offset = 0; offset < size; offset++) {
            values.push(
                slots[(front + offset) % CAPACITY]
            );
        }

        return values;
    }

    /* ================= Display ================= */

    function displayQueue(highlight = -1) {
        const container = $("queueContainer");

        container.replaceChildren();

        slots.forEach(function (value, index) {
            const slot = document.createElement("div");
            const storedValue = document.createElement("strong");
            const label = document.createElement("small");

            slot.className = "queue-slot";

            if (value === null) {
                slot.classList.add("empty-slot");
            }

            if (size > 0 && index === front) {
                slot.classList.add("front-slot");
            }

            if (index === rear) {
                slot.classList.add("rear-slot");
            }

            if (index === highlight) {
                slot.classList.add("front-slot");
            }

            storedValue.textContent =
                value === null ? "—" : value;

            const labels = [`slot ${index}`];

            if (size > 0 && index === front) {
                labels.push("FRONT");
            }

            if (index === rear) {
                labels.push("REAR/NEXT");
            }

            label.textContent = labels.join(" · ");

            slot.append(storedValue, label);
            container.append(slot);
        });

        const values = logicalValues();

        $("queueState").textContent =
            `Size: ${size}/${CAPACITY} · ` +
            `Front slot: ${front} · ` +
            `Rear/next slot: ${rear} · ` +
            `Logical order: ${values.join(" → ") || "Empty"}`;
    }

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

    function report(message, type = "", highlight = -1) {
        showResult(message, type);
        addHistory(message);
        displayQueue(highlight);
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

    function enqueueElement() {
        if (size === CAPACITY) {
            report(
                `Overflow: the queue already contains ${CAPACITY} values. ` +
                "Dequeue one before adding another.",
                "error"
            );

            return;
        }

        const value = getValue();
        const insertionSlot = rear;

        slots[rear] = value;
        rear = (rear + 1) % CAPACITY;
        size++;

        report(
            `Enqueue(${value}): stored in slot ${insertionSlot}. ` +
            `Rear moved to (${insertionSlot} + 1) % ${CAPACITY} = ${rear}.`,
            "success",
            insertionSlot
        );

        $("valueInput").value = "";
        $("valueInput").focus();
    }

    function dequeueElement() {
        if (size === 0) {
            report(
                "Underflow: the queue is empty. Nothing can be removed.",
                "error"
            );

            return;
        }

        const removalSlot = front;
        const removed = slots[front];

        slots[front] = null;
        front = (front + 1) % CAPACITY;
        size--;

        if (size === 0) {
            // Keep the canonical empty state.
            front = rear;
        }

        report(
            `Dequeue() returned ${removed} from slot ${removalSlot}. ` +
            `Front is now slot ${front}. No values shifted.`,
            "success"
        );
    }

    function peekFront() {
        if (size === 0) {
            report(
                "Peek is unavailable because the queue is empty.",
                "error"
            );

            return;
        }

        report(
            `Peek() returned ${slots[front]} from slot ${front}. ` +
            `Size remains ${size}.`,
            "success",
            front
        );
    }

    function checkIsEmpty() {
        report(
            `isEmpty() returned ${size === 0}. Size is ${size}.`,
            "success"
        );
    }

    function checkIsFull() {
        report(
            `isFull() returned ${size === CAPACITY}. ` +
            `${CAPACITY - size} slot(s) remain.`,
            "success"
        );
    }

    function resetQueue() {
        initializeQueue();

        $("valueInput").value = "";
        $("operationHistory").replaceChildren();

        addHistory(
            "Initial queue: Front [10, 20, 30] Rear."
        );

        displayQueue();

        showResult(
            "Reset to Front [10, 20, 30] Rear.",
            "success"
        );
    }

    const actions = {
        enqueueButton: enqueueElement,
        dequeueButton: dequeueElement,
        peekButton: peekFront,
        isEmptyButton: checkIsEmpty,
        isFullButton: checkIsFull,
        resetButton: resetQueue
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
                enqueueElement();
            } catch (error) {
                report(error.message, "error");
            }
        }
    });

    /* ================= Practice ================= */

    const questions = {
        sequence: {
            correct: 1,
            feedback: [
                "10 was already removed by the first Dequeue.",
                "Correct. 20 is now the earliest waiting value.",
                "30 arrived after 20, so it must wait."
            ]
        },

        rear: {
            correct: 0,
            feedback: [
                "Correct. (6 + 1) % 7 equals 0.",
                "Rear advances after a successful Enqueue.",
                "Slot 7 does not exist; valid slots are 0 through 6."
            ]
        },

        full: {
            correct: 1,
            feedback: [
                "Overwriting Front would destroy unprocessed data.",
                "Correct. Reject Enqueue and preserve the existing values.",
                "A circular queue does not shift values."
            ]
        }
    };

    const solved = new Set();

    document.querySelectorAll(".question-card").forEach(function (card) {
        const id = card.dataset.question;
        const data = questions[id];
        const buttons = card.querySelectorAll("[data-answer]");
        const feedback = card.querySelector(".question-feedback");

        buttons.forEach(function (button) {
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", function () {
                const answer = Number(this.dataset.answer);
                const correct = answer === data.correct;

                buttons.forEach(function (item) {
                    item.setAttribute("aria-pressed", "false");
                });

                this.setAttribute("aria-pressed", "true");

                feedback.textContent = data.feedback[answer];
                feedback.className =
                    "question-feedback " +
                    (correct ? "result-success" : "result-error");

                if (correct) {
                    solved.add(id);
                }

                $("practiceStatus").textContent =
                    `Questions solved: ${solved.size} / 3`;
            });
        });
    });

    /* ================= FIFO Challenge ================= */

    let incoming;
    let requestQueue;
    let served;
    let challengeFinished;

    function displayChallenge() {
        $("incomingRequests").textContent =
            incoming.join(" → ") || "Empty";

        $("requestQueue").textContent =
            requestQueue.join(" → ") || "Empty";

        $("servedRequests").textContent =
            served.join(" → ") || "Empty";

        $("requestEnqueueButton").disabled =
            challengeFinished || incoming.length === 0;

        $("requestServeButton").disabled =
            challengeFinished || requestQueue.length === 0;
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

    function enqueueRequest() {
        if (challengeFinished || incoming.length === 0) {
            return;
        }

        const request = incoming.shift();

        requestQueue.push(request);

        challengeMessage(
            `${request} joined at Rear.`
        );

        displayChallenge();
    }

    function serveRequest() {
        if (challengeFinished || requestQueue.length === 0) {
            return;
        }

        const request = requestQueue.shift();

        served.push(request);

        if (served.join("") !== "ABC".slice(0, served.length)) {
            challengeFinished = true;

            challengeMessage(
                "The arrival order was not preserved. Restart the challenge.",
                "error"
            );
        } else if (served.length === 3) {
            challengeFinished = true;

            challengeMessage(
                "Solved! A, B and C were served in arrival order. " +
                "That is FIFO.",
                "success"
            );
        } else {
            challengeMessage(
                `${request} was served from Front. Correct so far.`,
                "success"
            );
        }

        displayChallenge();
    }

    function resetChallenge() {
        incoming = ["A", "B", "C"];
        requestQueue = [];
        served = [];
        challengeFinished = false;

        challengeMessage(
            "Challenge restarted. Preserve A → B → C."
        );

        displayChallenge();
    }

    $("requestEnqueueButton").addEventListener(
        "click",
        enqueueRequest
    );

    $("requestServeButton").addEventListener(
        "click",
        serveRequest
    );

    $("challengeResetButton").addEventListener(
        "click",
        resetChallenge
    );

    /* ================= Progress ================= */

    const completeButton = $("completeLessonButton");

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
            const saved = await completeLesson(LESSON_ID);

            if (saved) {
                setCompleted();

                $("completionMessage").textContent =
                    "Queue lesson completion saved.";
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

    /* ================= Start ================= */

    initializeQueue();
    displayQueue();
    resetChallenge();
});