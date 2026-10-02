document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);

    /* ================= Authentication ================= */

    const authButton = $("authButton");

    try {
        const loggedInUser = localStorage.getItem("loggedInUser");

        if (authButton && loggedInUser) {
            authButton.textContent = "Profile";
            authButton.href = "../profile.html";
        }
    } catch (error) {
        // Keep the original login link if storage is unavailable.
        console.warn("Login state could not be read.", error);
    }

    /* ================= Array State ================= */

    const CAPACITY = 8;
    const initialNumbers = [10, 20, 30, 40];

    let numbers = [...initialNumbers];

    // A trace contains display snapshots.
    // The final result is committed when its last step is shown.
    let trace = null;

    const arrayContainer = $("interactiveArray");
    const resultText = $("visualizationResult");
    const indexInput = $("indexInput");
    const valueInput = $("valueInput");
    const nextStepButton = $("nextStepButton");
    const history = $("stepHistory");

    const operationIds = [
        "accessButton",
        "updateButton",
        "insertButton",
        "deleteButton",
        "searchButton",
        "traversalButton"
    ];

    /* ================= Rendering ================= */

    function displayArray(
        values = numbers,
        highlightedIndexes = [],
        activeSize = numbers.length
    ) {
        arrayContainer.replaceChildren();

        for (let index = 0; index < CAPACITY; index++) {
            const item = document.createElement("div");
            item.className = "array-item";

            if (highlightedIndexes.includes(index)) {
                item.classList.add("selected");
            }

            const value = document.createElement("div");
            value.className = "array-value";

            if (index < values.length) {
                value.textContent = values[index];
            } else {
                value.textContent = "—";
                item.classList.add("unused");
            }

            const label = document.createElement("span");
            label.className = "array-index";
            label.textContent = `index ${index}`;

            item.append(value, label);
            arrayContainer.append(item);
        }

        $("arrayState").textContent =
            `Active size: ${activeSize} · Capacity: ${CAPACITY}` +
            (trace ? " · Operation in progress" : "");
    }

    function showResult(message, type = "normal") {
        resultText.textContent = message;
        resultText.className = "visualization-result";

        if (type === "success") {
            resultText.classList.add("result-success");
        } else if (type === "error") {
            resultText.classList.add("result-error");
        }
    }

    function addHistory(message) {
        const item = document.createElement("li");
        item.textContent = message;
        history.append(item);
    }

    function lockControls(locked) {
        operationIds.forEach(id => {
            $(id).disabled = locked;
        });

        indexInput.disabled = locked;
        valueInput.disabled = locked;

        // Reset stays enabled so a trace can be cancelled.
    }

    /* ================= Validation ================= */

    function readInteger(input, name, minimum, maximum) {
        const raw = input.value.trim();
        const number = Number(raw);

        if (
            raw === "" ||
            !Number.isInteger(number) ||
            number < minimum ||
            number > maximum
        ) {
            input.focus();

            throw new Error(
                `${name}: enter a whole number from ` +
                `${minimum} to ${maximum}.`
            );
        }

        return number;
    }

    function getIndex(allowEnd = false) {
        if (!allowEnd && numbers.length === 0) {
            indexInput.focus();

            throw new Error(
                "The array is empty. Insert a value at index 0 first."
            );
        }

        return readInteger(
            indexInput,
            "Index",
            0,
            allowEnd ? numbers.length : numbers.length - 1
        );
    }

    function getValue() {
        return readInteger(
            valueInput,
            "Value",
            -999,
            999
        );
    }

    /* ================= Step-by-step Engine ================= */

    function makeFrame(
        values,
        highlights,
        message,
        size,
        type = "normal"
    ) {
        return {
            values: [...values],
            highlights: [...highlights],
            message,
            size,
            type
        };
    }

    function startTrace(name, frames, finalValues) {
        history.replaceChildren();

        trace = {
            name,
            frames,
            position: 0,
            finalValues: [...finalValues]
        };

        lockControls(true);
        nextStepButton.disabled = false;

        $("stepStatus").textContent =
            `${name}: 0 / ${frames.length} steps`;

        showResult(
            `${name} is ready. Predict the next change, ` +
            "then press Next step."
        );

        displayArray();
    }

    function nextStep() {
        if (!trace) {
            return;
        }

        const currentTrace = trace;
        const frame = currentTrace.frames[currentTrace.position];

        currentTrace.position++;

        const finished =
            currentTrace.position === currentTrace.frames.length;

        if (finished) {
            numbers = [...currentTrace.finalValues];
            trace = null;

            lockControls(false);
            nextStepButton.disabled = true;
        }

        displayArray(
            frame.values,
            frame.highlights,
            frame.size
        );

        showResult(frame.message, frame.type);
        addHistory(frame.message);

        $("stepStatus").textContent = finished
            ? `${currentTrace.name}: completed`
            : `${currentTrace.name}: ${currentTrace.position} / ` +
              `${currentTrace.frames.length} steps`;
    }

    function showImmediate(message, highlight = -1) {
        history.replaceChildren();
        addHistory(message);

        displayArray(
            numbers,
            highlight >= 0 ? [highlight] : []
        );

        showResult(message, "success");
        $("stepStatus").textContent = "Operation completed";
    }

    /* ================= Access ================= */

    function accessElement() {
        const index = getIndex();

        showImmediate(
            `Access a[${index}] = ${numbers[index]}. ` +
            "Direct indexed access takes O(1); no elements move.",
            index
        );
    }

    /* ================= Update ================= */

    function updateElement() {
        const index = getIndex();
        const value = getValue();
        const oldValue = numbers[index];

        numbers[index] = value;

        showImmediate(
            `Update: index ${index} changed from ${oldValue} ` +
            `to ${value}. Size remains ${numbers.length}. O(1).`,
            index
        );
    }

    /* ================= Insert ================= */

    function insertElement() {
        if (numbers.length === CAPACITY) {
            throw new Error(
                "The fixed-capacity array is full. " +
                "Delete an element before inserting."
            );
        }

        const index = getIndex(true);
        const value = getValue();

        const originalSize = numbers.length;
        const working = [...numbers];
        const frames = [];

        frames.push(makeFrame(
            working,
            [],
            `Insert ${value} at index ${index}. ` +
            `${originalSize - index} existing element(s) must shift right.`,
            originalSize
        ));

        // Copy rightmost elements first to avoid losing values.
        for (let destination = originalSize;
             destination > index;
             destination--) {

            const source = destination - 1;
            const movedValue = working[source];

            working[destination] = movedValue;

            frames.push(makeFrame(
                working,
                [source, destination],
                `Copy ${movedValue}: index ${source} → ` +
                `${destination}. The duplicate is temporary.`,
                originalSize
            ));
        }

        working[index] = value;

        frames.push(makeFrame(
            working,
            [index],
            `Write ${value} at index ${index} and increase size ` +
            `to ${originalSize + 1}. ` +
            `Total: ${originalSize - index} shift(s), ` +
            "plus one write of the new value.",
            originalSize + 1,
            "success"
        ));

        startTrace("Insert", frames, working);
    }

    /* ================= Delete ================= */

    function deleteElement() {
        const index = getIndex();

        const originalSize = numbers.length;
        const removed = numbers[index];
        const working = [...numbers];
        const frames = [];

        frames.push(makeFrame(
            working,
            [index],
            `Remove ${removed} from index ${index}. ` +
            `${originalSize - index - 1} later element(s) must shift left.`,
            originalSize
        ));

        for (let destination = index;
             destination < originalSize - 1;
             destination++) {

            const source = destination + 1;
            const movedValue = working[source];

            working[destination] = movedValue;

            frames.push(makeFrame(
                working,
                [destination, source],
                `Copy ${movedValue}: index ${source} → ${destination}.`,
                originalSize
            ));
        }

        working.pop();

        frames.push(makeFrame(
            working,
            [],
            `Deletion complete. Size is now ${working.length}. ` +
            `Total shifts: ${originalSize - index - 1}. ` +
            "The former last slot is now unused; allocated capacity stays 8.",
            working.length,
            "success"
        ));

        startTrace("Delete", frames, working);
    }

    /* ================= Linear Search ================= */

    function searchElement() {
        if (numbers.length === 0) {
            throw new Error(
                "The array is empty. There are no values to search."
            );
        }

        const target = getValue();
        const frames = [];
        let found = false;

        for (let index = 0; index < numbers.length; index++) {
            const matches = numbers[index] === target;

            frames.push(makeFrame(
                numbers,
                [index],
                `Comparison ${index + 1}: a[${index}] = ` +
                `${numbers[index]}. ` +
                (
                    matches
                        ? `Match! First occurrence of ${target} ` +
                          `found at index ${index}. Search stops.`
                        : `Not equal to ${target}.`
                ),
                numbers.length,
                matches ? "success" : "normal"
            ));

            if (matches) {
                found = true;
                break;
            }
        }

        if (!found) {
            frames.push(makeFrame(
                numbers,
                [],
                `${target} was not found after ` +
                `${numbers.length} comparisons. No values changed.`,
                numbers.length,
                "error"
            ));
        }

        startTrace("Linear search", frames, numbers);
    }

    /* ================= Traversal ================= */

    function traverseArray() {
        if (numbers.length === 0) {
            showImmediate(
                "The array is empty. Traversal visits 0 elements."
            );
            return;
        }

        const frames = [];
        const visited = [];
        let total = 0;

        numbers.forEach((value, index) => {
            visited.push(value);
            total += value;

            frames.push(makeFrame(
                numbers,
                [index],
                `Visit index ${index}: value ${value}. ` +
                `Running sum = ${total}.`,
                numbers.length
            ));
        });

        frames.push(makeFrame(
            numbers,
            [],
            `Traversal complete: ${visited.join(" → ")}. ` +
            `Visited ${numbers.length} elements. Sum = ${total}. ` +
            "Each element was visited once: O(n).",
            numbers.length,
            "success"
        ));

        startTrace("Traversal", frames, numbers);
    }

    /* ================= Reset ================= */

    function resetArray() {
        trace = null;
        numbers = [...initialNumbers];

        indexInput.value = "";
        valueInput.value = "";

        lockControls(false);
        nextStepButton.disabled = true;
        history.replaceChildren();

        displayArray();

        $("stepStatus").textContent = "No operation in progress";

        showResult(
            "Reset to [10, 20, 30, 40]. Any unfinished trace was cancelled.",
            "success"
        );
    }

    /* ================= Operation Events ================= */

    const actions = {
        accessButton: accessElement,
        updateButton: updateElement,
        insertButton: insertElement,
        deleteButton: deleteElement,
        searchButton: searchElement,
        traversalButton: traverseArray,
        resetButton: resetArray
    };

    Object.entries(actions).forEach(([id, action]) => {
        $(id).addEventListener("click", function () {
            if (trace && id !== "resetButton") {
                return;
            }

            try {
                action();
            } catch (error) {
                showResult(error.message, "error");
            }
        });
    });

    nextStepButton.addEventListener("click", nextStep);

    /* ================= Practice Feedback ================= */

    const questions = {
        index: {
            correct: 1,
            explanations: [
                "20 is at index 1. Counting begins at 0, " +
                "so index 2 contains 30.",

                "Correct. Indexes 0, 1, 2, 3 contain " +
                "10, 20, 30, 40 respectively.",

                "2 is the index, not the stored value. " +
                "The value at index 2 is 30."
            ]
        },

        shift: {
            correct: 2,
            explanations: [
                "Not just the value at index 1 moves. " +
                "20, 30 and 40 must all shift right.",

                "30 and 40 move, but 20 must also move " +
                "out of index 1 to make room.",

                "Correct. 40 moves to index 4, 30 to index 3, " +
                "and 20 to index 2. Then 99 is written at index 1."
            ]
        },

        search: {
            correct: 1,
            explanations: [
                "The first two comparisons inspect 5 and 2. " +
                "A third comparison is needed to find 8.",

                "Correct. Compare 5, then 2, then 8. " +
                "The search stops when it finds the match.",

                "The search stops at 8, so it never needs " +
                "to compare the final value 1."
            ]
        }
    };

    const solvedQuestions = new Set();

    document.querySelectorAll(".question-card").forEach(card => {
        const questionId = card.dataset.question;
        const question = questions[questionId];

        const buttons = card.querySelectorAll("[data-answer]");
        const feedback = card.querySelector(".question-feedback");

        buttons.forEach(button => {
            button.addEventListener("click", function () {
                const answer = Number(button.dataset.answer);
                const correct = answer === question.correct;

                buttons.forEach(item => {
                    item.setAttribute("aria-pressed", "false");
                });

                button.setAttribute("aria-pressed", "true");

                feedback.textContent = question.explanations[answer];
                feedback.className =
                    "question-feedback " +
                    (correct ? "result-success" : "result-error");

                if (correct) {
                    solvedQuestions.add(questionId);
                }

                $("practiceStatus").textContent =
                    `Questions solved: ${solvedQuestions.size} / 3`;
            });
        });
    });

    /* ================= Existing Lesson Progress ================= */

    const completeButton = $("completeLessonButton");
    const completionMessage = $("completionMessage");

    function setCompleted() {
        completeButton.textContent = "Completed ✓";
        completeButton.classList.add("completed");
        completeButton.disabled = true;
    }

    // Initialize the lab before checking external progress functions.
    displayArray();

    try {
        if (
            typeof isLessonCompleted === "function" &&
            isLessonCompleted("array")
        ) {
            setCompleted();
        }
    } catch (error) {
        console.warn("Could not read lesson completion.", error);
    }

    completeButton.addEventListener("click", async function () {
        if (typeof completeLesson !== "function") {
            completionMessage.textContent =
                "Progress is unavailable. Check that progress.js " +
                "loads correctly. You can still use the lesson.";
            return;
        }

        completeButton.disabled = true;

        try {
            // Keep the existing progress.js interface.
            const saved = await completeLesson("array");

            if (saved) {
                setCompleted();

                completionMessage.textContent =
                    "Array lesson completion saved.";
            } else {
                completeButton.disabled = false;

                completionMessage.textContent =
                    "Completion was not saved. Check your login " +
                    "and try again.";
            }
        } catch (error) {
            completeButton.disabled = false;

            completionMessage.textContent =
                "Completion could not be saved. Please try again.";

            console.warn("Could not save lesson completion.", error);
        }
    });
});