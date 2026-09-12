const MODULE2_QUESTION_BANK = {
    "moduleType": "fillInTheBlank",
    "difficulties": {
        "easy": {
            "label": "Easy",
            "questionCount": 5,
            "startingTimeSeconds": 600,
            "mistakesAllowed": 3,
            "baseScore": 500,
            "timeBonusCap": 500
        },
        "intermediate": {
            "label": "Intermediate",
            "questionCount": 5,
            "startingTimeSeconds": 420,
            "mistakesAllowed": 3,
            "baseScore": 1000,
            "timeBonusCap": 750
        },
        "hard": {
            "label": "Hard",
            "questionCount": 10,
            "startingTimeSeconds": 300,
            "mistakesAllowed": 2,
            "baseScore": 2000,
            "timeBonusCap": 1000
        },
        "expert": {
            "label": "Expert",
            "questionCount": 10,
            "startingTimeSeconds": 180,
            "mistakesAllowed": 1,
            "baseScore": 3000,
            "timeBonusCap": 1500
        }
    },
    "questions": [
        {
            "id": "fb-e-01",
            "difficulty": "easy",
            "topic": "Array",
            "prompt": "An ____ stores its elements in contiguous memory and supports constant-time index access.",
            "answer": "array"
        },
        {
            "id": "fb-e-02",
            "difficulty": "easy",
            "topic": "Stack",
            "prompt": "LIFO stands for ____ In First Out.",
            "answer": "last"
        },
        {
            "id": "fb-e-03",
            "difficulty": "easy",
            "topic": "Queue",
            "prompt": "The ____ operation removes an element from the front of a Queue.",
            "answer": "dequeue"
        },
        {
            "id": "fb-e-04",
            "difficulty": "easy",
            "topic": "Linked List",
            "prompt": "Each node in a singly linked list stores a pointer to the ____ node.",
            "answer": "next"
        },
        {
            "id": "fb-e-05",
            "difficulty": "easy",
            "topic": "Hashing",
            "prompt": "A ____ table stores key-value pairs for fast average-case lookup.",
            "answer": "hash"
        },
        {
            "id": "fb-i-01",
            "difficulty": "intermediate",
            "topic": "Tree",
            "prompt": "In a Binary Search Tree, values smaller than a node's value are stored in its ____ subtree.",
            "answer": "left"
        },
        {
            "id": "fb-i-02",
            "difficulty": "intermediate",
            "topic": "Graph",
            "prompt": "A Graph can be represented in memory using an adjacency ____ or an adjacency list.",
            "answer": "matrix"
        },
        {
            "id": "fb-i-03",
            "difficulty": "intermediate",
            "topic": "Queue",
            "prompt": "A ____ allows insertion and removal from both ends.",
            "answer": "deque"
        },
        {
            "id": "fb-i-04",
            "difficulty": "intermediate",
            "topic": "Sorting",
            "prompt": "____ sort repeatedly swaps adjacent elements that are out of order.",
            "answer": "bubble"
        },
        {
            "id": "fb-i-05",
            "difficulty": "intermediate",
            "topic": "Recursion",
            "prompt": "A recursive function must have a ____ case to avoid infinite recursion.",
            "answer": "base"
        },
        {
            "id": "fb-h-01",
            "difficulty": "hard",
            "topic": "Graph",
            "prompt": "A ____-first search explores as far as possible along a branch before backtracking.",
            "answer": "depth"
        },
        {
            "id": "fb-h-02",
            "difficulty": "hard",
            "topic": "Big O",
            "prompt": "An algorithm that runs in O(n log n) time is generally ____ than one that runs in O(n^2) for large n.",
            "answer": "faster"
        }
    ]
};