
// Fetch data from Firestore collection "services"
$(document).ready(function () {
    let page;
    const currentLocation = window.location.pathname;
    page = currentLocation.includes("index") ? 1 : 0;
    console.log(page);

    page === 0 ?
        db.collection("services").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var serviceHTML = `
                <div class="col-md-4 col-sm-6" id="${doc.id}">
                    <div class="event-box">
                        <img src="${doc.data().imageUrl}" alt="">
                        <h4>${doc.data().name}</h4>
                        <p class="raises"><span>Raised : $${doc.data()?.raised}</span> / $${doc.data().target ? doc.data().target : 10000}</p>
                        <p class="desic">${doc.data().description}</p>
                        <button class="btn btn-success btn-sm donate">Donate Now</button>
                    </div>
                </div>`;
                document.getElementById("services").innerHTML += serviceHTML;
            });
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        }) :

        db.collection("services").orderBy("raised", "desc")
            .limit(3).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    var serviceHTML = `
                <div class="col-md-4 col-sm-6" id="${doc.id}">
                    <div class="event-box">
                        <img src="${doc.data().imageUrl}" alt="">
                        <h4>${doc.data().name}</h4>
                        <p class="raises"><span>Raised : $${doc.data()?.raised}</span> / $${doc.data().target ? doc.data().target : 1000000}</p>
                        <p class="desic">${doc.data().description}</p>
                        <button class="btn btn-success btn-sm donate">Donate Now</button>
                    </div>
                </div>`;
                    document.getElementById("services").innerHTML += serviceHTML;
                });
            }).catch((error) => {
                console.log("Error getting documents: ", error);
            })

    $("#services").on("click", ".donate", function () {
        var serviceId = $(this).closest(".event-box").parent().attr("id");
        window.location.href = "donation.html?id=" + serviceId;
    });






    //   remove create event button if  not authenticated
    if (localStorage.getItem("userId") === null) {
        $("#create-event").remove();
    }

    // creating new event (service) in Firestore
    $("#saveEventBtn").on("click", function () {
        $("#loader-overlay").show().css("display", "flex");

        var eventName = $("#eventName").val();
        var eventDescription = $("#eventDescription").val();
        var eventTarget = $("#eventTarget").val();
        var eventImage = $("#eventImage").prop("files")[0];

        // Reference to Firebase Storage
        var storageRef = firebase.storage().ref();

        // Upload image to Firebase Storage
        var imageRef = storageRef.child("event_images/" + eventImage.name);
        console.log(imageRef);
        imageRef
            .put(eventImage)
            .then(function (snapshot) {
                return imageRef.getDownloadURL();
            })
            .then(function (imageUrl) {
                return db.collection("services").add({
                    name: eventName,
                    description: eventDescription,
                    raised: 0.0,
                    target: parseFloat(eventTarget),
                    imageUrl: imageUrl,
                });
            })
            .then(function (docRef) {
                $("#loader-overlay").hide();
                alert("Event added successfully");
                $("#addEventModal").modal("hide");
            })
            .catch(function (error) {
                $("#loader-overlay").hide();
                console.error("Error adding document: ", error);
            });
    });
});
