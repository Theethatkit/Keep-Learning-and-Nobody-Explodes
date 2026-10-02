(function () {
    "use strict";

    const setupCode = String.raw`#include <stdio.h>

#define CAPACITY 7

typedef struct {
    int data[CAPACITY];
    int top;
} Stack;

void initialize(Stack *stack) {
    stack->top = -1;
}`;

    const examples = [
        {
            title: "Shared Stack structure",

            description:
                "Use top = -1 to represent an empty stack.",

            code: setupCode,

            output:
                "After initialize: top = -1 and the active size is 0.",

            explanation:
                "The active elements occupy indexes 0 through top. " +
                "Capacity is fixed at 7.",

            complexity: "Initialization takes O(1)."
        },

        {
            title: "1. Push — add a value to Top",

            description:
                "Reject the operation if the fixed stack is full.",

            code: String.raw`int push(Stack *stack, int value) {
    if (stack->top == CAPACITY - 1) {
        return 0;
    }

    stack->top++;
    stack->data[stack->top] = value;

    return 1;
}

/* Example:
push(&stack, 10);
push(&stack, 20);
push(&stack, 30);
*/`,

            output:
                "Bottom [10, 20, 30] Top",

            explanation:
                "Increment Top first, then store the new value at " +
                "that index. Returning 0 reports overflow.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "2. Pop — remove the Top value",

            description:
                "Return failure when no active element exists.",

            code: String.raw`int pop(Stack *stack, int *removed) {
    if (stack->top == -1 || removed == NULL) {
        return 0;
    }

    *removed = stack->data[stack->top];
    stack->top--;

    return 1;
}

/* Example:
int value;

if (pop(&stack, &value)) {
    printf("Removed: %d\n", value);
}
*/`,

            output:
                "Removed: 30\nBottom [10, 20] Top",

            explanation:
                "Read the current Top before decreasing the Top index. " +
                "Returning 0 reports underflow or an invalid output pointer.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "3. Peek — read without removal",

            description:
                "Read the Top value while preserving the stack.",

            code: String.raw`int peek(
    const Stack *stack,
    int *value
) {
    if (stack->top == -1 || value == NULL) {
        return 0;
    }

    *value = stack->data[stack->top];
    return 1;
}`,

            output:
                "For bottom [10, 20, 30] top, Peek returns 30. Size remains 3.",

            explanation:
                "Peek does not change Top, so no element is removed.",

            complexity: "O(1) time and O(1) auxiliary space."
        },

        {
            title: "4. isEmpty and isFull",

            description:
                "Check the Top index against the two boundary states.",

            code: String.raw`int isEmpty(const Stack *stack) {
    return stack->top == -1;
}

int isFull(const Stack *stack) {
    return stack->top == CAPACITY - 1;
}

int size(const Stack *stack) {
    return stack->top + 1;
}`,

            output:
                "Empty: top == -1\nFull: top == 6\nSize: top + 1",

            explanation:
                "For capacity 7, valid active indexes are 0 through 6.",

            complexity:
                "All three operations take O(1) time."
        },

        {
            title: "5. Traverse from Top to Bottom",

            description:
                "Visit the values in the order they would be popped.",

            code: String.raw`void printTopToBottom(
    const Stack *stack
) {
    for (
        int i = stack->top;
        i >= 0;
        i--
    ) {
        printf("%d ", stack->data[i]);
    }

    printf("\n");
}`,

            output:
                "30 20 10",

            explanation:
                "Traversal begins at Top and visits every active element.",

            complexity:
                "O(n) time and O(1) auxiliary space."
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