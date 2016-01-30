"use strict";


var kid = function ( id, props) {

    var ellipse = function(ctx, x, y, w, h){
        //http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

        ctx.fill();
    };
    var kidObject = {
        "canvas": document.getElementById(id),
        MAXSTEP: props.maxstep !== undefined ? props.maxstep : 100,
        x: props.x !== undefined ? props.x : 0,
        y: props.y !== undefined ? props.y : 0,
        width: props.width !== undefined ? props.width : 200,
        height: props.height !== undefined ? props.height : 260,
        hair: props.hair !== undefined ? props.hair : "rgb( 139, 69, 19 )",
        skin: props.skin !== undefined ? props.skin : "rgb( 255, 255, 0 )",
        eyeColor: props.eyeColor !== undefined ? props.eyeColor : "rgb( 0, 255, 255 )",

        draw: function (step) {
            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height ); // clear canvas

            var w = this.width + 100 * step / this.MAXSTEP,
                h = this.height;

            // Center our origin
            ctx.translate(this.x + w / 2, this.y +h / 2);


            ctx.rotate(2 * Math.PI * step / this.MAXSTEP);

            ctx.translate(- w / 2 , - h / 2);


            // head
            ctx.fillStyle = this.skin;

            ellipse( ctx, 0, 0, w, h );

            // eyebrows

            var browMargin = w * .05,
                browY = h * .4,
                browW = w * .35,
                browH = h*.02;

            ctx.fillStyle = this.hair;

            ctx.fillRect(browMargin, browY, browW, browH);

            ctx.fillRect(w - browMargin - browW, browY, browW, browH);

            // Hair


            ctx.moveTo( 0, h*.3);

            ctx.beginPath(); 

            ctx.arc(w/2, w/2, w/2, Math.PI, 0);

            ctx.closePath();


            ctx.fill();


            // eyes
            ctx.fillStyle = "rgb(255, 255, 255)";

            var eyeW = w * .35,
                eyeH = eyeW,
                eyeY = h * .43,
                eyeMargin = w * .05;

            ellipse( ctx, eyeMargin, eyeY, eyeW, eyeH );

            ellipse( ctx, w - eyeMargin - eyeW, eyeY, eyeW, eyeH );

            ctx.fillStyle = this.eyeColor;

            ellipse( ctx, 
                     eyeMargin + eyeW/4,
                     eyeY + eyeH/4,
                     eyeW/2, 
                     eyeH/2);

            ellipse( ctx, 
                     w - eyeMargin - eyeW*0.75,
                     eyeY + eyeH/4,
                     eyeW/2,
                     eyeH/2 );

            ctx.fillStyle = "rgb( 0, 0, 0 )";

            ellipse( ctx, 
                     eyeMargin + eyeW/3,
                     eyeY + eyeH/3,
                     eyeW/3, 
                     eyeH/3);

            ellipse( ctx, 
                     w - eyeMargin - eyeW*.66,
                     eyeY + eyeH/3,
                     eyeW/3,
                     eyeH/3 );

            // mouth


            var mouthW = w * .4,
                mouthR = mouthW / 2,
                mouthX = w / 2,
                mouthY = h * .75;

            ctx.moveTo(mouthX, mouthY);

            ctx.beginPath();

            ctx.arc(mouthX, mouthY, mouthR,  Math.PI, 0, true);

            ctx.closePath();

            ctx.fillStyle = "rgb( 255, 0, 0 )";

            ctx.fill();

            ctx.restore();
        }
    };

    kidObject.draw(0);
    return kidObject;
};