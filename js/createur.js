/* =========================================================
   CRÉATEUR DE PARFUM — ÉLÉGANCE PARFUMERIE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    let currentStep = 1;
    const totalSteps = 5;

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const finishBtn = document.getElementById("finishBtn");

    const steps = document.querySelectorAll(".creator-step");
    const indicators = document.querySelectorAll(".creator-step-indicator");


    /* =====================================================
       AFFICHER UNE ÉTAPE
    ===================================================== */

    function showStep(step) {

        steps.forEach(function (element) {
            element.classList.remove("active");
        });

        indicators.forEach(function (element) {
            element.classList.remove("active");
        });

        const current = document.getElementById("step-" + step);
        const indicator = document.getElementById("step-indicator-" + step);

        if (current) {
            current.classList.add("active");
        }

        if (indicator) {
            indicator.classList.add("active");
        }


        /* Bouton précédent */

        if (step === 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.disabled = false;
        }


        /* Boutons suivant / terminer */

        if (step === totalSteps) {

            nextBtn.style.display = "none";
            finishBtn.style.display = "block";

        } else {

            nextBtn.style.display = "block";
            finishBtn.style.display = "none";
        }

    }


    /* =====================================================
       VÉRIFIER L'ÉTAPE
    ===================================================== */

    function validateStep(step) {

        if (step === 1) {

            const selected = document.querySelector(
                'input[name="famille"]:checked'
            );

            if (!selected) {
                alert("Veuillez choisir une famille olfactive.");
                return false;
            }
        }


        if (step === 2) {

            const selected = document.querySelector(
                'input[name="intensite"]:checked'
            );

            if (!selected) {
                alert("Veuillez choisir une intensité.");
                return false;
            }
        }


        if (step === 3) {

            const selected = document.querySelector(
                'input[name="ambiance"]:checked'
            );

            if (!selected) {
                alert("Veuillez choisir une ambiance.");
                return false;
            }
        }


        if (step === 4) {

            const selected = document.querySelector(
                'input[name="format"]:checked'
            );

            if (!selected) {
                alert("Veuillez choisir un format.");
                return false;
            }
        }


        if (step === 5) {

            const nameInput = document.getElementById("nom-parfum");

            if (!nameInput.value.trim()) {
                alert("Veuillez donner un nom à votre parfum.");
                nameInput.focus();
                return false;
            }
        }


        return true;
    }


    /* =====================================================
       RÉSUMÉ
    ===================================================== */

    function updateSummary() {

        const famille = document.querySelector(
            'input[name="famille"]:checked'
        );

        const intensite = document.querySelector(
            'input[name="intensite"]:checked'
        );

        const ambiance = document.querySelector(
            'input[name="ambiance"]:checked'
        );

        const format = document.querySelector(
            'input[name="format"]:checked'
        );


        document.getElementById("summary-famille").textContent =
            famille ? famille.value : "—";

        document.getElementById("summary-intensite").textContent =
            intensite ? intensite.value : "—";

        document.getElementById("summary-ambiance").textContent =
            ambiance ? ambiance.value : "—";

        if (format) {

            const prix = Number(format.dataset.prix);

            document.getElementById("summary-format").textContent =
                format.value + " — " +
                prix.toLocaleString("fr-FR") +
                " Ar";

        } else {

            document.getElementById("summary-format").textContent = "—";
        }
    }


    /* =====================================================
       BOUTON SUIVANT
    ===================================================== */

    nextBtn.addEventListener("click", function () {

        if (!validateStep(currentStep)) {
            return;
        }

        if (currentStep < totalSteps) {

            currentStep++;

            updateSummary();

            showStep(currentStep);
        }

    });


    /* =====================================================
       BOUTON PRÉCÉDENT
    ===================================================== */

    prevBtn.addEventListener("click", function () {

        if (currentStep > 1) {

            currentStep--;

            updateSummary();

            showStep(currentStep);
        }

    });


    /* =====================================================
       MISE À JOUR DU RÉSUMÉ LORS DES CHOIX
    ===================================================== */

    const allInputs = document.querySelectorAll(
        '.creator-option input'
    );

    allInputs.forEach(function (input) {

        input.addEventListener("change", function () {
            updateSummary();
        });

    });


    /* =====================================================
       CRÉER LE PARFUM
    ===================================================== */

    finishBtn.addEventListener("click", function () {

        if (!validateStep(5)) {
            return;
        }


        const famille = document.querySelector(
            'input[name="famille"]:checked'
        ).value;

        const intensite = document.querySelector(
            'input[name="intensite"]:checked'
        ).value;

        const ambiance = document.querySelector(
            'input[name="ambiance"]:checked'
        ).value;

        const formatInput = document.querySelector(
            'input[name="format"]:checked'
        );

        const format = formatInput.value;

        const prix = Number(formatInput.dataset.prix);

        const nom = document.getElementById(
            "nom-parfum"
        ).value.trim();


        /* =================================================
           OBJET DU PARFUM PERSONNALISÉ
        ================================================= */

        const parfumPersonnalise = {

            nom: nom,

            format: format,

            prix: prix,

            quantite: 1,

            personnalise: true,

            famille: famille,

            intensite: intensite,

            ambiance: ambiance

        };


        /* =================================================
           RÉCUPÉRER LE PANIER
        ================================================= */

        let panier = JSON.parse(
            localStorage.getItem("panier")
        ) || [];


        /* =================================================
           AJOUTER AU PANIER
        ================================================= */

        panier.push(parfumPersonnalise);


        localStorage.setItem(
            "panier",
            JSON.stringify(panier)
        );


        /* =================================================
           MESSAGE
        ================================================= */

        alert(
            "✨ Votre parfum « " +
            nom +
            " » a été ajouté au panier !"
        );


        /* =================================================
           REDIRECTION
        ================================================= */

        window.location.href = "panier.html";

    });


    /* =====================================================
       INITIALISATION
    ===================================================== */

    updateSummary();

    showStep(currentStep);

});