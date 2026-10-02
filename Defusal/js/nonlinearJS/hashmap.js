document.addEventListener("DOMContentLoaded", function () {

    /* ================= Authentication ================= */

    const authButton = document.getElementById("authButton");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (authButton) {
        if (loggedInUser) {
            authButton.textContent = "Profile";
            authButton.href = "../profile.html";
        } else {
            authButton.textContent = "Log in";
            authButton.href = "../login.html";
        }
    }


    /* ================= Hash Map State ================= */

    const CAPACITY = 7;

    let buckets = [];
    let steps = [];
    let currentStepIndex = -1;
    let pendingOperation = null;
    let comparisons = 0;


    /* ================= Elements ================= */

    const bucketContainer =
        document.getElementById("bucketContainer");

    const keyInput =
        document.getElementById("keyInput");

    const valueInput =
        document.getElementById("valueInput");

    const entryCount =
        document.getElementById("entryCount");

    const usedBucketCount =
        document.getElementById("usedBucketCount");

    const loadFactor =
        document.getElementById("loadFactor");

    const comparisonCount =
        document.getElementById("comparisonCount");

    const hashCalculation =
        document.getElementById("hashCalculation");

    const currentStep =
        document.getElementById("currentStep");

    const searchPath =
        document.getElementById("searchPath");

    const stepCounter =
        document.getElementById("stepCounter");

    const progressBar =
        document.getElementById("progressBar");

    const operationResult =
        document.getElementById("operationResult");

    const nextStepButton =
        document.getElementById("nextStepButton");


    /* ================= Hash Function ================= */

    function hashKey(key) {
        let sum = 0;

        for (let i = 0; i < key.length; i++) {
            sum += key.charCodeAt(i);
        }

        return {
            sum: sum,
            index: sum % CAPACITY
        };
    }


    /* ================= Validation ================= */

    function getKey() {
        const key = keyInput.value.trim();

        if (key === "") {
            showResult("Please enter a key.", "error");
            keyInput.focus();
            return null;
        }

        return key;
    }

    function getValue() {
        const value = valueInput.value.trim();

        if (value === "") {
            showResult("Please enter a value.", "error");
            valueInput.focus();
            return null;
        }

        return value;
    }


    /* ================= Rendering ================= */

    function renderBuckets(
        activeBucket = null,
        highlightedKey = null
    ) {
        bucketContainer.innerHTML = "";

        buckets.forEach(function (bucket, index) {
            const row = document.createElement("div");
            row.className = "bucket-row";

            if (index === activeBucket) {
                row.classList.add("active");
            }

            const indexBox = document.createElement("div");
            indexBox.className = "bucket-index";
            indexBox.textContent = `[${index}]`;

            const chain = document.createElement("div");
            chain.className = "bucket-chain";

            if (bucket.length === 0) {
                chain.innerHTML =
                    '<span class="empty-bucket">Empty bucket</span>';
            } else {
                bucket.forEach(function (entry) {
                    const element =
                        document.createElement("div");

                    element.className = "hash-entry";

                    if (entry.key === highlightedKey) {
                        element.classList.add("highlighted");
                    }

                    const keyElement =
                        document.createElement("strong");

                    keyElement.textContent = entry.key;

                    const valueElement =
                        document.createElement("span");

                    valueElement.textContent =
                        `: ${entry.value}`;

                    element.appendChild(keyElement);
                    element.appendChild(valueElement);

                    chain.appendChild(element);
                });
            }

            row.appendChild(indexBox);
            row.appendChild(chain);

            bucketContainer.appendChild(row);
        });

        updateStatistics();
    }

    function updateStatistics() {
        let totalEntries = 0;
        let usedBuckets = 0;

        buckets.forEach(function (bucket) {
            totalEntries += bucket.length;

            if (bucket.length > 0) {
                usedBuckets++;
            }
        });

        entryCount.textContent = totalEntries;

        usedBucketCount.textContent =
            `${usedBuckets} / ${CAPACITY}`;

        loadFactor.textContent =
            (totalEntries / CAPACITY).toFixed(2);

        comparisonCount.textContent = comparisons;
    }

    function showResult(message, type = "normal") {
        operationResult.textContent = message;

        operationResult.classList.remove(
            "success",
            "error"
        );

        if (type === "success") {
            operationResult.classList.add("success");
        }

        if (type === "error") {
            operationResult.classList.add("error");
        }
    }

    function renderSearchPath(keys) {
        searchPath.innerHTML = "";

        if (keys.length === 0) {
            searchPath.innerHTML =
                '<span class="empty-item">Empty</span>';

            return;
        }

        keys.forEach(function (key) {
            const item = document.createElement("span");

            item.className = "path-item";
            item.textContent = key;

            searchPath.appendChild(item);
        });
    }


    /* ================= Steps ================= */

    function beginOperation(operation, createdSteps) {
        pendingOperation = operation;
        steps = createdSteps;
        currentStepIndex = -1;

        nextStepButton.disabled = false;

        stepCounter.textContent =
            `0 / ${steps.length}`;

        progressBar.style.width = "0%";

        currentStep.textContent =
            "Press Next Step to begin.";

        renderSearchPath([]);

        showResult(
            `${operation.label} is ready. Press Next Step.`
        );
    }

    function createLookupSteps(key, label) {
        const hash = hashKey(key);
        const bucket = buckets[hash.index];

        const createdSteps = [{
            type: "hash",
            bucketIndex: hash.index,
            highlightedKey: null,
            path: [],
            message:
                `Hash ${key}: ${hash.sum} % ${CAPACITY} = ${hash.index}`,
            result:
                `The key belongs to bucket ${hash.index}.`
        }];

        const visited = [];

        for (let i = 0; i < bucket.length; i++) {
            visited.push(bucket[i].key);

            createdSteps.push({
                type: "compare",
                bucketIndex: hash.index,
                highlightedKey: bucket[i].key,
                path: [...visited],
                message:
                    `Compare "${key}" with "${bucket[i].key}".`,
                result:
                    key === bucket[i].key
                        ? `${label}: Key found.`
                        : "The keys do not match.",
                found: key === bucket[i].key,
                entry: bucket[i]
            });

            if (key === bucket[i].key) {
                return createdSteps;
            }
        }

        createdSteps.push({
            type: "not-found",
            bucketIndex: hash.index,
            highlightedKey: null,
            path: [...visited],
            message: "Reached the end of the chain.",
            result: `${label}: "${key}" was not found.`,
            found: false
        });

        return createdSteps;
    }

    function nextStep() {
        if (steps.length === 0) {
            return;
        }

        currentStepIndex++;

        if (currentStepIndex >= steps.length) {
            return;
        }

        const step = steps[currentStepIndex];

        currentStep.textContent = step.message;

        renderSearchPath(step.path || []);

        renderBuckets(
            step.bucketIndex,
            step.highlightedKey
        );

        showResult(step.result);

        if (step.type === "compare") {
            comparisons++;
            updateStatistics();
        }

        stepCounter.textContent =
            `${currentStepIndex + 1} / ${steps.length}`;

        progressBar.style.width =
            `${((currentStepIndex + 1) / steps.length) * 100}%`;

        if (currentStepIndex === steps.length - 1) {
            completeOperation(step);
        }
    }


    /* ================= Put ================= */

    function preparePut() {
        const key = getKey();

        if (key === null) {
            return;
        }

        const value = getValue();

        if (value === null) {
            return;
        }

        const hash = hashKey(key);
        const bucket = buckets[hash.index];

        hashCalculation.textContent =
            `${hash.sum} % ${CAPACITY} = ${hash.index}`;

        const createdSteps =
            createLookupSteps(key, "Put");

        beginOperation(
            {
                type: "put",
                label: "Put / Update",
                key: key,
                value: value,
                bucketIndex: hash.index,
                existed:
                    bucket.some(function (entry) {
                        return entry.key === key;
                    }),
                collision:
                    bucket.length > 0 &&
                    !bucket.some(function (entry) {
                        return entry.key === key;
                    })
            },
            createdSteps
        );
    }


    /* ================= Get ================= */

    function prepareGet() {
        const key = getKey();

        if (key === null) {
            return;
        }

        const hash = hashKey(key);

        hashCalculation.textContent =
            `${hash.sum} % ${CAPACITY} = ${hash.index}`;

        beginOperation(
            {
                type: "get",
                label: "Get",
                key: key,
                bucketIndex: hash.index
            },
            createLookupSteps(key, "Get")
        );
    }


    /* ================= Contains ================= */

    function prepareContains() {
        const key = getKey();

        if (key === null) {
            return;
        }

        const hash = hashKey(key);

        hashCalculation.textContent =
            `${hash.sum} % ${CAPACITY} = ${hash.index}`;

        beginOperation(
            {
                type: "contains",
                label: "Contains Key",
                key: key,
                bucketIndex: hash.index
            },
            createLookupSteps(key, "Contains Key")
        );
    }


    /* ================= Remove ================= */

    function prepareRemove() {
        const key = getKey();

        if (key === null) {
            return;
        }

        const hash = hashKey(key);

        hashCalculation.textContent =
            `${hash.sum} % ${CAPACITY} = ${hash.index}`;

        beginOperation(
            {
                type: "remove",
                label: "Remove",
                key: key,
                bucketIndex: hash.index
            },
            createLookupSteps(key, "Remove")
        );
    }


    /* ================= Complete Operation ================= */

    function completeOperation(finalStep) {
        nextStepButton.disabled = true;

        const operation = pendingOperation;
        const bucket = buckets[operation.bucketIndex];

        if (operation.type === "put") {
            const existingEntry =
                bucket.find(function (entry) {
                    return entry.key === operation.key;
                });

            if (existingEntry) {
                existingEntry.value = operation.value;

                showResult(
                    `"${operation.key}" was updated successfully.`,
                    "success"
                );
            } else {
                bucket.push({
                    key: operation.key,
                    value: operation.value
                });

                if (operation.collision) {
                    showResult(
                        `Collision detected. "${operation.key}" was added to bucket ${operation.bucketIndex} using Separate Chaining.`,
                        "success"
                    );
                } else {
                    showResult(
                        `"${operation.key}" was inserted into bucket ${operation.bucketIndex}.`,
                        "success"
                    );
                }
            }

            renderBuckets(
                operation.bucketIndex,
                operation.key
            );

            return;
        }

        const entryIndex =
            bucket.findIndex(function (entry) {
                return entry.key === operation.key;
            });

        if (operation.type === "get") {
            if (entryIndex !== -1) {
                showResult(
                    `Get("${operation.key}") returned "${bucket[entryIndex].value}".`,
                    "success"
                );
            } else {
                showResult(
                    `"${operation.key}" was not found.`,
                    "error"
                );
            }
        }

        if (operation.type === "contains") {
            showResult(
                entryIndex !== -1
                    ? `Contains Key returned true for "${operation.key}".`
                    : `Contains Key returned false for "${operation.key}".`,
                entryIndex !== -1 ? "success" : "error"
            );
        }

        if (operation.type === "remove") {
            if (entryIndex !== -1) {
                bucket.splice(entryIndex, 1);

                renderBuckets(operation.bucketIndex);

                showResult(
                    `"${operation.key}" was removed successfully.`,
                    "success"
                );
            } else {
                showResult(
                    `"${operation.key}" cannot be removed because it was not found.`,
                    "error"
                );
            }
        }
    }


    /* ================= Reset ================= */

    function resetHashMap() {
        buckets =
            Array.from(
                { length: CAPACITY },
                function () {
                    return [];
                }
            );

        comparisons = 0;
        steps = [];
        currentStepIndex = -1;
        pendingOperation = null;

        const initialEntries = [
            {
                key: "Peter",
                value: "Spiderman"
            },
            {
                key: "Tony",
                value: "Iron Man"
            },
            {
                key: "Bruce",
                value: "Batman"
            }
        ];

        initialEntries.forEach(function (entry) {
            const index = hashKey(entry.key).index;

            buckets[index].push(entry);
        });

        keyInput.value = "";
        valueInput.value = "";

        hashCalculation.textContent =
            "Waiting for an operation";

        currentStep.textContent =
            "Enter a key and value to begin.";

        renderSearchPath([]);

        stepCounter.textContent = "0 / 0";
        progressBar.style.width = "0%";

        nextStepButton.disabled = true;

        renderBuckets();

        showResult(
            "Hash Map reset with three example entries.",
            "success"
        );
    }


    /* ================= Hash Tracer ================= */

    const traceKeyInput =
        document.getElementById("traceKeyInput");

    const traceCharacters =
        document.getElementById("traceCharacters");

    const traceCodes =
        document.getElementById("traceCodes");

    const traceTotal =
        document.getElementById("traceTotal");

    const traceIndex =
        document.getElementById("traceIndex");

    function traceHash() {
        const key = traceKeyInput.value.trim();

        if (key === "") {
            traceCharacters.textContent = "Enter a key";
            traceCodes.textContent = "—";
            traceTotal.textContent = "—";
            traceIndex.textContent = "—";
            return;
        }

        const characters = [];
        const codes = [];
        let total = 0;

        for (let i = 0; i < key.length; i++) {
            characters.push(key[i]);

            const code = key.charCodeAt(i);

            codes.push(code);
            total += code;
        }

        traceCharacters.textContent =
            characters.join(" + ");

        traceCodes.textContent =
            codes.join(" + ");

        traceTotal.textContent = total;

        traceIndex.textContent =
            `${total} % ${CAPACITY} = ${total % CAPACITY}`;
    }


    /* ================= Code Examples ================= */

    const codeTabs =
        document.querySelectorAll(".code-tab");

    const codeTitle =
        document.getElementById("codeTitle");

    const codeDisplay =
        document.getElementById("codeDisplay");

    const codeExplanation =
        document.getElementById("codeExplanation");

    function showCodeExample(name) {
        const example =
            window.HASHMAP_CODE_EXAMPLES[name];

        codeTitle.textContent = example.title;
        codeDisplay.textContent = example.code;
        codeExplanation.textContent =
            example.explanation;
    }

    codeTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            codeTabs.forEach(function (otherTab) {
                otherTab.classList.remove("active");
            });

            tab.classList.add("active");

            showCodeExample(tab.dataset.example);
        });
    });

    document
        .getElementById("copyCodeButton")
        .addEventListener("click", async function () {
            const button = this;

            try {
                await navigator.clipboard.writeText(
                    codeDisplay.textContent
                );

                button.textContent = "Copied";

                setTimeout(function () {
                    button.textContent = "Copy code";
                }, 1200);
            } catch (error) {
                button.textContent = "Select and copy";
            }
        });


    /* ================= Quiz ================= */

    const quizQuestions =
        document.querySelectorAll(".quiz-question");

    const quizScore =
        document.getElementById("quizScore");

    const quizAnswers = new Map();

    function updateQuizScore() {
        let score = 0;

        quizAnswers.forEach(function (correct) {
            if (correct) {
                score++;
            }
        });

        quizScore.textContent =
            `${score} / ${quizQuestions.length}`;
    }

    quizQuestions.forEach(function (question, index) {
        const answer = question.dataset.answer;

        const buttons =
            question.querySelectorAll(
                ".answer-list button"
            );

        const feedback =
            question.querySelector(
                ".answer-feedback"
            );

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove(
                        "correct",
                        "incorrect"
                    );
                });

                const correct =
                    button.dataset.choice === answer;

                button.classList.add(
                    correct ? "correct" : "incorrect"
                );

                if (!correct) {
                    question
                        .querySelector(
                            `[data-choice="${answer}"]`
                        )
                        .classList.add("correct");
                }

                quizAnswers.set(index, correct);

                feedback.textContent =
                    correct
                        ? "Correct. Good work!"
                        : "Not quite. Review the highlighted answer.";

                updateQuizScore();
            });
        });
    });


    /* ================= Challenge ================= */

    const challengeKeyOne =
        document.getElementById("challengeKeyOne");

    const challengeKeyTwo =
        document.getElementById("challengeKeyTwo");

    const challengeOutputOne =
        document.getElementById("challengeOutputOne");

    const challengeOutputTwo =
        document.getElementById("challengeOutputTwo");

    const challengeResult =
        document.getElementById("challengeResult");

    const differentKeyMission =
        document.getElementById(
            "differentKeyMission"
        );

    const sameBucketMission =
        document.getElementById(
            "sameBucketMission"
        );

    function checkChallenge() {
        const firstKey =
            challengeKeyOne.value.trim();

        const secondKey =
            challengeKeyTwo.value.trim();

        if (firstKey === "" || secondKey === "") {
            challengeResult.textContent =
                "Enter both keys.";

            challengeResult.className =
                "challenge-result error";

            return;
        }

        const firstIndex =
            hashKey(firstKey).index;

        const secondIndex =
            hashKey(secondKey).index;

        const different =
            firstKey !== secondKey;

        const sameBucket =
            firstIndex === secondIndex;

        challengeOutputOne.textContent =
            `"${firstKey}" index: ${firstIndex}`;

        challengeOutputTwo.textContent =
            `"${secondKey}" index: ${secondIndex}`;

        differentKeyMission.classList.toggle(
            "passed",
            different
        );

        sameBucketMission.classList.toggle(
            "passed",
            sameBucket
        );

        if (different && sameBucket) {
            challengeResult.textContent =
                "Mission completed! You created a collision.";

            challengeResult.className =
                "challenge-result success";
        } else {
            challengeResult.textContent =
                "These keys do not create a valid collision.";

            challengeResult.className =
                "challenge-result error";
        }
    }


    /* ================= Progress ================= */

    const completeLessonButton =
        document.getElementById(
            "completeLessonButton"
        );

    if (
        typeof isLessonCompleted === "function" &&
        isLessonCompleted("hashmap")
    ) {
        completeLessonButton.textContent =
            "Completed ✓";

        completeLessonButton.classList.add(
            "completed"
        );
    }

    completeLessonButton.addEventListener(
        "click",
        function () {
            let saved = true;

            if (
                typeof completeLesson === "function"
            ) {
                saved = completeLesson("hashmap");
            }

            if (saved !== false) {
                completeLessonButton.textContent =
                    "Completed ✓";

                completeLessonButton.classList.add(
                    "completed"
                );

                alert("Hash Map lesson completed!");
            }
        }
    );


    /* ================= Events ================= */

    document
        .getElementById("putButton")
        .addEventListener("click", preparePut);

    document
        .getElementById("getButton")
        .addEventListener("click", prepareGet);

    document
        .getElementById("containsButton")
        .addEventListener(
            "click",
            prepareContains
        );

    document
        .getElementById("removeButton")
        .addEventListener("click", prepareRemove);

    document
        .getElementById("nextStepButton")
        .addEventListener("click", nextStep);

    document
        .getElementById("resetButton")
        .addEventListener("click", resetHashMap);

    document
        .getElementById("traceHashButton")
        .addEventListener("click", traceHash);

    document
        .getElementById("checkChallengeButton")
        .addEventListener(
            "click",
            checkChallenge
        );

    traceKeyInput.addEventListener(
        "keydown",
        function (event) {
            if (event.key === "Enter") {
                traceHash();
            }
        }
    );


    /* ================= Initial Page ================= */

    showCodeExample("structure");
    resetHashMap();

});