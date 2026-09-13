document.addEventListener("DOMContentLoaded", function () {

    /* ================= Authentication ================= */

    const authButton =
        document.getElementById("authButton");

    const loggedInUser =
        localStorage.getItem("loggedInUser");


    if (authButton) {

        if (loggedInUser) {

            authButton.textContent = "Logout";
            authButton.href = "#";

            authButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    localStorage.removeItem(
                        "loggedInUser"
                    );

                    window.location.href =
                        "../index.html";

                }
            );

        } else {

            authButton.textContent = "Log in";
            authButton.href = "login.html";

        }
    }


    /* ================= Category Navigation ================= */

    const categoryCards =
        document.querySelectorAll(".category-card");

    const exploreButtons =
        document.querySelectorAll(".explore-button");


    function openCategory(pageName) {

        if (!loggedInUser) {

            alert(
                "Please log in before starting a lesson."
            );

            window.location.href =
                "login.html";

            return;
        }


        if (pageName) {

            window.location.href =
                pageName;

        }
    }


    /* ================= Card Events ================= */

    categoryCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.closest(
                        ".explore-button"
                    )
                ) {
                    return;
                }


                const targetPage =
                    card.getAttribute("data-page");

                openCategory(targetPage);

            }
        );


        card.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    const targetPage =
                        card.getAttribute(
                            "data-page"
                        );

                    openCategory(targetPage);

                }
            }
        );

    });


    /* ================= Button Events ================= */

    exploreButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                const targetPage =
                    button.getAttribute(
                        "data-page"
                    );

                openCategory(targetPage);

            }
        );

    });


    /* ================= Entrance Animation ================= */

    categoryCards.forEach(
        function (card, index) {

            card.classList.add(
                "card-hidden"
            );

            setTimeout(function () {

                card.classList.remove(
                    "card-hidden"
                );

                card.classList.add(
                    "card-visible"
                );

            }, 150 * index);

        }
    );

});