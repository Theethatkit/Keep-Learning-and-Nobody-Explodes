document.addEventListener("DOMContentLoaded", function () {

    /* ================= Authentication ================= */

    const authButton = document.getElementById("authButton");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (authButton) {
        if (loggedInUser) {
            authButton.textContent = "Logout";
            authButton.href = "#";

            authButton.addEventListener("click", function (event) {
                event.preventDefault();

                localStorage.removeItem("loggedInUser");
                window.location.href = "../../index.html";
            });
        } else {
            authButton.textContent = "Log in";
            authButton.href = "../login.html";
        }
    }


    /* ================= Linked List Settings ================= */

    const initialValues = [10, 20, 30];
    let linkedList = [...initialValues];

    const linkedListContainer =
        document.getElementById("linkedListContainer");

    const resultText =
        document.getElementById("visualizationResult");

    const listType =
        document.getElementById("listType");

    const valueInput =
        document.getElementById("valueInput");

    const positionInput =
        document.getElementById("positionInput");

    const operationButtons =
        document.querySelectorAll(".operation-buttons button");


    /* ================= Display Linked List ================= */

    function displayLinkedList(highlightIndex = -1) {
        linkedListContainer.innerHTML = "";

        if (linkedList.length === 0) {
            linkedListContainer.innerHTML =
                '<p class="null-value">Head → null</p>';

            return;
        }

        const headLabel =
            document.createElement("span");

        headLabel.classList.add("list-label");
        headLabel.textContent = "Head";

        linkedListContainer.appendChild(headLabel);

        linkedList.forEach(function (value, index) {
            const node =
                document.createElement("div");

            node.classList.add("interactive-node");

            if (index === highlightIndex) {
                node.classList.add("selected");
            }

            if (listType.value === "doubly") {
                const previousPointer =
                    document.createElement("small");

                previousPointer.classList.add("pointer");
                previousPointer.textContent = "prev";

                node.appendChild(previousPointer);
            }

            const nodeValue =
                document.createElement("span");

            nodeValue.classList.add("node-value");
            nodeValue.textContent = value;

            const nextPointer =
                document.createElement("small");

            nextPointer.classList.add("pointer");
            nextPointer.textContent = "next";

            node.appendChild(nodeValue);
            node.appendChild(nextPointer);

            linkedListContainer.appendChild(node);

            const arrow =
                document.createElement("span");

            arrow.classList.add("interactive-arrow");

            if (listType.value === "doubly") {
                arrow.textContent = "⇄";
            } else {
                arrow.textContent = "→";
            }

            linkedListContainer.appendChild(arrow);
        });

        const nullValue =
            document.createElement("span");

        nullValue.classList.add("null-value");
        nullValue.textContent = "null";

        linkedListContainer.appendChild(nullValue);
    }


    /* ================= Result Message ================= */

    function showResult(message, type = "normal") {
        resultText.textContent = message;

        resultText.classList.remove(
            "result-success",
            "result-error"
        );

        if (type === "success") {
            resultText.classList.add("result-success");
        }

        if (type === "error") {
            resultText.classList.add("result-error");
        }
    }


    /* ================= Input Validation ================= */

    function getValue() {
        const input = valueInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter a value.",
                "error"
            );

            valueInput.focus();
            return null;
        }

        const value = Number(input);

        if (Number.isNaN(value)) {
            showResult(
                "Please enter a valid number.",
                "error"
            );

            return null;
        }

        return value;
    }


    function getPosition() {
        const input = positionInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter a position.",
                "error"
            );

            positionInput.focus();
            return null;
        }

        const position = Number(input);

        const validPosition =
            Number.isInteger(position) &&
            position >= 0 &&
            position <= linkedList.length;

        if (!validPosition) {
            showResult(
                `Invalid position. Enter a position from 0 to ${linkedList.length}.`,
                "error"
            );

            positionInput.focus();
            positionInput.select();

            return null;
        }

        return position;
    }


    /* ================= Insert Operations ================= */

    function insertFront() {
        const value = getValue();

        if (value === null) {
            return;
        }

        linkedList.unshift(value);

        displayLinkedList(0);

        showResult(
            `Insert Front: ${value} became the new head.`,
            "success"
        );
    }


    function insertBack() {
        const value = getValue();

        if (value === null) {
            return;
        }

        linkedList.push(value);

        displayLinkedList(linkedList.length - 1);

        showResult(
            `Insert Back: ${value} became the new tail.`,
            "success"
        );
    }


    function insertAtPosition() {
        const value = getValue();
        const position = getPosition();

        if (value === null || position === null) {
            return;
        }

        linkedList.splice(position, 0, value);

        displayLinkedList(position);

        showResult(
            `${value} was inserted at position ${position}.`,
            "success"
        );
    }


    /* ================= Delete Operations ================= */

    function deleteFront() {
        if (linkedList.length === 0) {
            showResult(
                "The linked list is already empty.",
                "error"
            );

            return;
        }

        const deletedValue = linkedList.shift();

        displayLinkedList();

        showResult(
            `Delete Front: ${deletedValue} was removed.`,
            "success"
        );
    }


    function deleteBack() {
        if (linkedList.length === 0) {
            showResult(
                "The linked list is already empty.",
                "error"
            );

            return;
        }

        const deletedValue = linkedList.pop();

        displayLinkedList();

        showResult(
            `Delete Back: ${deletedValue} was removed.`,
            "success"
        );
    }


    /* ================= Search ================= */

    async function searchValue() {
        if (linkedList.length === 0) {
            showResult(
                "The linked list is empty.",
                "error"
            );

            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        disableButtons(true);

        for (
            let index = 0;
            index < linkedList.length;
            index++
        ) {
            displayLinkedList(index);

            showResult(
                `Search: Checking node ${index}...`
            );

            await wait(500);

            if (linkedList[index] === value) {
                displayLinkedList(index);

                showResult(
                    `${value} was found at node ${index}.`,
                    "success"
                );

                disableButtons(false);
                return;
            }
        }

        displayLinkedList();

        showResult(
            `${value} was not found in the linked list.`,
            "error"
        );

        disableButtons(false);
    }


    /* ================= Traversal ================= */

    async function traverseLinkedList() {
        if (linkedList.length === 0) {
            showResult(
                "The linked list is empty.",
                "error"
            );

            return;
        }

        disableButtons(true);

        const visitedValues = [];

        for (
            let index = 0;
            index < linkedList.length;
            index++
        ) {
            visitedValues.push(linkedList[index]);

            displayLinkedList(index);

            showResult(
                `Traversal: Visiting node ${index}, value ${linkedList[index]}.`
            );

            await wait(500);
        }

        displayLinkedList();

        showResult(
            `Traversal completed: ${visitedValues.join(" → ")}`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Reset ================= */

    function resetLinkedList() {
        linkedList = [...initialValues];

        valueInput.value = "";
        positionInput.value = "";

        displayLinkedList();

        showResult(
            "The linked list has been reset.",
            "success"
        );
    }


    /* ================= Helper Functions ================= */

    function wait(milliseconds) {
        return new Promise(function (resolve) {
            setTimeout(resolve, milliseconds);
        });
    }


    function disableButtons(disabled) {
        operationButtons.forEach(function (button) {
            button.disabled = disabled;
        });

        listType.disabled = disabled;
    }


    /* ================= Events ================= */

    document
        .getElementById("insertFrontButton")
        .addEventListener("click", insertFront);

    document
        .getElementById("insertBackButton")
        .addEventListener("click", insertBack);

    document
        .getElementById("insertPositionButton")
        .addEventListener("click", insertAtPosition);

    document
        .getElementById("deleteFrontButton")
        .addEventListener("click", deleteFront);

    document
        .getElementById("deleteBackButton")
        .addEventListener("click", deleteBack);

    document
        .getElementById("searchButton")
        .addEventListener("click", searchValue);

    document
        .getElementById("traversalButton")
        .addEventListener("click", traverseLinkedList);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetLinkedList);

    listType.addEventListener("change", function () {
        displayLinkedList();

        showResult(
            `${listType.options[listType.selectedIndex].text} selected.`
        );
    });


    /* ================= Initial Display ================= */

    displayLinkedList();

});