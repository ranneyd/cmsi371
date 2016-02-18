"use strict";

/*
    prop        | default
    ------------------------
    useInside   | true               // Have a circle at center of explosion
    insideColor | "black"            // Color of above center
    insideRatio | .05                // Ratio of inner circle to size of whole explosion
    innerRatio  | .5                 // Ratio of inner ring of explosion to outer ring
    innerColor  | "rgb(255, 255, 0)" // Color of above inner ring (yellow)
    middleRatio | .75                // Ratio of middle ring of explosion to outer ring
    middleColor | "rgb(255, 153, 0)" // Color of above middle ring (orange)
    outerColor  | "rgb(255, 0, 0)""  // Color of outer ring of explosion (red)
*/

var explosion = function ( ctx, props ) {
    // So javascript doesn't freak out if no props are passed
    props = props || {};

    ctx.save();

    var w = 200,
        h = 200,
        useInside   = props.useInside === undefined ? true : props.useInside,
        insideRatio = props.insideRatio || .05,
        insideColor = props.insideColor || "black",
        innerRatio  = props.innerRatio  || .5,
        innerColor  = props.innerColor  || "rgb(255, 255, 0)",
        middleRatio = props.middleRatio || .75,
        middleColor = props.middleColor || "rgb(255, 153, 0)",
        outerColor  = props.outerColor  || "rgb(255, 0, 0)";

    var drawExplosion = function( w, h, color ) {
        var x = 0,
            y = 0;

        ctx.beginPath();
        // 10x, 10y
        // -5, -5
        x += w * -0.5;
        y += h * -0.5;
        ctx.moveTo( x, y );

        // 0, -2
        x += w * 0.4;
        y += h * 0.3;
        ctx.lineTo( x, y );

        // 1, -4
        x += w * 0.1;
        y += h * -0.2;
        ctx.lineTo( x, y );

        // 2, -2
        x += w * 0.1;
        y += h * 0.2;
        ctx.lineTo( x, y );

        // 4, -4.5
        x += w * 0.3;
        y += h * -0.25;
        ctx.lineTo( x, y );

        // 2, -1.5
        x += w * -0.2;
        y += h * 0.3;
        ctx.lineTo( x, y );

        // 4, -2
        x += w * 0.2;
        y += h * -0.05;
        ctx.lineTo( x, y );

        // 2, 0
        x += w * -0.2;
        y += h * 0.2;
        ctx.lineTo( x, y );

        // 5, 1
        x += w * 0.3;
        y += h * 0.1;
        ctx.lineTo( x, y );

        // 2, 1
        x += w * -0.3;
        y += h * 0;
        ctx.lineTo( x, y );

        // 5, 3
        x += w * 0.3;
        y += h * 0.2;
        ctx.lineTo( x, y );

        // 1.5, 2
        x += w * -0.35;
        y += h * -0.1;
        ctx.lineTo( x, y );

        // 1, 4
        x += w * -0.05;
        y += h * 0.2;
        ctx.lineTo( x, y );

        // 0, 2.5
        x += w * -0.1;
        y += h * -0.15;
        ctx.lineTo( x, y );

        // -2, 5
        x += w * -0.2;
        y += h * 0.25;
        ctx.lineTo( x, y );

        // -1.5, 2.5
        x += w * 0.05;
        y += h * -0.25;
        ctx.lineTo( x, y );

        // -4.5, 3
        x += w * -0.3;
        y += h * 0.05;
        ctx.lineTo( x, y );

        // -2.5, 0.5
        x += w * 0.2;
        y += h * -0.25;
        ctx.lineTo( x, y );

        // -5, -2
        x += w * -0.25;
        y += h * -0.25;
        ctx.lineTo( x, y );

        // -2.5, -1.5
        x += w * 0.25;
        y += h * 0.05;
        ctx.lineTo( x, y );

        ctx.closePath();

        ctx.fillStyle = color;
        ctx.fill();
    };
    
    drawExplosion( w, h, outerColor );
    drawExplosion( w * middleRatio, h * middleRatio, middleColor );
    drawExplosion( w * innerRatio, h * innerRatio, innerColor );

    if ( insideColor ) {
        ctx.beginPath();

        ctx.arc( 0, 0, w * insideRatio, h * insideRatio, 0, 2 * Math.PI );
        ctx.fillStyle = insideColor;
        ctx.fill();
    }

    ctx.restore();
};
