// ===================================================================
// Module 4 - Analyze question bank
//
// Analyze's job is "determine what an algorithm does": each question
// is a short, ordered list of operations (`operations`, an array of
// strings shown to the player as a numbered trace/console log) plus
// a `prompt` asking what came out of it, and the player types the
// answer on a keypad rather than picking from options - see
// renderAnalyzeQuestion / submitAnalyzeAnswer in defusal.js.
//
// `answer` is matched case-insensitively against the player's typed
// input (same as Module 2's fill-in-the-blank), so keep it short - a
// single value/element/count, not a sentence.
//
// difficulty ids (easy/intermediate/hard/expert) must match the ids
// used by the other modules' banks, since the overview's difficulty
// dropdown and its "X:XX on the clock" preview are built from
// IDENTIFY_QUESTION_BANK, not this one (see populateDifficultyOptions
// in defusal.js) - only the numbers below are Analyze's own.
//
// NOTE: the numbers below (time/mistakes/question count/scoring) are
// reasonable placeholders, not pulled from the site's existing
// per-module balance - adjust startingTimeSeconds/mistakesAllowed/
// baseScore/timeBonusCap per difficulty to match however Modules
// 1/2/3/5 are currently tuned, so Analyze doesn't feel noticeably
// easier or harder than the rest of the bomb.
// ===================================================================

const ANALYZE_QUESTION_BANK = {
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
        // ----------------------------- easy -----------------------------
        {
            topic: "Stacks",
            difficulty: "easy",
            operations: ["push(A)", "push(B)", "push(C)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "C"
        },
        {
            topic: "Queues",
            difficulty: "easy",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "A"
        },
        {
            topic: "Stacks",
            difficulty: "easy",
            operations: ["push(1)", "push(2)", "pop()", "push(3)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "3"
        },
        {
            topic: "Queues",
            difficulty: "easy",
            operations: ["enqueue(X)", "enqueue(Y)", "dequeue()", "enqueue(Z)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "Y"
        },
        {
            topic: "Arrays",
            difficulty: "easy",
            operations: ["arr = [5, 10, 15]", "arr[1] = 20"],
            prompt: "What is arr[1] after this code runs?",
            answer: "20"
        },

        // -------------------------- intermediate --------------------------
        {
            topic: "Stacks",
            difficulty: "intermediate",
            operations: ["push(A)", "push(B)", "push(C)", "pop()", "pop()", "push(D)"],
            prompt: "What is on top of the stack now?",
            answer: "D"
        },
        {
            topic: "Queues",
            difficulty: "intermediate",
            operations: ["enqueue(1)", "enqueue(2)", "enqueue(3)", "dequeue()", "enqueue(4)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "2"
        },
        {
            topic: "Linked Lists",
            difficulty: "intermediate",
            operations: ["list: 10 -> 20 -> 30", "insert 15 after 10", "delete 30"],
            prompt: "What is the last node's value?",
            answer: "20"
        },
        {
            topic: "Stacks",
            difficulty: "intermediate",
            operations: ["push(5)", "push(10)", "push(15)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "10"
        },
        {
            topic: "Arrays",
            difficulty: "intermediate",
            operations: ["arr = [1, 2, 3, 4]", "remove index 1", "arr[1] = 99"],
            prompt: "What is arr[1] after this code runs?",
            answer: "99"
        },
        {
            topic: "Queues",
            difficulty: "intermediate",
            operations: ["enqueue(A)", "enqueue(B)", "dequeue()", "enqueue(C)", "enqueue(D)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "B"
        },

        // ------------------------------ hard ------------------------------
        {
            topic: "Stacks",
            difficulty: "hard",
            operations: ["push(1)", "push(2)", "push(3)", "pop()", "push(4)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "1"
        },
        {
            topic: "Queues",
            difficulty: "hard",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "dequeue()", "dequeue()", "enqueue(D)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "D"
        },
        {
            topic: "Linked Lists",
            difficulty: "hard",
            operations: ["list: A -> B -> C -> D", "delete B", "insert E after A"],
            prompt: "What is the second node's value?",
            answer: "E"
        },
        {
            topic: "Stacks",
            difficulty: "hard",
            operations: ["push(2)", "push(4)", "push(6)", "x = pop()", "push(x * 2)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "12"
        },
        {
            topic: "Arrays",
            difficulty: "hard",
            operations: ["arr = [3, 6, 9, 12]", "sum = 0", "for each x in arr: sum += x"],
            prompt: "What is the value of sum after this code runs?",
            answer: "30"
        },
        {
            topic: "Queues",
            difficulty: "hard",
            operations: ["enqueue(10)", "enqueue(20)", "enqueue(30)", "dequeue()", "enqueue(40)", "dequeue()", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "40"
        },
        {
            topic: "Stacks",
            difficulty: "hard",
            operations: ["push(A)", "push(B)", "pop()", "push(C)", "push(D)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "A"
        },

        // ----------------------------- expert -----------------------------
        {
            topic: "Stacks",
            difficulty: "expert",
            operations: ["push(1)", "push(2)", "push(3)", "push(4)", "pop()", "pop()", "push(5)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "5"
        },
        {
            topic: "Queues",
            difficulty: "expert",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "enqueue(D)", "dequeue()", "dequeue()", "enqueue(E)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "C"
        },
        {
            topic: "Linked Lists",
            difficulty: "expert",
            operations: ["list: 1 -> 2 -> 3 -> 4 -> 5", "delete 1", "delete 5", "insert 10 after 3"],
            prompt: "What is the value of the third node?",
            answer: "10"
        },
        {
            topic: "Stacks",
            difficulty: "expert",
            operations: ["push(3)", "push(6)", "x = pop()", "push(x + 1)", "push(9)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "7"
        },
        {
            topic: "Arrays",
            difficulty: "expert",
            operations: ["arr = [2, 4, 6, 8, 10]", "count = 0", "for each x in arr: if x > 5: count += 1"],
            prompt: "What is the value of count after this code runs?",
            answer: "3"
        },
        {
            topic: "Queues",
            difficulty: "expert",
            operations: ["enqueue(5)", "enqueue(10)", "dequeue()", "enqueue(15)", "enqueue(20)", "dequeue()", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "15"
        },
        {
            topic: "Stacks",
            difficulty: "expert",
            operations: ["push(A)", "push(B)", "push(C)", "pop()", "pop()", "pop()", "push(D)"],
            prompt: "What is on top of the stack now (the only element)?",
            answer: "D"
        },
        {
            topic: "Linked Lists",
            difficulty: "expert",
            operations: ["list: X -> Y -> Z", "insert W after X", "delete Z", "insert V after W"],
            prompt: "What is the value of the last node?",
            answer: "V"
        }
    ]
};