var adjH = 42;

var rootURL = "https://uk-slope-server.herokuapp.com/search/";

function tableFromSlopeInfo(slopeObj) {
    var retStr = '<tr class="table-head"><td colspan="2"><strong>' + slopeObj.properties.name + '</strong></td></tr>';
    retStr = retStr + '<tr class="table-content">';
    retStr = retStr + '<td class="table-cat">Surface</td>';
    retStr = retStr + '<td class="cell-content">' + slopeObj.properties.surface + '</td></tr>';
    retStr = retStr + '<tr class="table-content"><td class="table-cat">Address</td>';
    retStr = retStr + '<td class="cell-content">' + slopeObj.properties.address + '</td>';
    retStr = retStr + '</tr><tr class="table-content table-content-last">';
    retStr = retStr + '<td class="table-cat">Website</td><td class="cell-content">';
    retStr = retStr + '<a href="' + slopeObj.properties.slopeURL + '" + target="_blank">';
    retStr = retStr + 'Link</a></td></tr>';

    return retStr;
}

function startSearch() {
    var searchStr = $('#search-bar').val();
    if(!/^\s*$/.test(searchStr)) { //checks not empty
        $('#spinner').show()
        var url = rootURL + searchStr;
        $.getJSON(url, function(data){
            if(!data || data == []) {
                $('.content-main').html("No slopes within 50 miles")
                $('#spinner').hide()
            } else {
                var currHTML = '<table>';
                for (var i=0; i<data.length; i++) {
                    currHTML = currHTML + tableFromSlopeInfo(data[i]);
                }
                currHTML = currHTML + '</table>';
                $('.content-main').html(currHTML);
                $('#spinner').hide()
            }
        });
    }
}

$(document).ready(function() {

    setCopyrightYear();
    copyMenu();

    $('.content-main').height(contentHeightForScreenWidth($(window).width()));

    $('#search-btn').on("click", function() {
        this.blur;
        startSearch();
    })

    // this is a repeat of the function for search-button - could tidy it up
    $("#search-bar").on('keyup', function (e) {
        if (e.keyCode == 13) {
            var searchTerm = $('#search-bar').val();
            if (!(/^\s*$/).test(searchTerm)) {  // checks not empty
                startSearch();
                this.blur();
            }
        }
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

    // hide the spinner
    $('#spinner').hide()

});

$(window).resize(function() {
    $('.content-main').height(contentHeightForScreenWidth($(window).width()));
})
