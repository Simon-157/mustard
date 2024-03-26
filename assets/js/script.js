$(document).ready(function () {
    var w = window.innerWidth;


    if (w > 767) {
        $("#menu-jk").scrollToFixed({
            marginTop: 0,
            minWidth: 768,
        });
    }

    $(".owl-carousel").owlCarousel({
        loop: true,
        margin: 0,
        nav: true,
        autoplay: true,
        dots: true,
        autoplayTimeout: 5000,
        navText: [
            '<i class="fa fa-angle-left"></i>',
            '<i class="fa fa-angle-right"></i>',
        ],
        responsive: {
            0: { items: 1 },
            600: { items: 1 },
            1000: { items: 1 },
        },
    });

    $(".donate").click(function () {
        console.log("donate clicked");
        window.location.href = "donation.html";
    });

    $(".join").click(function () {
        window.location.href = "volunteer.html";
    });

    $(".filter-button").on("click", function () {
        var value = $(this).attr("data-filter");

        $(".filter-button").removeClass("active");
        $(this).addClass("active");

        if (value === "all") {
            $(".filter").show(500);
        } else {
            $(".filter")
                .not("." + value)
                .hide(500);
            $(".filter")
                .filter("." + value)
                .show(500);
        }
    });

});
