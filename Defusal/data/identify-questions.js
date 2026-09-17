// ===================================================================
// Identify (Module 1) + Analyze (Module 4) question banks
//
// Replaces the old module1-questions.js (MC only) and
// module4-questions.js (True/False only). Both banks below use the
// SAME shared schema, since Identify and Analyze both render through
// createIdentifyStyleModule() in defusal.js:
//
//   Shared fields (every question):
//     topic       - string, used for the History screen's topic chart
//     difficulty  - "easy" | "intermediate" | "hard" | "expert"
//     prompt      - the question text shown in the popup
//     type        - "mc" | "trueFalse" - picks which widget renders
//
//   type: "mc" additionally needs:
//     options          - [{ id: "a"-"d", text, shape }]
//     correctOptionId  - matches one option's id
//
//   type: "trueFalse" additionally needs:
//     correctAnswer - boolean
//
// This file is a STARTER TEMPLATE with a small number of questions per
// difficulty to prove the schema out end-to-end - swap in the team's
// real question content, following the same shape, difficulty tiers
// unaffected.
// ===================================================================

const IDENTIFY_QUESTION_BANK = {
    difficulties: {
        easy: {
            label: "Easy",
            startingTimeSeconds: 600,
            mistakesAllowed: 3,
            questionCount: 5,
            baseScore: 100,
            timeBonusCap: 50
        },
        intermediate: {
            label: "Intermediate",
            startingTimeSeconds: 480,
            mistakesAllowed: 2,
            questionCount: 6,
            baseScore: 150,
            timeBonusCap: 75
        },
        hard: {
            label: "Hard",
            startingTimeSeconds: 360,
            mistakesAllowed: 2,
            questionCount: 7,
            baseScore: 200,
            timeBonusCap: 100
        },
        expert: {
            label: "Expert",
            startingTimeSeconds: 240,
            mistakesAllowed: 1,
            questionCount: 8,
            baseScore: 300,
            timeBonusCap: 150
        }
    },

    questions: [
        // ---- easy ----
        {
            topic: "Stacks",
            difficulty: "easy",
            type: "mc",
            prompt: "Which data structure follows LIFO (Last In, First Out)?",
            options: [
                { id: "a", text: "Queue", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Linked List", shape: "square" },
                { id: "d", text: "Binary Tree", shape: "diamond" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Queues",
            difficulty: "easy",
            type: "trueFalse",
            prompt: "A queue follows FIFO (First In, First Out).",
            correctAnswer: true
        },
        {
            topic: "Linked Lists",
            difficulty: "easy",
            type: "trueFalse",
            prompt: "A singly linked list node stores a pointer to the previous node.",
            correctAnswer: false
        },

        // ---- intermediate ----
        {
            topic: "Trees",
            difficulty: "intermediate",
            type: "mc",
            prompt: "Which structure is best suited for representing hierarchical, parent-child relationships?",
            options: [
                { id: "a", text: "Array", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Tree", shape: "square" },
                { id: "d", text: "Queue", shape: "diamond" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Hash Tables",
            difficulty: "intermediate",
            type: "trueFalse",
            prompt: "A hash table can have two different keys map to the same bucket (a collision).",
            correctAnswer: true
        },

        // ---- hard ----
        {
            topic: "Graphs",
            difficulty: "hard",
            type: "mc",
            prompt: "Which structure naturally represents a network of cities connected by roads, where a road can be one-way?",
            options: [
                { id: "a", text: "Directed Graph", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Queue", shape: "square" },
                { id: "d", text: "Array", shape: "diamond" }
            ],
            correctOptionId: "a"
        },

        // ---- expert ----
        {
            topic: "Heaps",
            difficulty: "expert",
            type: "trueFalse",
            prompt: "In a min-heap, the smallest element is always guaranteed to be the leftmost leaf.",
            correctAnswer: false
        }
    ]
};

