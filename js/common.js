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

function Carousel(imgID, imgArr, altArr, urlArr) {

    var counter = 0;
    var $carouselID = $('#' + imgID);
    var fadeTime = 500;
    var pauseTime = 5000;

    var spin = setInterval(function() {

        if (++counter >= urlArr.length) { counter = 0}

        $carouselID.fadeOut(fadeTime, function() {
            $carouselID.attr('href', urlArr[counter]);
            $carouselID.find('img').attr('src', imgArr[counter]);
            $carouselID.find('img').attr('alt', altArr[counter]);
        }).fadeIn(fadeTime);

    }, pauseTime + 2 * fadeTime);

}

var img200 = ['/images/SSE_200.jpg', '/images/SSS_200.jpg', '/images/SSW_200.jpg'];
var img100 = ['/images/SSE_100.jpg', '/images/SSS_100.jpg', '/images/SSW_100.jpg', 'images/YLH_100.png'];
var alt200 = ['Snowsport England', 'Snowsport Scotland', 'Snowsport Wales'];
var alt100 = [...alt200, 'Your Logo Here ...'];
var url200 = ['http://snowsportengland.org.uk/', 'http://www.snowsportscotland.org/', 'http://www.snowsportwales.co.uk/'];
var url100 = [...url200, 'mailto:info@domwakeling.com'];

$(document).ready(function() {
    var car1 = new Carousel('carouselSq', img200, alt200, url200);
    var car2 = new Carousel('carouselWi', img100, alt100, url100);
});
