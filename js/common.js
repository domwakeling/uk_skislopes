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

function setCopyrightYear() {
    var year = new Date().getFullYear();
    $('.copyright').html('<p>&copy; ' + year + ' <a href="http://www.domwakeling.com" target="_blank">Dom Wakeling</a></p>');
}

function copyMenu() {
    var menuItems = $('#navbar-top-menu').html();
    $('#menu-copy').html(menuItems);
}
