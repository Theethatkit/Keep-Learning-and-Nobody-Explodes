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


    /* ================= Stack Settings ================= */

    const initialStack = [10, 20, 30];
    const maximumSize = 7;

    let stack = [...initialStack];

    const stackContainer =
        document.getElementById("stackContainer");

    const resultText =
        document.getElementById("visualizationResult");

    const valueInput =
        document.getElementById("valueInput");

    const operationButtons =
        document.querySelectorAll(".operation-buttons button");


    /* ================= Display Stack ================= */

    function displayStack(highlightTop = false) {
        stackContainer.innerHTML = "";

        if (stack.length === 0) {
            stackContainer.innerHTML =
                '<p class="empty-stack">Empty Stack</p>';

            return;
        }

        for (
            let index = stack.length - 1;
            index >= 0;
            index--
        ) {
            const stackNode =
                document.createElement("div");

            stackNode.classList.add("stack-node");
            stackNode.textContent = stack[index];

            if (
                highlightTop &&
                index === stack.length - 1
            ) {
                stackNode.classList.add("selected");
            }

            stackContainer.appendChild(stackNode);
        }
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
                "Please enter a value before using Push.",
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


    /* ================= Push ================= */

    function pushElement() {
        if (stack.length >= maximumSize) {
            showResult(
                `Stack overflow: The maximum size is ${maximumSize}.`,
                "error"
            );

            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        stack.push(value);

        displayStack(true);

        showResult(
            `Push: ${value} was added to the top of the stack.`,
            "success"
        );

        valueInput.value = "";
        valueInput.focus();
    }


    /* ================= Pop ================= */

    function popElement() {
        if (stack.length === 0) {
            showResult(
                "Stack underflow: The stack is empty.",
                "error"
            );

            return;
        }

        const removedValue = stack.pop();

        displayStack();

        showResult(
            `Pop: ${removedValue} was removed from the top.`,
            "success"
        );
    }


    /* ================= Peek ================= */

    function peekElement() {
        if (stack.length === 0) {
            showResult(
                "Peek is unavailable because the stack is empty.",
                "error"
            );

            return;
        }

        const topValue = stack[stack.length - 1];

        displayStack(true);

        showResult(
            `Peek: The top element is ${topValue}.`,
            "success"
        );
    }


    /* ================= isEmpty ================= */

    function checkIsEmpty() {
        const empty = stack.length === 0;

        displayStack();

        showResult(
            `isEmpty: ${empty}. The stack contains ${stack.length} element(s).`,
            "success"
        );
    }


    /* ================= Reset ================= */

    function resetStack() {
        stack = [...initialStack];

        valueInput.value = "";

        displayStack();

        showResult(
            "The stack has been reset.",
            "success"
        );
    }


    /* ================= Button States ================= */

    function disableButtons(disabled) {
        operationButtons.forEach(function (button) {
            button.disabled = disabled;
        });
    }


    /* ================= Button Events ================= */

    document
        .getElementById("pushButton")
        .addEventListener("click", pushElement);

    document
        .getElementById("popButton")
        .addEventListener("click", popElement);

    document
        .getElementById("peekButton")
        .addEventListener("click", peekElement);

    document
        .getElementById("isEmptyButton")
        .addEventListener("click", checkIsEmpty);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetStack);


    valueInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            pushElement();
        }
    });


    /* ================= Initial Display ================= */

    disableButtons(false);
    displayStack();

});