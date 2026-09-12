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


    /* ================= Topic Navigation ================= */

    const topicCards =
        document.querySelectorAll(".topic-card");

    function openTopic(pageName) {
        if (pageName) {
            window.location.href = pageName;
        }
    }

    topicCards.forEach(function (card) {

        card.addEventListener("click", function (event) {
            if (event.target.closest(".topic-button")) {
                return;
            }

            const targetPage =
                card.getAttribute("data-page");

            openTopic(targetPage);
        });


        card.addEventListener("keydown", function (event) {
            if (
                event.key === "Enter" ||
                event.key === " "
            ) {
                event.preventDefault();

                const targetPage =
                    card.getAttribute("data-page");

                openTopic(targetPage);
            }
        });

    });


    /* ================= Entrance Animation ================= */

    topicCards.forEach(function (card, index) {
        card.classList.add("card-hidden");

        setTimeout(function () {
            card.classList.remove("card-hidden");
            card.classList.add("card-visible");
        }, 120 * index);
    });

});