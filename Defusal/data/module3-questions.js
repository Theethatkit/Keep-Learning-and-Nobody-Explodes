// ===================================================================
// data/module3-questions.js
//
// Module 3 - CONSTRUCT. (Replaces the old Trace / Connect-the-Dots
// bank.) Each question gives a CURRENT state and a TARGET state; the
// player drags operation blocks into a limited number of slots to
// build a sequence that transforms one into the other.
//
// The engine in defusal.js SIMULATES whatever the player builds, so
// any valid sequence is accepted - not just the authored one.
//
// Schema (MODULE3_QUESTION_BANK as read by defusal.js):
//
//   difficulties: {
//     <difficultyId>: {
//       label, startingTimeSeconds, mistakesAllowed, questionCount,
//       baseScore, timeBonusCap,
//       // --- Construct-specific constraints, all scale with difficulty ---
//       slackSlots,      // slots = solution.length + slackSlots
//       distractorCount, // how many decoy blocks get mixed into the tray
//       exactCount,      // true: must use EXACTLY slots operations
//       livePreview      // true: shows the running result while building
//     }
//   },
//   questions: [
//     {
//       id, difficulty, topic,
//       category: string | string[],   // see CATEGORY_NAMES in defusal.js
//       kind: "stack" | "queue" | "list" | "array",   // labels + rendering
//       prompt, explanation,
//       current: string[], target: string[],  // index 0 = top/front/head
//       solution: string[],      // one valid op sequence (also the block set)
//       distractors: string[]    // decoy pool; difficulty picks how many
//     }
//   ]
//
// Op strings: "name" or "name:arg". Supported ops:
//   reverse | delHead | delTail | insHead:v | insTail:v |
//   rotate (head moves to tail) | dup (duplicate head) | swap:i,j
// Applying an op to a structure it can't run on (e.g. delHead on an
// empty one) makes the whole sequence invalid.
//
// Each block can be used once, so a solution that needs the same op
// twice (e.g. two rotates) simply lists it twice.
// ===================================================================

const MODULE3_QUESTION_BANK = {
    difficulties: {
        easy: {
            label: "Easy",
            startingTimeSeconds: 600,
            mistakesAllowed: 3,
            questionCount: 4,
            baseScore: 100,
            timeBonusCap: 50,
            slackSlots: 2,
            distractorCount: 1,
            exactCount: false,
            livePreview: true
        },
        intermediate: {
            label: "Intermediate",
            startingTimeSeconds: 420,
            mistakesAllowed: 3,
            questionCount: 3,
            baseScore: 150,
            timeBonusCap: 75,
            slackSlots: 1,
            distractorCount: 2,
            exactCount: false,
            livePreview: true
        },
        hard: {
            label: "Hard",
            startingTimeSeconds: 360,
            mistakesAllowed: 2,
            questionCount: 3,
            baseScore: 200,
            timeBonusCap: 100,
            slackSlots: 0,
            distractorCount: 3,
            exactCount: false,
            livePreview: false
        },
        expert: {
            label: "Expert",
            startingTimeSeconds: 300,
            mistakesAllowed: 1,
            questionCount: 2,
            baseScore: 300,
            timeBonusCap: 150,
            slackSlots: 0,
            distractorCount: 4,
            exactCount: true,
            livePreview: false
        }
    },

    questions: [
        // -------------------- EASY --------------------
        // 1-2 operations, small structures, one decoy, spare slots, live preview on.
        {
            id: "m3c-easy-1",
            difficulty: "easy",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["C", "B", "A"],
            target: ["A", "B", "C"],
            solution: ["reverse"],
            distractors: ["delHead", "delTail", "insHead:A", "insTail:C", "insTail:B"],
            explanation: "Reversing the list swaps head and tail, so C → B → A becomes A → B → C in one operation."
        },
        {
            id: "m3c-easy-2",
            difficulty: "easy",
            topic: "Stacks",
            category: "stack",
            kind: "stack",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["5", "2"],
            target: ["7", "9", "5", "2"],
            solution: ["insHead:9", "insHead:7"],
            distractors: ["delHead", "dup", "insHead:3", "swap:0,1"],
            explanation: "PUSH always lands on top, so the last value pushed ends up on top: push 9 first, then 7."
        },
        {
            id: "m3c-easy-3",
            difficulty: "easy",
            topic: "Queues",
            category: "queue",
            kind: "queue",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["A", "B"],
            target: ["B", "C"],
            solution: ["insTail:C", "delHead"],
            distractors: ["rotate", "reverse", "insTail:D", "insTail:A"],
            explanation: "ENQUEUE adds C at the back and DEQUEUE removes A from the front. Either order works here."
        },
        {
            id: "m3c-easy-4",
            difficulty: "easy",
            topic: "Arrays",
            category: "array",
            kind: "array",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3"],
            target: ["2", "3", "4"],
            solution: ["insTail:4", "delHead"],
            distractors: ["reverse", "delTail", "insHead:4", "insTail:1"],
            explanation: "Append 4 at the end, then remove the first element."
        },
        {
            id: "m3c-easy-5",
            difficulty: "easy",
            topic: "Stacks",
            category: "stack",
            kind: "stack",
            prompt: "The stack starts empty. Build the target.",
            current: [],
            target: ["2", "1"],
            solution: ["insHead:1", "insHead:2"],
            distractors: ["insHead:3", "delHead", "dup", "swap:0,1"],
            explanation: "Starting from an empty stack, push 1 and then 2 - the later push sits on top."
        },
        {
            id: "m3c-easy-6",
            difficulty: "easy",
            topic: "Queues",
            category: "queue",
            kind: "queue",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["X", "Y", "Z"],
            target: ["Z"],
            solution: ["delHead", "delHead"],
            distractors: ["rotate", "reverse", "insTail:Z", "insTail:X"],
            explanation: "A queue removes from the front: two DEQUEUEs drop X and then Y, leaving Z."
        },
        {
            id: "m3c-easy-7",
            difficulty: "easy",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["10", "20"],
            target: ["20", "30"],
            solution: ["insTail:30", "delHead"],
            distractors: ["delTail", "insHead:30", "reverse", "insHead:10"],
            explanation: "Insert 30 at the tail, then delete the head node (10)."
        },
        {
            id: "m3c-easy-8",
            difficulty: "easy",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3", "4"],
            target: ["2", "3"],
            solution: ["delHead", "delTail"],
            distractors: ["reverse", "insHead:1", "insTail:4", "rotate"],
            explanation: "Trim one node from each end: delete the head (1) and the tail (4)."
        },

        // -------------------- INTERMEDIATE --------------------
        // 3 operations, two decoys, one spare slot, live preview on.
        {
            id: "m3c-int-1",
            difficulty: "intermediate",
            topic: "Stacks",
            category: "stack",
            kind: "stack",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["10", "20", "30"],
            target: ["20", "50", "30"],
            solution: ["delHead", "insHead:50", "swap:0,1"],
            distractors: ["dup", "insHead:10", "insHead:20", "delHead"],
            explanation: "POP removes 10, PUSH 50 gives 50, 20, 30, then swapping the top two gives 20, 50, 30."
        },
        {
            id: "m3c-int-2",
            difficulty: "intermediate",
            topic: "Queues",
            category: "queue",
            kind: "queue",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["A", "B", "C"],
            target: ["C", "D"],
            solution: ["delHead", "insTail:D", "delHead"],
            distractors: ["rotate", "insTail:A", "reverse", "insTail:C"],
            explanation: "Two DEQUEUEs remove A and B; ENQUEUE D adds it behind C."
        },
        {
            id: "m3c-int-3",
            difficulty: "intermediate",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3"],
            target: ["0", "2", "3", "4"],
            solution: ["delHead", "insHead:0", "insTail:4"],
            distractors: ["delTail", "reverse", "rotate", "insHead:4", "insTail:0"],
            explanation: "Delete the old head (1), insert 0 at the head, then append 4 at the tail."
        },
        {
            id: "m3c-int-4",
            difficulty: "intermediate",
            topic: "Sorting",
            category: ["array", "sorting"],
            kind: "array",
            prompt: "Reproduce one bubble-sort pass using adjacent swaps (swap i ↔ j).",
            current: ["8", "3", "5", "1"],
            target: ["3", "5", "1", "8"],
            solution: ["swap:0,1", "swap:1,2", "swap:2,3"],
            distractors: ["swap:0,2", "swap:0,3", "reverse", "swap:1,3"],
            explanation: "This is one bubble-sort pass: each adjacent swap carries the largest value (8) one step toward the end. Order matters - the 8 has to be the one being swapped each time."
        },
        {
            id: "m3c-int-5",
            difficulty: "intermediate",
            topic: "Queues",
            category: "queue",
            kind: "queue",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["A", "B", "C", "D"],
            target: ["C", "D", "A", "B"],
            solution: ["rotate", "rotate"],
            distractors: ["reverse", "delHead", "insTail:A", "insTail:B"],
            explanation: "Each HEAD → TAIL moves the front element to the back. Two rotations put A and B behind C and D."
        },
        {
            id: "m3c-int-6",
            difficulty: "intermediate",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3", "4"],
            target: ["5", "4", "3", "2"],
            solution: ["reverse", "delTail", "insHead:5"],
            distractors: ["delHead", "insTail:5", "rotate", "insHead:1"],
            explanation: "Reverse gives 4, 3, 2, 1; deleting the tail drops the 1; inserting 5 at the head finishes it."
        },

        // -------------------- HARD --------------------
        // Slots = exactly the optimal length, three decoys, no preview.
        {
            id: "m3c-hard-1",
            difficulty: "hard",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["10", "20", "30", "40"],
            target: ["25", "30", "20"],
            solution: ["reverse", "delTail", "delHead", "insHead:25"],
            distractors: ["insTail:25", "rotate", "insHead:10", "delHead", "delTail"],
            explanation: "Reverse: 40, 30, 20, 10. Delete the tail (10) and the head (40) to leave 30, 20. Insert 25 at the head."
        },
        {
            id: "m3c-hard-2",
            difficulty: "hard",
            topic: "Stacks",
            category: "stack",
            kind: "stack",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["4", "7", "2"],
            target: ["7", "4", "7", "2"],
            solution: ["delHead", "dup", "insHead:4", "swap:0,1"],
            distractors: ["insHead:7", "delHead", "dup", "insHead:2"],
            explanation: "POP (7, 2), DUP (7, 7, 2), PUSH 4 (4, 7, 7, 2), then swap the top two to get 7, 4, 7, 2."
        },
        {
            id: "m3c-hard-3",
            difficulty: "hard",
            topic: "Sorting",
            category: ["array", "sorting"],
            kind: "array",
            prompt: "Reproduce selection sort with swaps (swap i ↔ j). Skip any pass where the minimum is already in place.",
            current: ["29", "10", "14", "37", "13"],
            target: ["10", "13", "14", "29", "37"],
            solution: ["swap:0,1", "swap:1,4", "swap:3,4"],
            distractors: ["swap:2,3", "swap:0,4", "swap:2,4", "swap:1,2", "reverse"],
            explanation: "Selection sort: swap the minimum (10) into index 0, then 13 into index 1, index 2 (14) is already correct, then 29 into index 3."
        },
        {
            id: "m3c-hard-4",
            difficulty: "hard",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3", "4", "5"],
            target: ["4", "5", "1", "2"],
            solution: ["rotate", "rotate", "rotate", "delTail"],
            distractors: ["reverse", "delHead", "insTail:3", "insHead:5"],
            explanation: "Three HEAD → TAIL rotations give 4, 5, 1, 2, 3. Delete the tail (3) to finish."
        },
        {
            id: "m3c-hard-5",
            difficulty: "hard",
            topic: "Arrays",
            category: "array",
            kind: "array",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["3", "1", "2"],
            target: ["2", "3", "1", "9"],
            solution: ["rotate", "rotate", "insTail:9"],
            distractors: ["reverse", "delTail", "insHead:9", "swap:0,1"],
            explanation: "Two left-rotations turn 3, 1, 2 into 2, 3, 1; then append 9."
        },
        {
            id: "m3c-hard-6",
            difficulty: "hard",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["P", "Q", "R", "S"],
            target: ["T", "S", "R"],
            solution: ["reverse", "delTail", "delTail", "insHead:T"],
            distractors: ["insTail:T", "rotate", "delHead", "insHead:S"],
            explanation: "Reverse: S, R, Q, P. Delete the tail twice to leave S, R, then insert T at the head."
        },

        // -------------------- EXPERT --------------------
        // Exactly N operations, up to four decoys, no preview, one strike.
        {
            id: "m3c-exp-1",
            difficulty: "expert",
            topic: "Sorting",
            category: ["array", "sorting"],
            kind: "array",
            prompt: "Reproduce two bubble-sort passes (stop right after the second pass's last swap).",
            current: ["8", "3", "5", "1"],
            target: ["3", "1", "5", "8"],
            solution: ["swap:0,1", "swap:1,2", "swap:2,3", "swap:1,2"],
            distractors: ["swap:0,2", "swap:0,3", "swap:1,3", "reverse"],
            explanation: "Bubble sort across two passes. Pass 1: swap (0,1), (1,2), (2,3) gives 3, 5, 1, 8. Pass 2: 3 and 5 are in order, then swap (1,2) gives 3, 1, 5, 8."
        },
        {
            id: "m3c-exp-2",
            difficulty: "expert",
            topic: "Linked Lists",
            category: "linkedList",
            kind: "list",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["1", "2", "3", "4", "5"],
            target: ["9", "4", "3", "2", "0"],
            solution: ["reverse", "delHead", "delTail", "insHead:9", "insTail:0"],
            distractors: ["rotate", "insHead:0", "insTail:9", "delHead"],
            explanation: "Reverse (5, 4, 3, 2, 1), drop the head (5) and the tail (1), then insert 9 at the head and 0 at the tail."
        },
        {
            id: "m3c-exp-3",
            difficulty: "expert",
            topic: "Stacks",
            category: "stack",
            kind: "stack",
            prompt: "The stack starts empty. Build the target using exactly the number of slots shown.",
            current: [],
            target: ["1", "3", "1", "2"],
            solution: ["insHead:2", "insHead:1", "dup", "insHead:3", "swap:0,1"],
            distractors: ["delHead", "insHead:1", "insHead:3", "dup"],
            explanation: "Push 2, push 1, DUP the top (1, 1, 2), push 3 (3, 1, 1, 2), then swap the top two to get 1, 3, 1, 2."
        },
        {
            id: "m3c-exp-4",
            difficulty: "expert",
            topic: "Sorting",
            category: ["array", "sorting"],
            kind: "array",
            prompt: "Sort the array with swaps only, using selection sort's minimum number of swaps.",
            current: ["5", "2", "4", "1", "3"],
            target: ["1", "2", "3", "4", "5"],
            solution: ["swap:0,3", "swap:2,4", "swap:3,4"],
            distractors: ["swap:0,1", "swap:1,3", "swap:2,3", "swap:0,4"],
            explanation: "Selection sort: 1 swaps into index 0 (swap 0,3). Index 1 already holds 2. 3 swaps into index 2 (swap 2,4). 4 swaps into index 3 (swap 3,4)."
        },
        {
            id: "m3c-exp-5",
            difficulty: "expert",
            topic: "Queues",
            category: "queue",
            kind: "queue",
            prompt: "Build a sequence of operations that turns CURRENT into TARGET.",
            current: ["A", "B", "C"],
            target: ["D", "B", "E"],
            solution: ["delHead", "insTail:D", "rotate", "insTail:E", "delHead"],
            distractors: ["reverse", "insTail:A", "insTail:B", "delHead"],
            explanation: "Trace it: dequeue A (B, C); enqueue D (B, C, D); rotate (C, D, B); enqueue E (C, D, B, E); dequeue C (D, B, E)."
        }
    ]
};