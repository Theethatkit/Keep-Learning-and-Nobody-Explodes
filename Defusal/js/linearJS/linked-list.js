document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);
    const LESSON_ID = "linked-list";
    const MAX_NODES = 8;

    /* ================= Authentication ================= */

    try {
        const user = localStorage.getItem("loggedInUser");

        if (user) {
            $("authButton").textContent = "Profile";
            $("authButton").href = "../profile.html";
        }
    } catch (error) {
        console.warn("Login state could not be read.", error);
    }

    /* ================= List State ================= */

    let nextNodeId = 1;
    let nodes = [];
    let trace = null;

    function createNode(value) {
        return {
            id: nextNodeId++,
            value
        };
    }

    function initializeList() {
        nextNodeId = 1;

        nodes = [
            createNode(10),
            createNode(20),
            createNode(30)
        ];
    }

    /* ================= Rendering ================= */

    function displayList(
        displayNodes = nodes,
        selectedIds = []
    ) {
        const container = $("linkedListContainer");
        const type = $("listType").value;

        container.replaceChildren();

        const head = document.createElement("span");
        head.className = "list-label";
        head.textContent = displayNodes.length
            ? `HEAD → node #${displayNodes[0].id}`
            : "HEAD → NULL";

        container.append(head);

        if (displayNodes.length === 0) {
            updateState(displayNodes);
            return;
        }

        displayNodes.forEach((item, index) => {
            const node = document.createElement("div");

            node.className = "interactive-node";

            if (selectedIds.includes(item.id)) {
                node.classList.add("selected");
            }

            const value = document.createElement("span");
            value.className = "node-value";
            value.textContent = item.value;

            const information = document.createElement("small");
            information.className = "node-information";
            information.textContent =
                `node #${item.id} · position ${index}`;

            const pointers = document.createElement("small");
            pointers.className = "node-pointers";

            if (type === "doubly") {
                const previousId =
                    index === 0
                        ? "NULL"
                        : `#${displayNodes[index - 1].id}`;

                const nextId =
                    index === displayNodes.length - 1
                        ? "NULL"
                        : `#${displayNodes[index + 1].id}`;

                pointers.textContent =
                    `prev: ${previousId} | next: ${nextId}`;
            } else if (type === "circular") {
                const nextId =
                    index === displayNodes.length - 1
                        ? `#${displayNodes[0].id}`
                        : `#${displayNodes[index + 1].id}`;

                pointers.textContent = `next: ${nextId}`;
            } else {
                const nextId =
                    index === displayNodes.length - 1
                        ? "NULL"
                        : `#${displayNodes[index + 1].id}`;

                pointers.textContent = `next: ${nextId}`;
            }

            node.append(value, information, pointers);
            container.append(node);

            const arrow = document.createElement("span");
            arrow.className = "interactive-arrow";

            if (type === "doubly" && index < displayNodes.length - 1) {
                arrow.textContent = "⇄";
            } else if (index < displayNodes.length - 1) {
                arrow.textContent = "→";
            } else if (type === "circular") {
                arrow.textContent = "↺ HEAD";
            } else {
                arrow.textContent = "→ NULL";
            }

            container.append(arrow);
        });

        updateState(displayNodes);
    }

    function updateState(displayNodes = nodes) {
        const typeName =
            $("listType").options[
                $("listType").selectedIndex
            ].text;

        $("listState").textContent =
            `Type: ${typeName} · Nodes: ${displayNodes.length}` +
            (
                displayNodes.length
                    ? ` · Head: #${displayNodes[0].id}` +
                      ` · Tail: #${displayNodes[displayNodes.length - 1].id}`
                    : " · Head: NULL · Tail: NULL"
            );
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
        $("stepHistory").append(item);
    }

    /* ================= Validation ================= */

    function readInteger(input, label, min, max) {
        const raw = input.value.trim();
        const value = Number(raw);

        if (
            raw === "" ||
            !Number.isInteger(value) ||
            value < min ||
            value > max
        ) {
            input.focus();

            throw new Error(
                `${label}: enter a whole number from ${min} to ${max}.`
            );
        }

        return value;
    }

    function getValue() {
        return readInteger(
            $("valueInput"),
            "Value",
            -999,
            999
        );
    }

    function getInsertPosition() {
        return readInteger(
            $("positionInput"),
            "Position",
            0,
            nodes.length
        );
    }

    /* ================= Trace Engine ================= */

    const operationIds = [
        "insertFrontButton",
        "insertBackButton",
        "insertPositionButton",
        "deleteFrontButton",
        "deleteBackButton",
        "searchButton",
        "traversalButton"
    ];

    function lockControls(locked) {
        operationIds.forEach(id => {
            $(id).disabled = locked;
        });

        $("valueInput").disabled = locked;
        $("positionInput").disabled = locked;
        $("listType").disabled = locked;
    }

    function makeFrame(
        frameNodes,
        selected,
        message,
        type = ""
    ) {
        return {
            nodes: frameNodes.map(node => ({ ...node })),
            selected: [...selected],
            message,
            type
        };
    }

    function startTrace(name, frames, finalNodes) {
        $("stepHistory").replaceChildren();

        trace = {
            name,
            frames,
            index: 0,
            finalNodes: finalNodes.map(node => ({ ...node }))
        };

        lockControls(true);
        $("nextStepButton").disabled = false;

        $("stepStatus").textContent =
            `${name}: 0 / ${frames.length} steps`;

        showResult(
            `${name} is ready. Predict the next step, then press Next step.`
        );

        displayList();
    }

    function nextStep() {
        if (!trace) {
            return;
        }

        const activeTrace = trace;
        const currentFrame =
            activeTrace.frames[activeTrace.index];

        activeTrace.index++;

        const finished =
            activeTrace.index === activeTrace.frames.length;

        if (finished) {
            nodes = activeTrace.finalNodes.map(node => ({ ...node }));
            trace = null;

            lockControls(false);
            $("nextStepButton").disabled = true;
        }

        displayList(
            currentFrame.nodes,
            currentFrame.selected
        );

        showResult(
            currentFrame.message,
            currentFrame.type
        );

        addHistory(currentFrame.message);

        $("stepStatus").textContent = finished
            ? `${activeTrace.name}: completed`
            : `${activeTrace.name}: ${activeTrace.index} / ` +
              `${activeTrace.frames.length}`;
    }

    function traversalFrames(
        currentNodes,
        lastPosition
    ) {
        const frames = [];

        for (let index = 0; index <= lastPosition; index++) {
            const current = currentNodes[index];

            frames.push(makeFrame(
                currentNodes,
                [current.id],
                index === 0
                    ? `Start at Head: node #${current.id}, position 0.`
                    : `Follow Next to node #${current.id}, ` +
                      `position ${index}. Links followed: ${index}.`
            ));
        }

        return frames;
    }

    /* ================= Insert ================= */

    function prepareInsert(position, label) {
        if (nodes.length >= MAX_NODES) {
            throw new Error(
                "The visualization is limited to 8 nodes. Delete one first."
            );
        }

        const value = getValue();
        const newNode = createNode(value);

        let frames = [];

        if (position > 0) {
            frames = traversalFrames(nodes, position - 1);
        }

        const predecessor =
            position > 0 ? nodes[position - 1] : null;

        const successor =
            position < nodes.length ? nodes[position] : null;

        frames.push(makeFrame(
            nodes,
            predecessor ? [predecessor.id] : [],
            `Create node #${newNode.id} containing ${value}. ` +
            `Set its Next to ${
                successor ? "#" + successor.id : "NULL"
            }. It is not connected to the list yet.`
        ));

        const finalNodes = nodes.map(node => ({ ...node }));
        finalNodes.splice(position, 0, newNode);

        frames.push(makeFrame(
            finalNodes,
            [newNode.id],
            position === 0
                ? `Move Head to node #${newNode.id}. ` +
                  "The old Head remains connected through New.next."
                : `Change node #${predecessor.id}.next to ` +
                  `node #${newNode.id}. No existing values shift.`,
            "success"
        ));

        startTrace(label, frames, finalNodes);
    }

    function insertFront() {
        prepareInsert(0, "Insert Front");
    }

    function insertBack() {
        prepareInsert(nodes.length, "Insert Back");
    }

    function insertAtPosition() {
        const position = getInsertPosition();
        prepareInsert(position, "Insert at Position");
    }

    /* ================= Delete ================= */

    function deleteFront() {
        if (nodes.length === 0) {
            throw new Error("The list is already empty.");
        }

        const removed = nodes[0];
        const finalNodes = nodes.slice(1);

        const frames = [
            makeFrame(
                nodes,
                [removed.id],
                `Node #${removed.id} is the current Head. ` +
                `Save its successor before removing it.`
            ),
            makeFrame(
                finalNodes,
                [],
                finalNodes.length
                    ? `Move Head to node #${finalNodes[0].id}. ` +
                      `Release node #${removed.id}.`
                    : `Move Head to NULL and release node #${removed.id}.`,
                "success"
            )
        ];

        startTrace("Delete Front", frames, finalNodes);
    }

    function deleteBack() {
        if (nodes.length === 0) {
            throw new Error("The list is already empty.");
        }

        const lastIndex = nodes.length - 1;
        const removed = nodes[lastIndex];

        let frames = [];

        if (
            $("listType").value === "singly" ||
            $("listType").value === "circular"
        ) {
            if (lastIndex > 0) {
                frames = traversalFrames(nodes, lastIndex - 1);
            }
        } else {
            frames.push(makeFrame(
                nodes,
                [removed.id],
                `Tail directly identifies node #${removed.id}. ` +
                "Its Previous pointer identifies the predecessor."
            ));
        }

        frames.push(makeFrame(
            nodes,
            [removed.id],
            `Prepare to remove Tail node #${removed.id}, ` +
            `which stores ${removed.value}.`
        ));

        const finalNodes = nodes.slice(0, -1);

        frames.push(makeFrame(
            finalNodes,
            [],
            finalNodes.length
                ? `Tail is now node #${finalNodes[finalNodes.length - 1].id}. ` +
                  (
                      $("listType").value === "circular"
                          ? "Set Tail.next back to Head."
                          : "Set the new final Next pointer to NULL."
                  )
                : "Head and Tail are now NULL.",
            "success"
        ));

        startTrace("Delete Back", frames, finalNodes);
    }

    /* ================= Search ================= */

    function searchValue() {
        if (nodes.length === 0) {
            throw new Error("The list is empty.");
        }

        const target = getValue();
        const frames = [];
        let found = false;

        for (let index = 0; index < nodes.length; index++) {
            const node = nodes[index];
            const matches = node.value === target;

            frames.push(makeFrame(
                nodes,
                [node.id],
                `Comparison ${index + 1}: node #${node.id} ` +
                `contains ${node.value}. ` +
                (
                    matches
                        ? `Match found at position ${index}. Stop.`
                        : "No match. Follow Next."
                ),
                matches ? "success" : ""
            ));

            if (matches) {
                found = true;
                break;
            }
        }

        if (!found) {
            frames.push(makeFrame(
                nodes,
                [],
                `${target} was not found after ${nodes.length} comparisons.`,
                "error"
            ));
        }

        startTrace("Search", frames, nodes);
    }

    /* ================= Traversal ================= */

    function traverseList() {
        if (nodes.length === 0) {
            throw new Error("The list is empty.");
        }

        const frames = [];
        const visited = [];
        let sum = 0;

        nodes.forEach((node, index) => {
            visited.push(node.value);
            sum += node.value;

            frames.push(makeFrame(
                nodes,
                [node.id],
                `Visit position ${index}, node #${node.id}: ` +
                `value ${node.value}. Running sum = ${sum}.`
            ));
        });

        frames.push(makeFrame(
            nodes,
            [],
            `Traversal completed: ${visited.join(" → ")}. ` +
            `Visited ${nodes.length} node(s); sum = ${sum}. ` +
            (
                $("listType").value === "circular"
                    ? "Stop after returning to Head to avoid an infinite loop."
                    : "Stop after reaching NULL."
            ),
            "success"
        ));

        startTrace("Traversal", frames, nodes);
    }

    /* ================= Reset ================= */

    function resetList() {
        trace = null;
        initializeList();

        lockControls(false);
        $("nextStepButton").disabled = true;

        $("valueInput").value = "";
        $("positionInput").value = "";
        $("stepHistory").replaceChildren();

        $("stepStatus").textContent =
            "No operation in progress";

        displayList();

        showResult(
            "Reset to 10 → 20 → 30.",
            "success"
        );
    }

    /* ================= Events ================= */

    const actions = {
        insertFrontButton: insertFront,
        insertBackButton: insertBack,
        insertPositionButton: insertAtPosition,
        deleteFrontButton: deleteFront,
        deleteBackButton: deleteBack,
        searchButton: searchValue,
        traversalButton: traverseList,
        resetButton: resetList
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

    $("nextStepButton").addEventListener(
        "click",
        nextStep
    );

    $("listType").addEventListener("change", function () {
        displayList();

        showResult(
            `${this.options[this.selectedIndex].text} selected. ` +
            "The node values remain unchanged."
        );
    });

    /* ================= Practice ================= */

    const questionData = {
        links: {
            correct: 1,

            feedback: [
                "Head already refers to position 0, but position 2 " +
                "requires two Next movements.",

                "Correct. Follow 10 → 20 and then 20 → 30.",

                "Three nodes are visited, but only two pointers are followed."
            ]
        },

        insert: {
            correct: 0,

            feedback: [
                "Correct. Save A's old successor in N.next before " +
                "changing A.next.",

                "After A.next = N, using N.next = A.next would make " +
                "N point to itself."
            ]
        },

        delete: {
            correct: 1,

            feedback: [
                "Linked-list values do not shift like array elements.",

                "Correct. A singly linked list must normally traverse " +
                "to find the node before Tail.",

                "Head does not need to be deleted before Tail."
            ]
        }
    };

    const solved = new Set();

    document.querySelectorAll(".question-card").forEach(card => {
        const id = card.dataset.question;
        const data = questionData[id];
        const buttons =
            card.querySelectorAll("[data-answer]");
        const feedback =
            card.querySelector(".question-feedback");

        buttons.forEach(button => {
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", function () {
                const answer = Number(this.dataset.answer);
                const correct = answer === data.correct;

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
                    solved.add(id);
                }

                $("practiceStatus").textContent =
                    `Questions solved: ${solved.size} / 3`;
            });
        });
    });

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
                    "Linked List lesson completion saved.";
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

    initializeList();
    displayList();
});