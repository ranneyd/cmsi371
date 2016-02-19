/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        linearStep = function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return Math.floor(distance * percentComplete + start);
        },

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        
        duration = 500,
        compPos = { x: 500, y: 400 };
        sprites = [
            {
                draw: computer,
                keyframes: ( function(){
                    var keyframes = [],
                        flickerPeriod = 1.5;
                    for(var i = 0; i < (0 || (duration/flickerPeriod)); ++i) {
                        keyframes.push({
                            frame: i * flickerPeriod,
                            tx: compPos.x,
                            ty: compPos.y,
                            props: {
                                textColorR: (i % 3 === 0) ? 255 : 0,
                                textColorG: (i % 3 === 1) ? 255 : 0,
                                textColorB: (i % 3 === 2) ? 255 : 0,
                                backColorR: (i % 3 !== 0) ? 255 : 0,
                                backColorG: (i % 3 !== 1) ? 255 : 0,
                                backColorB: (i % 3 !== 2) ? 255 : 0,
                            },
                            ease: linearStep
                        });
                    }
                    return keyframes;
                })()
            },

            {
                draw: explosion,
                keyframes: [
                    {
                        frame: 50,
                        tx: 300,
                        ty: 600,
                        sx: 0.5,
                        sy: 0.5,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 100,
                        tx: 300,
                        ty: 0,
                        sx: 3,
                        sy: 0.25,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: 150,
                        tx: 300,
                        ty: 600,
                        sx: 0.5,
                        sy: 0.5
                    }
                ]
            }
        ];

    // Finally, we initialize the engine.  Mainly, it needs
    // to know the rendering context to use.  And the animations
    // to display, of course.
    KeyframeTweener.initialize({
        renderingContext: canvas.getContext("2d"),
        width: canvas.width,
        height: canvas.height,
        sprites: sprites
    });
}());
