"use strict";

/*
    prop        | default
    ------------------------
    textColorR  | 0
    textColorG  | 0
    textColorB  | 0
    backColorR  | 0
    backColorG  | 0
    backColorB  | 0
    compColorR  | 100
    compColorG  | 100
    compColorB  | 100
*/

var computer = function ( ctx, props ) {
    // So javascript doesn't freak out if no props are passed
    props = props || {};

    ctx.save();

    var w         = 200,
        h         = 200,
        textColorR = props.textColorR || 0,
        textColorG = props.textColorG || 0,
        textColorB = props.textColorB || 0,
        backColorR = props.backColorR || 0,
        backColorG = props.backColorG || 0,
        backColorB = props.backColorB || 0,
        compColorR = props.compColorR || 100,
        compColorG = props.compColorG || 100,
        compColorB = props.compColorB || 100;


    // I want to center around the origin, but I want to work as if the origin is in the
    // upper left
    ctx.translate( -w / 2 , -h / 2 );

    ctx.fillStyle  = 'rgb(' + compColorR + ', '
                            + compColorG + ', '
                            + compColorB + ')';

    var standWidth   = .3,
        standHeight  = .1,
        baseWidth    = .5,
        baseHeight   = .05,
        screenHeight = 1 - standHeight -  baseHeight,
        bezel        = .05;

    // Screen
    ctx.fillRect( 0, 0, w, h * screenHeight );
    // Stand neck
    ctx.fillRect( w * (1 - standWidth) / 2, 
                  h * screenHeight,
                  w * standWidth,
                  h * standHeight );
    // Stand base
    ctx.fillRect( w * (1 - baseWidth) / 2,
                  h * (1 - baseHeight),
                  w * baseWidth,
                  h * baseHeight );

    // Magic number found empirically to produce the right size of text
    ctx.font = w / 8 + "px Arial";
    ctx.textAlign = "center";

    ctx.fillStyle = 'rgb(' + backColorR + ', '
                           + backColorG + ', '
                           + backColorB + ')';

    // The actual screen
    ctx.fillRect( w * bezel,
                  w * bezel,
                  w * (1 - 2 * bezel),
                  h * (screenHeight - bezel - bezel) );

    ctx.fillStyle = 'rgb(' + textColorR + ', '
                           + textColorG + ', '
                           + textColorB + ')';

    ctx.fillText( "DANK MEMES", w / 2, h * screenHeight / 2 );

    ctx.restore();
};
