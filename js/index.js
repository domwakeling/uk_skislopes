var adjH = 20;

$(document).ready(function() {
    setCopyrightYear();
    copyMenu()

    $('.content-main').height(contentHeightForScreenWidth($(window).width()));

    $('#map').on("click", function() {
        window.open('./map.html', '_self');
    });
    $('#search').on("click", function() {
        window.open('./search.html', '_self');
    });

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

$(window).resize(function() {
    $('.content-main').height(contentHeightForScreenWidth($(window).width()));
})
