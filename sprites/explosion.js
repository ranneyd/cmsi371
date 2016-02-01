"use strict";


var explosion = function ( id, props) {

    var explosionObject = {
        "canvas": document.getElementById(id),
        MAXSTEP: props.MAXSTEP !== undefined ? props.MAXSTEP : 100,
        x: props.x !== undefined ? props.x : 0,
        y: props.y !== undefined ? props.y : 0,
        width: props.width !== undefined ? props.width : 300,
        height: props.height !== undefined ? props.height : 300,

        draw: function (step) {
            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            //ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height ); // clear canvas

            var w = this.width * step / this.MAXSTEP,
                h = this.width * step / this.MAXSTEP;

            var drawExplosion = function(ctx, x, y, w, h, color) {
                ctx.beginPath();
                // 10x, 10y
                // -5, -5
                x += w * -0.5;
                y += h * -0.5;
                ctx.moveTo(x, y);

                // 0, -2
                x += w * 0.4;
                y += h * 0.3;
                ctx.lineTo(x, y);

                // 1, -4
                x += w * 0.1;
                y += h * -0.2;
                ctx.lineTo(x, y);

                // 2, -2
                x += w * 0.1;
                y += h * 0.2;
                ctx.lineTo(x, y);

                // 4, -4.5
                x += w * 0.3;
                y += h * -0.25;
                ctx.lineTo(x, y);

                // 2, -1.5
                x += w * -0.2;
                y += h * 0.3;
                ctx.lineTo(x, y);

                // 4, -2
                x += w * 0.2;
                y += h * -0.05;
                ctx.lineTo(x, y);

                // 2, 0
                x += w * -0.2;
                y += h * 0.2;
                ctx.lineTo(x, y);

                // 5, 1
                x += w * 0.3;
                y += h * 0.1;
                ctx.lineTo(x, y);

                // 2, 1
                x += w * -0.3;
                y += h * 0;
                ctx.lineTo(x, y);

                // 5, 3
                x += w * 0.3;
                y += h * 0.2;
                ctx.lineTo(x, y);

                // 1.5, 2
                x += w * -0.35;
                y += h * -0.1;
                ctx.lineTo(x, y);

                // 1, 4
                x += w * -0.05;
                y += h * 0.2;
                ctx.lineTo(x, y);

                // 0, 2.5
                x += w * -0.1;
                y += h * -0.15;
                ctx.lineTo(x, y);

                // -2, 5
                x += w * -0.2;
                y += h * 0.25;
                ctx.lineTo(x, y);

                // -1.5, 2.5
                x += w * 0.05;
                y += h * -0.25;
                ctx.lineTo(x, y);

                // -4.5, 3
                x += w * -0.3;
                y += h * 0.05;
                ctx.lineTo(x, y);

                // -2.5, 0.5
                x += w * 0.2;
                y += h * -0.25;
                ctx.lineTo(x, y);

                // -5, -2
                x += w * -0.25;
                y += h * -0.25;
                ctx.lineTo(x, y);

                // -2.5, -1.5
                x += w * 0.25;
                y += h * 0.05;
                ctx.lineTo(x, y);


                ctx.closePath();

                ctx.fillStyle = color;
                ctx.fill();
            };



            ctx.save();
            
            // Center canvas
            ctx.translate(this.x, this.y );

            drawExplosion(ctx, 0, 0, w, h, "rgb(255, 0, 0)");
            drawExplosion(ctx, 0, 0, w * 0.75, h * 0.75, "rgb(255, 153, 0)");
            drawExplosion(ctx, 0, 0, w * 0.5, h * 0.5, "rgb(255, 255, 0)");

            ctx.beginPath();
            ctx.arc(0, 0, w * .05, h * .05, 0, 2 * Math.PI);
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.fill();

            ctx.restore();





            ctx.restore();
        }
    };

    explosionObject.draw(0);
    return explosionObject;
};
