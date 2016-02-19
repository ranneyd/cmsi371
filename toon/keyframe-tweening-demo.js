/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        // Then, we have "easing functions" that determine how
        // intermediate frames are computed.

        // Now, to actually define the animated sprites.  Each sprite
        // has a drawing function and an array of keyframes.
        
        duration = 100,
        explosionTime = 15,
        compPos = { x: 600, y: 300 },
        kidPos = { x: 300, y: 200 },
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
                            ease: KeyframeTweener.linearStep
                        });
                    }
                    return keyframes;
                })()
            },
            {
                draw: kid,
                keyframes: [
                    {
                        frame: 0,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        ease: KeyframeTweener.linear
                    },

                    {
                        frame: duration,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        ease: KeyframeTweener.linear
                    },
                ]
            },

            {
                draw: explosion,
                keyframes: [
                    {
                        frame: duration - explosionTime,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 0,
                        sy: 0,
                        ease: KeyframeTweener.quadEaseOut
                    },

                    {
                        frame: duration,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 10,
                        sy: 10,
                        ease: KeyframeTweener.easeInExpo
                    },
                ]
            },
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
