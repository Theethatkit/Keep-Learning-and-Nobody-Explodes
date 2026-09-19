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
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            operations: ["push(10)", "push(20)", "push(30)", "pop()", "push(40)"],
            prompt: "What value is currently at the TOP of the stack?",
            answer: "40",
            explanation: "Since a stack follows LIFO (Last In, First Out), the most recently added item sits at the top, leaving 40 at the TOP."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            operations: ["enqueue(5)", "enqueue(15)", "enqueue(25)", "dequeue()", "peek()"],
            prompt: "What value is returned by peek()?",
            answer: "15",
            explanation: "the peek() operation returns the value at the front of the queue without removing it. After dequeuing 5, the front of the queue is now 15, so peek() returns 15.",

        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "easy",
            operations: ["arr = [4, 8, 15, 16]", "update arr[2] = 99", "access arr[2]"],
            prompt: "What value is returned?",
            answer: "99",
            explanation: "The array is initialized with values [4, 8, 15, 16]. The third element (index 2) is updated to 99. Accessing arr[2] returns the updated value, which is 99."
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
        {
            topic: "Queues & Stacks",
            category: ["queue", "stack"],
            difficulty: "intermediate",
            operations: ["Queue Q = [A, B, C] (front -> back)", "Stack S = []", "S.push(Q.dequeue())", "S.push(Q.dequeue())", "Q.enqueue(S.pop())"],
            prompt: "What item is now at the BACK of Queue Q?",
            answer: "B",
            explanation: "The queue starts as [A, B, C]. The first dequeue removes A and pushes it onto the stack S. The second dequeue removes B and pushes it onto S. Then popping from S returns B, which is enqueued back to Q. The final state of Q is [C, B], so the BACK of Q is now B."

        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "intermediate",
            operations: ["arr[A] = [10,20,30,40]", "delete element at index 1 (requires left shift)", "insert 99 at index 1"],
            prompt: "What value is stored at index 2?",
            answer: "30",
            explanation: "The array starts as [10, 20, 30, 40]. Deleting the element at index 1 (20) shifts the elements left, resulting in [10, 30, 40]. Inserting 99 at index 1 results in [10, 99, 30, 40]. The value at index 2 is now 30."

        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "intermediate",
            operations: ["list: Head -> 5 -> 12 -> 8 -> NULL", "Delete front (head) node", "Insert 42 at front"],
            prompt: "What value does Head.next.value evaluate to?",
            answer: "5",
            explanation: "The linked list starts as Head -> 5 -> 12 -> 8 -> NULL. Deleting the front node (5) results in Head -> 12 -> 8 -> NULL. Inserting 42 at the front results in Head -> 42 -> 12 -> 8 -> NULL. Therefore, Head.next.value evaluates to 12."

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
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "hard",
            operations: ["Circular linked list (Tail pointer tracks last node [30] which points to Head [10]): Initial State: [10] -> [20] -> [30] -> (back to 10))", "insert front (5)", "delete back()"],
            prompt: "What value does Tail.value equal now?",
            answer: "20",
            explanation: "The circular linked list starts as [10] -> [20] -> [30] -> (back to 10). Inserting 5 at the front results in [5] -> [10] -> [20] -> [30] -> (back to 5). Deleting the back node (30) results in [5] -> [10] -> [20] -> (back to 5). The Tail pointer now points to the last node, which has the value 20."
        },
        {
            topic: "Stacks & Queues",
            category: ["stack", "queue"],
            difficulty: "hard",
            operations: ["Stack S: push(1), push(2), push(3)", "Queue Q: enqueue(S.pop())", "Queue Q: enqueue(S.pop())", "Stack S: push(10) 5. X = Q.dequeue() + S.pop()"],
            prompt: "What is the numeric value of X?",
            answer: "12",
            explanation: "The stack S starts with 1, 2, 3. Popping twice gives 3 and 2, which are enqueued into Q. The stack S now has 1. Pushing 10 onto S makes it [1, 10]. Dequeuing from Q gives 3 (the first element), and popping from S gives 10. Therefore, X = 3 + 10 = 13."
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "hard",
            operations: ["Head -> [A] <-> [B] <-> [C] <- Tail", "Delete Node B (given direct reference to B)", "Insert Node X after A"], 
            prompt: "Starting from Head to Tail, what is the exact 3-letter node sequence? (Format: XYZ)",
            answer: "AXC",
            explanation: "The doubly linked list starts as A <-> B <-> C. Deleting node B results in A <-> C. Inserting node X after A results in A <-> X <-> C. The sequence from Head to Tail is now A, X, C."
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
        },
        {
            topic: "multi data structures",
            category: ["stack", "queue", "arrays"],
            difficulty: "expert",
            operations: ["Array A = [2, 4, 6]", "Stack S = []", "Queue Q = []", "Push A[0] and A[2] onto Stack S", "Pop top of Stack S and Enqueue it into Queue Q", "Enqueue (A[1] + S.pop()) into Queue Q"],
            prompt: "What is the final value at the FRONT of Queue Q?",
            answer: "6",
            explanation: "The array A is [2, 4, 6]. Pushing A[0] (2) and A[2] (6) onto Stack S results in S = [2, 6]. Popping the top of Stack S (6) and enqueuing it into Queue Q results in Q = [6]. Popping the next top of Stack S (2) and adding it to A[1] (4) gives 4 + 2 = 6, which is enqueued into Queue Q. The final state of Queue Q is [6, 6], so the FRONT of Queue Q is now 6."
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            operations: ["Head -> [10] -> [20] -> [30] -> [40] -> NULL", "Target = Head.next (Node 20)", "Target.next = Target.next.next (bypassing Node 30)", "Head = Head.next"],
            prompt: "What value does Head.next.value evaluate to now?",
            answer: "30",
            explanation: "The linked list starts as Head -> [10] -> [20] -> [30] -> [40] -> NULL. Target is set to Node 20. Bypassing Node 30 results in the list: Head -> [10] -> [20] -> [40] -> NULL. Moving Head to Head.next makes Head point to Node 20. Therefore, Head.next.value now evaluates to 40."
        }
    ]
};
        
    
