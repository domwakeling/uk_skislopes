var rootURL = "https://uk-slope-server.herokuapp.com/search/";

function tableFromSlopeInfo(slopeObj) {
    var retStr = '<tr class="table-head"><td colspan="2"><strong>' + slopeObj.properties.name + '</strong></td></tr>';
    retStr = retStr + '<tr class="table-content">';
    retStr = retStr + '<td class="table-cat">Surface</td>';
    retStr = retStr + '<td class="cell-content">' + slopeObj.properties.surface + '</td></tr>';
    retStr = retStr + '<tr class="table-content"><td class="table-cat">Address</td>';
    retStr = retStr + '<td class="cell-content">' + slopeObj.properties.address + '</td>';
    retStr = retStr + '</tr><tr class="table-content table-content-last">';
    retStr = retStr + '<td class="table-cat">Website</td>';
    retStr = retStr + '<td class="cell-content">' + slopeObj.properties.slopeURL + '</td>';
    retStr = retStr + '</tr>';

    return retStr;
}


function startSearch() {
    var searchStr = $('#search-bar').val();
    if(!/^\s*$/.test(searchStr)) { //checks not empty
        var url = rootURL + searchStr;
        $.getJSON(url, function(data){
            if(!data || data == []) {
                $('.content-main').html("No slopes within 50 miles")
            } else {
                data.sort(function(a,b) {return a.distance > b.distance});
                var currHTML = '<table>';
                for (var i=0; i<data.length; i++) {
                    console.log(data[i]);
                    currHTML = currHTML + tableFromSlopeInfo(data[i]);
                }
                currHTML = currHTML + '</table>';
                $('.content-main').html(currHTML);
            }
        });
    }
}

$(document).ready(function() {

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

});
