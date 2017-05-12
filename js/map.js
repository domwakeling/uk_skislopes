var adjH = 22;

function contentHeightForScreenWidth(w) {
    if (w >= 900) {
        return 600;
    } else {
        var windH = $(window).height();
        var adveH = $('.advert').height();
        var mastH = $('.mast-head').height();
        var titlH = $('.content-title').height();
        return windH - adveH - mastH - titlH - adjH;
    }
}

function resizeMap() {
    var width = $('.content-map').width();
    var height = $('.content-map').height();
    zoomCurr = Math.min(zoomCurr, zoomCurr * width/450, zoomCurr * height/650);
    zoomMin = zoomCurr;
    zoomOrig = zoomCurr;
    transOrig = [width/2, height/2];
    transCurr = [width/2, height/2];

    projection.scale(zoomCurr).translate([width / 2, height / 2]);

    chart
        .attr("width", width)
        .attr("height", height);
}

function setCopyrightYear() {
    var year = new Date().getFullYear();
    $('.copyright').html('<p>&copy; ' + year + ' <a href="http://www.domwakeling.com" target="_blank">Dom Wakeling</a></p>');
}

function copyMenu() {
    var menuItems = $('#navbar-top-menu').html();
    $('#menu-copy').html(menuItems);
}

$(document).ready(function() {
    setCopyrightYear();
    copyMenu();

    $('.content-map').height(contentHeightForScreenWidth($(window).width()));
    resizeMap();
    var chartDOM = document.getElementsByTagName("svg")[0];
    chartDOM.addEventListener("touchstart", handleStart, false);
    chartDOM.addEventListener("touchend", handleEnd, false);
    chartDOM.addEventListener("touchcancel", handleCancel, false);
    chartDOM.addEventListener("touchmove", handleMove, false);

    // make the menu button work
    $('.menu-toggle-button').click(function() {
        $('.navbar-collapse').slideToggle(200);
        $('.menu-toggle-button').blur()
    })

    $('a.collapse').click(function(e) {
        e.preventDefault();
        $this = $(this);
        $this.next().toggle(200);
    });

});

$(document).on("keydown", function(evt) {
    evt = evt || window.event;
    if (modal.is(":visible")) {
        if ("key" in evt & (evt.key == "Escape" || evt.key == "Esc") ) {
            modal.hide();
        } else if (evt.keyCode == 27) {
            modal.hide();
        }
    }
});

$(window).resize(function() {
    $('.content-map').height(contentHeightForScreenWidth($(window).width()));
    resizeMap();
})
