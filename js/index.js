const adjH = 20;

function contentHeightForScreenWidth(w) {
    if (w >= 900) {
        return 600;
    } else {
        let windH = $(window).height();
        let adveH = $('.advert').height();
        let mastH = $('.mast-head').height();
        let titlH = $('.content-title').height();
        return windH - adveH - mastH - titlH - adjH;
    }
}

function setCopyrightYear() {
    let year = new Date().getFullYear();
    $('.copyright').html('<p>&copy; ' + year + ' <a href="http://www.domwakeling.com" target="_blank">Dom Wakeling</a></p>');
}

$(document).ready(function() {
    setCopyrightYear();
    $('.content-main').height(contentHeightForScreenWidth($(window).width()));

    $('#map').on("click", function() {
        window.open('./map.html', '_self');
    });
    $('#search').on("click", function() {
        window.open('./search.html', '_self');
    });

});

$(window).resize(function() {
    $('.content-main').height(contentHeightForScreenWidth($(window).width()));
})
