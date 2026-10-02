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
        // ---- easy ----
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            type: "mc",
            prompt: "Which data structure follows LIFO (Last In, First Out)?",
            options: [
                { id: "a", text: "Queue", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Linked List", shape: "square" },
                { id: "d", text: "Binary Tree", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Stack follows Last In, First Out (LIFO) order, meaning the last element added is the first one to be removed."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            type: "trueFalse",
            prompt: "A queue follows FIFO (First In, First Out).",
            correctAnswer: true
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "easy",
            type: "trueFalse",
            prompt: "A singly linked list node stores a pointer to the previous node.",
            correctAnswer: false
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "easy",
            type: "trueFalse",
            prompt: "In a standard array, accessing the element at index 4 takes O(n) linear search time because you must start counting from index 0.",
            correctAnswer: false,
            explanation: "Accessing an element in an array by its index takes constant time, O(1), because you can directly compute the memory address of the element without iterating through the array."
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "easy",
            type: "mc",
            prompt: "A web browser needs to manage your browsing history so that clicking the back button takes you to the page you visited most recently. Which data structure fits best?",
            options: [
                { id: "a", text: "Queue", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Circular Linked List", shape: "square" },
                { id: "d", text: "Matrix", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Stack is ideal for managing browsing history because it follows Last In, First Out (LIFO) order. The most recently visited page is on top of the stack, so clicking 'Back' pops it off and returns you to that page."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "easy",
            type: "mc",
            prompt: "A print server receives job requests from multiple users and must print documents strictly in the exact order they were submitted. Which structure fits best?",
            options: [
                { id: "a", text: "Stack", shape: "circle" },
                { id: "b", text: "Doubly Linked List", shape: "triangle" },
                { id: "c", text: "Queue", shape: "square" },
                { id: "d", text: "Array", shape: "diamond" }
            ],
            correctOptionId: "c",
            explanation: "A Queue is ideal for a print server because it follows First In, First Out (FIFO) order. The first job submitted is the first one to be printed, ensuring fairness and order."    
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "easy",
            type: "mc",
            prompt: "A music player app needs a playlist feature allowing users to hit Next Track to go forward, or Previous Track to rewind to the last song seamlessly. Which structure fits best?",
            options: [
                { id: "a", text: "Queue", shape: "circle" },
                { id: "b", text: "Doubly Linked List", shape: "triangle" },
                { id: "c", text: "Stack", shape: "square" },
                { id: "d", text: "Array", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Doubly Linked List is ideal for a music playlist because it allows traversal in both directions. You can easily move to the next track or go back to the previous track without needing to start from the beginning."
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "easy",
            type: "mc",
            prompt: "A game engine requires instant O(1) access to grid coordinates on a 2D chessboard using row/column lookup tables. Which structure fits best?",
            options: [
                { id: "a", text: "Singly Linked List", shape: "circle" },
                { id: "b", text: "Stack", shape: "triangle" },
                { id: "c", text: "Matrix (2D Array)", shape: "square" },
                { id: "d", text: "Queue", shape: "diamond" }
            ],
            correctOptionId: "c",
            explanation: "A 2D Array (Matrix) is ideal for a chessboard because it allows constant time O(1) access to any cell using its row and column indices. This is essential for efficient game logic and rendering."
        },


        // ---- intermediate ----
        {
            topic: "Trees",
            category: "tree",
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
            category: "hash",
            difficulty: "intermediate",
            type: "trueFalse",
            prompt: "A hash table can have two different keys map to the same bucket (a collision).",
            correctAnswer: true
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "intermediate",
            type: "trueFalse",
            prompt: "Implementing a queue using a simple fixed array with Front = index 0 results in an O(n) time complexity for dequeue() because remaining elements must be shifted.",
            correctAnswer: true
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "intermediate",
            type: "trueFalse",
            prompt: "Reading the top element of a stack via peek() removes that element from the stack permanently.",
            correctAnswer: false
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "intermediate",
            type: "trueFalse",
            prompt: "Inserting an element into the middle of an array takes O(1) time because memory allocations are dynamic.",
            correctAnswer: false
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "intermediate",
            type: "mc",
            prompt: "A system needs a cache that frequently moves the least recently used item to the front or drops items off the end instantly, requiring O(1) neighbor updates with known node references. Which fits best?",
            options: [
                { id: "a", text: "Singly Linked List", shape: "circle" },
                { id: "b", text: "Doubly Linked List", shape: "triangle" },
                { id: "c", text: "Stack", shape: "square" },
                { id: "d", text: "Array", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Doubly Linked List is ideal for a cache that needs to move items to the front or remove them from the end in O(1) time. Each node has pointers to both its previous and next nodes, allowing quick updates without traversing the list."
        },

        // ---- hard ----
        {
            topic: "Graphs",
            category: "graph",
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
        {
            topic: "Arrays",
            category: "array",
            difficulty: "hard",
            type: "trueFalse",
            prompt: "Amortized analysis shows that appending an item to a dynamic array takes O(1) time on average, even though periodic array resizing takes O(n) time.",
            correctAnswer: true
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "hard",
            type: "trueFalse",
            prompt: "In a Singly Linked List, if you hold a pointer to an arbitrary target node (not Head), you can delete that target node in O(1) time without traversing from the head.",
            correctAnswer: false
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            type: "trueFalse",
            prompt: "A queue implemented using a Singly Linked List requires both head and tail pointers to achieve O(1) enqueue and O(1) dequeue operations.",
            correctAnswer: true
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "hard",
            type: "trueFalse",
            prompt: "A stack can be implemented using a Singly Linked List where the head node acts as the top, achieving O(1) push and pop without needing a tail pointer.",
            correctAnswer: true
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "hard",
            type: "mc",
            prompt: "A multiplayer game matchmaking system groups players in strict arrival order (first joined, first placed into match). Which structure fits best?",
            options: [
                { id: "a", text: "Stack", shape: "circle" },
                { id: "b", text: "Queue", shape: "triangle" },
                { id: "c", text: "Array Matrix (2D)", shape: "square" },
                { id: "d", text: "Singly Linked List (Head only)", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Queue is ideal for a matchmaking system that groups players in strict arrival order. It follows First In, First Out (FIFO) order, ensuring that the first player to join is the first to be placed into a match."
        },

        // ---- expert ----
        {
            topic: "Heaps",
            category: "heap",
            difficulty: "expert",
            type: "trueFalse",
            prompt: "In a min-heap, the smallest element is always guaranteed to be the leftmost leaf.",
            correctAnswer: false
        },
        {
            topic: "Linked Lists",
            category: "linkedList",
            difficulty: "expert",
            type: "trueFalse",
            prompt: "In a Doubly Linked List, deleting the node immediately preceding a known reference node requires traversing backward from Head in O(n) time.",
            correctAnswer: false,
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            type: "trueFalse",
            prompt: "If you implement a Queue using an Array where Enqueue appends to the back in O(1) amortized time, Dequeue can be done in O(1) without shifting if you maintain a floating Front index pointer.",
            correctAnswer: true
        },
        {
            topic: "Stacks",
            category: "stack",
            difficulty: "expert",
            type: "trueFalse",
            prompt: "Evaluating a postfix mathematical expression (e.g., 3 4 +) requires a Queue to ensure numbers are processed in First-In, First-Out order.",
            correctAnswer: false
        },
        {
            topic: "Arrays",
            category: "array",
            difficulty: "expert",
            type: "mc",
            prompt: "A high-frequency trading platform needs to store stock ticker prices indexed directly by millisecond offsets for instant O(1) random lookups, where total duration is pre-determined at market open. Which structure fits best?",
            options: [
                { id: "a", text: "Dynamic Array (resizable)", shape: "circle" },
                { id: "b", text: "Singly Linked List", shape: "triangle" },
                { id: "c", text: "Fixed-size Array", shape: "square" },
                { id: "d", text: "Stacks", shape: "diamond" }
            ],
            correctOptionId: "c",
            explanation: "A Fixed-size Array is ideal for storing stock ticker prices indexed by millisecond offsets because it allows direct O(1) access to any element using its index. Since the total duration is known at market open, a fixed-size array can be allocated without the overhead of resizing."
        },
        {
            topic: "Queues",
            category: "queue",
            difficulty: "expert",
            type: "mc",
            prompt: "An operating system CPU scheduler uses a Round-Robin algorithm to allocate small time slices to active processes in sequential order, re-inserting incomplete processes to the back of the cycle. Which structure fits best?",
            options: [
                { id: "a", text: "Stack", shape: "circle" },
                { id: "b", text: "Queue", shape: "triangle" },
                { id: "c", text: "Doubly Linked List", shape: "square" },
                { id: "d", text: "Binary Heap", shape: "diamond" }
            ],
            correctOptionId: "b",
            explanation: "A Queue is ideal for a Round-Robin CPU scheduler because it follows First In, First Out (FIFO) order. Processes are executed in the order they arrive, and incomplete processes are re-inserted at the back of the queue for their next time slice."
        }
    ]
};

