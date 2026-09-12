// ===================================================================
// Module 3 - Connect the Dots
//
// Each "question" here is a round with several vocabulary terms and
// their definitions. The definitions are shown in shuffled order and
// the player has to connect every term to its matching definition,
// then press Check Connections. A round only counts as solved if
// EVERY pair in it is connected correctly - same "all or nothing per
// round" idea as Module 5's statement checks.
//
// Shape matches the other modules on purpose (difficulties block with
// the same fields, questions tagged by difficulty) so it drops into
// MODULE_REGISTRY the same way - just "options"/"statements" becomes
// "pairs", where each pair's own id is shared by its term and its
// correct definition.
// ===================================================================
const MODULE3_QUESTION_BANK = {
    "moduleType": "connectTheDots",
    "difficulties": {
        "easy": {
            "label": "Easy",
            "questionCount": 5,
            "startingTimeSeconds": 480,
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
            "startingTimeSeconds": 360,
            "mistakesAllowed": 2,
            "baseScore": 2000,
            "timeBonusCap": 1000
        },
        "expert": {
            "label": "Expert",
            "questionCount": 10,
            "startingTimeSeconds": 240,
            "mistakesAllowed": 1,
            "baseScore": 3000,
            "timeBonusCap": 1500
        }
    },
    "questions": [
        {
            "id": "ctd-e-01",
            "difficulty": "easy",
            "topic": "Core Structures",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Array", "definition": "A collection of elements stored in contiguous memory and accessed by index." },
                { "id": "p2", "term": "Stack", "definition": "A structure where the last element added is the first one removed." },
                { "id": "p3", "term": "Queue", "definition": "A structure where the first element added is the first one removed." }
            ]
        },
        {
            "id": "ctd-e-02",
            "difficulty": "easy",
            "topic": "Linked Structures",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Linked List", "definition": "A sequence of nodes where each node points to the next." },
                { "id": "p2", "term": "Tree", "definition": "A hierarchical structure of nodes with a single root and no cycles." },
                { "id": "p3", "term": "Graph", "definition": "A set of nodes connected by edges, which may contain cycles." }
            ]
        },
        {
            "id": "ctd-e-03",
            "difficulty": "easy",
            "topic": "Queue Operations",
            "prompt": "Connect each operation to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Enqueue", "definition": "Adds an element to the back of a queue." },
                { "id": "p2", "term": "Dequeue", "definition": "Removes an element from the front of a queue." },
                { "id": "p3", "term": "Peek", "definition": "Looks at the next element without removing it." }
            ]
        },
        {
            "id": "ctd-i-01",
            "difficulty": "intermediate",
            "topic": "Graph & Tree Vocabulary",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Binary Search Tree", "definition": "A tree where every left child is smaller and every right child is larger than its parent." },
                { "id": "p2", "term": "Adjacency List", "definition": "A graph representation storing, for each node, the list of nodes it connects to." },
                { "id": "p3", "term": "Adjacency Matrix", "definition": "A graph representation using a grid of 0s and 1s to mark which nodes connect." },
                { "id": "p4", "term": "Deque", "definition": "A queue that allows insertion and removal from both ends." }
            ]
        },
        {
            "id": "ctd-i-02",
            "difficulty": "intermediate",
            "topic": "Algorithm Analysis",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Recursion", "definition": "A function that solves a problem by calling itself on smaller sub-problems." },
                { "id": "p2", "term": "Big O Notation", "definition": "A way of describing how an algorithm's cost grows as input size grows." },
                { "id": "p3", "term": "Time Complexity", "definition": "A measure of how long an algorithm takes relative to its input size." },
                { "id": "p4", "term": "Space Complexity", "definition": "A measure of how much memory an algorithm uses relative to its input size." }
            ]
        },
        {
            "id": "ctd-i-03",
            "difficulty": "intermediate",
            "topic": "Hashing",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Hash Table", "definition": "A structure that maps keys to values using a hash function for fast lookup." },
                { "id": "p2", "term": "Hash Function", "definition": "A function that converts a key into an index within a fixed range." },
                { "id": "p3", "term": "Collision", "definition": "When two different keys hash to the same index." },
                { "id": "p4", "term": "Load Factor", "definition": "The ratio of stored elements to the total number of available slots." }
            ]
        },
        {
            "id": "ctd-h-01",
            "difficulty": "hard",
            "topic": "Graph Algorithms",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Depth-First Search", "definition": "A traversal that explores as far as possible down one path before backtracking." },
                { "id": "p2", "term": "Breadth-First Search", "definition": "A traversal that explores all neighbors at the current depth before going deeper." },
                { "id": "p3", "term": "Dijkstra's Algorithm", "definition": "An algorithm that finds the shortest path in a graph with non-negative edge weights." },
                { "id": "p4", "term": "Topological Sort", "definition": "An ordering of a directed acyclic graph's nodes so every edge points forward." },
                { "id": "p5", "term": "Minimum Spanning Tree", "definition": "A subset of edges connecting all nodes with the least possible total weight." }
            ]
        },
        {
            "id": "ctd-h-02",
            "difficulty": "hard",
            "topic": "Advanced Trees",
            "prompt": "Connect each term to its correct definition.",
            "pairs": [
                { "id": "p1", "term": "Balanced Tree", "definition": "A tree kept at roughly even height on both sides to keep operations fast." },
                { "id": "p2", "term": "AVL Tree", "definition": "A self-balancing binary search tree that rebalances after every insert or delete." },
                { "id": "p3", "term": "Red-Black Tree", "definition": "A self-balancing binary search tree that uses node coloring rules to stay balanced." },
                { "id": "p4", "term": "Heap", "definition": "A tree-based structure where every parent is smaller (or larger) than its children." },
                { "id": "p5", "term": "Trie", "definition": "A tree structure used to store strings, where each path spells out a prefix." }
            ]
        }
    ]
};