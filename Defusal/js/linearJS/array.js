// Initial array
let numbers = [10, 20, 30, 40];

// Select elements from the visualization section
const visualization = document.querySelector(".visualization");
const arrayContainer = visualization.querySelector(".array-example");
const resultText = visualization.querySelector(".visualization-result");
const operationButtons = visualization.querySelectorAll(
    ".operation-buttons button"
);

// Select each operation button
const accessButton = operationButtons[0];
const updateButton = operationButtons[1];
const insertButton = operationButtons[2];
const deleteButton = operationButtons[3];
const searchButton = operationButtons[4];
const traversalButton = operationButtons[5];


/* ================= Display Array ================= */

function displayArray(highlightIndex = -1) {
    // Remove the old array display
    arrayContainer.innerHTML = "";

    // Display every array element
    numbers.forEach(function (value, index) {
        const arrayItem = document.createElement("div");
        arrayItem.classList.add("array-item");

        // Highlight the selected element
        if (index === highlightIndex) {
            arrayItem.classList.add("selected");
        }

        const arrayValue = document.createElement("div");
        arrayValue.classList.add("array-value");
        arrayValue.textContent = value;

        const arrayIndex = document.createElement("span");
        arrayIndex.classList.add("array-index");
        arrayIndex.textContent = index;

        arrayItem.appendChild(arrayValue);
        arrayItem.appendChild(arrayIndex);
        arrayContainer.appendChild(arrayItem);
    });

    // Show a message when the array is empty
    if (numbers.length === 0) {
        arrayContainer.innerHTML =
            '<p class="empty-message">The array is empty.</p>';
    }
}


/* ================= Show Result ================= */

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


/* ================= Check Index ================= */

function isValidIndex(index) {
    return (
        Number.isInteger(index) &&
        index >= 0 &&
        index < numbers.length
    );
}


/* ================= Access ================= */

function accessElement() {
    if (numbers.length === 0) {
        showResult("The array is empty.", "error");
        return;
    }

    const index = askForIndex(
        `Enter an index from 0 to ${numbers.length - 1}:`
    );

    if (index === null) {
        showResult("Access operation was cancelled.");
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
        showResult("The array is empty.", "error");
        return;
    }

    const index = askForIndex(
        `Enter an index from 0 to ${numbers.length - 1}:`
    );

    if (index === null) {
        showResult("Update operation was cancelled.");
        return;
    }

    let newValue;

    while (true) {
        const valueInput = prompt("Enter the new value:");

        if (valueInput === null) {
            showResult("Update operation was cancelled.");
            return;
        }

        newValue = Number(valueInput);

        if (
            valueInput.trim() !== "" &&
            !Number.isNaN(newValue)
        ) {
            break;
        }

        alert("Invalid value! Please enter a number.");
    }

    const oldValue = numbers[index];
    numbers[index] = newValue;

    displayArray(index);

    showResult(
        `Update: The value at index ${index} changed from ` +
        `${oldValue} to ${newValue}.`,
        "success"
    );
}


/* ================= Insert ================= */

function insertElement() {
    let newValue;

    while (true) {
        const valueInput = prompt("Enter a value to insert:");

        if (valueInput === null) {
            showResult("Insert operation was cancelled.");
            return;
        }

        newValue = Number(valueInput);

        if (
            valueInput.trim() !== "" &&
            !Number.isNaN(newValue)
        ) {
            break;
        }

        alert("Invalid value! Please enter a number.");
    }

    const index = askForIndex(
        `Enter an insertion index from 0 to ${numbers.length}:`,
        true
    );

    if (index === null) {
        showResult("Insert operation was cancelled.");
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
        showResult("The array is already empty.", "error");
        return;
    }

    const index = askForIndex(
        `Enter an index to delete from 0 to ${numbers.length - 1}:`
    );

    if (index === null) {
        showResult("Delete operation was cancelled.");
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
        showResult("The array is empty.", "error");
        return;
    }

    const input = prompt("Enter a value to search for:");

    if (input === null) {
        return;
    }

    const searchValue = Number(input);

    if (input.trim() === "" || Number.isNaN(searchValue)) {
        showResult("Please enter a valid number.", "error");
        return;
    }

    disableButtons(true);

    // Linear search: check each element one by one
    for (let index = 0; index < numbers.length; index++) {
        displayArray(index);

        showResult(
            `Searching: Checking index ${index}...`
        );

        await wait(500);

        if (numbers[index] === searchValue) {
            displayArray(index);

            showResult(
                `Search: ${searchValue} was found at index ${index}.`,
                "success"
            );

            disableButtons(false);
            return;
        }
    }

    displayArray();

    showResult(
        `Search: ${searchValue} was not found in the array.`,
        "error"
    );

    disableButtons(false);
}

/* ================= Traversal ================= */

async function traverseArray() {
    if (numbers.length === 0) {
        showResult("The array is empty.", "error");
        return;
    }

    disableButtons(true);

    const visitedValues = [];

    // Visit each array element from beginning to end
    for (let index = 0; index < numbers.length; index++) {
        visitedValues.push(numbers[index]);

        // Highlight the current element
        displayArray(index);

        showResult(
            `Traversal: Visiting index ${index}, value ${numbers[index]}.`
        );

        // Wait before visiting the next element
        await wait(500);
    }

    // Remove the final highlight
    displayArray();

    showResult(
        `Traversal completed: ${visitedValues.join(" → ")}`,
        "success"
    );

    disableButtons(false);
}



/* ================= Helper Functions ================= */

function askForIndex(message, allowEndIndex = false) {
    while (true) {
        const input = prompt(message);

        // กด Cancel เพื่อยกเลิก operation
        if (input === null) {
            return null;
        }

        // ป้องกันช่องว่างและเลขทศนิยม
        if (input.trim() === "") {
            alert("Invalid index. Please enter a valid index.");
            continue;
        }

        const index = Number(input);

        const maximumIndex = allowEndIndex
            ? numbers.length
            : numbers.length - 1;

        const validIndex =
            Number.isInteger(index) &&
            index >= 0 &&
            index <= maximumIndex;

        if (validIndex) {
            return index;
        }

        alert(
            `Invalid index! Please enter an index from 0 to ${maximumIndex}.`
        );
    }
}

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

accessButton.addEventListener("click", accessElement);
updateButton.addEventListener("click", updateElement);
insertButton.addEventListener("click", insertElement);
deleteButton.addEventListener("click", deleteElement);
searchButton.addEventListener("click", searchElement);
traversalButton.addEventListener("click", traverseArray);


/* ================= Initial Display ================= */

displayArray();

showResult(
    "Select an operation to interact with the array."
);