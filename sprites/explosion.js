"use strict";


var explosion = function ( id, x, y, scale) {
    // var ellipse = function(ctx, x, y, w, h){
    //     //http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
    //     var kappa = .5522848,
    //         ox = (w / 2) * kappa, // control point offset horizontal
    //         oy = (h / 2) * kappa, // control point offset vertical
    //         xe = x + w,           // x-end
    //         ye = y + h,           // y-end
    //         xm = x + w / 2,       // x-middle
    //         ym = y + h / 2;       // y-middle

    //     ctx.beginPath();
    //     ctx.moveTo(x, ym);
    //     ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    //     ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    //     ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    //     ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

    //     ctx.fill();
    // };
    var explosionObject = {
        "canvas": document.getElementById(id),
        MAXSTEP: 200,
        stepval: 0,
        step: function(){
            console.log(this.stepval);
            if(++this.stepval === this.MAXSTEP){
                this.stepval = 0;
            }
        },
        draw: function () {
            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height ); // clear canvas

            var w = 300,
                h = 300;

            

            ctx.restore();
        }
    };

    explosionObject.draw();
    return explosionObject;
};