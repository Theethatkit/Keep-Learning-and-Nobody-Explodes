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




    /* ================= HashMap Settings ================= */

    const bucketCount = 7;

    let hashMap = [
        [],
        [],
        [],
        [],
        [],
        [],
        []
    ];


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


    const hashTable =
        document.getElementById("hashTable");

    const resultText =
        document.getElementById("visualizationResult");

    const keyInput =
        document.getElementById("keyInput");

    const valueInput =
        document.getElementById("valueInput");


    /* ================= Hash Function ================= */

    function hashFunction(key) {

        let hashCode = 0;


        for (
            let index = 0;
            index < key.length;
            index++
        ) {

            hashCode +=
                key.charCodeAt(index);

        }


        return hashCode % bucketCount;

    }


    /* ================= Find Entry ================= */

    function findEntry(key) {

        const bucketIndex =
            hashFunction(key);

        const entryIndex =
            hashMap[bucketIndex].findIndex(
                function (entry) {

                    return entry.key === key;

                }
            );


        return {
            bucketIndex: bucketIndex,
            entryIndex: entryIndex
        };

    }


    /* ================= Display HashMap ================= */

    function displayHashMap(
        highlightedBucket = -1,
        highlightedKey = ""
    ) {

        hashTable.innerHTML = "";


        hashMap.forEach(
            function (bucket, bucketIndex) {

                const bucketRow =
                    document.createElement("div");

                bucketRow.classList.add(
                    "bucket-row"
                );


                const bucketNumber =
                    document.createElement("div");

                bucketNumber.classList.add(
                    "bucket-number"
                );

                bucketNumber.textContent =
                    bucketIndex;


                const bucketContent =
                    document.createElement("div");

                bucketContent.classList.add(
                    "bucket-content"
                );


                if (bucket.length === 0) {

                    const emptyBucket =
                        document.createElement("span");

                    emptyBucket.classList.add(
                        "empty-bucket"
                    );

                    emptyBucket.textContent =
                        "Empty";

                    bucketContent.appendChild(
                        emptyBucket
                    );

                } else {

                    bucket.forEach(
                        function (entry, entryIndex) {

                            if (entryIndex > 0) {

                                const arrow =
                                    document.createElement("span");

                                arrow.classList.add(
                                    "chain-arrow"
                                );

                                arrow.textContent = "→";

                                bucketContent.appendChild(
                                    arrow
                                );

                            }


                            const entryElement =
                                document.createElement("div");

                            entryElement.classList.add(
                                "hash-entry"
                            );


                            if (
                                bucketIndex === highlightedBucket &&
                                entry.key === highlightedKey
                            ) {

                                entryElement.classList.add(
                                    "highlighted"
                                );

                            }


                            const keyElement =
                                document.createElement("strong");

                            keyElement.textContent =
                                entry.key;


                            const separator =
                                document.createTextNode(":");


                            const valueElement =
                                document.createElement("span");

                            valueElement.textContent =
                                entry.value;


                            entryElement.appendChild(
                                keyElement
                            );

                            entryElement.appendChild(
                                separator
                            );

                            entryElement.appendChild(
                                valueElement
                            );

                            bucketContent.appendChild(
                                entryElement
                            );

                        }
                    );

                }


                bucketRow.appendChild(
                    bucketNumber
                );

                bucketRow.appendChild(
                    bucketContent
                );

                hashTable.appendChild(
                    bucketRow
                );

            }
        );

    }


    /* ================= Result Message ================= */

    function showResult(
        message,
        type = "normal"
    ) {

        resultText.textContent = message;

        resultText.classList.remove(
            "result-success",
            "result-error"
        );


        if (type === "success") {

            resultText.classList.add(
                "result-success"
            );

        }


        if (type === "error") {

            resultText.classList.add(
                "result-error"
            );

        }

    }


    /* ================= Input Validation ================= */

    function getKey() {

        const key =
            keyInput.value.trim();


        if (key === "") {

            showResult(
                "Please enter a key.",
                "error"
            );

            keyInput.focus();

            return null;

        }


        return key;

    }


    function getValue() {

        const value =
            valueInput.value.trim();


        if (value === "") {

            showResult(
                "Please enter a value.",
                "error"
            );

            valueInput.focus();

            return null;

        }


        return value;

    }


    /* ================= Put ================= */

    function putEntry() {

        const key = getKey();
        const value = getValue();


        if (
            key === null ||
            value === null
        ) {
            return;
        }


        const location =
            findEntry(key);


        if (location.entryIndex !== -1) {

            const oldValue =
                hashMap[location.bucketIndex]
                    [location.entryIndex]
                    .value;


            hashMap[location.bucketIndex]
                [location.entryIndex]
                .value = value;


            displayHashMap(
                location.bucketIndex,
                key
            );


            showResult(
                `Put: "${key}" was updated from "${oldValue}" to "${value}".`,
                "success"
            );

        } else {

            const collision =
                hashMap[location.bucketIndex]
                    .length > 0;


            hashMap[location.bucketIndex].push({
                key: key,
                value: value
            });


            displayHashMap(
                location.bucketIndex,
                key
            );


            if (collision) {

                showResult(
                    `Collision: "${key}" was added to bucket ${location.bucketIndex} using chaining.`,
                    "success"
                );

            } else {

                showResult(
                    `Put: "${key}" was stored in bucket ${location.bucketIndex}.`,
                    "success"
                );

            }

        }


        keyInput.value = "";
        valueInput.value = "";

    }


    /* ================= Get ================= */

    function getEntry() {

        const key = getKey();


        if (key === null) {
            return;
        }


        const location =
            findEntry(key);


        if (location.entryIndex === -1) {

            displayHashMap();


            showResult(
                `Get: The key "${key}" was not found.`,
                "error"
            );

            return;

        }


        const entry =
            hashMap[location.bucketIndex]
                [location.entryIndex];


        displayHashMap(
            location.bucketIndex,
            key
        );


        showResult(
            `Get: "${key}" is connected to "${entry.value}".`,
            "success"
        );

    }


    /* ================= Remove ================= */

    function removeEntry() {

        const key = getKey();


        if (key === null) {
            return;
        }


        const location =
            findEntry(key);


        if (location.entryIndex === -1) {

            showResult(
                `Remove: The key "${key}" was not found.`,
                "error"
            );

            return;

        }


        const removedEntry =
            hashMap[location.bucketIndex]
                .splice(
                    location.entryIndex,
                    1
                )[0];


        displayHashMap();


        showResult(
            `Remove: "${removedEntry.key}" and its value were removed.`,
            "success"
        );

        keyInput.value = "";
        valueInput.value = "";

    }


    /* ================= containsKey ================= */

    function containsKey() {

        const key = getKey();


        if (key === null) {
            return;
        }


        const location =
            findEntry(key);

        const exists =
            location.entryIndex !== -1;


        if (exists) {

            displayHashMap(
                location.bucketIndex,
                key
            );


            showResult(
                `containsKey("${key}"): true`,
                "success"
            );

        } else {

            displayHashMap();


            showResult(
                `containsKey("${key}"): false`,
                "error"
            );

        }

    }


    /* ================= Reset ================= */

    function resetHashMap() {

        hashMap = [
            [],
            [],
            [],
            [],
            [],
            [],
            []
        ];


        initialEntries.forEach(
            function (entry) {

                const bucketIndex =
                    hashFunction(entry.key);


                hashMap[bucketIndex].push({
                    key: entry.key,
                    value: entry.value
                });

            }
        );


        keyInput.value = "";
        valueInput.value = "";


        displayHashMap();


        showResult(
            "The HashMap has been reset.",
            "success"
        );

    }


    /* ================= Button Events ================= */

    document
        .getElementById("putButton")
        .addEventListener(
            "click",
            putEntry
        );


    document
        .getElementById("getButton")
        .addEventListener(
            "click",
            getEntry
        );


    document
        .getElementById("removeButton")
        .addEventListener(
            "click",
            removeEntry
        );


    document
        .getElementById("containsButton")
        .addEventListener(
            "click",
            containsKey
        );


    document
        .getElementById("resetButton")
        .addEventListener(
            "click",
            resetHashMap
        );


    valueInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                putEntry();

            }

        }
    );


    /* ================= Initial Display ================= */

    resetHashMap();

});