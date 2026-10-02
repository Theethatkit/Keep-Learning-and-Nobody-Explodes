(function () {
    "use strict";

    const examples = [
        {
            title: "Shared adjacency-matrix graph",

            description:
                "This example uses six vertices labeled A to F.",

            code: String.raw`#include <stdio.h>

#define V 6

typedef struct {
    int matrix[V][V];
} Graph;

void initialize(Graph *graph) {
    for (int row = 0; row < V; row++) {
        for (int column = 0;
             column < V;
             column++) {

            graph->matrix[row][column] = 0;
        }
    }
}

int validVertex(int vertex) {
    return vertex >= 0 && vertex < V;
}`,

            output:
                "All matrix entries begin as 0.",

            explanation:
                "Vertex 0 represents A, 1 represents B and so on.",

            complexity:
                "Initialization takes O(V²) time and storage is O(V²)."
        },

        {
            title: "1. Add an undirected edge",

            description:
                "Store both directions because A—B can be followed either way.",

            code: String.raw`int addEdge(
    Graph *graph,
    int from,
    int to
) {
    if (
        !validVertex(from) ||
        !validVertex(to) ||
        from == to
    ) {
        return 0;
    }

    graph->matrix[from][to] = 1;
    graph->matrix[to][from] = 1;

    return 1;
}

/* addEdge(&graph, 0, 1); creates A—B */`,

            output:
                "matrix[A][B] = 1 and matrix[B][A] = 1",

            explanation:
                "For a directed graph, only matrix[from][to] would be set.",

            complexity: "O(1) time."
        },

        {
            title: "2. Remove an edge",

            description:
                "Set both directions back to zero.",

            code: String.raw`int removeEdge(
    Graph *graph,
    int from,
    int to
) {
    if (
        !validVertex(from) ||
        !validVertex(to)
    ) {
        return 0;
    }

    graph->matrix[from][to] = 0;
    graph->matrix[to][from] = 0;

    return 1;
}`,

            output:
                "The undirected connection no longer exists.",

            explanation:
                "Removing one direction only would leave a directed connection.",

            complexity: "O(1) time."
        },

        {
            title: "3. Breadth-First Search",

            description:
                "BFS uses a Queue and marks vertices when they are discovered.",

            code: String.raw`void bfs(
    const Graph *graph,
    int start
) {
    int visited[V] = {0};
    int queue[V];
    int front = 0;
    int rear = 0;

    visited[start] = 1;
    queue[rear++] = start;

    while (front < rear) {
        int current = queue[front++];

        printf("%c ", 'A' + current);

        for (int next = 0; next < V; next++) {
            if (
                graph->matrix[current][next] &&
                !visited[next]
            ) {
                visited[next] = 1;
                queue[rear++] = next;
            }
        }
    }
}`,

            output:
                "The exact order depends on edges and neighbor order.",

            explanation:
                "Marking a vertex when enqueued prevents duplicate Queue entries.",

            complexity:
                "With an adjacency matrix: O(V²). With an adjacency list: O(V + E)."
        },

        {
            title: "4. Depth-First Search",

            description:
                "Recursive DFS explores one branch before returning.",

            code: String.raw`void dfsVisit(
    const Graph *graph,
    int current,
    int visited[]
) {
    visited[current] = 1;

    printf("%c ", 'A' + current);

    for (int next = 0; next < V; next++) {
        if (
            graph->matrix[current][next] &&
            !visited[next]
        ) {
            dfsVisit(
                graph,
                next,
                visited
            );
        }
    }
}

void dfs(
    const Graph *graph,
    int start
) {
    int visited[V] = {0};

    dfsVisit(graph, start, visited);
}`,

            output:
                "DFS explores a branch deeply before backtracking.",

            explanation:
                "The program's call stack stores unfinished DFS calls.",

            complexity:
                "With an adjacency matrix: O(V²). Recursion can use O(V) space."
        }
    ];

    function text(tag, content) {
        const element = document.createElement(tag);
        element.textContent = content;
        return element;
    }

    function codeBlock(content) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");

        code.textContent = content;
        pre.append(code);

        return pre;
    }

    function renderExamples() {
        const container =
            document.getElementById("codeExamplesContainer");

        if (!container) {
            return;
        }

        const fragment =
            document.createDocumentFragment();

        examples.forEach(function (example, index) {
            const details =
                document.createElement("details");

            details.open = index === 0;

            details.append(
                text("summary", example.title),
                text("p", example.description),
                text("h3", "Code"),
                codeBlock(example.code),
                text("h3", "Expected result"),
                codeBlock(example.output),
                text("h3", "Explanation"),
                text("p", example.explanation),
                text("h3", "Complexity"),
                text("p", example.complexity)
            );

            fragment.append(details);
        });

        container.replaceChildren(fragment);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            renderExamples,
            { once: true }
        );
    } else {
        renderExamples();
    }
})();