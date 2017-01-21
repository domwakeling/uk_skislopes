var modal = $('#slopeModal');

var closeSpan = $(".close");

closeSpan.on("click", function() {
    modal.hide();
});

$(document).on("mousedown", function() {
    if (event.target != modal && modal.is(":visible")) {
        modal.hide();
    }
});
