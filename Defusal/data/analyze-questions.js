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
            baseScore: 500,
            timeBonusCap: 500
        },
        intermediate: {
            label: "Intermediate",
            startingTimeSeconds: 420,
            mistakesAllowed: 2,
            questionCount: 6,
            baseScore: 1000,
            timeBonusCap: 750
        },
        hard: {
            label: "Hard",
            startingTimeSeconds: 360,
            mistakesAllowed: 2,
            questionCount: 7,
            baseScore: 2000,
            timeBonusCap: 1000
        },
        expert: {
            label: "Expert",
            startingTimeSeconds: 300,
            mistakesAllowed: 1,
            questionCount: 8,
            baseScore: 3000,
            timeBonusCap: 1500
        }
    },

    questions: [
        // ----------------------------- easy -----------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            operations: ["push(A)", "push(B)", "push(C)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "C",
            explanation: "The last value pushed onto the stack is C, which is returned by the pop() operation."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "A",
            explanation: "The first value enqueued is A, which is returned by the dequeue() operation."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            operations: ["push(1)", "push(2)", "pop()", "push(3)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "3",
            explanation: "The values are pushed onto the stack in order 1, 2, 3. The last value pushed is 3, which is returned by the pop() operation."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            operations: ["enqueue(X)", "enqueue(Y)", "dequeue()", "enqueue(Z)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "Y",
            explanation: "The first value enqueued is X, which is returned by the first dequeue() operation. The second value enqueued is Y, which is returned by the second dequeue() operation."  
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "easy",
            operations: ["arr = [5, 10, 15]", "arr[1] = 20"],
            prompt: "What is arr[1] after this code runs?",
            answer: "20",
            explanation: "The array is initialized with values [5, 10, 15]. The second element (index 1) is then updated to 20, so arr[1] is now 20."
        },

        // -------------------------- intermediate --------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "intermediate",
            operations: ["push(A)", "push(B)", "push(C)", "pop()", "pop()", "push(D)"],
            prompt: "What is on top of the stack now?",
            answer: "D",
            explanation: "The stack operations result in the following sequence: push A, push B, push C, pop (removes C), pop (removes B), push D. The top of the stack is now D."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "intermediate",
            operations: ["enqueue(1)", "enqueue(2)", "enqueue(3)", "dequeue()", "enqueue(4)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "2",
            explanation: "The queue operations result in the following sequence: enqueue 1, enqueue 2, enqueue 3, dequeue (removes 1), enqueue 4, dequeue (removes 2). The final value returned is 2."
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "intermediate",
            operations: ["list: 10 -> 20 -> 30", "insert 15 after 10", "delete 30"],
            prompt: "What is the last node's value?",
            answer: "20",
            explanation: "The linked list starts as 10 -> 20 -> 30. After inserting 15 after 10, it becomes 10 -> 15 -> 20 -> 30. Deleting 30 leaves the list as 10 -> 15 -> 20, so the last node's value is 20."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "intermediate",
            operations: ["push(5)", "push(10)", "push(15)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "10",
            explanation: "The stack operations result in the following sequence: push 5, push 10, push 15, pop (removes 15), pop (removes 10). The final value returned is 10."
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "intermediate",
            operations: ["arr = [1, 2, 3, 4]", "remove index 1", "arr[1] = 99"],
            prompt: "What is arr[1] after this code runs?",
            answer: "99",
            explanation: "The array is initialized with values [1, 2, 3, 4]. Removing index 1 (value 2) results in [1, 3, 4]. Then arr[1] is set to 99, so arr[1] is now 99."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "intermediate",
            operations: ["enqueue(A)", "enqueue(B)", "dequeue()", "enqueue(C)", "enqueue(D)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "B",
            explanation: "The queue operations result in the following sequence: enqueue A, enqueue B, dequeue (removes A), enqueue C, enqueue D, dequeue (removes B). The final value returned is B."
        },

        // ------------------------------ hard ------------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            operations: ["push(1)", "push(2)", "push(3)", "pop()", "push(4)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "1",
            explanation: "The stack operations result in the following sequence: push 1, push 2, push 3, pop (removes 3), push 4, pop (removes 4), pop (removes 2). The final value returned is 1."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "dequeue()", "dequeue()", "enqueue(D)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "D",
            explanation: "The queue operations result in the following sequence: enqueue A, enqueue B, enqueue C, dequeue (removes A), dequeue (removes B), enqueue D, dequeue (removes C). The final value returned is D."
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "hard",
            operations: ["list: A -> B -> C -> D", "delete B", "insert E after A"],
            prompt: "What is the second node's value?",
            answer: "E",
            explanation: "The linked list starts as A -> B -> C -> D. Deleting B results in A -> C -> D. Inserting E after A results in A -> E -> C -> D. The second node's value is now E."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            operations: ["push(2)", "push(4)", "push(6)", "x = pop()", "push(x * 2)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "12",
            explanation: "The stack operations result in the following sequence: push 2, push 4, push 6, pop (removes 6, x = 6), push(x * 2) (pushes 12), pop (removes 12). The final value returned is 12."           
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "hard",
            operations: ["arr = [3, 6, 9, 12]", "sum = 0", "for each x in arr: sum += x"],
            prompt: "What is the value of sum after this code runs?",
            answer: "30",
            explanation: "The array is initialized with values [3, 6, 9, 12]. The loop iterates over each element and adds it to sum: 0 + 3 = 3, 3 + 6 = 9, 9 + 9 = 18, 18 + 12 = 30. The final value of sum is 30."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            operations: ["enqueue(10)", "enqueue(20)", "enqueue(30)", "dequeue()", "enqueue(40)", "dequeue()", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "40",
            explanation: "The queue operations result in the following sequence: enqueue 10, enqueue 20, enqueue 30, dequeue (removes 10), enqueue 40, dequeue (removes 20), dequeue (removes 30). The final value returned is 40."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            operations: ["push(A)", "push(B)", "pop()", "push(C)", "push(D)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "A",
            explanation: "The stack operations result in the following sequence: push A, push B, pop (removes B), push C, push D, pop (removes D), pop (removes C). The final value returned is A."
        },

        // ----------------------------- expert -----------------------------
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            operations: ["push(1)", "push(2)", "push(3)", "push(4)", "pop()", "pop()", "push(5)", "pop()"],
            prompt: "What is the final value returned?",
            answer: "5",
            explanation: "The stack operations result in the following sequence: push 1, push 2, push 3, push 4, pop (removes 4), pop (removes 3), push 5, pop (removes 5). The final value returned is 5."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            operations: ["enqueue(A)", "enqueue(B)", "enqueue(C)", "enqueue(D)", "dequeue()", "dequeue()", "enqueue(E)", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "C",
            explanation: "The queue operations result in the following sequence: enqueue A, enqueue B, enqueue C, enqueue D, dequeue (removes A), dequeue (removes B), enqueue E, dequeue (removes C). The final value returned is C."  
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            operations: ["list: 1 -> 2 -> 3 -> 4 -> 5", "delete 1", "delete 5", "insert 10 after 3"],
            prompt: "What is the value of the third node?",
            answer: "10",
            explanation: "The linked list starts as 1 -> 2 -> 3 -> 4 -> 5. Deleting 1 results in 2 -> 3 -> 4 -> 5. Deleting 5 results in 2 -> 3 -> 4. Inserting 10 after 3 results in 2 -> 3 -> 10 -> 4. The third node's value is now 10."

        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            operations: ["push(3)", "push(6)", "x = pop()", "push(x + 1)", "push(9)", "pop()", "pop()"],
            prompt: "What is the final value returned?",
            answer: "7",
            explanation: "The stack operations result in the following sequence: push 3, push 6, pop (removes 6, x = 6), push(x + 1) (pushes 7), push 9, pop (removes 9), pop (removes 7). The final value returned is 7."
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "expert",
            operations: ["arr = [2, 4, 6, 8, 10]", "count = 0", "for each x in arr: if x > 5: count += 1"],
            prompt: "What is the value of count after this code runs?",
            answer: "3",
            explanation: "The array is initialized with values [2, 4, 6, 8, 10]. The loop iterates over each element and increments count for values greater than 5: 6, 8, and 10. The final value of count is 3."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            operations: ["enqueue(5)", "enqueue(10)", "dequeue()", "enqueue(15)", "enqueue(20)", "dequeue()", "dequeue()"],
            prompt: "What is the final value returned?",
            answer: "15",
            explanation: "The queue operations result in the following sequence: enqueue 5, enqueue 10, dequeue (removes 5), enqueue 15, enqueue 20, dequeue (removes 10), dequeue (removes 15). The final value returned is 15."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            operations: ["push(A)", "push(B)", "push(C)", "pop()", "pop()", "pop()", "push(D)"],
            prompt: "What is on top of the stack now (the only element)?",
            answer: "D",
            explanation: "The stack operations result in the following sequence: push A, push B, push C, pop (removes C), pop (removes B), pop (removes A), push D. The only element on the stack now is D."
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            operations: ["list: X -> Y -> Z", "insert W after X", "delete Z", "insert V after W"],
            prompt: "What is the value of the last node?",
            answer: "V",
            explanation: "The linked list starts as X -> Y -> Z. Inserting W after X results in X -> W -> Y -> Z. Deleting Z results in X -> W -> Y. Inserting V after W results in X -> W -> V -> Y. The last node's value is now V."
        }
    ]
};