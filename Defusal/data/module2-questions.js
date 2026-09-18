// ===================================================================
// data/module2-questions.js
//
// Module 2 - OPERATE. The player is given a state + a goal and must
// TYPE the name of the single operation that accomplishes it, using
// the on-screen keypad (or a physical keyboard - see defusal.js).
//
// IMPORTANT CONSTRAINT: the keypad only has letters, space, Backspace
// and Enter (see #module2GameScreen in defusal.html) - no digits or
// punctuation. So every answer here is an operation NAME only, never
// an operand value (e.g. "POP", not "POP 20") - which is also exactly
// the OPERATE/TRACE split: OPERATE asks "what operation do I
// perform?", TRACE (Module 3) asks "what happens when it's
// performed?".
//
// Checking is done in defusal.js via
//   module2TypedAnswer.trim().toLowerCase() === question.answer.toLowerCase()
// so casing here doesn't matter, but multi-word answers must match
// exactly one space between words (the on-screen Space key/physical
// spacebar both type exactly one space per press).
//
// Schema (matches MODULE2_QUESTION_BANK as read by defusal.js):
//
//   difficulties: {
//     <difficultyId>: {
//       label, startingTimeSeconds, mistakesAllowed, questionCount,
//       baseScore, timeBonusCap
//     }
//   },
//   questions: [
//     { difficulty: "<difficultyId>", topic: string, prompt: string, answer: string }
//   ]
// ===================================================================

const MODULE2_QUESTION_BANK = {
    difficulties: {
        easy: {
            label: "Easy",
            startingTimeSeconds: 600,
            mistakesAllowed: 3,
            questionCount: 4,
            baseScore: 1000,
            timeBonusCap: 500
        },
        intermediate: {
            label: "Intermediate",
            startingTimeSeconds: 420,
            mistakesAllowed: 3,
            questionCount: 4,
            baseScore: 1500,
            timeBonusCap: 750
        },
        hard: {
            label: "Hard",
            startingTimeSeconds: 360,
            mistakesAllowed: 2,
            questionCount: 4,
            baseScore: 2000,
            timeBonusCap: 1000
        },
        expert: {
            label: "Expert",
            startingTimeSeconds: 300,
            mistakesAllowed: 1,
            questionCount: 3,
            baseScore: 3000,
            timeBonusCap: 1500
        }
    },

    questions: [

        // ----------------------------- EASY -----------------------------
        // Single, common operations - one-word answers only.
        {
            difficulty: "easy",
            topic: "Stacks",
            prompt: "Stack (top to bottom): 30, 20, 10. You need to remove the top element. What operation do you perform?",
            answer: "POP"
        },
        {
            difficulty: "easy",
            topic: "Queues",
            prompt: "Queue (front to back): A, B, C. You need to remove the element at the front. What operation do you perform?",
            answer: "DEQUEUE"
        },
        {
            difficulty: "easy",
            topic: "Stacks",
            prompt: "You want to add a new element to the top of a stack. What operation do you perform?",
            answer: "PUSH"
        },
        {
            difficulty: "easy",
            topic: "Queues",
            prompt: "You want to add a new element to the back of a queue. What operation do you perform?",
            answer: "ENQUEUE"
        },
        {
            difficulty: "easy",
            topic: "Arrays",
            prompt: "You want to add a new element to the end of an array. What operation do you perform?",
            answer: "APPEND"
        },

        // ------------------------- INTERMEDIATE -------------------------
        // Slightly less common operations - still one or two words.
        {
            difficulty: "intermediate",
            topic: "Stacks",
            prompt: "You want to see the top element of a stack WITHOUT removing it. What operation do you perform?",
            answer: "PEEK"
        },
        {
            difficulty: "intermediate",
            topic: "Linked Lists",
            prompt: "You want to add a new node at the very beginning of a linked list. What operation do you perform?",
            answer: "PREPEND"
        },
        {
            difficulty: "intermediate",
            topic: "Linked Lists",
            prompt: "You want to remove the very first node of a linked list. What operation do you perform?",
            answer: "REMOVE HEAD"
        },
        {
            difficulty: "intermediate",
            topic: "Queues",
            prompt: "You want to check the value at the front of a queue WITHOUT removing it. What operation do you perform?",
            answer: "PEEK"
        },
        {
            difficulty: "intermediate",
            topic: "Trees",
            prompt: "You want to visit a node, then its left subtree, then its right subtree. What traversal do you perform?",
            answer: "PREORDER"
        },

        // ----------------------------- HARD -----------------------------
        // Traversal names and collision-handling terminology.
        {
            difficulty: "hard",
            topic: "Trees",
            prompt: "You want to visit the left subtree, then the node itself, then the right subtree. What traversal do you perform?",
            answer: "INORDER"
        },
        {
            difficulty: "hard",
            topic: "Trees",
            prompt: "You want to visit the left subtree, then the right subtree, then the node itself. What traversal do you perform?",
            answer: "POSTORDER"
        },
        {
            difficulty: "hard",
            topic: "Graphs",
            prompt: "You want to explore a graph level by level, visiting all neighbors before going deeper. What traversal do you perform (acronym)?",
            answer: "BFS"
        },
        {
            difficulty: "hard",
            topic: "Graphs",
            prompt: "You want to explore a graph by going as deep as possible along a branch before backtracking. What traversal do you perform (acronym)?",
            answer: "DFS"
        },
        {
            difficulty: "hard",
            topic: "Hash Tables",
            prompt: "Two keys hash to the same bucket. What technique resolves this by storing every entry that lands there in a list at that bucket?",
            answer: "CHAINING"
        },

        // ---------------------------- EXPERT ----------------------------
        // Less common operations, still unambiguous canonical names.
        {
            difficulty: "expert",
            topic: "Hash Tables",
            prompt: "A hash table has grown too full and needs a larger underlying array with every element reinserted. What operation do you perform?",
            answer: "REHASHING"
        },
        {
            difficulty: "expert",
            topic: "Trees",
            prompt: "You just removed the root of a max-heap and moved the last element there. It now violates the heap property, so it must be moved downward until the property holds again. What operation do you perform?",
            answer: "SIFT DOWN"
        },
        {
            difficulty: "expert",
            topic: "Trees",
            prompt: "An AVL node's left subtree is taller than its right subtree by more than one after an insertion that went left, then left again (a left-left case). What single operation restores balance?",
            answer: "RIGHT ROTATION"
        },
        {
            difficulty: "expert",
            topic: "Arrays",
            prompt: "An array-backed dynamic list is completely full and needs more capacity before the next append can happen. What operation do you perform first?",
            answer: "RESIZE"
        }
    ]
};