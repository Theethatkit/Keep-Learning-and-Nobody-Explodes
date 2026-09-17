// ===================================================================
// data/module3-questions.js
//
// Module 3 - TRACE. Reuses the existing Connect-the-Dots matching
// engine in defusal.js (renderConnectQuestion / submitConnectAnswer)
// completely unmodified - only the CONTENT changes.
//
// The educational shift from the old "vocabulary term -> definition"
// version of this module: each pair.term is now a starting state
// plus one or more operations, and pair.definition is the correct
// resulting state after tracing those operations through. When a
// question has several pairs, the other pairs' correct results act
// as the shuffled distractors on the right-hand column - the player
// has to actually trace each one to avoid connecting it to a
// DIFFERENT pair's answer.
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
//       difficulty: "<difficultyId>",
//       topic: string,
//       prompt: string,
//       pairs: [
//         { id: "p1", term: "<starting state + operation(s)>", definition: "<resulting state>" },
//         ...
//       ]
//     }
//   ]
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
            startingTimeSeconds: 480,
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
            startingTimeSeconds: 240,
            mistakesAllowed: 1,
            questionCount: 2,
            baseScore: 300,
            timeBonusCap: 150
        }
    },

    questions: [

        // ----------------------------- EASY -----------------------------
        // Single-operation traces only.
        {
            difficulty: "easy",
            topic: "Stacks & Queues",
            prompt: "Trace each operation and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Stack (top->bottom): 10. Operation: PUSH 20.", definition: "Result (top->bottom): 20, 10" },
                { id: "p2", term: "Stack (top->bottom): 15, 5. Operation: POP.", definition: "Result (top->bottom): 5" },
                { id: "p3", term: "Queue (front->back): A, B. Operation: ENQUEUE C.", definition: "Result (front->back): A, B, C" }
            ]
        },
        {
            difficulty: "easy",
            topic: "Queues & Stacks",
            prompt: "Trace each operation and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Queue (front->back): A, B, C. Operation: DEQUEUE.", definition: "Result (front->back): B, C" },
                { id: "p2", term: "Queue (front->back): X, Y. Operation: ENQUEUE Z.", definition: "Result (front->back): X, Y, Z" },
                { id: "p3", term: "Stack (top->bottom): 1. Operation: PUSH 2.", definition: "Result (top->bottom): 2, 1" }
            ]
        },
        {
            difficulty: "easy",
            topic: "Linked Lists",
            prompt: "Trace each operation and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "List: 10 -> 20 -> NULL. Operation: Insert 30 at the end.", definition: "Result: 10 -> 20 -> 30 -> NULL" },
                { id: "p2", term: "List: 5 -> 10 -> 15 -> NULL. Operation: Delete the head node.", definition: "Result: 10 -> 15 -> NULL" },
                { id: "p3", term: "Stack (top->bottom): 7. Operation: POP.", definition: "Result: Stack is empty" }
            ]
        },
        {
            difficulty: "easy",
            topic: "Arrays & Queues",
            prompt: "Trace each operation and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Array: [1, 2, 3]. Operation: Append 4.", definition: "Result: [1, 2, 3, 4]" },
                { id: "p2", term: "Array: [1, 2, 3, 4]. Operation: Remove the last element.", definition: "Result: [1, 2, 3]" },
                { id: "p3", term: "Queue (front->back): P, Q, R. Operation: DEQUEUE.", definition: "Result (front->back): Q, R" }
            ]
        },
        {
            difficulty: "easy",
            topic: "Stacks & Lists",
            prompt: "Trace each operation and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Stack (top->bottom): 6, 3. Operations: POP, then PUSH 9.", definition: "Result (top->bottom): 9, 3" },
                { id: "p2", term: "Queue (front->back): M, N. Operations: DEQUEUE, then ENQUEUE O.", definition: "Result (front->back): N, O" },
                { id: "p3", term: "List: 1 -> 2 -> NULL. Operation: Insert 0 at the head.", definition: "Result: 0 -> 1 -> 2 -> NULL" }
            ]
        },

        // ------------------------- INTERMEDIATE -------------------------
        // Multiple chained operations per pair.
        {
            difficulty: "intermediate",
            topic: "Stacks & Queues",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Stack (top->bottom): 10, 20, 30. Operations: POP, PUSH 50, POP.", definition: "Result (top->bottom): 20, 30" },
                { id: "p2", term: "Stack (top->bottom): 3, 2, 1. Operations: POP, POP, PUSH 9.", definition: "Result (top->bottom): 9, 1" },
                { id: "p3", term: "Queue (front->back): 1, 2, 3, 4. Operations: DEQUEUE, DEQUEUE, ENQUEUE 5.", definition: "Result (front->back): 3, 4, 5" },
                { id: "p4", term: "Queue (front->back): A, B, C. Operations: DEQUEUE, then ENQUEUE D.", definition: "Result (front->back): B, C, D" }
            ]
        },
        {
            difficulty: "intermediate",
            topic: "Linked Lists",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "List: 10 -> 20 -> 30 -> NULL. Operation: Delete the node with value 20.", definition: "Result: 10 -> 30 -> NULL" },
                { id: "p2", term: "List: 1 -> 2 -> 3 -> NULL. Operations: Insert 4 after 2, then delete 1.", definition: "Result: 2 -> 4 -> 3 -> NULL" },
                { id: "p3", term: "Stack (top->bottom): 5. Operations: PUSH 10, PUSH 15, POP.", definition: "Result (top->bottom): 10, 5" },
                { id: "p4", term: "Queue (front->back): X, Y, Z. Operations: DEQUEUE, DEQUEUE.", definition: "Result (front->back): Z" }
            ]
        },
        {
            difficulty: "intermediate",
            topic: "Arrays",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Array: [8, 3, 5, 1]. Operation: One bubble-sort pass (adjacent swaps, left to right).", definition: "Result: [3, 5, 1, 8]" },
                { id: "p2", term: "Array: [4, 2, 7, 1]. Operation: Sort in ascending order.", definition: "Result: [1, 2, 4, 7]" },
                { id: "p3", term: "Stack (top->bottom): 6, 4, 2. Operations: POP, POP.", definition: "Result (top->bottom): 2" },
                { id: "p4", term: "Queue (front->back): 1, 2, 3. Operations: ENQUEUE 4, then DEQUEUE.", definition: "Result (front->back): 2, 3, 4" }
            ]
        },

        // ----------------------------- HARD -----------------------------
        // Structural changes on lists, plus trees and graphs introduced.
        {
            difficulty: "hard",
            topic: "Linked Lists & Trees",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "List: 10 -> 20 -> 30 -> 40 -> NULL. Operations: Delete 20, then insert 25 after 30.", definition: "Result: 10 -> 30 -> 25 -> 40 -> NULL" },
                { id: "p2", term: "List: 1 -> 2 -> 3 -> NULL. Operation: Reverse the list.", definition: "Result: 3 -> 2 -> 1 -> NULL" },
                { id: "p3", term: "BST: root 50, left child 30, right child 70 (70 has left 60, right 80). Operation: Search for 60.", definition: "Nodes visited: 50 -> 70 -> 60" },
                { id: "p4", term: "Stack (top->bottom): 3, 2, 1. Operations: POP, POP, PUSH 9, PUSH 8.", definition: "Result (top->bottom): 8, 9, 1" }
            ]
        },
        {
            difficulty: "hard",
            topic: "Trees & Queues",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "BST insert order: 50, 30, 70, 20, 40. Operation: In-order traversal.", definition: "Result: 20, 30, 40, 50, 70" },
                { id: "p2", term: "BST: root 50, left child 30, right child 70 (70 has left 60, right 80). Operation: Search for 80.", definition: "Nodes visited: 50 -> 70 -> 80" },
                { id: "p3", term: "Queue (front->back): A, B, C, D. Operations: DEQUEUE, ENQUEUE E, DEQUEUE, ENQUEUE F.", definition: "Result (front->back): C, D, E, F" },
                { id: "p4", term: "Array: [5, 1, 4, 2]. Operation: One selection-sort pass (place the minimum at index 0).", definition: "Result: [1, 5, 4, 2]" }
            ]
        },
        {
            difficulty: "hard",
            topic: "Graphs & Lists",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Graph edges: A-B, A-C, B-D, C-D. Operation: BFS starting at A (visit neighbors alphabetically).", definition: "Visit order: A, B, C, D" },
                { id: "p2", term: "List: 10 -> 20 -> 30 -> NULL. Operation: Delete the tail node.", definition: "Result: 10 -> 20 -> NULL" },
                { id: "p3", term: "Stack (top->bottom): empty. Operations: PUSH 1, PUSH 2, PUSH 3, POP, POP.", definition: "Result (top->bottom): 1" },
                { id: "p4", term: "Array: [3, 6, 1, 8, 2, 4]. Operations: Sort ascending, then remove the first element.", definition: "Result: [2, 3, 4, 6, 8]" }
            ]
        },

        // ---------------------------- EXPERT ----------------------------
        // Algorithm tracing, longer chains, multiple interacting structures.
        {
            difficulty: "expert",
            topic: "Sorting & Graphs",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "Array: [5, 2, 9, 1, 5, 6]. Operation: First TWO passes of bubble sort (adjacent swaps, left to right).", definition: "Result: [2, 1, 5, 5, 6, 9]" },
                { id: "p2", term: "Array: [8, 3, 5, 1]. Operation: Full selection sort to completion.", definition: "Result: [1, 3, 5, 8]" },
                { id: "p3", term: "BST insert order: 40, 20, 60, 10, 30, 50, 70. Operation: Determine the height of the resulting tree (root at height 0).", definition: "Result: Height = 2" },
                { id: "p4", term: "Graph edges: A-B, A-C, B-D, C-D. Operation: DFS starting at A, visiting the alphabetically smallest unvisited neighbor first.", definition: "Visit order: A, B, D, C" }
            ]
        },
        {
            difficulty: "expert",
            topic: "Queues & Lists",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "A queue is built from two stacks. Stack A (top->bottom): 4, 3, 2, 1. All elements are moved onto stack B, then DEQUEUE is called three times.", definition: "Dequeued values, in order: 1, 2, then 3" },
                { id: "p2", term: "List: 1 -> 2 -> 3 -> 4 -> 5 -> NULL. Operations: Reverse the list, then delete the new head.", definition: "Result: 4 -> 3 -> 2 -> 1 -> NULL" },
                { id: "p3", term: "BST: root 50, left child 30 (30 has left 20, right 40), right child 70. Operation: In-order traversal.", definition: "Result: 20, 30, 40, 50, 70" },
                { id: "p4", term: "Array: [3, 1, 4, 1, 5, 9, 2, 6]. Operation: Sort ascending (needed before binary search can be used).", definition: "Result: [1, 1, 2, 3, 4, 5, 6, 9]" }
            ]
        },
        {
            difficulty: "expert",
            topic: "Trees & Sorting",
            prompt: "Trace each operation sequence and connect it to its correct resulting state.",
            pairs: [
                { id: "p1", term: "BST insert order: 8, 3, 10, 1, 6, 14, 4, 7, 13. Operation: In-order traversal.", definition: "Result: 1, 3, 4, 6, 7, 8, 10, 13, 14" },
                { id: "p2", term: "Array: [9, 7, 5, 3, 1]. Operation: First pass of insertion sort (i = 1 only).", definition: "Result: [7, 9, 5, 3, 1]" },
                { id: "p3", term: "Graph edges: A-B, A-C, B-D, C-D. Operation: BFS starting at A (visit neighbors alphabetically).", definition: "Visit order: A, B, C, D" },
                { id: "p4", term: "List: 1 -> 2 -> 3 -> 4 -> NULL. Operation: Reverse the list.", definition: "Result: 4 -> 3 -> 2 -> 1 -> NULL" }
            ]
        }
    ]
};