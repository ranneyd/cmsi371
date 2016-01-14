"use strict";

/* neko takes the id of a canvas element and x/y coordinates and creates a neko
girl sprite inside in it at those coordinates. It returns an object with
references to functions that allow manipulation of the neko girl*/

var neko = function ( id, x, y ) {
    var nekoObject = {
        "canvas": document.getElementById(id),
        init: function () {
            var ctx = this.canvas.getContext( "2d" );

            ctx.fillStyle = "rgb(200,0,0)";
            ctx.fillRect (10, 10, 55, 50);

            // Triangle

            var triangle = new Path2D("M75 50 l 25 -25 v 50 Z");
            ctx.fill(triangle);

            // circle

            ctx.arc( 70, 100, 20, 0, 2*Math.PI)
            ctx.fill();
        }
    };

    nekoObject.init();
    return nekoObject;
};