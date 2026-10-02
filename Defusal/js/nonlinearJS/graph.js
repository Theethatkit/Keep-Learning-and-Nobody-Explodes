document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const $ = id => document.getElementById(id);

    const LESSON_ID = "graph";
    const VERTICES = ["A", "B", "C", "D", "E", "F"];

    const INITIAL_EDGES = [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["C", "D"],
        ["D", "E"],
        ["E", "F"]
    ];

    const SVG_NS = "http://www.w3.org/2000/svg";
    const positions = {
        A: { x: 160, y: 35 },
        B: { x: 275, y: 95 },
        C: { x: 45, y: 95 },
        D: { x: 160, y: 165 },
        E: { x: 80, y: 275 },
        F: { x: 240, y: 275 }
    };

    let adjacency;
    let trace = null;

    /* ================= Authentication ================= */

    try {
        if (localStorage.getItem("loggedInUser")) {
            $("authButton").textContent = "Profile";
            $("authButton").href = "../profile.html";
        }
    } catch (error) {
        console.warn("Login state could not be read.", error);
    }

    /* ================= Graph State ================= */

    function buildEmptyGraph() {
        adjacency = new Map();

        VERTICES.forEach(function (vertex) {
            adjacency.set(vertex, new Set());
        });
    }

    function isDirected() {
        return $("graphType").value === "directed";
    }

    function addEdge(from, to) {
        adjacency.get(from).add(to);

        if (!isDirected()) {
            adjacency.get(to).add(from);
        }
    }

    function removeEdge(from, to) {
        adjacency.get(from).delete(to);

        if (!isDirected()) {
            adjacency.get(to).delete(from);
        }
    }

    function buildInitialGraph() {
        buildEmptyGraph();

        INITIAL_EDGES.forEach(function ([from, to]) {
            addEdge(from, to);
        });
    }

    function edgeKey(from, to) {
        return isDirected()
            ? `${from}->${to}`
            : [from, to].sort().join("-");
    }

    function edgeList() {
        const edges = [];
        const seen = new Set();

        adjacency.forEach(function (neighbors, from) {
            neighbors.forEach(function (to) {
                const key = edgeKey(from, to);

                if (!seen.has(key)) {
                    seen.add(key);
                    edges.push([from, to]);
                }
            });
        });

        return edges;
    }

    /* ================= Selects ================= */

    function populateSelects() {
        [$("vertexFromInput"), $("vertexToInput")]
            .forEach(function (select) {
                select.replaceChildren();

                VERTICES.forEach(function (vertex) {
                    const option =
                        document.createElement("option");

                    option.value = vertex;
                    option.textContent = vertex;

                    select.append(option);
                });
            });

        $("vertexToInput").selectedIndex = 1;
    }

    /* ================= Rendering ================= */

    function svgElement(name) {
        return document.createElementNS(SVG_NS, name);
    }

    function displayGraph(
        visited = [],
        current = null,
        usedEdges = []
    ) {
        const container = $("interactiveGraph");

        container.replaceChildren();

        $("vertexCount").textContent = VERTICES.length;
        $("edgeCount").textContent = edgeList().length;

        const svg = svgElement("svg");

        svg.setAttribute("viewBox", "0 0 320 320");
        svg.setAttribute("width", "420");
        svg.setAttribute("height", "420");

        if (isDirected()) {
            const definitions = svgElement("defs");
            const marker = svgElement("marker");

            marker.setAttribute("id", "arrowhead");
            marker.setAttribute("markerWidth", "8");
            marker.setAttribute("markerHeight", "6");
            marker.setAttribute("refX", "24");
            marker.setAttribute("refY", "3");
            marker.setAttribute("orient", "auto");

            const path = svgElement("path");

            path.setAttribute("d", "M0,0 L0,6 L8,3 z");
            path.setAttribute("fill", "#64748b");

            marker.append(path);
            definitions.append(marker);
            svg.append(definitions);
        }

        const usedKeys = usedEdges.map(function ([from, to]) {
            return edgeKey(from, to);
        });

        edgeList().forEach(function ([from, to]) {
            const line = svgElement("line");

            line.setAttribute("x1", positions[from].x);
            line.setAttribute("y1", positions[from].y);
            line.setAttribute("x2", positions[to].x);
            line.setAttribute("y2", positions[to].y);
            line.classList.add("tree-edge");

            if (isDirected()) {
                line.setAttribute(
                    "marker-end",
                    "url(#arrowhead)"
                );
            }

            if (usedKeys.includes(edgeKey(from, to))) {
                line.classList.add("visited");
            }

            svg.append(line);
        });

        VERTICES.forEach(function (vertex) {
            const group = svgElement("g");
            const circle = svgElement("circle");
            const text = svgElement("text");

            group.classList.add("tree-node");

            if (vertex === current) {
                group.classList.add("current");
            } else if (visited.includes(vertex)) {
                group.classList.add("selected");
            }

            circle.setAttribute("cx", positions[vertex].x);
            circle.setAttribute("cy", positions[vertex].y);
            circle.setAttribute("r", "24");
            circle.classList.add("tree-node-circle");

            text.setAttribute("x", positions[vertex].x);
            text.setAttribute("y", positions[vertex].y);
            text.classList.add("tree-node-text");
            text.textContent = vertex;

            group.append(circle, text);
            svg.append(group);
        });

        container.append(svg);
    }

    function updateAdjacencyList() {
        const panel = $("adjacencyList");

        panel.replaceChildren();

        VERTICES.forEach(function (vertex) {
            const row = document.createElement("div");
            const title = document.createElement("strong");
            const neighbors = Array
                .from(adjacency.get(vertex))
                .sort();

            row.className = "adjacency-row";
            title.textContent = vertex;

            row.append(
                title,
                document.createTextNode(
                    ` → ${neighbors.join(", ") || "—"}`
                )
            );

            panel.append(row);
        });
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

    /* ================= Edge Operations ================= */

    function selectedVertices() {
        return {
            from: $("vertexFromInput").value,
            to: $("vertexToInput").value
        };
    }

    function handleAddEdge() {
        const { from, to } = selectedVertices();

        if (from === to) {
            showResult(
                "Choose two different vertices.",
                "error"
            );

            return;
        }

        if (adjacency.get(from).has(to)) {
            showResult(
                `${from}${isDirected() ? "→" : "—"}${to} already exists.`,
                "error"
            );

            return;
        }

        addEdge(from, to);
        displayGraph([from, to], null, [[from, to]]);
        updateAdjacencyList();

        showResult(
            `Added ${from}${isDirected() ? "→" : "—"}${to}.`,
            "success"
        );
    }

    function handleRemoveEdge() {
        const { from, to } = selectedVertices();

        if (!adjacency.get(from).has(to)) {
            showResult(
                `No edge exists from ${from} to ${to}.`,
                "error"
            );

            return;
        }

        removeEdge(from, to);
        displayGraph([from, to]);
        updateAdjacencyList();

        showResult(
            `Removed ${from}${isDirected() ? "→" : "—"}${to}.`,
            "success"
        );
    }

    /* ================= Traversal Frames ================= */

    function buildBFS(start) {
        const discovered = new Set([start]);
        const queue = [start];
        const order = [];
        const usedEdges = [];
        const frames = [];

        while (queue.length > 0) {
            const current = queue.shift();

            order.push(current);

            Array.from(adjacency.get(current))
                .sort()
                .forEach(function (neighbor) {
                    if (!discovered.has(neighbor)) {
                        discovered.add(neighbor);
                        queue.push(neighbor);
                        usedEdges.push([current, neighbor]);
                    }
                });

            frames.push({
                current,
                visited: [...order],
                working: [...queue],
                usedEdges: [...usedEdges],
                message:
                    `Visit ${current}. Queue now: ` +
                    `${queue.join(" → ") || "Empty"}.`
            });
        }

        return {
            name: "BFS",
            label: "Queue · Front → Rear",
            frames
        };
    }

    function buildDFS(start) {
        const visited = new Set();
        const stack = [{ vertex: start, parent: null }];
        const order = [];
        const usedEdges = [];
        const frames = [];

        while (stack.length > 0) {
            const item = stack.pop();

            if (visited.has(item.vertex)) {
                continue;
            }

            visited.add(item.vertex);
            order.push(item.vertex);

            if (item.parent !== null) {
                usedEdges.push([
                    item.parent,
                    item.vertex
                ]);
            }

            const neighbors = Array
                .from(adjacency.get(item.vertex))
                .sort()
                .reverse();

            neighbors.forEach(function (neighbor) {
                if (!visited.has(neighbor)) {
                    stack.push({
                        vertex: neighbor,
                        parent: item.vertex
                    });
                }
            });

            frames.push({
                current: item.vertex,
                visited: [...order],
                working: stack.map(entry => entry.vertex),
                usedEdges: [...usedEdges],
                message:
                    `Visit ${item.vertex}. Stack bottom → top: ` +
                    `${stack.map(entry => entry.vertex).join(" → ") || "Empty"}.`
            });
        }

        return {
            name: "DFS",
            label: "Stack · Bottom → Top",
            frames
        };
    }

    /* ================= Trace Engine ================= */

    const controlIds = [
        "addEdgeButton",
        "removeEdgeButton",
        "bfsButton",
        "dfsButton",
        "resetButton"
    ];

    function lockControls(locked) {
        controlIds.forEach(function (id) {
            $(id).disabled = locked;
        });

        $("graphType").disabled = locked;
        $("vertexFromInput").disabled = locked;
        $("vertexToInput").disabled = locked;
    }

    function startTrace(type) {
        const start = $("vertexFromInput").value;

        trace = type === "BFS"
            ? buildBFS(start)
            : buildDFS(start);

        trace.index = 0;

        $("stepHistory").replaceChildren();
        $("workingLabel").textContent = trace.label;
        $("workingStructure").textContent = start;
        $("visitedOrder").textContent = "Empty";
        $("stepStatus").textContent =
            `${trace.name}: 0 / ${trace.frames.length}`;

        $("nextStepButton").disabled = false;

        lockControls(true);

        displayGraph();

        showResult(
            `${trace.name} is ready from ${start}. ` +
            "Predict the next vertex, then press Next Step."
        );
    }

    function nextStep() {
        if (!trace) {
            return;
        }

        const active = trace;
        const frame = active.frames[active.index];

        active.index++;

        displayGraph(
            frame.visited,
            frame.current,
            frame.usedEdges
        );

        $("workingStructure").textContent =
            frame.working.join(" → ") || "Empty";

        $("visitedOrder").textContent =
            frame.visited.join(" → ");

        showResult(frame.message);

        const historyItem =
            document.createElement("li");

        historyItem.textContent = frame.message;
        $("stepHistory").append(historyItem);

        const finished =
            active.index === active.frames.length;

        if (finished) {
            showResult(
                `${active.name} completed: ` +
                `${frame.visited.join(" → ")}`,
                "success"
            );

            $("stepStatus").textContent =
                `${active.name}: completed`;

            $("nextStepButton").disabled = true;

            trace = null;
            lockControls(false);
        } else {
            $("stepStatus").textContent =
                `${active.name}: ${active.index} / ` +
                `${active.frames.length}`;
        }
    }

    /* ================= Reset and Type ================= */

    function resetGraph() {
        trace = null;
        buildInitialGraph();

        lockControls(false);

        $("nextStepButton").disabled = true;
        $("stepHistory").replaceChildren();
        $("workingStructure").textContent = "Empty";
        $("visitedOrder").textContent = "Empty";
        $("stepStatus").textContent =
            "No traversal in progress";

        displayGraph();
        updateAdjacencyList();

        showResult(
            "The graph has been reset.",
            "success"
        );
    }

    function changeGraphType() {
        resetGraph();

        showResult(
            `${isDirected() ? "Directed" : "Undirected"} graph selected. ` +
            "The initial edges were rebuilt using this rule.",
            "success"
        );
    }

    /* ================= Challenge ================= */

    function findPath(start, target) {
        const queue = [[start]];
        const visited = new Set([start]);

        while (queue.length > 0) {
            const path = queue.shift();
            const current = path[path.length - 1];

            if (current === target) {
                return path;
            }

            Array.from(adjacency.get(current))
                .sort()
                .forEach(function (neighbor) {
                    if (!visited.has(neighbor)) {
                        visited.add(neighbor);
                        queue.push([...path, neighbor]);
                    }
                });
        }

        return null;
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

    function checkChallengePath() {
        const path = findPath("A", "F");

        if (!path) {
            challengeMessage(
                "No path currently exists from A to F. Add more edges.",
                "error"
            );

            return;
        }

        const pathEdges = [];

        for (let i = 0; i < path.length - 1; i++) {
            pathEdges.push([path[i], path[i + 1]]);
        }

        displayGraph(path, null, pathEdges);

        challengeMessage(
            `Path found: ${path.join(" → ")}`,
            "success"
        );
    }

    function clearForChallenge() {
        buildEmptyGraph();
        displayGraph();
        updateAdjacencyList();

        challengeMessage(
            "All edges removed. Build a path from A to F."
        );

        showResult(
            "Challenge graph ready. Add edges using From and To."
        );
    }

    /* ================= Practice ================= */

    const questions = {
        bfs: {
            correct: 1,
            feedback: [
                "A Stack processes the most recently added item first.",
                "Correct. BFS uses a Queue to process discoveries in FIFO order.",
                "An array can implement a Queue, but the required behavior is FIFO."
            ]
        },

        directed: {
            correct: 0,
            feedback: [
                "Correct. A→B permits movement from A toward B.",
                "B→A requires another directed edge or a different path.",
                "A→B is a connection from A to B."
            ]
        },

        complexity: {
            correct: 1,
            feedback: [
                "Traversal depends on the number of vertices and edges.",
                "Correct. Each reachable vertex and edge is processed a limited number of times.",
                "BFS and DFS with adjacency lists do not require this squared cost."
            ]
        }
    };

    const solved = new Set();

    document.querySelectorAll(".question-card")
        .forEach(function (card) {
            const id = card.dataset.question;
            const data = questions[id];
            const buttons =
                card.querySelectorAll("[data-answer]");
            const feedback =
                card.querySelector(".question-feedback");

            buttons.forEach(function (button) {
                button.setAttribute(
                    "aria-pressed",
                    "false"
                );

                button.addEventListener("click", function () {
                    const answer =
                        Number(this.dataset.answer);

                    const correct =
                        answer === data.correct;

                    buttons.forEach(function (item) {
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

    /* ================= Events ================= */

    $("addEdgeButton").addEventListener(
        "click",
        handleAddEdge
    );

    $("removeEdgeButton").addEventListener(
        "click",
        handleRemoveEdge
    );

    $("bfsButton").addEventListener(
        "click",
        () => startTrace("BFS")
    );

    $("dfsButton").addEventListener(
        "click",
        () => startTrace("DFS")
    );

    $("nextStepButton").addEventListener(
        "click",
        nextStep
    );

    $("resetButton").addEventListener(
        "click",
        resetGraph
    );

    $("graphType").addEventListener(
        "change",
        changeGraphType
    );

    $("checkPathButton").addEventListener(
        "click",
        checkChallengePath
    );

    $("challengeResetButton").addEventListener(
        "click",
        clearForChallenge
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
                    "Graph lesson completion saved.";
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

    populateSelects();
    resetGraph();
});