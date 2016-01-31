"use strict";


var computer = function ( id, props) {

    var computerObject = {
        "canvas": document.getElementById(id),
        period:  props.period !== undefined ? props.period : 10,
        x: props.x !== undefined ? props.x : 0,
        y: props.y !== undefined ? props.y : 0,
        width: props.width !== undefined ? props.width : 200,
        height: props.height !== undefined ? props.height : 250,

        draw: function (step) {
            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            // This will get weirder as time progresses
            var w = this.width,
                h = this.height;

            // Center our origin
            ctx.translate(this.x, this.y);

            ctx.fillStyle  = "rgb(150, 150, 150)";
            ctx.fillRect(0, 0, w, h);

            ctx.restore();
        }
    };

    computerObject.draw(0);
    return computerObject;
};