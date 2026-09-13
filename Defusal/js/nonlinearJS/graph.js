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


    /* ================= Graph Settings ================= */

    const VERTICES = ["A", "B", "C", "D", "E", "F"];

    const initialEdges = [
        ["A", "B"],
        ["A", "C"],
        ["B", "D"],
        ["C", "D"],
        ["D", "E"],
        ["E", "F"]
    ];

    const SVG_NS = "http://www.w3.org/2000/svg";

    const NODE_RADIUS = 24;
    const CIRCLE_RADIUS = 130;
    const CENTER_X = 160;
    const CENTER_Y = 160;

    let adjacency = new Map();

    const graphContainer =
        document.getElementById("interactiveGraph");

    const resultText =
        document.getElementById("visualizationResult");

    const fromSelect =
        document.getElementById("vertexFromInput");

    const toSelect =
        document.getElementById("vertexToInput");

    const vertexCountLabel =
        document.getElementById("vertexCount");

    const edgeCountLabel =
        document.getElementById("edgeCount");

    const adjacencyListPanel =
        document.getElementById("adjacencyList");

    const operationButtons =
        document.querySelectorAll(".operation-buttons button");


    /* ================= Setup ================= */

    function buildInitialGraph() {
        adjacency = new Map();

        VERTICES.forEach(function (vertex) {
            adjacency.set(vertex, new Set());
        });

        initialEdges.forEach(function ([a, b]) {
            adjacency.get(a).add(b);
            adjacency.get(b).add(a);
        });
    }

    function populateSelects() {
        [fromSelect, toSelect].forEach(function (select) {
            select.innerHTML = "";

            VERTICES.forEach(function (vertex) {
                const option = document.createElement("option");

                option.value = vertex;
                option.textContent = vertex;

                select.appendChild(option);
            });
        });

        toSelect.selectedIndex = 1;
    }


    /* ================= Layout ================= */

    function getPositions() {
        const positions = new Map();

        VERTICES.forEach(function (vertex, index) {
            const angle =
                (index / VERTICES.length) * 2 * Math.PI - Math.PI / 2;

            positions.set(vertex, {
                x: CENTER_X + CIRCLE_RADIUS * Math.cos(angle),
                y: CENTER_Y + CIRCLE_RADIUS * Math.sin(angle)
            });
        });

        return positions;
    }

    function edgeKey(a, b) {
        return [a, b].sort().join("-");
    }

    function getEdgeList() {
        const seen = new Set();
        const edges = [];

        adjacency.forEach(function (neighbors, vertex) {
            neighbors.forEach(function (neighbor) {
                const key = edgeKey(vertex, neighbor);

                if (!seen.has(key)) {
                    seen.add(key);
                    edges.push([vertex, neighbor]);
                }
            });
        });

        return edges;
    }


    /* ================= Render ================= */

    function displayGraph(highlightVertices = [], currentVertex = null, highlightEdges = []) {
        graphContainer.innerHTML = "";

        vertexCountLabel.textContent = VERTICES.length;
        edgeCountLabel.textContent = getEdgeList().length;

        const positions = getPositions();

        const svg = document.createElementNS(SVG_NS, "svg");

        svg.setAttribute("viewBox", "0 0 320 320");
        svg.setAttribute("width", 320);
        svg.setAttribute("height", 320);

        const highlightEdgeKeys = highlightEdges.map(
            ([a, b]) => edgeKey(a, b)
        );


        /* Draw Edges */

        getEdgeList().forEach(function ([a, b]) {
            const positionA = positions.get(a);
            const positionB = positions.get(b);

            const line = document.createElementNS(SVG_NS, "line");

            line.setAttribute("x1", positionA.x);
            line.setAttribute("y1", positionA.y);
            line.setAttribute("x2", positionB.x);
            line.setAttribute("y2", positionB.y);

            line.classList.add("tree-edge");

            if (highlightEdgeKeys.includes(edgeKey(a, b))) {
                line.classList.add("visited");
            }

            svg.appendChild(line);
        });


        /* Draw Vertices */

        VERTICES.forEach(function (vertex) {
            const position = positions.get(vertex);

            const group = document.createElementNS(SVG_NS, "g");
            group.classList.add("tree-node");

            if (vertex === currentVertex) {
                group.classList.add("current");
            } else if (highlightVertices.includes(vertex)) {
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
            text.textContent = vertex;

            group.appendChild(circle);
            group.appendChild(text);

            svg.appendChild(group);
        });

        graphContainer.appendChild(svg);
    }


    /* ================= Adjacency Panel ================= */

    function updateAdjacencyPanel() {
        adjacencyListPanel.innerHTML = "";

        VERTICES.forEach(function (vertex) {
            const neighbors = Array.from(adjacency.get(vertex)).sort();

            const row = document.createElement("div");
            row.classList.add("adjacency-row");

            row.innerHTML =
                `<strong>${vertex}</strong> → ${neighbors.length ? neighbors.join(", ") : "—"}`;

            adjacencyListPanel.appendChild(row);
        });
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


    /* ================= Add / Remove Edge ================= */

    function handleAddEdge() {
        const from = fromSelect.value;
        const to = toSelect.value;

        if (from === to) {
            showResult(
                "Choose two different vertices to connect.",
                "error"
            );

            return;
        }

        if (adjacency.get(from).has(to)) {
            displayGraph([from, to]);

            showResult(
                `An edge between ${from} and ${to} already exists.`,
                "error"
            );

            return;
        }

        adjacency.get(from).add(to);
        adjacency.get(to).add(from);

        displayGraph([from, to], null, [[from, to]]);
        updateAdjacencyPanel();

        showResult(
            `Add Edge: ${from} and ${to} are now connected.`,
            "success"
        );
    }

    function handleRemoveEdge() {
        const from = fromSelect.value;
        const to = toSelect.value;

        if (!adjacency.get(from).has(to)) {
            displayGraph([from, to]);

            showResult(
                `There is no edge between ${from} and ${to}.`,
                "error"
            );

            return;
        }

        adjacency.get(from).delete(to);
        adjacency.get(to).delete(from);

        displayGraph([from, to]);
        updateAdjacencyPanel();

        showResult(
            `Remove Edge: the connection between ${from} and ${to} was removed.`,
            "success"
        );
    }


    /* ================= Traversals ================= */

    async function runBFS() {
        const start = fromSelect.value;

        disableButtons(true);

        const visited = [start];
        const order = [start];
        const queue = [start];
        const usedEdges = [];

        while (queue.length > 0) {
            const current = queue.shift();
            const neighbors = Array.from(adjacency.get(current)).sort();

            neighbors.forEach(function (neighbor) {
                if (!visited.includes(neighbor)) {
                    visited.push(neighbor);
                    order.push(neighbor);
                    usedEdges.push([current, neighbor]);
                    queue.push(neighbor);
                }
            });
        }

        for (let i = 0; i < order.length; i++) {
            const edgesSoFar = usedEdges.filter(
                ([, to]) => order.indexOf(to) <= i
            );

            displayGraph(
                order.slice(0, i + 1),
                order[i],
                edgesSoFar
            );

            showResult(
                `BFS from ${start}: visiting ${order[i]}...`
            );

            await wait(600);
        }

        displayGraph(order, null, usedEdges);

        showResult(
            `BFS from ${start} completed: ${order.join(" → ")}`,
            "success"
        );

        disableButtons(false);
    }

    async function runDFS() {
        const start = fromSelect.value;

        disableButtons(true);

        const visited = new Set();
        const order = [];
        const usedEdges = [];

        function visit(vertex, parent) {
            visited.add(vertex);
            order.push(vertex);

            if (parent !== null) {
                usedEdges.push([parent, vertex]);
            }

            const neighbors = Array.from(adjacency.get(vertex)).sort();

            neighbors.forEach(function (neighbor) {
                if (!visited.has(neighbor)) {
                    visit(neighbor, vertex);
                }
            });
        }

        visit(start, null);

        for (let i = 0; i < order.length; i++) {
            const edgesSoFar = usedEdges.filter(
                ([, to]) => order.indexOf(to) <= i
            );

            displayGraph(
                order.slice(0, i + 1),
                order[i],
                edgesSoFar
            );

            showResult(
                `DFS from ${start}: visiting ${order[i]}...`
            );

            await wait(600);
        }

        displayGraph(order, null, usedEdges);

        showResult(
            `DFS from ${start} completed: ${order.join(" → ")}`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Reset ================= */

    function resetGraph() {
        buildInitialGraph();

        displayGraph();
        updateAdjacencyPanel();

        showResult(
            "The graph has been reset.",
            "success"
        );
    }


    /* ================= Button Events ================= */

    document
        .getElementById("addEdgeButton")
        .addEventListener("click", handleAddEdge);

    document
        .getElementById("removeEdgeButton")
        .addEventListener("click", handleRemoveEdge);

    document
        .getElementById("bfsButton")
        .addEventListener("click", runBFS);

    document
        .getElementById("dfsButton")
        .addEventListener("click", runDFS);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetGraph);


    /* ================= Initial Display ================= */

    populateSelects();
    resetGraph();

});