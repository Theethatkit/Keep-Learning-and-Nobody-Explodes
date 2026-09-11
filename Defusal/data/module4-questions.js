const MODULE4_QUESTION_BANK = {
    "moduleType": "trueFalse",
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
            "id": "tf-e-01",
            "difficulty": "easy",
            "topic": "Array",
            "prompt": "Accessing an element in an array by its index takes constant time, O(1).",
            "correctAnswer": true
        },
        {
            "id": "tf-e-02",
            "difficulty": "easy",
            "topic": "Stack",
            "prompt": "A Stack follows Last In First Out (LIFO) order.",
            "correctAnswer": true
        },
        {
            "id": "tf-e-03",
            "difficulty": "easy",
            "topic": "Queue",
            "prompt": "The enqueue operation adds a new element to the front of the Queue.",
            "correctAnswer": false
        },
        {
            "id": "tf-e-04",
            "difficulty": "easy",
            "topic": "Linked List",
            "prompt": "Each node in a singly linked list stores a pointer to the next node.",
            "correctAnswer": true
        },
        {
            "id": "tf-e-05",
            "difficulty": "easy",
            "topic": "Array vs Linked List",
            "prompt": "Linked lists store their elements in contiguous memory, just like arrays.",
            "correctAnswer": false
        },
        {
            "id": "tf-i-01",
            "difficulty": "intermediate",
            "topic": "Stack",
            "prompt": "A stack of plates, where you can only take from the top, is a real-world example of a Stack.",
            "correctAnswer": true
        },
        {
            "id": "tf-i-02",
            "difficulty": "intermediate",
            "topic": "Tree",
            "prompt": "In a Binary Search Tree, values greater than a node's value are stored in its left subtree.",
            "correctAnswer": false
        },
        {
            "id": "tf-i-03",
            "difficulty": "intermediate",
            "topic": "Graph",
            "prompt": "A Graph can be represented in memory using an adjacency matrix.",
            "correctAnswer": true
        },
        {
            "id": "tf-i-04",
            "difficulty": "intermediate",
            "topic": "Queue",
            "prompt": "A Deque allows insertion and removal from both ends.",
            "correctAnswer": true
        },
        {
            "id": "tf-i-05",
            "difficulty": "intermediate",
            "topic": "Linked List",
            "prompt": "Inserting a node in the middle of a Linked List requires shifting every later element, the same as inserting into an array.",
            "correctAnswer": false
        },
        {
            "id": "tf-h-01",
            "difficulty": "hard",
            "topic": "Tree",
            "prompt": "Searching a balanced Binary Search Tree with n nodes takes O(log n) time.",
            "correctAnswer": true
        },
        {
            "id": "tf-h-02",
            "difficulty": "hard",
            "topic": "Graph",
            "prompt": "Breadth-First Search (BFS) uses a Stack as its core data structure.",
            "correctAnswer": false
        }
    ]
};