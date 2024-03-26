$(document).ready(function () {
    /**** *******************************************************************DONATION FUNCTIONALITY ***********************/
    const serviceId = window.location.search.split("=")[1];

    console.log("serviceId: ", serviceId);
    // Handle donation method selection
    $("#donation-method").change(function () {
        var selectedOption = $(this).val();
        if (selectedOption === "mobile-money") {
            $(".credit-card-fields").hide();
            $(".mobile-money-fields").show();
        } else {
            $(".mobile-money-fields").hide();
            $(".credit-card-fields").show();
        }
    });
    // Stripe setup
    var stripe = Stripe(
        "pk_test_51OvIzTRtDHBqT6m5oJVMiv5uh5nLiQgfwopl8dFtlW7n8y6mo3PVkWQjHTsfIXG5Ic52PmL3G2m0Zs9p06wpCqiL00fMuokwca"
    );
    var elements = stripe.elements();
    var card = elements.create("card");

    // Mount card element
    card.mount("#card-element");

    // Handle real-time validation errors from the card Element
    card.addEventListener("change", function (event) {
        var displayError = document.getElementById("card-errors");
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = "";
        }
    });

    // Handle form submission
    $("#donation-form").on("submit", function (event) {
        event.preventDefault();
        let service;
        if (serviceId) {
            service = db.collection("services").doc(serviceId);
        }

        var $form = $(this);
        $("#submit-button").prop("disabled", true);

        // Show loader
        $("#loader-overlay").show().css("display", "flex");

        stripe
            .createPaymentMethod({
                type: "card",
                card: card,
            })
            .then(function (result) {
                if (result.error) {
                    var errorElement = document.getElementById("card-errors");
                    errorElement.textContent = result.error.message;
                    $("#submit-button").prop("disabled", false);
                    // Hide loader on error
                    $("#loader-overlay").hide();
                } else {
                    $.ajax({
                        url: "https://mustard-donor.onrender.com/charge",
                        method: "POST",
                        data: {
                            payment_method_id: result.paymentMethod.id,
                            amount: $("#amount").val(),
                            service: service ? service.name : "general",
                            name: $("name").val(),
                            email: $("email").val(),
                            address: $("address").val(),
                            phone: $("phone").val(),
                        },

                        success: function (response) {
                            // update amount raised of service in Firestore
                            try {
                                service.get().then((doc) => {
                                    if (doc.exists) {
                                        service.update({
                                            raised: doc.data().raised + parseInt($("#amount").val()),
                                        });
                                    } else {
                                        console.log("No such document!");
                                    }
                                });
                            } catch (error) {
                                console.error("Error getting document:", error);
                            }
                            service.update({
                                raised: firebase.firestore.FieldValue.increment(
                                    parseInt($("#amount").val())
                                ),
                            });

                            // Show success modal
                            $("#successModal").modal("show");
                            // Reset form
                            $form.trigger("reset");
                            $("#submit-button").prop("disabled", false);
                            // Hide loader on success
                            $("#loader-overlay").hide();
                        },
                        error: function (xhr, status, error) {
                            console.error(xhr.responseText);
                            alert("Error occurred. Please try again.");
                            $("#submit-button").prop("disabled", false);
                            // Hide loader on error
                            $("#loader-overlay").hide();
                        },
                    });
                }
            });
    });
});
