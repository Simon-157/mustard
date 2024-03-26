$(document).ready(function () {
    const beneficiariesRef = db.collection("beneficaries");

    // Fetching beneficiaries

    beneficiariesRef
        .get()
        .then((querySnapshot) => {
            const beneficiariesContainer = document.getElementById(
                "beneficiaries-container"
            );
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const beneficiaryHtml = `
                <div class="col-md-3 col-sm-6" id="${doc.id}">
                    <div class="single-usr benCont">
                        <img src="${data.imageUrl}" alt="">
                        <div class="det-o">
                            <h4 class="beneficiary-name">${data.firstname} ${data.lastname}</h4>
                            <i class="beneficiary-email">${data.email}</i>
                            <button type="button" class="btn btn-success btn-sm help-beneficiary-btn" 
                                data-toggle="modal" data-target="#helpModal"
                                onClick="window.handleHelpClick('${data.firstname} ${data.lastname}', '${data.email}')">
                                Click to help
                            </button>


                        </div>
                    </div>
                </div>`;
                beneficiariesContainer.insertAdjacentHTML("beforeend", beneficiaryHtml);
            });
        })
        .catch((error) => {
            console.error("Error fetching beneficiaries: ", error);
        });

    //   remove create event button if  not authenticated
    if (localStorage.getItem("userId") === null) {
        $("#create-beneficiary").remove();
    }

    // creating new event (service) in Firestore
    $("#saveBeneficiaryBtn").on("click", function () {
        $("#loader-overlay").show().css("display", "flex");

        var lname = $("#fname").val();
        var fname = $("#lname").val();
        var p_email = $("#p_email").val();
        var personImg = $("#personImg").prop("files")[0];

        // Reference to Firebase Storage
        var storageRef = firebase.storage().ref();

        // Upload image to Firebase Storage
        var imageRef = storageRef.child("beneficiary_images/" + personImg.name);
        console.log(imageRef);
        imageRef
            .put(personImg)
            .then(function (snapshot) {
                return imageRef.getDownloadURL();
            })
            .then(function (imageUrl) {
                return db.collection("beneficaries").add({
                    firstname: fname,
                    lastname: lname,
                    email: p_email,
                    imageUrl: imageUrl,
                });
            })
            .then(function (docRef) {
                $("#loader-overlay").hide();
                alert("Beneficiary added successfully");
                $("#addBeneficiaryModal").modal("hide");
            })
            .catch(function (error) {
                $("#loader-overlay").hide();
                console.error("Error adding document: ", error);
            });
    });



    /****************************************************** HELP BENEFICIARY CONTROLLER */
    var beneficiaryName ;
    var beneficiaryEmail;
   window.handleHelpClick = function(name, email) {
    $("#helpModal .modal-title").text(`Help ${name}`);
    $("#helpModal .modal-body p").text(`Email: ${email}`);

    beneficiaryName = name;
    beneficiaryEmail = email;
}

    $("#helpBtn").click(function (event) {
        event.preventDefault();

        // Show loader
        $("#loader-overlay").show().css("display", "flex");

        // Remove any existing error messages
        $(".error-message").remove();

        // Form validation
        var name = $("#h_name").val();
        var email = $("#h_email").val();
        var phone = $("#h_phone").val();



        // Regular expressions for validation
        var nameRegex = /^[a-zA-Z\s]+$/;
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        var phoneRegex = /^\d{10}$/;

        if (!nameRegex.test(name)) {
            $("#h_name").after(
                '<div class="error-message text-danger">Please enter a valid name</div>'
            );
            $("#loader-overlay").hide(); // Hide loader
            return;
        }

        if (!emailRegex.test(email)) {
            $("#h_email").after(
                '<div class="error-message text-danger">Please enter a valid email address</div>'
            );
            $("#loader-overlay").hide(); // Hide loader
            return;
        }

        if (!phoneRegex.test(phone)) {
            $("#h_phone").after(
                '<div class="error-message text-danger">Please enter a valid 10-digit phone number</div>'
            );
            $("#loader-overlay").hide(); // Hide loader
            return;
        }

        // // Validate reCAPTCHA
        // var recaptchaResponse = grecaptcha.getResponse();
        // if (!recaptchaResponse) {
        //   alert("Please complete the CAPTCHA validation");
        //   $("g-recaptcha").after(
        //     '<div class="error-message text-danger">Please complete the CAPTCHA validation</div>'
        //   );
        //   $("#loader-overlay").hide(); // Hide loader
        //   return;
        // }

        // Send form data to backend API
        $.ajax({
            type: "POST",
            url: "https://mustard-donor.onrender.com/help",
            data: {
                helperName: name,
                helperEmail: email,
                helperPhone: phone,
                beneficaryName: beneficiaryName,
                beneficaryEmail: beneficiaryEmail
            },

            success: function (response) {
                // Handle success response
                console.log("Form submitted successfully:", response);
                $("#loader-overlay").hide(); // Hide loader
                $('#helpModal').modal('hide');
                $("#successModal").modal("show");
                $("#helpForm").trigger("reset");
            },
            error: function (xhr, status, error) {
                // Handle error response
                console.error("Error:", error);
                alert("Error submitting form: " + xhr.responseText); // Displaying error message from API response
                $("#loader-overlay").hide(); // Hide loader
            },
        });
    });
});
