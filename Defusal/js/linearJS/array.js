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


    /* ================= Array Settings ================= */

    const initialNumbers = [10, 20, 30, 40];
    let numbers = [...initialNumbers];

    const arrayContainer =
        document.getElementById("interactiveArray");

    const resultText =
        document.getElementById("visualizationResult");

    const indexInput =
        document.getElementById("indexInput");

    const valueInput =
        document.getElementById("valueInput");

    const operationButtons =
        document.querySelectorAll(".operation-buttons button");


    /* ================= Display Array ================= */

    function displayArray(highlightIndex = -1) {
        arrayContainer.innerHTML = "";

        if (numbers.length === 0) {
            arrayContainer.innerHTML =
                '<p class="empty-message">The array is empty.</p>';

            return;
        }

        numbers.forEach(function (value, index) {
            const arrayItem =
                document.createElement("div");

            arrayItem.classList.add("array-item");

            if (index === highlightIndex) {
                arrayItem.classList.add("selected");
            }

            const arrayValue =
                document.createElement("div");

            arrayValue.classList.add("array-value");
            arrayValue.textContent = value;

            const arrayIndex =
                document.createElement("span");

            arrayIndex.classList.add("array-index");
            arrayIndex.textContent = index;

            arrayItem.appendChild(arrayValue);
            arrayItem.appendChild(arrayIndex);

            arrayContainer.appendChild(arrayItem);
        });
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

    function getIndex(allowEndIndex = false) {
        const input = indexInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter an index.",
                "error"
            );

            indexInput.focus();
            return null;
        }

        const index = Number(input);

        const maximumIndex = allowEndIndex
            ? numbers.length
            : numbers.length - 1;

        const validIndex =
            Number.isInteger(index) &&
            index >= 0 &&
            index <= maximumIndex;

        if (!validIndex) {
            showResult(
                `Invalid index. Enter an index from 0 to ${maximumIndex}.`,
                "error"
            );

            indexInput.focus();
            indexInput.select();

            return null;
        }

        return index;
    }


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

            valueInput.focus();
            valueInput.select();

            return null;
        }

        return value;
    }


    /* ================= Access ================= */

    function accessElement() {
        if (numbers.length === 0) {
            showResult(
                "The array is empty.",
                "error"
            );

            return;
        }

        const index = getIndex();

        if (index === null) {
            return;
        }

        displayArray(index);

        showResult(
            `Access: The element at index ${index} is ${numbers[index]}.`,
            "success"
        );
    }


    /* ================= Update ================= */

    function updateElement() {
        if (numbers.length === 0) {
            showResult(
                "The array is empty.",
                "error"
            );

            return;
        }

        const index = getIndex();
        const newValue = getValue();

        if (index === null || newValue === null) {
            return;
        }

        const oldValue = numbers[index];

        numbers[index] = newValue;

        displayArray(index);

        showResult(
            `Update: Index ${index} changed from ${oldValue} to ${newValue}.`,
            "success"
        );
    }


    /* ================= Insert ================= */

    function insertElement() {
        const index = getIndex(true);
        const newValue = getValue();

        if (index === null || newValue === null) {
            return;
        }

        numbers.splice(index, 0, newValue);

        displayArray(index);

        showResult(
            `Insert: ${newValue} was inserted at index ${index}.`,
            "success"
        );
    }


    /* ================= Delete ================= */

    function deleteElement() {
        if (numbers.length === 0) {
            showResult(
                "The array is already empty.",
                "error"
            );

            return;
        }

        const index = getIndex();

        if (index === null) {
            return;
        }

        const deletedValue = numbers.splice(index, 1)[0];

        displayArray();

        showResult(
            `Delete: ${deletedValue} was removed from index ${index}.`,
            "success"
        );
    }


    /* ================= Search ================= */

    async function searchElement() {
        if (numbers.length === 0) {
            showResult(
                "The array is empty.",
                "error"
            );

            return;
        }

        const searchValue = getValue();

        if (searchValue === null) {
            return;
        }

        disableButtons(true);

        for (
            let index = 0;
            index < numbers.length;
            index++
        ) {
            displayArray(index);

            showResult(
                `Search: Checking index ${index}...`
            );

            await wait(500);

            if (numbers[index] === searchValue) {
                displayArray(index);

                showResult(
                    `${searchValue} was found at index ${index}.`,
                    "success"
                );

                disableButtons(false);
                return;
            }
        }

        displayArray();

        showResult(
            `${searchValue} was not found in the array.`,
            "error"
        );

        disableButtons(false);
    }


    /* ================= Traversal ================= */

    async function traverseArray() {
        if (numbers.length === 0) {
            showResult(
                "The array is empty.",
                "error"
            );

            return;
        }

        disableButtons(true);

        const visitedValues = [];

        for (
            let index = 0;
            index < numbers.length;
            index++
        ) {
            visitedValues.push(numbers[index]);

            displayArray(index);

            showResult(
                `Traversal: Visiting index ${index}, value ${numbers[index]}.`
            );

            await wait(500);
        }

        displayArray();

        showResult(
            `Traversal completed: ${visitedValues.join(" → ")}`,
            "success"
        );

        disableButtons(false);
    }


    /* ================= Reset ================= */

    function resetArray() {
        numbers = [...initialNumbers];

        indexInput.value = "";
        valueInput.value = "";

        displayArray();

        showResult(
            "The array has been reset.",
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
    }


    /* ================= Button Events ================= */

    document
        .getElementById("accessButton")
        .addEventListener("click", accessElement);

    document
        .getElementById("updateButton")
        .addEventListener("click", updateElement);

    document
        .getElementById("insertButton")
        .addEventListener("click", insertElement);

    document
        .getElementById("deleteButton")
        .addEventListener("click", deleteElement);

    document
        .getElementById("searchButton")
        .addEventListener("click", searchElement);

    document
        .getElementById("traversalButton")
        .addEventListener("click", traverseArray);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetArray);


    /* ================= Initial Display ================= */

    displayArray();

});