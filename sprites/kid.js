"use strict";

/*
    prop           | default
    ---------------------------------------
    hairColor      | "rgb( 139, 69, 19 )"
    skinColor      | "rgb( 255, 255, 0 )"
    eyeColor       | "rgb( 0, 255, 255 )"
    eyeRedness     | 0  // percentage
    mouthXOffset   | 0  // pixels
    mouthYOffset   | 0  // pixels
    eyeSpreadDelta | 0  // pixels, representing increased distance between eyes
    eyeYOffset     | 0  // pixels
*/

var kid = function (ctx, props) {

    var ellipse = function( x, y, w, h, half ) {
        //http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
        var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w,           // x-end
            ye = y + h,           // y-end
            xm = x + w / 2,       // x-middle
            ym = y + h / 2;       // y-middle

        ctx.beginPath();
        ctx.moveTo( x, ym );
        ctx.bezierCurveTo( x, ym - oy, xm - ox, y, xm, y );
        ctx.bezierCurveTo( xm + ox, y, xe, ym - oy, xe, ym );
        if ( !half ) {
            ctx.bezierCurveTo( xe, ym + oy, xm + ox, ye, xm, ye );
            ctx.bezierCurveTo( xm - ox, ye, x, ym + oy, x, ym );
        }

        ctx.fill();
    };

    // So javascript doesn't freak out if no props are passed
    props = props || {};

    ctx.save();

    var w              = props.width          || 200,
        h              = props.height         || 260,
        skinColor      = props.skinColor      || "rgb( 139, 69, 19 )",
        hairColor      = props.hairColor      || "rgb( 255, 255, 0 )",
        eyeColor       = props.eyeColor       || "rgb( 0, 255, 255 )",
        eyeRedness     = props.eyeRedness     || 0,
        mouthXOffset   = props.mouthXOffset   || 0,
        mouthYOffset   = props.mouthYOffset   || 0,
        eyeSpreadDelta = props.eyeSpreadDelta || 0,
        eyeYOffset     = props.eyeYOffset     || 0;

    // I want to center around the origin, but I want to work as if the origin is in the
    // upper left
    ctx.translate( -w / 2 , -h / 2 );


    // head
    ctx.fillStyle = hairColor;
    ellipse( 0, 0, w, h );

    // eyebrows
    var browMargin = w * .05 - eyeSpreadDelta / 2,
        browY = h * .4 + eyeYOffset,
        browW = w * .35,
        browH = h*.02;

    ctx.fillStyle = skinColor;

    // left
    ctx.fillRect(browMargin, browY, browW, browH);
    // right
    ctx.fillRect(w - browMargin - browW, browY, browW, browH);

    // Hair
    ellipse ( 0, 0, w, h * .75, true );

    ctx.fill();

    // eyes 

    // Eyes get redder based on an eyeRedness percentage. The minimum amount of redness is
    // rgb(255, 153, 153). We start at rgb(255, 255, 255) (white) and work our way to red
    // from there

    var rednessRGBValue = 0 | 255 - 153 * eyeRedness / 100
    ctx.fillStyle = "rgb( 255, " + rednessRGBValue + ", " + rednessRGBValue + ")";

    var eyeW = w * .35,
        eyeH = eyeW,
        eyeY = h * .43 + eyeYOffset,
        eyeMargin = w * .05 - eyeSpreadDelta / 2;

    // left
    ellipse( eyeMargin, eyeY, eyeW, eyeH );
    // right
    ellipse( w - eyeMargin - eyeW, eyeY, eyeW, eyeH );

    // Irises
    ctx.fillStyle = eyeColor;

    // left
    ellipse( eyeMargin + eyeW/4,
             eyeY + eyeH/4,
             eyeW/2, 
             eyeH/2);
    // right
    ellipse( w - eyeMargin - eyeW*0.75,
             eyeY + eyeH/4,
             eyeW/2,
             eyeH/2 );

    // pupils
    ctx.fillStyle = "rgb( 0, 0, 0 )";

    // left
    ellipse( eyeMargin + eyeW/3,
             eyeY + eyeH/3,
             eyeW/3, 
             eyeH/3);
    // right
    ellipse( w - eyeMargin - eyeW*.66,
             eyeY + eyeH/3,
             eyeW/3,
             eyeH/3 );

    // mouth

    var mouthW = w * .4,
        mouthR = mouthW / 2,
        mouthX = w / 2 + mouthXOffset,
        mouthY = h * .75 + mouthYOffset;

    ctx.moveTo( mouthX, mouthY );

    ctx.beginPath();

    ctx.arc( mouthX, mouthY, mouthR,  Math.PI, 0, true );

    ctx.closePath();

    ctx.fillStyle = "rgb( 255, 0, 0 )";

    ctx.fill();

    ctx.restore();
};