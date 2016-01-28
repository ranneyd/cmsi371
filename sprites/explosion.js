"use strict";


var explosion = function ( id, x, y, scale) {
    var img = new Image();
    img.src = "explosion.png";

    var explosionObject = {
        "canvas": document.getElementById(id),
        MAXSTEP: 400,
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

            ctx.drawImage(img, 0, 0);
            ctx.scale(this.stepval/this.MAXSTEP , this.stepval/this.MAXSTEP);

            console.log(this.stepval);
            console.log(this.stepval/this.MAXSTEP);

            ctx.restore();
        }
    };

    explosionObject.draw();
    return explosionObject;
};