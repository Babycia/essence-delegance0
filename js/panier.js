/* =========================================================
   ÉLÉGANCE PARFUMERIE
   PANIER + COMMANDE
   ========================================================= */


/* =========================================================
   RÉCUPÉRER LE PANIER
   ========================================================= */

function recupererPanier() {

    let panier = JSON.parse(
        localStorage.getItem("panier")
    ) || [];

    /*
       Compatibilité avec les anciennes données :
       - quantite
       - nombre
    */

    panier = panier.map(function(produit) {

        if (
            typeof produit.quantite !== "number" ||
            produit.quantite < 1
        ) {

            if (
                typeof produit.nombre === "number" &&
                produit.nombre > 0
            ) {

                produit.quantite = produit.nombre;

            } else {

                produit.quantite = 1;

            }

        }

        return produit;

    });

    return panier;
}


/* =========================================================
   SAUVEGARDER LE PANIER
   ========================================================= */

function sauvegarderPanier(panier) {

    localStorage.setItem(
        "panier",
        JSON.stringify(panier)
    );

}


/* =========================================================
   FORMATAGE DU PRIX
   ========================================================= */

function afficherPrix(prix) {

    return Number(prix).toLocaleString("fr-FR") + " Ar";

}


/* =========================================================
   AFFICHER LE PANIER
   ========================================================= */

function afficherPanier() {

    const panier = recupererPanier();

    const cartItems =
        document.getElementById("cart-items");

    const emptyCart =
        document.getElementById("empty-cart");

    const cartLayout =
        document.getElementById("cart-layout");

    const cartCount =
        document.getElementById("cart-count");

    const cartItemsCount =
        document.getElementById("cart-items-count");

    const summaryQuantity =
        document.getElementById("summary-quantity");

    const summarySubtotal =
        document.getElementById("summary-subtotal");

    const cartTotal =
        document.getElementById("cart-total");


    /* -----------------------------------------------------
       QUANTITÉ TOTALE
    ----------------------------------------------------- */

    let quantiteTotale = 0;

    panier.forEach(function(produit) {

        quantiteTotale +=
            Number(produit.quantite) || 1;

    });


    /* -----------------------------------------------------
       COMPTEUR NAVIGATION
    ----------------------------------------------------- */

    if (cartCount) {

        cartCount.textContent =
            quantiteTotale;

    }


    /* -----------------------------------------------------
       PANIER VIDE
    ----------------------------------------------------- */

    if (panier.length === 0) {

        if (emptyCart) {

            emptyCart.style.display = "block";

        }

        if (cartLayout) {

            cartLayout.style.display = "none";

        }

        return;
    }


    /* -----------------------------------------------------
       PANIER NON VIDE
    ----------------------------------------------------- */

    if (emptyCart) {

        emptyCart.style.display = "none";

    }

    if (cartLayout) {

        cartLayout.style.display = "grid";

    }


    /* -----------------------------------------------------
       NOMBRE D'ARTICLES
    ----------------------------------------------------- */

    if (cartItemsCount) {

        cartItemsCount.textContent =
            quantiteTotale +
            (
                quantiteTotale > 1
                    ? " articles"
                    : " article"
            );

    }


    /* -----------------------------------------------------
       CALCUL DU TOTAL
    ----------------------------------------------------- */

    let total = 0;

    panier.forEach(function(produit) {

        total +=
            Number(produit.prix || 0) *
            Number(produit.quantite || 1);

    });


    if (summaryQuantity) {

        summaryQuantity.textContent =
            quantiteTotale;

    }


    if (summarySubtotal) {

        summarySubtotal.textContent =
            afficherPrix(total);

    }


    if (cartTotal) {

        cartTotal.textContent =
            afficherPrix(total);

    }


    /* -----------------------------------------------------
       AFFICHAGE DES PRODUITS
    ----------------------------------------------------- */

    if (!cartItems) {

        return;

    }


    cartItems.innerHTML = "";


    panier.forEach(function(produit, index) {

        const article =
            document.createElement("div");

        article.className =
            "cart-product-item";


        /* Produit personnalisé */

        let labelPersonnalise = "";

        if (produit.personnalise) {

            labelPersonnalise =
                '<span class="custom-label">' +
                'Parfum personnalisé' +
                '</span>';

        }


        /* Composition du parfum personnalisé */

        let details = "";

        if (produit.personnalise) {

            details =
                (produit.famille || "") +
                " • " +
                (produit.intensite || "") +
                " • " +
                (produit.ambiance || "");

        } else {

            details =
                produit.format || "";

        }


        article.innerHTML = `

            <div class="cart-product-visual">

                <div class="cart-mini-bottle"></div>

            </div>


            <div class="cart-product-info">

                ${labelPersonnalise}

                <h3>
                    ${produit.nom || "Parfum"}
                </h3>

                <p>
                    ${details}
                </p>

                <strong>
                    ${afficherPrix(produit.prix || 0)}
                </strong>

            </div>


            <div class="cart-product-actions">

                <div class="quantity-control">

                    <button
                        type="button"
                        onclick="modifierQuantite(${index}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${produit.quantite || 1}
                    </span>

                    <button
                        type="button"
                        onclick="modifierQuantite(${index}, 1)"
                    >
                        +
                    </button>

                </div>


                <div class="product-total">

                    ${afficherPrix(
                        (produit.prix || 0) *
                        (produit.quantite || 1)
                    )}

                </div>


                <button
                    type="button"
                    class="delete-product"
                    onclick="supprimerProduit(${index})"
                    aria-label="Supprimer le produit"
                >
                    ×
                </button>

            </div>

        `;


        cartItems.appendChild(article);

    });

}


/* =========================================================
   MODIFIER LA QUANTITÉ
   ========================================================= */

function modifierQuantite(index, changement) {

    const panier = recupererPanier();

    if (!panier[index]) {

        return;

    }


    panier[index].quantite =
        Number(panier[index].quantite || 1) +
        changement;


    /* Minimum : 1 */

    if (panier[index].quantite < 1) {

        panier[index].quantite = 1;

    }


    sauvegarderPanier(panier);

    afficherPanier();

}


/* =========================================================
   SUPPRIMER UN PRODUIT
   ========================================================= */

function supprimerProduit(index) {

    const panier = recupererPanier();

    if (!panier[index]) {

        return;

    }


    panier.splice(index, 1);

    sauvegarderPanier(panier);

    afficherPanier();

}


/* =========================================================
   OUVRIR LA COMMANDE
   ========================================================= */

function ouvrirCommande() {

    const panier = recupererPanier();

    if (panier.length === 0) {

        alert(
            "Votre panier est vide."
        );

        return;

    }


    /* Si la fenêtre existe déjà, on la supprime */

    const ancienneFenetre =
        document.getElementById("checkout-modal");

    if (ancienneFenetre) {

        ancienneFenetre.remove();

    }


    /* -----------------------------------------------------
       CALCUL TOTAL
    ----------------------------------------------------- */

    let total = 0;

    panier.forEach(function(produit) {

        total +=
            Number(produit.prix || 0) *
            Number(produit.quantite || 1);

    });


    /* -----------------------------------------------------
       CRÉATION DE LA FENÊTRE
    ----------------------------------------------------- */

    const modal =
        document.createElement("div");

    modal.id =
        "checkout-modal";


    modal.innerHTML = `

        <div class="checkout-overlay">

            <div class="checkout-box">


                <button
                    type="button"
                    class="checkout-close"
                    onclick="fermerCommande()"
                >
                    ×
                </button>


                <!-- =====================================
                     ÉTAPE 1 : COORDONNÉES
                ====================================== -->

                <div
                    class="checkout-step active"
                    id="checkout-step-1"
                >

                    <span class="checkout-number">
                        01
                    </span>

                    <h2>
                        Vos coordonnées
                    </h2>

                    <p>
                        Informations nécessaires pour votre commande.
                    </p>


                    <div class="checkout-form">

                        <label>
                            Nom complet
                        </label>

                        <input
                            type="text"
                            id="client-nom"
                            placeholder="Votre nom complet"
                        >


                        <label>
                            Téléphone
                        </label>

                        <input
                            type="tel"
                            id="client-telephone"
                            placeholder="Votre numéro de téléphone"
                        >


                        <label>
                            Adresse e-mail
                        </label>

                        <input
                            type="email"
                            id="client-email"
                            placeholder="Votre adresse e-mail"
                        >

                    </div>


                    <button
                        type="button"
                        class="checkout-next"
                        onclick="allerEtape(2)"
                    >
                        Continuer
                    </button>

                </div>


                <!-- =====================================
                     ÉTAPE 2 : LIVRAISON
                ====================================== -->

                <div
                    class="checkout-step"
                    id="checkout-step-2"
                >

                    <span class="checkout-number">
                        02
                    </span>

                    <h2>
                        Livraison
                    </h2>

                    <p>
                        Indiquez où vous souhaitez recevoir votre commande.
                    </p>


                    <div class="checkout-form">

                        <label>
                            Adresse
                        </label>

                        <input
                            type="text"
                            id="livraison-adresse"
                            placeholder="Adresse de livraison"
                        >


                        <label>
                            Ville
                        </label>

                        <input
                            type="text"
                            id="livraison-ville"
                            placeholder="Ville"
                        >


                        <label>
                            Quartier
                        </label>

                        <input
                            type="text"
                            id="livraison-quartier"
                            placeholder="Quartier"
                        >


                        <label>
                            Indication supplémentaire
                        </label>

                        <textarea
                            id="livraison-indication"
                            placeholder="Ex : près de..."
                        ></textarea>

                    </div>


                    <div class="checkout-buttons">

                        <button
                            type="button"
                            class="checkout-back"
                            onclick="allerEtape(1)"
                        >
                            Retour
                        </button>


                        <button
                            type="button"
                            class="checkout-next"
                            onclick="allerEtape(3)"
                        >
                            Continuer
                        </button>

                    </div>

                </div>


                <!-- =====================================
                     ÉTAPE 3 : PAIEMENT
                ====================================== -->

                <div
                    class="checkout-step"
                    id="checkout-step-3"
                >

                    <span class="checkout-number">
                        03
                    </span>

                    <h2>
                        Mode de paiement
                    </h2>

                    <p>
                        Choisissez votre mode de paiement.
                    </p>


                    <div class="payment-options">


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paiement"
                                value="Paiement à la livraison"
                            >

                            <span>
                                Paiement à la livraison
                            </span>

                        </label>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paiement"
                                value="MVola"
                            >

                            <span>
                                MVola
                            </span>

                        </label>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paiement"
                                value="Orange Money"
                            >

                            <span>
                                Orange Money
                            </span>

                        </label>


                        <label class="payment-option">

                            <input
                                type="radio"
                                name="paiement"
                                value="Airtel Money"
                            >

                            <span>
                                Airtel Money
                            </span>

                        </label>


                    </div>


                    <div class="checkout-buttons">

                        <button
                            type="button"
                            class="checkout-back"
                            onclick="allerEtape(2)"
                        >
                            Retour
                        </button>


                        <button
                            type="button"
                            class="checkout-next"
                            onclick="allerEtape(4)"
                        >
                            Continuer
                        </button>

                    </div>

                </div>


                <!-- =====================================
                     ÉTAPE 4 : RÉCAPITULATIF
                ====================================== -->

                <div
                    class="checkout-step"
                    id="checkout-step-4"
                >

                    <span class="checkout-number">
                        04
                    </span>

                    <h2>
                        Récapitulatif
                    </h2>

                    <p>
                        Vérifiez vos informations avant de confirmer.
                    </p>


                    <div
                        id="order-summary"
                        class="order-summary"
                    >

                    </div>


                    <div class="checkout-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${afficherPrix(total)}
                        </strong>

                    </div>


                    <div class="checkout-buttons">

                        <button
                            type="button"
                            class="checkout-back"
                            onclick="allerEtape(3)"
                        >
                            Retour
                        </button>


                        <button
                            type="button"
                            class="checkout-confirm"
                            onclick="confirmerCommande()"
                        >
                            Confirmer la commande
                        </button>

                    </div>

                </div>


            </div>

        </div>

    `;


    document.body.appendChild(modal);


    ajouterStyleCommande();


}


/* =========================================================
   NAVIGATION ENTRE LES ÉTAPES
   ========================================================= */

function allerEtape(numero) {

    /* Validation des étapes */

    if (numero === 2) {

        const nom =
            document.getElementById(
                "client-nom"
            ).value.trim();

        const telephone =
            document.getElementById(
                "client-telephone"
            ).value.trim();


        if (!nom || !telephone) {

            alert(
                "Veuillez remplir votre nom et votre numéro de téléphone."
            );

            return;

        }

    }


    if (numero === 3) {

        const adresse =
            document.getElementById(
                "livraison-adresse"
            ).value.trim();

        const ville =
            document.getElementById(
                "livraison-ville"
            ).value.trim();


        if (!adresse || !ville) {

            alert(
                "Veuillez remplir votre adresse et votre ville."
            );

            return;

        }

    }


    if (numero === 4) {

        const paiement =
            document.querySelector(
                'input[name="paiement"]:checked'
            );


        if (!paiement) {

            alert(
                "Veuillez choisir un mode de paiement."
            );

            return;

        }


        afficherRecapitulatif();

    }


    document
        .querySelectorAll(".checkout-step")
        .forEach(function(step) {

            step.classList.remove("active");

        });


    const nouvelleEtape =
        document.getElementById(
            "checkout-step-" + numero
        );


    if (nouvelleEtape) {

        nouvelleEtape.classList.add("active");

    }

}


/* =========================================================
   AFFICHER LE RÉCAPITULATIF
   ========================================================= */

function afficherRecapitulatif() {

    const panier =
        recupererPanier();


    let total = 0;

    let produitsHTML = "";


    panier.forEach(function(produit) {

        const sousTotal =
            Number(produit.prix || 0) *
            Number(produit.quantite || 1);

        total += sousTotal;


        produitsHTML += `

            <div class="summary-product">

                <span>
                    ${produit.nom}
                    × ${produit.quantite}
                </span>

                <strong>
                    ${afficherPrix(sousTotal)}
                </strong>

            </div>

        `;

    });


    const nom =
        document.getElementById(
            "client-nom"
        ).value.trim();


    const telephone =
        document.getElementById(
            "client-telephone"
        ).value.trim();


    const email =
        document.getElementById(
            "client-email"
        ).value.trim();


    const adresse =
        document.getElementById(
            "livraison-adresse"
        ).value.trim();


    const ville =
        document.getElementById(
            "livraison-ville"
        ).value.trim();


    const quartier =
        document.getElementById(
            "livraison-quartier"
        ).value.trim();


    const indication =
        document.getElementById(
            "livraison-indication"
        ).value.trim();


    const paiement =
        document.querySelector(
            'input[name="paiement"]:checked'
        );


    const recap =
        document.getElementById(
            "order-summary"
        );


    recap.innerHTML = `

        <div class="summary-section">

            <h3>
                Client
            </h3>

            <p>
                ${nom}
            </p>

            <p>
                ${telephone}
            </p>

            ${
                email
                    ? `<p>${email}</p>`
                    : ""
            }

        </div>


        <div class="summary-section">

            <h3>
                Livraison
            </h3>

            <p>
                ${adresse}
            </p>

            <p>
                ${ville}
                ${
                    quartier
                        ? " — " + quartier
                        : ""
                }
            </p>

            ${
                indication
                    ? `<p>${indication}</p>`
                    : ""
            }

        </div>


        <div class="summary-section">

            <h3>
                Paiement
            </h3>

            <p>
                ${paiement.value}
            </p>

        </div>


        <div class="summary-section">

            <h3>
                Produits
            </h3>

            ${produitsHTML}

        </div>

    `;

}


/* =========================================================
   CONFIRMER LA COMMANDE
   ========================================================= */

function confirmerCommande() {

    const panier =
        recupererPanier();


    if (panier.length === 0) {

        alert(
            "Votre panier est vide."
        );

        return;

    }


    const nom =
        document.getElementById(
            "client-nom"
        ).value.trim();


    const telephone =
        document.getElementById(
            "client-telephone"
        ).value.trim();


    const email =
        document.getElementById(
            "client-email"
        ).value.trim();


    const adresse =
        document.getElementById(
            "livraison-adresse"
        ).value.trim();


    const ville =
        document.getElementById(
            "livraison-ville"
        ).value.trim();


    const quartier =
        document.getElementById(
            "livraison-quartier"
        ).value.trim();


    const indication =
        document.getElementById(
            "livraison-indication"
        ).value.trim();


    const paiement =
        document.querySelector(
            'input[name="paiement"]:checked'
        );


    /* Calcul total */

    let total = 0;

    panier.forEach(function(produit) {

        total +=
            Number(produit.prix || 0) *
            Number(produit.quantite || 1);

    });


    /* Numéro de commande */

    const numeroCommande =
        "EP-" +
        Date.now()
            .toString()
            .slice(-8);


    /* Création de la commande */

    const commande = {

        numero: numeroCommande,

        date:
            new Date().toLocaleString(
                "fr-FR"
            ),

        client: {

            nom: nom,

            telephone: telephone,

            email: email

        },

        livraison: {

            adresse: adresse,

            ville: ville,

            quartier: quartier,

            indication: indication

        },

        paiement:
            paiement.value,

        produits:
            panier,

        total:
            total

    };


    /* Sauvegarder la dernière commande */

    localStorage.setItem(

        "derniereCommande",

        JSON.stringify(commande)

    );


    /* Vider le panier */

    localStorage.removeItem(
        "panier"
    );


    /* Aller à la confirmation */

    window.location.href =
        "confirmation.html";

}


/* =========================================================
   FERMER LA COMMANDE
   ========================================================= */

function fermerCommande() {

    const modal =
        document.getElementById(
            "checkout-modal"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   STYLE DE LA FENÊTRE DE COMMANDE
   ========================================================= */

function ajouterStyleCommande() {

    if (
        document.getElementById(
            "checkout-extra-style"
        )
    ) {

        return;

    }


    const style =
        document.createElement("style");


    style.id =
        "checkout-extra-style";


    style.textContent = `

        #checkout-modal {

            position: fixed;

            inset: 0;

            z-index: 99999;

        }


        .checkout-overlay {

            position: absolute;

            inset: 0;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 25px;

            background:
                rgba(
                    35,
                    27,
                    24,
                    0.72
                );

            backdrop-filter:
                blur(7px);

            overflow-y: auto;

        }


        .checkout-box {

            position: relative;

            width:
                min(
                    620px,
                    100%
                );

            max-height:
                92vh;

            overflow-y: auto;

            background: #f8eeeb;

            border:
                1px solid #e0ccc5;

            padding: 45px;

            box-shadow:
                0 25px 80px
                rgba(
                    0,
                    0,
                    0,
                    0.25
                );

        }


        .checkout-close {

            position: absolute;

            top: 15px;

            right: 20px;

            width: 35px;

            height: 35px;

            border: none;

            background: transparent;

            color: #4b403b;

            font-size: 27px;

            cursor: pointer;

        }


        .checkout-step {

            display: none;

        }


        .checkout-step.active {

            display: block;

        }


        .checkout-number {

            display: block;

            margin-bottom: 8px;

            color: #a7865d;

            font-size: 11px;

            letter-spacing: 3px;

        }


        .checkout-step h2 {

            margin:
                0 0 8px;

            font-family:
                Georgia,
                "Times New Roman",
                serif;

            font-size: 32px;

            font-weight: 400;

            color: #29221f;

        }


        .checkout-step > p {

            margin:
                0 0 28px;

            color: #776b65;

            font-size: 13px;

            line-height: 1.6;

        }


        .checkout-form {

            display: flex;

            flex-direction: column;

            gap: 8px;

        }


        .checkout-form label {

            margin-top: 10px;

            color: #514641;

            font-size: 11px;

            letter-spacing: .5px;

        }


        .checkout-form input,

        .checkout-form textarea {

            width: 100%;

            box-sizing: border-box;

            border:
                1px solid #d9c8c1;

            background: white;

            padding:
                13px 14px;

            outline: none;

            font-family: inherit;

            color: #29221f;

        }


        .checkout-form textarea {

            min-height: 80px;

            resize: vertical;

        }


        .checkout-form input:focus,

        .checkout-form textarea:focus {

            border-color: #a7865d;

        }


        .checkout-buttons {

            display: flex;

            justify-content: space-between;

            gap: 15px;

            margin-top: 30px;

        }


        .checkout-next,

        .checkout-confirm,

        .checkout-back {

            padding:
                14px 22px;

            border: 1px solid #29221f;

            cursor: pointer;

            font-size: 10px;

            letter-spacing: 1.4px;

            text-transform: uppercase;

        }


        .checkout-next,

        .checkout-confirm {

            background: #29221f;

            color: #e5c18c;

        }


        .checkout-back {

            background: transparent;

            color: #29221f;

        }


        .checkout-next:hover,

        .checkout-confirm:hover {

            background: #a7865d;

            border-color: #a7865d;

            color: white;

        }


        .checkout-back:hover {

            background: white;

        }


        .payment-options {

            display: flex;

            flex-direction: column;

            gap: 12px;

        }


        .payment-option {

            display: flex;

            align-items: center;

            gap: 13px;

            padding: 17px;

            border:
                1px solid #dfd0ca;

            background: white;

            cursor: pointer;

            transition: .2s;

        }


        .payment-option:hover {

            border-color: #a7865d;

        }


        .payment-option input {

            accent-color: #a7865d;

        }


        .payment-option span {

            font-size: 13px;

            color: #403631;

        }


        .order-summary {

            background: white;

            border:
                1px solid #e2d5cf;

            padding: 20px;

        }


        .summary-section {

            padding-bottom: 17px;

            margin-bottom: 17px;

            border-bottom:
                1px solid #eee4e0;

        }


        .summary-section:last-child {

            border-bottom: none;

            margin-bottom: 0;

            padding-bottom: 0;

        }


        .summary-section h3 {

            margin:
                0 0 9px;

            color: #a7865d;

            font-size: 10px;

            letter-spacing: 1.5px;

            text-transform: uppercase;

        }


        .summary-section p {

            margin:
                4px 0;

            color: #665953;

            font-size: 12px;

        }


        .summary-product {

            display: flex;

            justify-content: space-between;

            gap: 20px;

            padding: 7px 0;

            color: #5d514c;

            font-size: 12px;

        }


        .summary-product strong {

            color: #29221f;

            font-weight: 500;

        }


        .checkout-total {

            display: flex;

            align-items: center;

            justify-content: space-between;

            margin-top: 20px;

            padding:
                18px 0;

            border-top:
                1px solid #d9c9c3;

        }


        .checkout-total span {

            color: #a7865d;

            font-size: 10px;

            letter-spacing: 2px;

        }


        .checkout-total strong {

            font-family:
                Georgia,
                "Times New Roman",
                serif;

            font-size: 24px;

            font-weight: 400;

            color: #29221f;

        }


        @media (max-width: 600px) {

            .checkout-overlay {

                padding: 12px;

            }


            .checkout-box {

                padding:
                    35px 22px;

            }


            .checkout-buttons {

                flex-direction: column;

            }


            .checkout-next,

            .checkout-confirm,

            .checkout-back {

                width: 100%;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   BOUTON "PASSER LA COMMANDE"
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        afficherPanier();


        const checkoutButton =
            document.getElementById(
                "checkout-btn"
            );


        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                    ouvrirCommande();

                }
            );

        }

    }
);