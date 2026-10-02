(function () {
    "use strict";

    const sharedCode = String.raw`#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *next;
} Node;

Node *createNode(int value) {
    Node *node = malloc(sizeof(Node));

    if (node == NULL) {
        return NULL;
    }

    node->data = value;
    node->next = NULL;

    return node;
}

void printList(const Node *head) {
    const Node *current = head;

    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }

    printf("NULL\n");
}

void freeList(Node *head) {
    while (head != NULL) {
        Node *next = head->next;
        free(head);
        head = next;
    }
}`;

    const examples = [
        {
            title: "Shared Node structure and helper functions",

            description:
                "Use this code before the operation functions below.",

            code: sharedCode,

            output:
                "This section defines Node, allocation, printing and cleanup.",

            explanation:
                "malloc allocates one node. freeList visits and releases " +
                "all remaining nodes when the program finishes.",

            complexity:
                "createNode: O(1). printList and freeList: O(n)."
        },

        {
            title: "1. Access a node by position",

            description:
                "Follow Next pointers until the requested position is reached.",

            code: String.raw`const Node *nodeAt(
    const Node *head,
    int position
) {
    if (position < 0) {
        return NULL;
    }

    const Node *current = head;

    for (
        int i = 0;
        current != NULL && i < position;
        i++
    ) {
        current = current->next;
    }

    return current;
}

/* Example:
const Node *node = nodeAt(head, 2);

if (node != NULL) {
    printf("%d\n", node->data);
}
*/`,

            output: "30",

            explanation:
                "Position 2 requires following two Next pointers from Head.",

            complexity:
                "O(n) worst-case time and O(1) auxiliary space."
        },

        {
            title: "2. Update a node by position",

            description:
                "Find the node, then replace its Data value.",

            code: String.raw`int updateAt(
    Node *head,
    int position,
    int value
) {
    if (position < 0) {
        return 0;
    }

    Node *current = head;

    for (
        int i = 0;
        current != NULL && i < position;
        i++
    ) {
        current = current->next;
    }

    if (current == NULL) {
        return 0;
    }

    current->data = value;
    return 1;
}

/* Example:
updateAt(head, 1, 99);
printList(head);
*/`,

            output: "10 -> 99 -> 30 -> NULL",

            explanation:
                "Only Data changes. Node identity and Next pointers remain unchanged.",

            complexity:
                "O(n) by position; updating an already-known node is O(1)."
        },

        {
            title: "3. Insert at a position",

            description:
                "Find the incoming pointer, connect the new node to the " +
                "old successor, then connect the list to the new node.",

            code: String.raw`int insertAt(
    Node **head,
    int position,
    int value
) {
    if (head == NULL || position < 0) {
        return 0;
    }

    Node **link = head;

    for (int i = 0; i < position; i++) {
        if (*link == NULL) {
            return 0;
        }

        link = &(*link)->next;
    }

    Node *node = createNode(value);

    if (node == NULL) {
        return 0;
    }

    node->next = *link;
    *link = node;

    return 1;
}

/* Example:
insertAt(&head, 1, 15);
printList(head);
*/`,

            output: "10 -> 15 -> 20 -> 30 -> NULL",

            explanation:
                "Node ** allows the function to change Head when inserting " +
                "at position 0. Existing values are not shifted.",

            complexity:
                "O(n) by position; O(1) at Head. One node is allocated."
        },

        {
            title: "4. Delete at a position",

            description:
                "Reconnect the incoming pointer to the target's successor, " +
                "then release the target.",

            code: String.raw`int deleteAt(
    Node **head,
    int position
) {
    if (head == NULL || position < 0) {
        return 0;
    }

    Node **link = head;

    for (int i = 0; i < position; i++) {
        if (*link == NULL) {
            return 0;
        }

        link = &(*link)->next;
    }

    if (*link == NULL) {
        return 0;
    }

    Node *removed = *link;
    *link = removed->next;

    free(removed);
    return 1;
}

/* Example:
deleteAt(&head, 1);
printList(head);
*/`,

            output: "10 -> 30 -> NULL",

            explanation:
                "The list bypasses the removed node before free releases it.",

            complexity:
                "O(n) by position; O(1) at Head. Auxiliary space is O(1)."
        },

        {
            title: "5. Search for a value",

            description:
                "Return the position of the first matching value.",

            code: String.raw`int searchValue(
    const Node *head,
    int target
) {
    int position = 0;

    for (
        const Node *current = head;
        current != NULL;
        current = current->next
    ) {
        if (current->data == target) {
            return position;
        }

        position++;
    }

    return -1;
}

/* Example:
printf("%d\n", searchValue(head, 20));
*/`,

            output: "1",

            explanation:
                "The function returns −1 if it reaches NULL without a match.",

            complexity:
                "O(n) worst-case time and O(1) auxiliary space."
        },

        {
            title: "6. Traverse and calculate a sum",

            description:
                "Visit every node and accumulate its value.",

            code: String.raw`long long sumList(const Node *head) {
    long long total = 0;

    for (
        const Node *current = head;
        current != NULL;
        current = current->next
    ) {
        total += current->data;
    }

    return total;
}

/* Example:
printf("%lld\n", sumList(head));
*/`,

            output: "60",

            explanation:
                "Unlike a successful search, summation must visit every node.",

            complexity:
                "O(n) time and O(1) auxiliary space."
        }
    ];

    function createText(tag, value) {
        const element = document.createElement(tag);
        element.textContent = value;
        return element;
    }

    function createCodeBlock(value) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");

        code.textContent = value;
        pre.append(code);

        return pre;
    }

    function createExample(example, index) {
        const details = document.createElement("details");

        details.open = index === 0;

        details.append(
            createText("summary", example.title),
            createText("p", example.description),
            createText("h3", "Code"),
            createCodeBlock(example.code),
            createText("h3", "Expected result"),
            createCodeBlock(example.output),
            createText("h3", "Explanation"),
            createText("p", example.explanation),
            createText("h3", "Complexity"),
            createText("p", example.complexity)
        );

        return details;
    }

    function renderExamples() {
        const container =
            document.getElementById("codeExamplesContainer");

        if (!container) {
            return;
        }

        const fragment =
            document.createDocumentFragment();

        examples.forEach(function (example, index) {
            fragment.append(
                createExample(example, index)
            );
        });

        container.replaceChildren(fragment);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            renderExamples,
            { once: true }
        );
    } else {
        renderExamples();
    }
})();