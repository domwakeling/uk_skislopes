var TOUCH_NONE = 0;
var TOUCH_DRAG = 1;
var TOUCH_ZOOM = 2;

var mouseOrig;
var mouseCurr;
var touchOrig = [];
var touchCurr = [];
var anglesCurr = [4.5, -54.65, -2];
var zoomOrig;
var zoomCurr = 3400; // works with 450-wide, change in main.js for viewport size
var zoomMin = 3400; // works with 450-wide, change in main.js for viewport size
var zoomMax = 10000;
var mSc = 20; //mouse scale for rotations - higher = less sensitive
var zoomFacMouse = 200; // factor for zoom sensitivity (higher = less sensitive)
var zoomFacTouch = 0.6; // factor for touch zoom, fraction, lower = less senstive

var touchMode = TOUCH_NONE;

// arbitrary values here, they will be replaced once document loads
var width = 450;
var height = 550;

var transOrig = [width / 2, height / 2];
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
    .attr("height", height)
    .attr("overflow", "hidden");

var g = chart.append("g");

// define tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// URLs for [1] a 110-m map stored locally and [2] the slopes data stored locally
var url1 = "data/world.json"
var url2 = "data/skislopes.json"

// queue no longer used; instead load map data locally (pretty immediate) and
// then load the remote data; means that map will be visible and cuts down
// perceived loading time

d3.json(url1, function(error, topology) {
    if(error) {
        console.log(error);
        throw error;
    }
    renderMap(topology);
    d3.json(url2, function(error, slopes) {
        if(error) {
            console.log(error);
            throw error;
        }
        renderSlopes(slopes);
        $('#spinner').hide();
    });

});

function renderMap(topology) {
    g.selectAll("path.country")
        .data(topology.features)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return (d.properties.ADMIN == "United Kingdom") ? "country" : "country_dim";
        })
        .attr("d", path);

    chart.on("mousedown", mouseDown)
        .on("mousewheel", zoomed);

    d3.select(window)
        .on("mousemove", mouseMoved)
        .on("mouseup", mouseUp);
}

function renderSlopes(slopes) {

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
        .attr("id", function(d) {return d.location})
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
    zoomCurr *= (zoomFacMouse - d3.event.deltaY) / zoomFacMouse;
    zoomCurr = Math.min(zoomMax, Math.max(zoomMin, zoomCurr));
    projection.scale(zoomCurr);
    if (zoomCurr < zoomOrig) {
        var tempTransX = transOrig[0] - 0.5 * (transOrig[0] - transCurr[0]) * (zoomCurr - zoomMin) / zoomMin;
        var tempTransY = transOrig[1] - 0.5 * (transOrig[1] - transCurr[1]) * (zoomCurr - zoomMin) / zoomMin;
        transCurr = [tempTransX, tempTransY];
        projection.translate(transCurr);
    }
    refresh();
    zoomOrig = zoomCurr;
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

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < touchOrig.length; i++) {
    var id = touchOrig[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}

function handleStart(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    var elem = touches[0].srcElement ? touches[0].srcElement : (touches[0].target ? touches[0].target : null);
    // react if this is a simple touch on a slope
    if (touchMode == TOUCH_NONE && touches.length == 1 & /slopes/.test(elem.className.baseVal)) {
        // make a simulated mouse touch and pass it down to the target
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent("mousedown", true, true, window, 1,
                                  touches[0].screenX, touches[0].screenY,
                                  touches[0].clientX, touches[0].clientY, false,
                                  false, false, false, 0/*left*/, null);
        touches[0].target.dispatchEvent(simulatedEvent);
    } else {
        // check if we're starting from fresh
        if (touchMode == TOUCH_NONE && touchOrig.length == 0) {
            // check number of touches, set mode and store info
            if (touches.length == 1) {
                touchMode = TOUCH_DRAG;
                touchOrig.push(copyTouch(touches[0]));
                touchCurr.push(copyTouch(touches[0]));
            } else if (touches.length == 2) {
                touchMode = TOUCH_ZOOM;
                touchOrig.push(copyTouch(touches[0]));
                touchOrig.push(copyTouch(touches[1]));
                touchCurr.push(copyTouch(touches[0]));
                touchCurr.push(copyTouch(touches[1]));
            }
        } else if(touchMode == TOUCH_DRAG && touches.length == 1) {
            // we have a second touch, convert to zoom mode
            touchOrig.push(copyTouch(touches[0]));
            touchCurr.push(copyTouch(touches[0]));
            zoomOrig = zoomCurr;
            touchMode = TOUCH_ZOOM;
        }
    }
}

function handleMove(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    // cycle through the touches and update stored info
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0 && idx < touchMode) {
            // swap in the new touch
            touchCurr.splice(idx, 1, copyTouch(touches[i]));
        }
    }
    // now use the info
    if (touchMode == TOUCH_DRAG) {
        updateTouchDrag();
    } else if(touchMode == TOUCH_ZOOM)
        updateTouchZoom();
}

function handleEnd(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        var idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0 && idx < touchMode) {
            // we're lifting a finger which is registered at the moment; all done
            if (touchMode == TOUCH_DRAG) {
                transCurr = [transCurr[0] + touchCurr[0].pageX - touchOrig[0].pageX,
                             transCurr[1] + touchCurr[0].pageY - touchOrig[0].pageY];
            }
            touchCurr = [];
            touchOrig = [];
            touchMode = TOUCH_NONE;
        }
    }
}

function handleCancel(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.splice(i, 1);
    }
}

function updateTouchDrag() {
    projection.translate([transCurr[0] + touchCurr[0].pageX - touchOrig[0].pageX,
                          transCurr[1] + touchCurr[0].pageY - touchOrig[0].pageY]);
    refresh();
}

function distanceBetween(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.pageX - pointB.pageX,2) + Math.pow(pointA.pageY - pointB.pageY,2));
}

function updateTouchZoom() {
    var distOrig = distanceBetween(touchOrig[0], touchOrig[1]);
    var distCurr = distanceBetween(touchCurr[0], touchCurr[1]);
    zoomCurr = zoomOrig * distCurr / distOrig;
    zoomCurr = Math.min(zoomMax, Math.max(zoomMin, zoomCurr));
    if (zoomCurr < zoomOrig) {
        var tempTransX = transOrig[0] - 0.5 * (transOrig[0] - transCurr[0]) * (zoomCurr - zoomMin) / zoomMin;
        var tempTransY = transOrig[1] - 0.5 * (transOrig[1] - transCurr[1]) * (zoomCurr - zoomMin) / zoomMin;
        transCurr = [tempTransX, tempTransY];
        projection.translate(transCurr);
    }
    projection.scale(zoomCurr);
    refresh();
}

function refresh() {
    chart.selectAll("path").attr("d", path);
}
