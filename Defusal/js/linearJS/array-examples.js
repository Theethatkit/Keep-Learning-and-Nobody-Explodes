(function () {
    "use strict";

    /* ================= Example Data ================= */

    // String.raw preserves C escape sequences such as \n.
    // Each code example is an independent C program.

    const examples = [
        {
            id: "access",
            title: "1. Access — read an element by index",

            description:
                "Read the value at index 2 without changing the array.",

            code: String.raw`#include <stdio.h>

int main(void) {
    int a[8] = {10, 20, 30, 40};
    int n = 4;
    int index = 2;

    if (index < 0 || index >= n) {
        printf("Invalid index.\n");
        return 0;
    }

    printf("a[%d] = %d\n", index, a[index]);

    return 0;
}`,

            steps: [
                "Check that the index refers to an active element.",
                "Read a[index] directly.",
                "The values and the active size remain unchanged."
            ],

            output: "a[2] = 30",

            explanation:
                "Index 2 refers to the third element because indexing " +
                "starts at 0. The index is a position, not the stored value.",

            time: "O(1). Direct access does not scan earlier elements.",

            space:
                "O(1) auxiliary space, excluding the array storage.",

            challenge:
                "Change index to 4. Why does the program reject it " +
                "even though the allocated capacity is 8?",

            solution:
                "The active size is 4, so active indexes are 0 through 3. " +
                "Index 4 is within the allocated storage but outside " +
                "the active sequence used by this program."
        },

        {
            id: "update",
            title: "2. Update — replace an existing value",

            description:
                "Replace the value at index 1 with 99. " +
                "The number of active elements does not change.",

            code: String.raw`#include <stdio.h>

int main(void) {
    int a[8] = {10, 20, 30, 40};
    int n = 4;
    int index = 1;
    int value = 99;

    if (index < 0 || index >= n) {
        printf("Invalid index.\n");
        return 0;
    }

    a[index] = value;

    for (int i = 0; i < n; i++) {
        printf("%d%s", a[i], i == n - 1 ? "\n" : " ");
    }

    return 0;
}`,

            steps: [
                "Validate the index before writing.",
                "Replace 20 with 99 at index 1.",
                "Keep n equal to 4 because no element was added.",
                "Print the active sequence."
            ],

            output: "10 99 30 40",

            explanation:
                "Updating overwrites an existing value. Inserting would " +
                "preserve that value by shifting it and increasing the size.",

            time:
                "O(1) for the update. The separate output loop takes O(n).",

            space:
                "O(1) auxiliary space, excluding the array storage.",

            challenge:
                "Change index to 0 and value to -5. " +
                "Predict the output before running the program.",

            solution:
                "The output is -5 20 30 40. " +
                "Only the value at index 0 changes; n remains 4."
        },

        {
            id: "insert",
            title: "3. Insert — make room for a new element",

            description:
                "Insert 99 at index 1 while preserving all existing values.",

            code: String.raw`#include <stdio.h>

#define CAPACITY 8

int main(void) {
    int a[CAPACITY] = {10, 20, 30, 40};
    int n = 4;
    int index = 1;
    int value = 99;

    if (n >= CAPACITY) {
        printf("Array is full.\n");
        return 0;
    }

    if (index < 0 || index > n) {
        printf("Invalid insertion index.\n");
        return 0;
    }

    /* Shift right, starting from the end. */
    for (int i = n; i > index; i--) {
        a[i] = a[i - 1];
    }

    a[index] = value;
    n++;

    for (int i = 0; i < n; i++) {
        printf("%d%s", a[i], i == n - 1 ? "\n" : " ");
    }

    return 0;
}`,

            steps: [
                "Check that spare capacity exists and the index is valid.",
                "Copy 40 from index 3 to index 4.",
                "Copy 30 from index 2 to index 3.",
                "Copy 20 from index 1 to index 2.",
                "Write 99 at index 1.",
                "Increase n from 4 to 5."
            ],

            output: "10 99 20 30 40",

            explanation:
                "Shift from right to left so each value is copied before " +
                "its old position is overwritten. The number of shifts " +
                "is the original size minus the insertion index.",

            time:
                "O(n) worst case. Inserting at the end takes O(1) " +
                "when spare capacity exists. Printing takes O(n).",

            space:
                "O(1) auxiliary space. Shifting uses the existing storage.",

            challenge:
                "Set index to n before insertion. " +
                "How many elements shift, and what is the output?",

            solution:
                "No elements shift because the new value is appended. " +
                "The output is 10 20 30 40 99, and n becomes 5."
        },

        {
            id: "delete",
            title: "4. Delete — close the gap after removal",

            description:
                "Remove the value at index 1 while keeping the remaining " +
                "values in their original order.",

            code: String.raw`#include <stdio.h>

int main(void) {
    int a[8] = {10, 20, 30, 40};
    int n = 4;
    int index = 1;

    if (index < 0 || index >= n) {
        printf("Invalid deletion index.\n");
        return 0;
    }

    int removed = a[index];

    /* Shift later elements one position left. */
    for (int i = index; i < n - 1; i++) {
        a[i] = a[i + 1];
    }

    n--;

    printf("Removed: %d\n", removed);

    if (n == 0) {
        printf("Array is empty.\n");
    } else {
        for (int i = 0; i < n; i++) {
            printf("%d%s", a[i], i == n - 1 ? "\n" : " ");
        }
    }

    return 0;
}`,

            steps: [
                "Check that the deletion index refers to an active element.",
                "Save the removed value, 20.",
                "Copy 30 from index 2 to index 1.",
                "Copy 40 from index 3 to index 2.",
                "Reduce n from 4 to 3."
            ],

            output: `Removed: 20
10 30 40`,

            explanation:
                "Reducing n does not shrink the allocated array. " +
                "The former last slot may still contain a value, " +
                "but it is no longer part of the active sequence.",

            time:
                "O(n) worst case. Deleting the last active element " +
                "takes O(1). Printing the remaining sequence takes O(n).",

            space:
                "O(1) auxiliary space, excluding the array storage.",

            challenge:
                "Set index to n - 1. Which value is removed, " +
                "and how many elements shift?",

            solution:
                "40 is removed. No elements shift because it was last. " +
                "The active sequence becomes 10 20 30."
        },

        {
            id: "search",
            title: "5. Linear Search — find the first matching value",

            description:
                "Search for 30 by comparing active values from left to right.",

            code: String.raw`#include <stdio.h>

int main(void) {
    int a[8] = {10, 20, 30, 40};
    int n = 4;
    int target = 30;

    int foundIndex = -1;
    int comparisons = 0;

    for (int i = 0; i < n; i++) {
        comparisons++;

        if (a[i] == target) {
            foundIndex = i;
            break;
        }
    }

    if (foundIndex == -1) {
        printf("Value not found.\n");
    } else {
        printf("Found at index %d\n", foundIndex);
    }

    printf("Comparisons: %d\n", comparisons);

    return 0;
}`,

            steps: [
                "Start with foundIndex = -1 to represent no match.",
                "Compare 10 with 30: no match.",
                "Compare 20 with 30: no match.",
                "Compare 30 with 30: a match at index 2.",
                "Save index 2 and stop the loop with break."
            ],

            output: `Found at index 2
Comparisons: 3`,

            explanation:
                "This search returns the first matching index. " +
                "It works even if the array is unsorted. " +
                "If no match exists, foundIndex remains -1.",

            time:
                "O(n) worst case. O(1) when the first element matches.",

            space:
                "O(1) auxiliary space, excluding the array storage.",

            challenge:
                "Change target to 99. Predict the message " +
                "and the number of comparisons.",

            solution:
                "The program prints Value not found. " +
                "It performs 4 comparisons because every active value " +
                "must be checked."
        },

        {
            id: "traversal",
            title: "6. Traversal — visit every active element",

            description:
                "Visit all active values and calculate their sum.",

            code: String.raw`#include <stdio.h>

int main(void) {
    int a[8] = {10, 20, 30, 40};
    int n = 4;
    int sum = 0;

    for (int i = 0; i < n; i++) {
        sum += a[i];

        printf(
            "Index %d: value %d, running sum %d\n",
            i, a[i], sum
        );
    }

    printf("Total: %d\n", sum);

    return 0;
}`,

            steps: [
                "Start with sum = 0.",
                "Visit index 0: add 10, making the sum 10.",
                "Visit index 1: add 20, making the sum 30.",
                "Visit index 2: add 30, making the sum 60.",
                "Visit index 3: add 40, making the sum 100.",
                "Stop after all n active elements have been visited."
            ],

            output: `Index 0: value 10, running sum 10
Index 1: value 20, running sum 30
Index 2: value 30, running sum 60
Index 3: value 40, running sum 100
Total: 100`,

            explanation:
                "Traversal visits every active element. Unlike a search " +
                "that stops at a match, this calculation needs all values. " +
                "The array remains unchanged. For larger datasets, use " +
                "a numeric type that can hold the total without overflow.",

            time: "O(n), because each active element is visited once.",

            space:
                "O(1) auxiliary space: a running sum and a loop index.",

            challenge:
                "Change n to 0. How many elements are visited, " +
                "and what total is printed?",

            solution:
                "No elements are visited because i < n is false " +
                "at the start. The program prints Total: 0."
        }
    ];

    /* ================= Rendering Helpers ================= */

    function createTextElement(tag, text, className = "") {
        const element = document.createElement(tag);

        element.textContent = text;

        if (className) {
            element.className = className;
        }

        return element;
    }

    function createCodeBlock(text) {
        const pre = document.createElement("pre");
        const code = document.createElement("code");

        // Render C code as text rather than interpreting it as HTML.
        code.textContent = text;

        pre.append(code);

        return pre;
    }

    function createLabeledParagraph(label, text) {
        const paragraph = document.createElement("p");
        const strong = document.createElement("strong");

        strong.textContent = `${label}: `;

        paragraph.append(
            strong,
            document.createTextNode(text)
        );

        return paragraph;
    }

    function createExample(example, index) {
        const details = document.createElement("details");

        details.id = `example-${example.id}`;

        // Show the first example initially.
        details.open = index === 0;

        const summary = createTextElement(
            "summary",
            example.title
        );

        const description = createTextElement(
            "p",
            example.description
        );

        const codeBlock = createCodeBlock(example.code);

        const explanationHeading = createTextElement(
            "h3",
            "How it works"
        );

        const steps = document.createElement("ol");
        steps.className = "information-list";

        example.steps.forEach(step => {
            steps.append(
                createTextElement("li", step)
            );
        });

        const explanation = createTextElement(
            "p",
            example.explanation
        );

        const outputHeading = createTextElement(
            "h3",
            "Expected output"
        );

        const outputBlock = createCodeBlock(example.output);

        const time = createLabeledParagraph(
            "Time complexity",
            example.time
        );

        const space = createLabeledParagraph(
            "Extra space",
            example.space
        );

        const challengeBox = document.createElement("div");
        challengeBox.className = "learning-box";

        challengeBox.append(
            createTextElement("h3", "Predict before running"),
            createTextElement("p", example.challenge)
        );

        const solution = document.createElement("details");

        solution.append(
            createTextElement(
                "summary",
                "Check your prediction"
            ),
            createTextElement(
                "p",
                example.solution
            )
        );

        challengeBox.append(solution);

        details.append(
            summary,
            description,
            codeBlock,
            explanationHeading,
            steps,
            explanation,
            outputHeading,
            outputBlock,
            time,
            space,
            challengeBox
        );

        return details;
    }

    /* ================= Initialize ================= */

    function renderExamples() {
        const container = document.getElementById(
            "codeExamplesContainer"
        );

        if (!container) {
            return;
        }

        const fragment = document.createDocumentFragment();

        examples.forEach((example, index) => {
            fragment.append(
                createExample(example, index)
            );
        });

        // Replace the fallback text and avoid duplicate examples.
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