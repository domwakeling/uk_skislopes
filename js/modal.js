var modal = $('#slopeModal');

var closeSpan = $(".close");

closeSpan.on("click", function() {
    modal.hide();
});

$(document).on("mousedown", function(e) {
    if(modal.is(":visible") && event.target.id == "slopeModal") {
        modal.hide();
    }
})
