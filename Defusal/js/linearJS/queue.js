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


    /* ================= Queue Settings ================= */

    const initialQueue = [10, 20, 30];
    const maximumSize = 7;

    let queue = [...initialQueue];

    const queueContainer =
        document.getElementById("queueContainer");

    const resultText =
        document.getElementById("visualizationResult");

    const valueInput =
        document.getElementById("valueInput");


    /* ================= Display Queue ================= */

    function displayQueue(highlightIndex = -1) {
        queueContainer.innerHTML = "";

        if (queue.length === 0) {
            queueContainer.innerHTML =
                '<p class="empty-queue">Empty Queue</p>';

            return;
        }

        queue.forEach(function (value, index) {
            const queueNode =
                document.createElement("div");

            queueNode.classList.add("queue-node");
            queueNode.textContent = value;

            if (index === highlightIndex) {
                queueNode.classList.add("selected");
            }

            queueContainer.appendChild(queueNode);
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

    function getValue() {
        const input = valueInput.value.trim();

        if (input === "") {
            showResult(
                "Please enter a value before using Enqueue.",
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


    /* ================= Enqueue ================= */

    function enqueueElement() {
        if (queue.length >= maximumSize) {
            showResult(
                `Queue overflow: The maximum size is ${maximumSize}.`,
                "error"
            );

            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        queue.push(value);

        displayQueue(queue.length - 1);

        showResult(
            `Enqueue: ${value} was added at the rear.`,
            "success"
        );

        valueInput.value = "";
        valueInput.focus();
    }


    /* ================= Dequeue ================= */

    function dequeueElement() {
        if (queue.length === 0) {
            showResult(
                "Queue underflow: The queue is empty.",
                "error"
            );

            return;
        }

        const removedValue = queue.shift();

        displayQueue();

        showResult(
            `Dequeue: ${removedValue} was removed from the front.`,
            "success"
        );
    }


    /* ================= Peek ================= */

    function peekFront() {
        if (queue.length === 0) {
            showResult(
                "Peek is unavailable because the queue is empty.",
                "error"
            );

            return;
        }

        displayQueue(0);

        showResult(
            `Peek: The front element is ${queue[0]}.`,
            "success"
        );
    }


    /* ================= isEmpty ================= */

    function checkIsEmpty() {
        const empty = queue.length === 0;

        displayQueue();

        showResult(
            `isEmpty: ${empty}. The queue contains ${queue.length} element(s).`,
            "success"
        );
    }


    /* ================= Reset ================= */

    function resetQueue() {
        queue = [...initialQueue];

        valueInput.value = "";

        displayQueue();

        showResult(
            "The queue has been reset.",
            "success"
        );
    }


    /* ================= Button Events ================= */

    document
        .getElementById("enqueueButton")
        .addEventListener("click", enqueueElement);

    document
        .getElementById("dequeueButton")
        .addEventListener("click", dequeueElement);

    document
        .getElementById("peekButton")
        .addEventListener("click", peekFront);

    document
        .getElementById("isEmptyButton")
        .addEventListener("click", checkIsEmpty);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetQueue);


    valueInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            enqueueElement();
        }
    });


    /* ================= Initial Display ================= */

    displayQueue();

});