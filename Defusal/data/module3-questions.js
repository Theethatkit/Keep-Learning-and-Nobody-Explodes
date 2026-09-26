// ===================================================================
// data/module3-questions.js
//
// Module 3 - TRACE. Reuses the existing Connect-the-Dots matching
// engine in defusal.js (renderConnectQuestion / submitConnectAnswer),
// but the CONTENT is no longer independent vocab-style pairs - each
// question is now a single continuous trace: one starting state, an
// ORDERED sequence of operations applied to it one after another, and
// the resulting state after each operation. The player has to follow
// the whole chain to place any one step correctly, since each result
// depends on the one before it - that's what makes this "tracing"
// rather than "matching known facts".
//
// Schema (matches MODULE3_QUESTION_BANK as read by defusal.js):
//
//   difficulties: {
//     <difficultyId>: {
//       label, startingTimeSeconds, mistakesAllowed, questionCount,
//       baseScore, timeBonusCap
//     }
//   },
//   questions: [
//     {
//       id: "<unique within this bank>",
//       difficulty: "<difficultyId>",
//       topic: string,
//       category: string | string[],       // see CATEGORY_NAMES in defusal.js
//       prompt: string,                    // optional, instructions shown above the board
//       initialState: string,              // the fixed starting readout ("Signal Origin")
//       operations: string[],              // ordered - operations[i] is applied to the
//                                           // state that existed just before it
//       states: string[]                   // ordered, same length as operations -
//                                           // states[i] is the result of operations[i]
//     }
//   ]
//
// renderConnectQuestion() in defusal.js turns operations/states into
// the {id, term, definition} pairs the matching engine expects: term
// is the fixed, ordered step slot ("Step 2: PUSH(50)"), definition is
// that step's resulting state, shuffled on the right-hand column. The
// step slots stay in order on the left (there's no puzzle in knowing
// WHICH operation came second - the puzzle is computing what state it
// produced), while the resulting states are what the player has to
// route back to the correct step.
//
// Notation used throughout, kept consistent so results are
// unambiguous to trace:
//   Stack   -> written top-to-bottom: "Stack (top->bottom): X, Y, Z"
//   Queue   -> written front-to-back: "Queue (front->back): X, Y, Z"
//   List    -> written head to NULL:  "A -> B -> NULL"
//   Array   -> written index 0 first: "[a, b, c]"
// ===================================================================

const MODULE3_QUESTION_BANK = {
    difficulties: {
        easy: {
            label: "Easy",
            startingTimeSeconds: 600,
            mistakesAllowed: 3,
            questionCount: 4,
            baseScore: 100,
            timeBonusCap: 50
        },
        intermediate: {
            label: "Intermediate",
            startingTimeSeconds: 420,
            mistakesAllowed: 3,
            questionCount: 3,
            baseScore: 150,
            timeBonusCap: 75
        },
        hard: {
            label: "Hard",
            startingTimeSeconds: 360,
            mistakesAllowed: 2,
            questionCount: 3,
            baseScore: 200,
            timeBonusCap: 100
        },
        expert: {
            label: "Expert",
            startingTimeSeconds: 300,
            mistakesAllowed: 1,
            questionCount: 2,
            baseScore: 300,
            timeBonusCap: 150
        }
    },

    questions: [

        // ----------------------------- EASY -----------------------------
        // One or two simple operations, small structures, obvious
        // single-step state changes.
        {
            id: "m3-easy-1",
            difficulty: "easy",
            topic: "Stacks",
            category: "stack",
            initialState: "Stack (top->bottom): 5, 2",
            operations: ["PUSH(9)", "POP"],
            states: ["Stack (top->bottom): 9, 5, 2", "Stack (top->bottom): 5, 2"]
        },
        {
            id: "m3-easy-2",
            difficulty: "easy",
            topic: "Queues",
            category: "queue",
            initialState: "Queue (front->back): A, B",
            operations: ["ENQUEUE(C)", "DEQUEUE"],
            states: ["Queue (front->back): A, B, C", "Queue (front->back): B, C"]
        },
        {
            id: "m3-easy-3",
            difficulty: "easy",
            topic: "Arrays",
            category: "array",
            initialState: "[1, 2, 3]",
            operations: ["Append 4", "Remove the first element"],
            states: ["[1, 2, 3, 4]", "[2, 3, 4]"]
        },
        {
            id: "m3-easy-4",
            difficulty: "easy",
            topic: "Linked Lists",
            category: "linkedList",
            initialState: "10 -> 20 -> NULL",
            operations: ["Insert 30 at the end", "Delete the head node"],
            states: ["10 -> 20 -> 30 -> NULL", "20 -> 30 -> NULL"]
        },
        {
            id: "m3-easy-5",
            difficulty: "easy",
            topic: "Stacks",
            category: "stack",
            initialState: "Stack (top->bottom): (empty)",
            operations: ["PUSH(1)", "PUSH(2)"],
            states: ["Stack (top->bottom): 1", "Stack (top->bottom): 2, 1"]
        },
        {
            id: "m3-easy-6",
            difficulty: "easy",
            topic: "Queues",
            category: "queue",
            initialState: "Queue (front->back): X, Y, Z",
            operations: ["DEQUEUE", "DEQUEUE"],
            states: ["Queue (front->back): Y, Z", "Queue (front->back): Z"]
        },

        // ------------------------- INTERMEDIATE -------------------------
        // Three chained operations, mixing structures or introducing a
        // simple combination of operations.
        {
            id: "m3-intermediate-1",
            difficulty: "intermediate",
            topic: "Stacks",
            category: "stack",
            initialState: "Stack (top->bottom): 10, 20, 30",
            operations: ["POP", "PUSH(50)", "POP"],
            states: [
                "Stack (top->bottom): 20, 30",
                "Stack (top->bottom): 50, 20, 30",
                "Stack (top->bottom): 20, 30"
            ]
        },
        {
            id: "m3-intermediate-2",
            difficulty: "intermediate",
            topic: "Queues",
            category: "queue",
            initialState: "Queue (front->back): A, B, C",
            operations: ["DEQUEUE", "ENQUEUE(D)", "DEQUEUE"],
            states: [
                "Queue (front->back): B, C",
                "Queue (front->back): B, C, D",
                "Queue (front->back): C, D"
            ]
        },
        {
            id: "m3-intermediate-3",
            difficulty: "intermediate",
            topic: "Linked Lists",
            category: "linkedList",
            initialState: "1 -> 2 -> 3 -> NULL",
            operations: ["Insert 4 after 2", "Delete the head node (1)", "Insert 0 at the head"],
            states: [
                "1 -> 2 -> 4 -> 3 -> NULL",
                "2 -> 4 -> 3 -> NULL",
                "0 -> 2 -> 4 -> 3 -> NULL"
            ]
        },
        {
            id: "m3-intermediate-4",
            difficulty: "intermediate",
            topic: "Sorting",
            category: ["array", "sorting"],
            prompt: "Trace one full bubble-sort pass, one adjacent comparison at a time.",
            initialState: "[8, 3, 5, 1]",
            operations: [
                "Compare index 0,1 (8, 3): out of order, swap",
                "Compare index 1,2 (8, 5): out of order, swap",
                "Compare index 2,3 (8, 1): out of order, swap"
            ],
            states: ["[3, 8, 5, 1]", "[3, 5, 8, 1]", "[3, 5, 1, 8]"]
        },
        {
            id: "m3-intermediate-5",
            difficulty: "intermediate",
            topic: "Trees",
            category: "tree",
            prompt: "Trace the search path step by step, one comparison at a time.",
            initialState: "BST: root 50, left child 30, right child 70 (70 has left child 60, right child 80). Searching for 60.",
            operations: [
                "Compare 60 with root (50)",
                "Compare 60 with 70",
                "Compare 60 with 60"
            ],
            states: [
                "60 > 50, so move right to 70",
                "60 < 70, so move left to 60",
                "60 = 60, target found"
            ]
        },

        // ---------------------------- HARD ----------------------------
        // Four chained operations, structural changes, more states to
        // keep track of at once.
        {
            id: "m3-hard-1",
            difficulty: "hard",
            topic: "Linked Lists",
            category: "linkedList",
            initialState: "10 -> 20 -> 30 -> 40 -> NULL",
            operations: [
                "Delete the node with value 20",
                "Insert 25 after 30",
                "Reverse the list",
                "Delete the new head node"
            ],
            states: [
                "10 -> 30 -> 40 -> NULL",
                "10 -> 30 -> 25 -> 40 -> NULL",
                "40 -> 25 -> 30 -> 10 -> NULL",
                "25 -> 30 -> 10 -> NULL"
            ]
        },
        {
            id: "m3-hard-2",
            difficulty: "hard",
            topic: "Graphs",
            category: "graph",
            prompt: "Trace a queue-based BFS from A, one dequeue/enqueue step at a time (alphabetical neighbor order).",
            initialState: "Graph edges: A-B, A-C, B-D, C-D. Queue: A. Visited: (none)",
            operations: [
                "Dequeue A, visit it, enqueue its unvisited neighbors (B, C)",
                "Dequeue B, visit it, enqueue its unvisited neighbor (D)",
                "Dequeue C, visit it - D is already queued",
                "Dequeue D, visit it - queue is now empty"
            ],
            states: [
                "Visited: A. Queue (front->back): B, C",
                "Visited: A, B. Queue (front->back): C, D",
                "Visited: A, B, C. Queue (front->back): D",
                "Visited: A, B, C, D. Queue: empty"
            ]
        },
        {
            id: "m3-hard-3",
            difficulty: "hard",
            topic: "Sorting",
            category: ["array", "sorting"],
            prompt: "Trace selection sort, one full pass (find the minimum, then swap it into place) at a time.",
            initialState: "[29, 10, 14, 37, 13]",
            operations: [
                "Pass 1: minimum of the whole array is 10 - swap into index 0",
                "Pass 2: minimum of indices 1-4 is 13 - swap into index 1",
                "Pass 3: minimum of indices 2-4 is 14 - already in place",
                "Pass 4: minimum of indices 3-4 is 29 - swap into index 3"
            ],
            states: [
                "[10, 29, 14, 37, 13]",
                "[10, 13, 14, 37, 29]",
                "[10, 13, 14, 37, 29]",
                "[10, 13, 14, 29, 37]"
            ]
        },
        {
            id: "m3-hard-4",
            difficulty: "hard",
            topic: "Stacks & Queues",
            category: ["stack", "queue"],
            prompt: "Trace both structures together - each step only changes the one it names.",
            initialState: "Stack (top->bottom): 3, 2, 1. Queue (front->back): X, Y.",
            operations: [
                "POP the stack",
                "ENQUEUE the popped value (3) into the queue",
                "PUSH(9) onto the stack",
                "DEQUEUE the queue"
            ],
            states: [
                "Stack (top->bottom): 2, 1 (popped 3). Queue unchanged: X, Y.",
                "Queue (front->back): X, Y, 3. Stack unchanged: 2, 1.",
                "Stack (top->bottom): 9, 2, 1. Queue unchanged: X, Y, 3.",
                "Queue (front->back): Y, 3 (dequeued X). Stack unchanged: 9, 2, 1."
            ]
        },

        // ---------------------------- EXPERT ----------------------------
        // Five chained steps, algorithm tracing, larger or less obvious
        // sequences, pointer/reference-level changes.
        {
            id: "m3-expert-1",
            difficulty: "expert",
            topic: "Sorting",
            category: ["array", "sorting"],
            prompt: "Trace bubble sort comparison by comparison, across as many passes as it takes.",
            initialState: "[8, 3, 5, 1]",
            operations: [
                "Pass 1 - compare index 0,1 (8, 3): swap",
                "Pass 1 - compare index 1,2 (8, 5): swap",
                "Pass 1 - compare index 2,3 (8, 1): swap",
                "Pass 2 - compare index 0,1 (3, 5): already in order",
                "Pass 2 - compare index 1,2 (5, 1): swap"
            ],
            states: [
                "[3, 8, 5, 1]",
                "[3, 5, 8, 1]",
                "[3, 5, 1, 8]",
                "[3, 5, 1, 8]",
                "[3, 1, 5, 8]"
            ]
        },
        {
            id: "m3-expert-2",
            difficulty: "expert",
            topic: "Graphs",
            category: "graph",
            prompt: "Trace a recursive DFS from A, always visiting the alphabetically smallest unvisited neighbor first.",
            initialState: "Graph edges: A-B, A-C, B-D, C-D. Visited: (none)",
            operations: [
                "Visit A",
                "Visit A's alphabetically smallest unvisited neighbor (B)",
                "Visit B's alphabetically smallest unvisited neighbor (D)",
                "D's only neighbors (B, C) - backtrack to A, visit its next unvisited neighbor (C)",
                "C's neighbors (A, D) are both already visited - DFS complete"
            ],
            states: [
                "Visited: A",
                "Visited: A, B",
                "Visited: A, B, D",
                "Visited: A, B, D, C",
                "Visited: A, B, D, C (done)"
            ]
        },
        {
            id: "m3-expert-3",
            difficulty: "expert",
            topic: "Trees",
            category: "tree",
            prompt: "Trace where a new value would land in this BST, one comparison at a time.",
            initialState: "BST: root 40 (left 20, right 60); 20 has children 10, 30; 60 has children 50, 70. Inserting 35.",
            operations: [
                "Compare 35 with root (40)",
                "Compare 35 with 20",
                "Compare 35 with 30",
                "Check whether 30 has a right child",
                "Place the new node"
            ],
            states: [
                "35 < 40, so move to the left child (20)",
                "35 > 20, so move to the right child (30)",
                "35 > 30, so move to 30's right child",
                "30 has no right child - this is the insertion point",
                "35 is inserted as the right child of 30"
            ]
        },
        {
            id: "m3-expert-4",
            difficulty: "expert",
            topic: "Stacks & Queues",
            category: ["stack", "queue"],
            prompt: "Trace a queue built from two stacks: every element is moved from Stack A to Stack B before any DEQUEUE.",
            initialState: "Stack A (top->bottom): 1, 2, 3, 4 (used as the inbox). Stack B: empty (used as the outbox).",
            operations: [
                "Pop 1 from A, push it onto B",
                "Pop 2 from A, push it onto B",
                "Pop 3 from A, push it onto B",
                "Pop 4 from A, push it onto B",
                "DEQUEUE by popping from B"
            ],
            states: [
                "Stack A: 2, 3, 4 | Stack B (top->bottom): 1",
                "Stack A: 3, 4 | Stack B (top->bottom): 2, 1",
                "Stack A: 4 | Stack B (top->bottom): 3, 2, 1",
                "Stack A: empty | Stack B (top->bottom): 4, 3, 2, 1",
                "Dequeued value: 4 | Stack B (top->bottom): 3, 2, 1"
            ]
        }
    ]
};