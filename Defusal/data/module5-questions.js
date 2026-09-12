// ===================================================================
// Module 5 - Choose the Correct Answer
//
// Unlike Module 1 (exactly one correct option), each question here
// gives 4 statements and the player must select EVERY statement that
// is true - no more, no less - before pressing Confirm. Getting the
// exact set right solves the question; anything else (missing a true
// statement, or selecting a false one) counts as a strike, same as a
// wrong answer in the other modules.
//
// Shape matches module1-questions.js on purpose (same difficulty
// keys/fields) so it drops into MODULE_REGISTRY the same way - just
// "options" -> "statements", and "correctOptionId" -> each
// statement's own "isCorrect" flag instead of a single id.
// ===================================================================
const MODULE5_QUESTION_BANK = {
    "moduleType": "chooseCorrect",
    "difficulties": {
        "easy": {
            "label": "Easy",
            "questionCount": 5,
            "startingTimeSeconds": 720,
            "mistakesAllowed": 3,
            "baseScore": 600,
            "timeBonusCap": 500
        },
        "intermediate": {
            "label": "Intermediate",
            "questionCount": 5,
            "startingTimeSeconds": 480,
            "mistakesAllowed": 3,
            "baseScore": 1200,
            "timeBonusCap": 750
        },
        "hard": {
            "label": "Hard",
            "questionCount": 10,
            "startingTimeSeconds": 360,
            "mistakesAllowed": 2,
            "baseScore": 2400,
            "timeBonusCap": 1000
        },
        "expert": {
            "label": "Expert",
            "questionCount": 10,
            "startingTimeSeconds": 240,
            "mistakesAllowed": 1,
            "baseScore": 3600,
            "timeBonusCap": 1500
        }
    },
    "questions": [
        {
            "id": "cc-e-01",
            "difficulty": "easy",
            "topic": "Array",
            "prompt": "Select every statement below that is TRUE about Arrays.",
            "statements": [
                { "id": "a", "text": "Accessing an element by index is O(1).", "isCorrect": true },
                { "id": "b", "text": "Elements are stored in contiguous memory.", "isCorrect": true },
                { "id": "c", "text": "Every array can resize itself for free at runtime.", "isCorrect": false },
                { "id": "d", "text": "Inserting at the front is always O(1).", "isCorrect": false }
            ]
        },
        {
            "id": "cc-e-02",
            "difficulty": "easy",
            "topic": "Stack",
            "prompt": "Select every statement below that is TRUE about Stacks.",
            "statements": [
                { "id": "a", "text": "A Stack follows Last In, First Out order.", "isCorrect": true },
                { "id": "b", "text": "push() adds an element to the top.", "isCorrect": true },
                { "id": "c", "text": "A Stack follows First In, First Out order.", "isCorrect": false },
                { "id": "d", "text": "You can access any element directly by index.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-e-03",
            "difficulty": "easy",
            "topic": "Queue",
            "prompt": "Select every statement below that is TRUE about Queues.",
            "statements": [
                { "id": "a", "text": "A Queue follows First In, First Out order.", "isCorrect": true },
                { "id": "b", "text": "enqueue() adds an element to the back.", "isCorrect": true },
                { "id": "c", "text": "dequeue() removes the most recently added element.", "isCorrect": false },
                { "id": "d", "text": "A Queue can only ever hold one element at a time.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-e-04",
            "difficulty": "easy",
            "topic": "Linked List",
            "prompt": "Select every statement below that is TRUE about singly Linked Lists.",
            "statements": [
                { "id": "a", "text": "Each node stores a pointer to the next node.", "isCorrect": true },
                { "id": "b", "text": "Nodes are stored in contiguous memory, like an array.", "isCorrect": false },
                { "id": "c", "text": "The list is traversed starting from the head node.", "isCorrect": true },
                { "id": "d", "text": "Every node knows the address of the previous node.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-e-05",
            "difficulty": "easy",
            "topic": "Array vs Linked List",
            "prompt": "Select every statement below that is TRUE.",
            "statements": [
                { "id": "a", "text": "Arrays support constant-time random access.", "isCorrect": true },
                { "id": "b", "text": "Linked Lists support constant-time random access.", "isCorrect": false },
                { "id": "c", "text": "Linked Lists can grow or shrink without reallocating a whole block.", "isCorrect": true },
                { "id": "d", "text": "Arrays never need contiguous memory.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-i-01",
            "difficulty": "intermediate",
            "topic": "Stack",
            "prompt": "Select every statement below that is TRUE about Stack use cases.",
            "statements": [
                { "id": "a", "text": "Undo/redo history in an editor is a natural fit for a Stack.", "isCorrect": true },
                { "id": "b", "text": "Function call tracking (the call stack) behaves like a Stack.", "isCorrect": true },
                { "id": "c", "text": "A print queue at a shared office printer behaves like a Stack.", "isCorrect": false },
                { "id": "d", "text": "A Stack is the best fit for scheduling tasks by priority.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-i-02",
            "difficulty": "intermediate",
            "topic": "Tree",
            "prompt": "Select every statement below that is TRUE about Binary Search Trees.",
            "statements": [
                { "id": "a", "text": "Values smaller than a node are stored in its left subtree.", "isCorrect": true },
                { "id": "b", "text": "Values larger than a node are stored in its right subtree.", "isCorrect": true },
                { "id": "c", "text": "Every BST is automatically balanced.", "isCorrect": false },
                { "id": "d", "text": "A BST can only store numbers, never strings.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-i-03",
            "difficulty": "intermediate",
            "topic": "Graph",
            "prompt": "Select every statement below that is TRUE about Graphs.",
            "statements": [
                { "id": "a", "text": "A Graph can be represented with an adjacency matrix.", "isCorrect": true },
                { "id": "b", "text": "A Graph can be represented with an adjacency list.", "isCorrect": true },
                { "id": "c", "text": "Every Graph must be a tree.", "isCorrect": false },
                { "id": "d", "text": "Graphs cannot contain cycles.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-i-04",
            "difficulty": "intermediate",
            "topic": "Queue",
            "prompt": "Select every statement below that is TRUE about a Deque.",
            "statements": [
                { "id": "a", "text": "Elements can be inserted at both the front and the back.", "isCorrect": true },
                { "id": "b", "text": "Elements can be removed from both the front and the back.", "isCorrect": true },
                { "id": "c", "text": "A Deque only allows insertion at the front.", "isCorrect": false },
                { "id": "d", "text": "A Deque is another name for a Priority Queue.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-i-05",
            "difficulty": "intermediate",
            "topic": "Linked List",
            "prompt": "Select every statement below that is TRUE about Linked Lists vs Arrays.",
            "statements": [
                { "id": "a", "text": "Inserting in the middle of a Linked List avoids shifting other elements.", "isCorrect": true },
                { "id": "b", "text": "Linked Lists generally have better cache locality than arrays.", "isCorrect": false },
                { "id": "c", "text": "A Linked List's size can change without reallocating one big block.", "isCorrect": true },
                { "id": "d", "text": "Random access is faster on a Linked List than an Array.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-h-01",
            "difficulty": "hard",
            "topic": "Tree",
            "prompt": "Select every statement below that is TRUE about balanced Binary Search Trees.",
            "statements": [
                { "id": "a", "text": "Search runs in O(log n) time.", "isCorrect": true },
                { "id": "b", "text": "Insertion runs in O(log n) time.", "isCorrect": true },
                { "id": "c", "text": "Search degrades to O(n) even when the tree is balanced.", "isCorrect": false },
                { "id": "d", "text": "A balanced BST must be a linked list in disguise.", "isCorrect": false }
            ]
        },
        {
            "id": "cc-h-02",
            "difficulty": "hard",
            "topic": "Graph",
            "prompt": "Select every statement below that is TRUE about graph traversal.",
            "statements": [
                { "id": "a", "text": "Breadth-First Search uses a Queue as its core data structure.", "isCorrect": true },
                { "id": "b", "text": "Depth-First Search can be implemented with a Stack (or recursion).", "isCorrect": true },
                { "id": "c", "text": "Breadth-First Search uses a Stack as its core data structure.", "isCorrect": false },
                { "id": "d", "text": "DFS always visits nodes in the same order as BFS.", "isCorrect": false }
            ]
        }
    ]
};