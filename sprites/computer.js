"use strict";

/*
    prop        | default
    ------------------------
    textColor   | "black"
    backColor   | "black"
    compColor   | "rgb(100, 100, 100)"
*/

var computer = function ( id, initial_props ) {

    var computerObject = {
        "canvas": document.getElementById( id ),

        draw: function ( props ) {
            // So javascript doesn't freak out if no props are passed
            props = props || {};

            var ctx = this.canvas.getContext( "2d" );

            ctx.save();

            var w         = 200,
                h         = 200,
                textColor = props.textColor || "black",
                backColor = props.backColor || "black",
                compColor = props.compColor || "rgb(100, 100, 100)";


            // I want to center around the origin, but I want to work as if the origin is in the
            // upper left
            ctx.translate( -w / 2 , -h / 2 );

            ctx.fillStyle  = compColor;

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

            ctx.fillStyle = backColor;

            // The actual screen
            ctx.fillRect( w * bezel,
                          w * bezel,
                          w * (1 - 2 * bezel),
                          h * (screenHeight - bezel - bezel) );

            ctx.fillStyle = textColor;

            ctx.fillText( "DANK MEMES", w / 2, h * screenHeight / 2 );

            ctx.restore();
        }
    };

    computerObject.draw( initial_props );
    return computerObject;
};