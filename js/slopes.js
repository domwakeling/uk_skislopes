var mouseOrig;
var mouseCurr;
var anglesCurr = [4.5, -54.65, -2];
var zoomCurr = 3250; // works with 450-wide, change in main.js for viewport size
var zoomMin = 3250; // works with 450-wide, change in main.js for viewport size
var zoomMax = 10000;
var mSc = 20; //mouse scale for rotations - higher = less sensitive
var zoomFac = 200; // factor for zoom sensitivity (higher = less sensitive)

// arbitrary values here, they will be replaced once document loads
var width = 450;
var height = 550;

var transCurr = [width / 2, height / 2];

var projection = d3.geoMercator()
    .scale(zoomCurr)
    .clipAngle(90)
    .translate([width / 2, height / 2])
    .rotate(anglesCurr);

var path = d3.geoPath()
    .projection(projection);

var circle = d3.geoCircle();

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

var g = chart.append("g");

// define tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// URLs for [1] a 110-m map stored in a GitHub repo and [2] the slopes data in a GitHub repo
var url1 = "https://raw.githubusercontent.com/domwakeling/uk_skislopes/master/data/world.json";
var url2 = "https://raw.githubusercontent.com/domwakeling/uk_skislopes/master/data/skislopes.json";

d3.queue(2)
    .defer(d3.json, url1)
    .defer(d3.json, url2)
    .await(function(error, topology, slopes) {
        if (error) {
            console.log(error);
            throw error;
        }
        renderMap(topology, slopes);
    });

function renderMap(topology, slopes) {
    console.log(topology);
    console.log(slopes);
    g.selectAll("path.country")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("d", path);

    chart.on("mousedown", mouseDown)
        .on("mousewheel", zoomed);

    d3.select(window)
        .on("mousemove", mouseMoved)
        .on("mouseup", mouseUp);

    renderslopes(slopes);
}

function renderslopes(slopes) {

    var slopesFixed = slopes.features.filter(function(d) {
        return d.geometry != null
    }); // remove anything with no coordinates

    g.selectAll("path.slopes")
        .data(slopesFixed)
        .enter()
        .append("path")
        .datum(function(d) {
            var slopeObj = circle.radius(0.065).center(d.geometry.coordinates)();
            slopeObj.location = d.properties.location;
            slopeObj.name = d.properties.name;
            slopeObj.slopeType = d.properties.slopeType;
            slopeObj.surface = d.properties.surface;
            slopeObj.address = d.properties.address.replace(/\n/g, '<br/>');
            slopeObj.slopeURL = d.properties.slopeURL;
            return slopeObj;
        })
        .attr("class", "slopes")
        .attr("class", function(d) {return "slopes " + d.slopeType})
        .attr("d", path)

        .on("mousedown", function(slopeObj) {
            $('#modalTitle').html('<strong>' + slopeObj.name + '</strong>');
            $('#modalSurface').html(slopeObj.surface);
            $('#modalAddress').html(slopeObj.address);
            $('#modalURL').html('<a href="' + slopeObj.slopeURL + '" target="_blank">Link</a>');
            setTimeout(function() {
                modal.show()
            }, 50);
        })

        .on("mouseover", function(d) {
            var str = d.location;
            div.transition()
                .duration(200)
                .style("opacity", 1.0);
            div.html(str)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
}

function zoomed() {
    d3.event.preventDefault();
    zoomCurr *= (zoomFac + d3.event.deltaY) / zoomFac;
    zoomCurr = Math.min(zoomMax, Math.max(zoomMin, zoomCurr));
    projection.scale(zoomCurr);
    refresh();
}

function mouseDown() {
    if (d3.event.target.classList.contains("slopes")) {
        // code on the path will deal with the event so intercept it here
    } else {
        mouseOrig = [d3.event.pageX, d3.event.pageY];
        anglesOrig = [anglesCurr[0], anglesCurr[1], anglesCurr[2]];
        d3.event.preventDefault();
    }
}

function mouseMoved() {
    if (mouseOrig) {
        mouseCurr = [d3.event.pageX, d3.event.pageY];
        projection.translate([transCurr[0] + mouseCurr[0] - mouseOrig[0], transCurr[1] + mouseCurr[1] - mouseOrig[1]]);
        refresh();
    }
}

function mouseUp() {
    if (mouseOrig) {
        mouseMoved();
        transCurr = [transCurr[0] + mouseCurr[0] - mouseOrig[0], transCurr[1] + mouseCurr[1] - mouseOrig[1]];
        mouseOrig = null;
    }
}

function refresh() {
    chart.selectAll("path").attr("d", path);
}
