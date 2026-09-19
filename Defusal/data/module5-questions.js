// ===================================================================
// Module 5 - Defuse question bank
//
// Defuse's job is "apply everything to a problem": each question
// poses a real-world scenario (`prompt`) and a short list of
// candidate data structures (`options`, an array of { id, text }),
// exactly one of which is right (`correctOptionId`). Unlike the old
// multi-select version of this module, there is no "select every
// correct statement" here - picking an option submits immediately,
// same as Module 1's MC buttons (see renderScenarioQuestion /
// module5OptionList's click handler in defusal.js).
//
// Keep `options` to 3-4 candidates per question, and keep each
// option's `text` short (it's rendered directly on a button, not in
// a separate list) - a structure name, not a sentence.
//
// difficulty ids (easy/intermediate/hard/expert) must match the ids
// used by the other modules' banks, since the overview's difficulty
// dropdown and its "X:XX on the clock" preview are built from
// IDENTIFY_QUESTION_BANK, not this one (see populateDifficultyOptions
// in defusal.js) - only the numbers below are Defuse's own.
//
// NOTE: the numbers below (time/mistakes/question count/scoring) are
// reasonable placeholders, not pulled from the site's existing
// per-module balance - adjust startingTimeSeconds/mistakesAllowed/
// baseScore/timeBonusCap per difficulty to match however Modules
// 1/2/3/4 are currently tuned, so Defuse doesn't feel noticeably
// easier or harder than the rest of the bomb.
// ===================================================================

const MODULE5_QUESTION_BANK = {
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
            startingTimeSeconds: 420,
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
            startingTimeSeconds: 300,
            mistakesAllowed: 1,
            questionCount: 8,
            baseScore: 300,
            timeBonusCap: 150
        }
    },

    questions: [
        // ----------------------------- easy -----------------------------
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            prompt: "The system receives customers in the order they arrive. The first customer must be processed first. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Array" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "a"
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            prompt: "A text editor needs to undo the user's most recent action first, then the one before that. Which structure fits best?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Array" },
                { id: "d", text: "Tree" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "easy",
            prompt: "You need to store exactly 10 temperature readings and access any of them instantly by their position (e.g. the 3rd reading). Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "a"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            prompt: "Print jobs sent to a shared office printer should come out in the same order they were sent. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Queue" },
                { id: "c", text: "Binary Tree" },
                { id: "d", text: "Array" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            prompt: "A browser's \"Back\" button should return to the most recently visited page first. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Array" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Hash Table" }
            ],
            correctOptionId: "c"
        },

        // -------------------------- intermediate --------------------------
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "intermediate",
            prompt: "You're building a playlist where songs are frequently inserted and removed from the middle, and you never need to jump straight to song #47. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "intermediate",
            prompt: "Support tickets should be handled in the order they came in, and new tickets keep arriving while old ones are still being processed. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Array" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "intermediate",
            prompt: "You need to store a fixed set of 7 days of the week and quickly access \"day 4\" without walking through the others. Which structure fits best?",
            options: [
                { id: "a", text: "Linked List" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Array" }
            ],
            correctOptionId: "d"
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "intermediate",
            prompt: "A calculator needs to check whether every open parenthesis in an expression has a matching close parenthesis, in the right order. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Array" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "intermediate",
            prompt: "A music app needs to insert a new song right after the currently playing one without shifting every other song in memory. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Linked List" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "intermediate",
            prompt: "A call center needs callers answered in the exact order they dialed in. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Array" },
                { id: "c", text: "Linked List" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "d"
        },

        // ------------------------------ hard ------------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            prompt: "A function-call tracker needs to know which function to return control to when the currently running one finishes - always the most recently called, still-running one. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Array" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            prompt: "A ride-share app needs to match drivers to riders in the order the ride requests came in, with requests constantly being added. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Array" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Tree" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "hard",
            prompt: "A note-taking app frequently removes notes from anywhere in a long list and never accesses notes by their position number. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "hard",
            prompt: "A grading app stores exactly 30 students' fixed seat numbers and needs to jump straight to seat #18 instantly. Which structure fits best?",
            options: [
                { id: "a", text: "Linked List" },
                { id: "b", text: "Queue" },
                { id: "c", text: "Array" },
                { id: "d", text: "Stack" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            prompt: "A maze-solving robot needs to backtrack to its most recent unexplored junction whenever it hits a dead end. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Array" },
                { id: "c", text: "Linked List" },
                { id: "d", text: "Stack" }
            ],
            correctOptionId: "d"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            prompt: "A video game's matchmaking system pairs players in the order they queued up for a match. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Stack" },
                { id: "c", text: "Array" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "a"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "hard",
            prompt: "A spreadsheet-like tool needs to store a fixed 5x5 grid of values and read/write any cell by its row and column instantly. Which structure fits best?",
            options: [
                { id: "a", text: "Linked List" },
                { id: "b", text: "Array" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Stack" }
            ],
            correctOptionId: "b"
        },

        // ----------------------------- expert -----------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            prompt: "A compiler needs to verify that brackets, braces, and parentheses in source code all close in the correct nested order. Which structure should be used?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Array" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            prompt: "A print server must process documents from multiple offices strictly in the order they were submitted, with new documents constantly arriving. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Queue" },
                { id: "c", text: "Array" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            prompt: "A version-history feature needs to insert and remove entries from anywhere in a long, frequently changing sequence, with no need to jump to entry #200 directly. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Queue" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Linked List" }
            ],
            correctOptionId: "d"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "expert",
            prompt: "A lookup table of exactly 100 fixed product IDs needs instant access to any entry by its index. Which structure fits best?",
            options: [
                { id: "a", text: "Linked List" },
                { id: "b", text: "Array" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            prompt: "A recursive algorithm's call frames must unwind in exactly the reverse order they were created. Which structure models this?",
            options: [
                { id: "a", text: "Queue" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Array" }
            ],
            correctOptionId: "c"
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            prompt: "A task scheduler runs background jobs strictly in the order they were submitted, and jobs keep getting added while others are still waiting. Which structure should be used?",
            options: [
                { id: "a", text: "Stack" },
                { id: "b", text: "Array" },
                { id: "c", text: "Linked List" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "d"
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            prompt: "A large contact list needs frequent inserts/deletes anywhere in the middle, and the app never needs to fetch \"the 500th contact\" directly. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Stack" },
                { id: "d", text: "Queue" }
            ],
            correctOptionId: "b"
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "expert",
            prompt: "An image is stored as a fixed grid of pixels, and the app needs to read pixel (x, y) instantly without scanning other pixels. Which structure fits best?",
            options: [
                { id: "a", text: "Array" },
                { id: "b", text: "Linked List" },
                { id: "c", text: "Queue" },
                { id: "d", text: "Stack" }
            ],
            correctOptionId: "a"
        }
    ]
};