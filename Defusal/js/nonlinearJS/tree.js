document.addEventListener("DOMContentLoaded", function () {

    /* ================= Authentication ================= */

    const authButton = document.getElementById("authButton");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (authButton) {
        if (loggedInUser) {
            authButton.textContent = "Logout";
            authButton.href = "#";

            authButton.addEventListener("click", function (event) {
                event.preventDefault();

                localStorage.removeItem("loggedInUser");
                window.location.href = "../../index.html";
            });
        } else {
            authButton.textContent = "Log in";
            authButton.href = "../login.html";
        }
    }


    /* ================= Tree Settings ================= */

    const initialValues = [45, 25, 65, 15, 35, 55, 75];

    const SVG_NS = "http://www.w3.org/2000/svg";

    const NODE_RADIUS = 22;
    const LEVEL_HEIGHT = 80;
    const NODE_SPACING = 62;
    const TOP_MARGIN = 30;
    const SIDE_MARGIN = 30;

    let root = null;
    let nextId = 1;

    const treeContainer =
        document.getElementById("interactiveTree");

    const resultText =
        document.getElementById("visualizationResult");

    const valueInput =
        document.getElementById("valueInput");

    const nodeCountLabel =
        document.getElementById("nodeCount");

    const treeHeightLabel =
        document.getElementById("treeHeight");

    const operationButtons =
        document.querySelectorAll(".operation-buttons button");


    /* ================= Node Factory ================= */

    function createNode(value) {
        return {
            id: nextId++,
            value: value,
            left: null,
            right: null
        };
    }


    /* ================= Insert (data only, no animation) ================= */

    function insertValue(node, value) {
        if (node === null) {
            return createNode(value);
        }

        if (value < node.value) {
            node.left = insertValue(node.left, value);
        } else if (value > node.value) {
            node.right = insertValue(node.right, value);
        }

        return node;
    }


    /* ================= Layout ================= */

    function computeLayout() {
        const positions = new Map();
        let cursor = 0;

        function assign(node, depth) {
            if (node === null) {
                return;
            }

            assign(node.left, depth + 1);

            positions.set(node.id, {
                node: node,
                x: cursor * NODE_SPACING + SIDE_MARGIN + NODE_RADIUS,
                y: depth * LEVEL_HEIGHT + TOP_MARGIN + NODE_RADIUS
            });

            cursor++;

            assign(node.right, depth + 1);
        }

        assign(root, 0);

        return positions;
    }


    function treeHeight(node) {
        if (node === null) {
            return 0;
        }

        return 1 + Math.max(
            treeHeight(node.left),
            treeHeight(node.right)
        );
    }


    function countNodes(node) {
        if (node === null) {
            return 0;
        }

        return 1 + countNodes(node.left) + countNodes(node.right);
    }


    /* ================= Render ================= */

    function displayTree(highlightIds = [], foundId = null) {
        treeContainer.innerHTML = "";

        nodeCountLabel.textContent = countNodes(root);
        treeHeightLabel.textContent = treeHeight(root);

        if (root === null) {
            treeContainer.innerHTML =
                '<p class="empty-message">The tree is empty.</p>';

            return;
        }

        const positions = computeLayout();

        let maxX = 0;
        let maxY = 0;

        positions.forEach(function (position) {
            maxX = Math.max(maxX, position.x);
            maxY = Math.max(maxY, position.y);
        });

        const svg = document.createElementNS(SVG_NS, "svg");

        svg.setAttribute(
            "viewBox",
            `0 0 ${maxX + SIDE_MARGIN + NODE_RADIUS} ${maxY + NODE_RADIUS + 20}`
        );

        svg.setAttribute(
            "width",
            Math.max(maxX + SIDE_MARGIN + NODE_RADIUS, 320)
        );

        svg.setAttribute("height", maxY + NODE_RADIUS + 20);


        /* Draw Edges */

        positions.forEach(function (position) {
            const node = position.node;

            [node.left, node.right].forEach(function (child) {
                if (child === null) {
                    return;
                }

                const childPosition = positions.get(child.id);

                const line = document.createElementNS(SVG_NS, "line");

                line.setAttribute("x1", position.x);
                line.setAttribute("y1", position.y);
                line.setAttribute("x2", childPosition.x);
                line.setAttribute("y2", childPosition.y);

                line.classList.add("tree-edge");

                svg.appendChild(line);
            });
        });


        /* Draw Nodes */

        positions.forEach(function (position) {
            const node = position.node;

            const group = document.createElementNS(SVG_NS, "g");
            group.classList.add("tree-node");

            if (foundId === node.id) {
                group.classList.add("found");
            } else if (highlightIds.includes(node.id)) {
                group.classList.add("selected");
            }

            const circle = document.createElementNS(SVG_NS, "circle");

            circle.setAttribute("cx", position.x);
            circle.setAttribute("cy", position.y);
            circle.setAttribute("r", NODE_RADIUS);

            circle.classList.add("tree-node-circle");

            const text = document.createElementNS(SVG_NS, "text");

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


    /* ================= Result Message ================= */

    function showResult(message, type = "normal") {
        resultText.textContent = message;

        resultText.classList.remove(
            "result-success",
            "result-error"
        );

        if (type === "success") {
            resultText.classList.add("result-success");
        }

        if (type === "error") {
            resultText.classList.add("result-error");
        }
    }


    /* ================= Input Validation ================= */

    function getValue() {
        const input = valueInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter a value.",
                "error"
            );

            valueInput.focus();
            return null;
        }

        const value = Number(input);

        if (!Number.isInteger(value)) {
            showResult(
                "Please enter a whole number.",
                "error"
            );

            valueInput.focus();
            valueInput.select();

            return null;
        }

        return value;
    }


    /* ================= Helper Functions ================= */

    function wait(milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, milliseconds);
        });
    }


    function disableButtons(disabled) {
        operationButtons.forEach(function (button) {
            button.disabled = disabled;
        });
    }


    function findPath(value) {
        const path = [];
        let current = root;

        while (current !== null) {
            path.push(current);

            if (value === current.value) {
                return { path, found: current };
            }

            current = value < current.value ? current.left : current.right;
        }

        return { path, found: null };
    }


    /* ================= Insert ================= */

    async function handleInsert() {
        const value = getValue();

        if (value === null) {
            return;
        }

        const existing = findPath(value);

        if (existing.found) {
            displayTree(existing.path.map((node) => node.id));

            showResult(
                `${value} is already in the tree. Duplicate values are not inserted.`,
                "error"
            );

            return;
        }

        disableButtons(true);

        for (let i = 0; i < existing.path.length; i++) {
            displayTree(existing.path.slice(0, i + 1).map((node) => node.id));

            showResult(
                `Insert: ${value} ${value < existing.path[i].value ? "<" : ">"} ${existing.path[i].value}, moving ${value < existing.path[i].value ? "left" : "right"}...`
            );

            await wait(500);
        }

        root = insertValue(root, value);

        displayTree();

        showResult(
            `Insert: ${value} was added to the tree.`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Search ================= */

    async function handleSearch() {
        if (root === null) {
            showResult(
                "The tree is empty.",
                "error"
            );

            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        disableButtons(true);

        const { path, found } = findPath(value);

        for (let i = 0; i < path.length; i++) {
            const isLast = i === path.length - 1;

            displayTree(
                path.slice(0, i + 1).map((node) => node.id),
                isLast && found ? found.id : null
            );

            if (path[i].value === value) {
                showResult(
                    `Search: ${value} was found.`,
                    "success"
                );
            } else {
                showResult(
                    `Search: Checking ${path[i].value}, moving ${value < path[i].value ? "left" : "right"}...`
                );
            }

            await wait(500);
        }

        if (!found) {
            displayTree();

            showResult(
                `${value} was not found in the tree.`,
                "error"
            );
        }

        disableButtons(false);
    }


    /* ================= Delete ================= */

    function findMin(node) {
        let current = node;

        while (current.left !== null) {
            current = current.left;
        }

        return current;
    }

    function removeValue(node, value) {
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.left = removeValue(node.left, value);
        } else if (value > node.value) {
            node.right = removeValue(node.right, value);
        } else {
            if (node.left === null) {
                return node.right;
            }

            if (node.right === null) {
                return node.left;
            }

            const successor = findMin(node.right);

            node.value = successor.value;
            node.right = removeValue(node.right, successor.value);
        }

        return node;
    }

    async function handleDelete() {
        if (root === null) {
            showResult(
                "The tree is already empty.",
                "error"
            );

            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        disableButtons(true);

        const { path, found } = findPath(value);

        for (let i = 0; i < path.length; i++) {
            displayTree(path.slice(0, i + 1).map((node) => node.id));

            showResult(
                path[i].value === value
                    ? `Delete: ${value} was found, removing it...`
                    : `Delete: Checking ${path[i].value}, moving ${value < path[i].value ? "left" : "right"}...`
            );

            await wait(500);
        }

        if (!found) {
            displayTree();

            showResult(
                `${value} was not found in the tree.`,
                "error"
            );

            disableButtons(false);
            return;
        }

        root = removeValue(root, value);

        displayTree();

        showResult(
            `Delete: ${value} was removed from the tree.`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Traversals ================= */

    async function runTraversal(order, label) {
        if (root === null) {
            showResult(
                "The tree is empty.",
                "error"
            );

            return;
        }

        disableButtons(true);

        const sequence = [];

        function collect(node) {
            if (node === null) {
                return;
            }

            if (order === "pre") {
                sequence.push(node);
            }

            collect(node.left);

            if (order === "in") {
                sequence.push(node);
            }

            collect(node.right);

            if (order === "post") {
                sequence.push(node);
            }
        }

        if (order === "level") {
            const queue = [root];

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
        } else {
            collect(root);
        }

        const visitedValues = [];

        for (let i = 0; i < sequence.length; i++) {
            visitedValues.push(sequence[i].value);

            displayTree(sequence.slice(0, i + 1).map((node) => node.id));

            showResult(
                `${label}: Visiting ${sequence[i].value}...`
            );

            await wait(500);
        }

        displayTree();

        showResult(
            `${label} completed: ${visitedValues.join(" → ")}`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Reset ================= */

    function resetTree() {
        root = null;
        nextId = 1;

        initialValues.forEach(function (value) {
            root = insertValue(root, value);
        });

        valueInput.value = "";

        displayTree();

        showResult(
            "The tree has been reset.",
            "success"
        );
    }


    /* ================= Button Events ================= */

    document
        .getElementById("insertButton")
        .addEventListener("click", handleInsert);

    document
        .getElementById("searchButton")
        .addEventListener("click", handleSearch);

    document
        .getElementById("deleteButton")
        .addEventListener("click", handleDelete);

    document
        .getElementById("preorderButton")
        .addEventListener("click", () => runTraversal("pre", "Preorder"));

    document
        .getElementById("inorderButton")
        .addEventListener("click", () => runTraversal("in", "Inorder"));

    document
        .getElementById("postorderButton")
        .addEventListener("click", () => runTraversal("post", "Postorder"));

    document
        .getElementById("levelOrderButton")
        .addEventListener("click", () => runTraversal("level", "Level Order"));

    document
        .getElementById("resetButton")
        .addEventListener("click", resetTree);


    /* ================= Initial Display ================= */

    resetTree();

});