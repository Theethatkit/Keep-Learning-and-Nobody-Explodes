(function () {
    "use strict";

    const examples = [
        {
            title: "Shared Circular Queue structure",

            description:
                "Front identifies the next removal slot. " +
                "Rear identifies the next insertion slot.",

            code: String.raw`#include <stdio.h>

#define CAPACITY 7

typedef struct {
    int data[CAPACITY];
    int front;
    int rear;
    int size;
} Queue;

void initialize(Queue *queue) {
    queue->front = 0;
    queue->rear = 0;
    queue->size = 0;
}`,

            output:
                "Initial state: Front = 0, Rear = 0, Size = 0.",

            explanation:
                "Size distinguishes an empty queue from a full queue " +
                "when Front and Rear are equal.",

            complexity: "Initialization takes O(1)."
        },

        {
            title: "1. Enqueue — add at Rear",

            description:
                "Store the value, advance Rear using modulo and increase Size.",

            code: String.raw`int enqueue(Queue *queue, int value) {
    if (queue->size == CAPACITY) {
        return 0;
    }

    queue->data[queue->rear] = value;

    queue->rear =
        (queue->rear + 1) % CAPACITY;

    queue->size++;
    return 1;
}`,

            output:
                "If Rear is 6, the next Rear becomes (6 + 1) % 7 = 0.",

            explanation:
                "Modulo returns Rear to slot 0 after the final slot. " +
                "No active values need to shift.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "2. Dequeue — remove from Front",

            description:
                "Read the oldest value, advance Front and decrease Size.",

            code: String.raw`int dequeue(Queue *queue, int *removed) {
    if (queue->size == 0 || removed == NULL) {
        return 0;
    }

    *removed = queue->data[queue->front];

    queue->front =
        (queue->front + 1) % CAPACITY;

    queue->size--;
    return 1;
}`,

            output:
                "For Front [10, 20, 30] Rear, Dequeue returns 10.",

            explanation:
                "Front advances rather than shifting 20 and 30. " +
                "Returning 0 reports underflow or an invalid output pointer.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "3. Peek — read Front without removal",

            description:
                "Return the oldest value while preserving the queue.",

            code: String.raw`int peek(
    const Queue *queue,
    int *value
) {
    if (queue->size == 0 || value == NULL) {
        return 0;
    }

    *value = queue->data[queue->front];
    return 1;
}`,

            output:
                "Peek returns 10. Front, Rear and Size remain unchanged.",

            explanation:
                "Peek reads data[Front] but does not advance Front.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "4. State checks",

            description:
                "Use Size for empty, full and element-count queries.",

            code: String.raw`int isEmpty(const Queue *queue) {
    return queue->size == 0;
}

int isFull(const Queue *queue) {
    return queue->size == CAPACITY;
}

int queueSize(const Queue *queue) {
    return queue->size;
}`,

            output:
                "Empty: Size = 0\nFull: Size = 7",

            explanation:
                "These checks avoid ambiguity when Front equals Rear.",

            complexity: "Each operation takes O(1)."
        },

        {
            title: "5. Traverse in logical FIFO order",

            description:
                "Physical slot order may differ from logical queue order.",

            code: String.raw`void printQueue(const Queue *queue) {
    for (int offset = 0;
         offset < queue->size;
         offset++) {

        int index =
            (queue->front + offset) % CAPACITY;

        printf("%d ", queue->data[index]);
    }

    printf("\n");
}`,

            output:
                "Values are printed from Front toward Rear.",

            explanation:
                "The index calculation wraps around while preserving FIFO order.",

            complexity: "O(n) time and O(1) auxiliary space."
        }
    ];

    function text(tag, content) {
        const element = document.createElement(tag);
        element.textContent = content;
        return element;
    }

    function codeBlock(content) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");

        code.textContent = content;
        pre.append(code);

        return pre;
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
            const details =
                document.createElement("details");

            details.open = index === 0;

            details.append(
                text("summary", example.title),
                text("p", example.description),
                text("h3", "Code"),
                codeBlock(example.code),
                text("h3", "Expected result"),
                codeBlock(example.output),
                text("h3", "Explanation"),
                text("p", example.explanation),
                text("h3", "Complexity"),
                text("p", example.complexity)
            );

            fragment.append(details);
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