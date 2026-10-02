document.addEventListener("DOMContentLoaded", function () {

    /* ================= Authentication ================= */

    const authButton = document.getElementById("authButton");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (authButton) {
        if (loggedInUser) {
            authButton.textContent = "Profile";
            authButton.href = "../profile.html";
        } else {
            authButton.textContent = "Log in";
            authButton.href = "../login.html";
        }
    }


    /* ================= Elements ================= */

    const treeContainer =
        document.getElementById("interactiveTree");

    const valueInput =
        document.getElementById("valueInput");

    const resultDisplay =
        document.getElementById("visualizationResult");

    const nodeCountDisplay =
        document.getElementById("nodeCount");

    const treeHeightDisplay =
        document.getElementById("treeHeight");

    const currentActionDisplay =
        document.getElementById("currentAction");

    const comparisonDisplay =
        document.getElementById("comparisonDisplay");

    const structureLabel =
        document.getElementById("structureLabel");

    const structureDisplay =
        document.getElementById("structureDisplay");

    const traversalOutput =
        document.getElementById("traversalOutput");

    const stepCounter =
        document.getElementById("stepCounter");

    const stepProgressBar =
        document.getElementById("stepProgressBar");

    const insertButton =
        document.getElementById("insertButton");

    const searchButton =
        document.getElementById("searchButton");

    const deleteButton =
        document.getElementById("deleteButton");

    const nextStepButton =
        document.getElementById("nextStepButton");

    const resetButton =
        document.getElementById("resetButton");

    const traversalButtons =
        document.querySelectorAll(".traversal-button");


    /* ================= Tree State ================= */

    const initialValues = [45, 25, 65, 15, 35, 55, 75];

    const SVG_NS = "http://www.w3.org/2000/svg";

    const NODE_RADIUS = 23;
    const LEVEL_HEIGHT = 88;
    const NODE_SPACING = 68;
    const SIDE_MARGIN = 35;
    const TOP_MARGIN = 26;

    let root = null;
    let nextNodeId = 1;

    let steps = [];
    let currentStepIndex = -1;
    let pendingAction = null;


    /* ================= Node Functions ================= */

    function createNode(value) {
        return {
            id: nextNodeId++,
            value: value,
            left: null,
            right: null
        };
    }

    function insertImmediately(node, value) {
        if (node === null) {
            return createNode(value);
        }

        if (value < node.value) {
            node.left = insertImmediately(node.left, value);
        } else if (value > node.value) {
            node.right = insertImmediately(node.right, value);
        }

        return node;
    }

    function findMinimum(node) {
        let current = node;

        while (current && current.left !== null) {
            current = current.left;
        }

        return current;
    }

    function deleteImmediately(node, value) {
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.left = deleteImmediately(node.left, value);
        } else if (value > node.value) {
            node.right = deleteImmediately(node.right, value);
        } else {
            if (node.left === null) {
                return node.right;
            }

            if (node.right === null) {
                return node.left;
            }

            const successor = findMinimum(node.right);

            node.value = successor.value;
            node.right =
                deleteImmediately(node.right, successor.value);
        }

        return node;
    }

    function countNodes(node) {
        if (node === null) {
            return 0;
        }

        return 1 +
            countNodes(node.left) +
            countNodes(node.right);
    }

    function countLevels(node) {
        if (node === null) {
            return 0;
        }

        return 1 + Math.max(
            countLevels(node.left),
            countLevels(node.right)
        );
    }

    function findNode(value) {
        let current = root;

        while (current !== null) {
            if (value === current.value) {
                return current;
            }

            current =
                value < current.value
                    ? current.left
                    : current.right;
        }

        return null;
    }


    /* ================= Tree Layout ================= */

    function calculateLayout() {
        const positions = new Map();
        let horizontalIndex = 0;

        function assignPosition(node, depth) {
            if (node === null) {
                return;
            }

            assignPosition(node.left, depth + 1);

            positions.set(node.id, {
                node: node,
                x:
                    SIDE_MARGIN +
                    NODE_RADIUS +
                    horizontalIndex * NODE_SPACING,
                y:
                    TOP_MARGIN +
                    NODE_RADIUS +
                    depth * LEVEL_HEIGHT
            });

            horizontalIndex++;

            assignPosition(node.right, depth + 1);
        }

        assignPosition(root, 0);

        return positions;
    }


    /* ================= Tree Rendering ================= */

    function renderTree(options = {}) {
        const activeId = options.activeId || null;
        const visitedIds = options.visitedIds || [];
        const foundId = options.foundId || null;
        const deletedId = options.deletedId || null;

        treeContainer.innerHTML = "";

        nodeCountDisplay.textContent = countNodes(root);
        treeHeightDisplay.textContent = countLevels(root);

        if (root === null) {
            treeContainer.innerHTML =
                '<p class="empty-tree">The tree is empty.</p>';

            return;
        }

        const positions = calculateLayout();

        let maxX = 500;
        let maxY = 280;

        positions.forEach(function (position) {
            maxX = Math.max(maxX, position.x + 50);
            maxY = Math.max(maxY, position.y + 50);
        });

        const svg =
            document.createElementNS(SVG_NS, "svg");

        svg.setAttribute(
            "viewBox",
            `0 0 ${maxX} ${maxY}`
        );

        svg.setAttribute("width", maxX);
        svg.setAttribute("height", maxY);


        positions.forEach(function (position) {
            const node = position.node;

            [node.left, node.right].forEach(function (child) {
                if (child === null) {
                    return;
                }

                const childPosition = positions.get(child.id);

                const line =
                    document.createElementNS(SVG_NS, "line");

                line.setAttribute("x1", position.x);
                line.setAttribute("y1", position.y);
                line.setAttribute("x2", childPosition.x);
                line.setAttribute("y2", childPosition.y);

                line.classList.add("tree-edge");

                if (
                    activeId === node.id ||
                    activeId === child.id
                ) {
                    line.classList.add("active");
                }

                svg.appendChild(line);
            });
        });


        positions.forEach(function (position) {
            const node = position.node;

            const group =
                document.createElementNS(SVG_NS, "g");

            group.classList.add("tree-node");

            if (visitedIds.includes(node.id)) {
                group.classList.add("visited");
            }

            if (node.id === activeId) {
                group.classList.add("active");
            }

            if (node.id === foundId) {
                group.classList.add("found");
            }

            if (node.id === deletedId) {
                group.classList.add("deleted");
            }

            const circle =
                document.createElementNS(SVG_NS, "circle");

            circle.setAttribute("cx", position.x);
            circle.setAttribute("cy", position.y);
            circle.setAttribute("r", NODE_RADIUS);
            circle.classList.add("tree-node-circle");

            const text =
                document.createElementNS(SVG_NS, "text");

            text.setAttribute("x", position.x);
            text.setAttribute("y", position.y);
            text.classList.add("tree-node-text");
            text.textContent = node.value;

            group.appendChild(circle);
            group.appendChild(text);

            svg.appendChild(group);
        });

        treeContainer.appendChild(svg);
    }


    /* ================= Interface Helpers ================= */

    function showResult(message, type = "normal") {
        resultDisplay.textContent = message;

        resultDisplay.classList.remove(
            "success",
            "error"
        );

        if (type === "success") {
            resultDisplay.classList.add("success");
        }

        if (type === "error") {
            resultDisplay.classList.add("error");
        }
    }

    function getInputValue() {
        const input = valueInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter a value before selecting an operation.",
                "error"
            );

            valueInput.focus();
            return null;
        }

        const value = Number(input);

        if (
            !Number.isInteger(value) ||
            value < -99 ||
            value > 999
        ) {
            showResult(
                "Enter a whole number between -99 and 999.",
                "error"
            );

            valueInput.focus();
            valueInput.select();

            return null;
        }

        return value;
    }

    function updateStructure(values) {
        structureDisplay.innerHTML = "";

        if (!values || values.length === 0) {
            structureDisplay.innerHTML =
                '<span class="empty-item">Empty</span>';

            return;
        }

        values.forEach(function (value) {
            const item = document.createElement("span");

            item.className = "structure-item";
            item.textContent = value;

            structureDisplay.appendChild(item);
        });
    }

    function clearSelectedTraversal() {
        traversalButtons.forEach(function (button) {
            button.classList.remove("selected");
        });
    }

    function resetStepInterface() {
        steps = [];
        currentStepIndex = -1;
        pendingAction = null;

        nextStepButton.disabled = true;

        comparisonDisplay.textContent =
            "Waiting for an operation";

        structureLabel.textContent = "Visited nodes";

        updateStructure([]);

        traversalOutput.textContent = "—";

        stepCounter.textContent = "0 / 0";
        stepProgressBar.style.width = "0%";

        clearSelectedTraversal();
    }

    function startSteps(action, createdSteps) {
        steps = createdSteps;
        currentStepIndex = -1;
        pendingAction = action;

        nextStepButton.disabled = false;

        currentActionDisplay.textContent =
            action.label;

        stepCounter.textContent =
            `0 / ${steps.length}`;

        stepProgressBar.style.width = "0%";

        comparisonDisplay.textContent =
            "Press Next Step to begin.";

        updateStructure([]);
        traversalOutput.textContent = "—";

        showResult(
            `${action.label} is ready. Press Next Step to trace the algorithm.`
        );
    }


    /* ================= Search Path ================= */

    function createSearchSteps(value, operationName) {
        const createdSteps = [];
        const visited = [];

        let current = root;

        while (current !== null) {
            visited.push(current);

            if (value === current.value) {
                createdSteps.push({
                    activeId: current.id,
                    foundId: current.id,
                    visitedIds: visited.map(function (node) {
                        return node.id;
                    }),
                    values: visited.map(function (node) {
                        return node.value;
                    }),
                    message:
                        `${value} = ${current.value}. Target found.`,
                    result:
                        `${operationName}: ${value} was found.`,
                    final: true,
                    found: true
                });

                return createdSteps;
            }

            const movesLeft = value < current.value;

            createdSteps.push({
                activeId: current.id,
                visitedIds: visited.map(function (node) {
                    return node.id;
                }),
                values: visited.map(function (node) {
                    return node.value;
                }),
                message:
                    `${value} ${movesLeft ? "<" : ">"} ` +
                    `${current.value} → Move ` +
                    `${movesLeft ? "left" : "right"}.`,
                result:
                    `Comparing ${value} with ${current.value}.`,
                final: false
            });

            current =
                movesLeft
                    ? current.left
                    : current.right;
        }

        createdSteps.push({
            activeId: null,
            visitedIds: visited.map(function (node) {
                return node.id;
            }),
            values: visited.map(function (node) {
                return node.value;
            }),
            message: "Reached an empty position.",
            result:
                `${operationName}: ${value} is not in the tree.`,
            final: true,
            found: false
        });

        return createdSteps;
    }


    /* ================= Insert ================= */

    function prepareInsert() {
        const value = getInputValue();

        if (value === null) {
            return;
        }

        clearSelectedTraversal();

        if (findNode(value)) {
            showResult(
                `${value} already exists. Duplicate values are not inserted.`,
                "error"
            );

            return;
        }

        const createdSteps = [];
        const visited = [];

        let current = root;

        if (current === null) {
            createdSteps.push({
                activeId: null,
                visitedIds: [],
                values: [],
                message: "The tree is empty.",
                result: `${value} will become the root.`,
                final: true
            });
        }

        while (current !== null) {
            visited.push(current);

            const movesLeft = value < current.value;
            const nextNode =
                movesLeft
                    ? current.left
                    : current.right;

            createdSteps.push({
                activeId: current.id,
                visitedIds: visited.map(function (node) {
                    return node.id;
                }),
                values: visited.map(function (node) {
                    return node.value;
                }),
                message:
                    `${value} ${movesLeft ? "<" : ">"} ` +
                    `${current.value} → Move ` +
                    `${movesLeft ? "left" : "right"}.`,
                result:
                    `Searching for the correct position for ${value}.`,
                final: nextNode === null
            });

            current = nextNode;
        }

        startSteps(
            {
                type: "insert",
                label: "Insert",
                value: value
            },
            createdSteps
        );
    }


    /* ================= Search ================= */

    function prepareSearch() {
        const value = getInputValue();

        if (value === null) {
            return;
        }

        if (root === null) {
            showResult("The tree is empty.", "error");
            return;
        }

        clearSelectedTraversal();

        startSteps(
            {
                type: "search",
                label: "Search",
                value: value
            },
            createSearchSteps(value, "Search")
        );
    }


    /* ================= Delete ================= */

    function prepareDelete() {
        const value = getInputValue();

        if (value === null) {
            return;
        }

        if (root === null) {
            showResult("The tree is empty.", "error");
            return;
        }

        clearSelectedTraversal();

        startSteps(
            {
                type: "delete",
                label: "Delete",
                value: value
            },
            createSearchSteps(value, "Delete")
        );
    }


    /* ================= Traversals ================= */

    function getTraversalSequence(order) {
        const sequence = [];

        function preorder(node) {
            if (node === null) {
                return;
            }

            sequence.push(node);
            preorder(node.left);
            preorder(node.right);
        }

        function inorder(node) {
            if (node === null) {
                return;
            }

            inorder(node.left);
            sequence.push(node);
            inorder(node.right);
        }

        function postorder(node) {
            if (node === null) {
                return;
            }

            postorder(node.left);
            postorder(node.right);
            sequence.push(node);
        }

        function levelorder(node) {
            if (node === null) {
                return;
            }

            const queue = [node];

            while (queue.length > 0) {
                const current = queue.shift();

                sequence.push(current);

                if (current.left) {
                    queue.push(current.left);
                }

                if (current.right) {
                    queue.push(current.right);
                }
            }
        }

        if (order === "preorder") {
            preorder(root);
        }

        if (order === "inorder") {
            inorder(root);
        }

        if (order === "postorder") {
            postorder(root);
        }

        if (order === "levelorder") {
            levelorder(root);
        }

        return sequence;
    }

    function prepareTraversal(order, selectedButton) {
        if (root === null) {
            showResult("The tree is empty.", "error");
            return;
        }

        clearSelectedTraversal();
        selectedButton.classList.add("selected");

        const names = {
            preorder: "Preorder",
            inorder: "Inorder",
            postorder: "Postorder",
            levelorder: "Level Order"
        };

        const sequence = getTraversalSequence(order);

        const createdSteps = sequence.map(
            function (node, index) {
                const visitedNodes =
                    sequence.slice(0, index + 1);

                return {
                    activeId: node.id,
                    visitedIds: visitedNodes.map(
                        function (visitedNode) {
                            return visitedNode.id;
                        }
                    ),
                    values: visitedNodes.map(
                        function (visitedNode) {
                            return visitedNode.value;
                        }
                    ),
                    message:
                        `Visit node ${node.value}.`,
                    result:
                        `${names[order]} is visiting ${node.value}.`,
                    final: index === sequence.length - 1
                };
            }
        );

        structureLabel.textContent =
            order === "levelorder"
                ? "Queue / visited order"
                : "Traversal stack / visited order";

        startSteps(
            {
                type: "traversal",
                label: names[order],
                order: order
            },
            createdSteps
        );

        structureLabel.textContent =
            order === "levelorder"
                ? "Queue / visited order"
                : "Traversal stack / visited order";
    }


    /* ================= Next Step ================= */

    function executeNextStep() {
        if (steps.length === 0) {
            return;
        }

        currentStepIndex++;

        if (currentStepIndex >= steps.length) {
            return;
        }

        const step = steps[currentStepIndex];

        comparisonDisplay.textContent = step.message;

        updateStructure(step.values);

        traversalOutput.textContent =
            step.values.length > 0
                ? step.values.join(" → ")
                : "—";

        stepCounter.textContent =
            `${currentStepIndex + 1} / ${steps.length}`;

        stepProgressBar.style.width =
            `${((currentStepIndex + 1) / steps.length) * 100}%`;

        renderTree({
            activeId: step.activeId,
            visitedIds: step.visitedIds || [],
            foundId: step.foundId || null
        });

        showResult(step.result);

        if (currentStepIndex === steps.length - 1) {
            finishPendingAction(step);
        }
    }

    function finishPendingAction(finalStep) {
        nextStepButton.disabled = true;

        if (pendingAction.type === "insert") {
            root =
                insertImmediately(
                    root,
                    pendingAction.value
                );

            renderTree();

            showResult(
                `${pendingAction.value} was inserted successfully.`,
                "success"
            );
        }

        if (pendingAction.type === "search") {
            if (finalStep.found) {
                showResult(
                    `${pendingAction.value} was found in the tree.`,
                    "success"
                );
            } else {
                showResult(
                    `${pendingAction.value} was not found.`,
                    "error"
                );
            }
        }

        if (pendingAction.type === "delete") {
            if (finalStep.found) {
                root =
                    deleteImmediately(
                        root,
                        pendingAction.value
                    );

                renderTree();

                showResult(
                    `${pendingAction.value} was deleted successfully.`,
                    "success"
                );
            } else {
                showResult(
                    `${pendingAction.value} cannot be deleted because it was not found.`,
                    "error"
                );
            }
        }

        if (pendingAction.type === "traversal") {
            showResult(
                `${pendingAction.label} completed: ` +
                `${finalStep.values.join(" → ")}`,
                "success"
            );
        }

        currentActionDisplay.textContent = "Completed";
    }


    /* ================= Reset Tree ================= */

    function resetTree() {
        root = null;
        nextNodeId = 1;

        initialValues.forEach(function (value) {
            root = insertImmediately(root, value);
        });

        valueInput.value = "";

        resetStepInterface();
        renderTree();

        currentActionDisplay.textContent = "Ready";

        showResult(
            "Tree reset to 45, 25, 65, 15, 35, 55, 75.",
            "success"
        );
    }


    /* ================= Code Examples ================= */

    const codeDisplay =
        document.getElementById("codeDisplay");

    const codeTitle =
        document.getElementById("codeTitle");

    const codeExplanation =
        document.getElementById("codeExplanation");

    const copyCodeButton =
        document.getElementById("copyCodeButton");

    const codeTabs =
        document.querySelectorAll(".code-tab");

    function showCodeExample(exampleName) {
        const examples =
            window.TREE_CODE_EXAMPLES || {};

        const example = examples[exampleName];

        if (!example) {
            codeDisplay.textContent =
                "Code example could not be loaded.";

            return;
        }

        codeTitle.textContent = example.title;
        codeDisplay.textContent = example.code;
        codeExplanation.textContent =
            example.explanation;
    }

    codeTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            codeTabs.forEach(function (otherTab) {
                otherTab.classList.remove("active");
            });

            tab.classList.add("active");

            showCodeExample(tab.dataset.example);
        });
    });

    copyCodeButton.addEventListener(
        "click",
        async function () {
            try {
                await navigator.clipboard.writeText(
                    codeDisplay.textContent
                );

                copyCodeButton.textContent = "Copied";

                setTimeout(function () {
                    copyCodeButton.textContent =
                        "Copy code";
                }, 1200);
            } catch (error) {
                copyCodeButton.textContent =
                    "Select and copy";
            }
        }
    );


    /* ================= Quiz ================= */

    const quizQuestions =
        document.querySelectorAll(".quiz-question");

    const quizScore =
        document.getElementById("quizScore");

    const answeredQuestions = new Map();

    function updateQuizScore() {
        let score = 0;

        answeredQuestions.forEach(function (correct) {
            if (correct) {
                score++;
            }
        });

        quizScore.textContent =
            `${score} / ${quizQuestions.length}`;
    }

    quizQuestions.forEach(function (question, index) {
        const correctAnswer =
            question.dataset.answer;

        const feedback =
            question.querySelector(".answer-feedback");

        const answerButtons =
            question.querySelectorAll(
                ".answer-list button"
            );

        answerButtons.forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    answerButtons.forEach(
                        function (answerButton) {
                            answerButton.classList.remove(
                                "correct",
                                "incorrect"
                            );
                        }
                    );

                    const isCorrect =
                        button.dataset.choice ===
                        correctAnswer;

                    button.classList.add(
                        isCorrect
                            ? "correct"
                            : "incorrect"
                    );

                    if (!isCorrect) {
                        const correctButton =
                            question.querySelector(
                                `[data-choice="${correctAnswer}"]`
                            );

                        correctButton.classList.add(
                            "correct"
                        );
                    }

                    answeredQuestions.set(
                        index,
                        isCorrect
                    );

                    feedback.textContent =
                        isCorrect
                            ? "Correct. Good work!"
                            : "Not quite. Review the highlighted answer.";

                    updateQuizScore();
                }
            );
        });
    });


    /* ================= Challenge ================= */

    const challengeInput =
        document.getElementById("challengeInput");

    const challengeInsertButton =
        document.getElementById(
            "challengeInsertButton"
        );

    const checkChallengeButton =
        document.getElementById(
            "checkChallengeButton"
        );

    const resetChallengeButton =
        document.getElementById(
            "resetChallengeButton"
        );

    const challengeValuesDisplay =
        document.getElementById("challengeValues");

    const challengeResult =
        document.getElementById("challengeResult");

    const missionRoot =
        document.getElementById("missionRoot");

    const missionChildren =
        document.getElementById("missionChildren");

    const missionInorder =
        document.getElementById("missionInorder");

    let challengeRoot = null;
    let challengeValues = [];

    function createChallengeNode(value) {
        return {
            value: value,
            left: null,
            right: null
        };
    }

    function insertChallengeNode(node, value) {
        if (node === null) {
            return createChallengeNode(value);
        }

        if (value < node.value) {
            node.left =
                insertChallengeNode(
                    node.left,
                    value
                );
        } else if (value > node.value) {
            node.right =
                insertChallengeNode(
                    node.right,
                    value
                );
        }

        return node;
    }

    function getChallengeInorder(node, values) {
        if (node === null) {
            return;
        }

        getChallengeInorder(node.left, values);
        values.push(node.value);
        getChallengeInorder(node.right, values);
    }

    function updateChallengeValues() {
        challengeValuesDisplay.textContent =
            challengeValues.length > 0
                ? challengeValues.join(" → ")
                : "No values inserted";
    }

    function insertChallengeValue() {
        const input =
            challengeInput.value.trim();

        const value = Number(input);

        if (
            input === "" ||
            !Number.isInteger(value)
        ) {
            challengeResult.textContent =
                "Enter a valid whole number.";

            challengeResult.className =
                "challenge-result error";

            return;
        }

        if (challengeValues.includes(value)) {
            challengeResult.textContent =
                "That value has already been inserted.";

            challengeResult.className =
                "challenge-result error";

            return;
        }

        challengeRoot =
            insertChallengeNode(
                challengeRoot,
                value
            );

        challengeValues.push(value);

        challengeInput.value = "";
        challengeInput.focus();

        updateChallengeValues();

        challengeResult.textContent =
            `${value} inserted into the challenge tree.`;

        challengeResult.className =
            "challenge-result";
    }

    function checkChallenge() {
        const inorderValues = [];

        getChallengeInorder(
            challengeRoot,
            inorderValues
        );

        const rootPassed =
            challengeRoot !== null &&
            challengeRoot.value === 50;

        const childrenPassed =
            challengeRoot !== null &&
            challengeRoot.left !== null &&
            challengeRoot.right !== null;

        const inorderPassed =
            inorderValues.join(",") ===
            "20,30,50,70,80";

        missionRoot.classList.toggle(
            "passed",
            rootPassed
        );

        missionChildren.classList.toggle(
            "passed",
            childrenPassed
        );

        missionInorder.classList.toggle(
            "passed",
            inorderPassed
        );

        if (
            rootPassed &&
            childrenPassed &&
            inorderPassed
        ) {
            challengeResult.textContent =
                "Mission completed! You built a valid BST.";

            challengeResult.className =
                "challenge-result success";
        } else {
            challengeResult.textContent =
                `Not complete yet. Current inorder: ` +
                `${inorderValues.join(", ") || "empty"}.`;

            challengeResult.className =
                "challenge-result error";
        }
    }

    function resetChallenge() {
        challengeRoot = null;
        challengeValues = [];

        challengeInput.value = "";

        missionRoot.classList.remove("passed");
        missionChildren.classList.remove("passed");
        missionInorder.classList.remove("passed");

        challengeResult.textContent = "";
        challengeResult.className =
            "challenge-result";

        updateChallengeValues();
    }


    /* ================= Progress ================= */

    const completeLessonButton =
        document.getElementById(
            "completeLessonButton"
        );

    if (
        typeof isLessonCompleted === "function" &&
        isLessonCompleted("tree")
    ) {
        completeLessonButton.textContent =
            "Completed ✓";

        completeLessonButton.classList.add(
            "completed"
        );
    }

    completeLessonButton.addEventListener(
        "click",
        function () {
            let saved = true;

            if (
                typeof completeLesson === "function"
            ) {
                saved = completeLesson("tree");
            }

            if (saved !== false) {
                completeLessonButton.textContent =
                    "Completed ✓";

                completeLessonButton.classList.add(
                    "completed"
                );

                alert("Tree lesson completed!");
            }
        }
    );


    /* ================= Events ================= */

    insertButton.addEventListener(
        "click",
        prepareInsert
    );

    searchButton.addEventListener(
        "click",
        prepareSearch
    );

    deleteButton.addEventListener(
        "click",
        prepareDelete
    );

    nextStepButton.addEventListener(
        "click",
        executeNextStep
    );

    resetButton.addEventListener(
        "click",
        resetTree
    );

    traversalButtons.forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                prepareTraversal(
                    button.dataset.order,
                    button
                );
            }
        );
    });

    valueInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                prepareInsert();
            }
        }
    );

    challengeInsertButton.addEventListener(
        "click",
        insertChallengeValue
    );

    checkChallengeButton.addEventListener(
        "click",
        checkChallenge
    );

    resetChallengeButton.addEventListener(
        "click",
        resetChallenge
    );

    challengeInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                insertChallengeValue();
            }
        }
    );


    /* ================= Initial Page ================= */

    showCodeExample("node");
    resetChallenge();
    resetTree();

});