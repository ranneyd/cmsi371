/*
 * This file demonstrates how our homebrew keyframe-tweening
 * engine is used.
 */
(function () {
    var canvas = document.getElementById("canvas"),

        // First, a selection of "drawing functions" from which we
        // can choose.  Their common trait: they all accept a single
        // renderingContext argument.
        square = function (renderingContext) {
            renderingContext.fillStyle = "blue";
            renderingContext.fillRect(-20, -20, 40, 40);
        },

        circle = function (renderingContext) {
            renderingContext.strokeStyle = "red";
            renderingContext.beginPath();
            renderingContext.arc(0, 0, 50, 0, Math.PI * 2);
            renderingContext.stroke();
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
                keyframes: [
                    {
                        frame: 0,
                        tx: compPos.x,
                        ty: compPos.y,
                        props: {
                            textColor: "rgb(255, 0, 0)",
                            backColor: "rgb(0, 255, 255)"
                        },
                        ease: KeyframeTweener.linear
                    },
                    {
                        frame: duration,
                        tx: compPos.x,
                        ty: compPos.y,
                        // props: {
                        //     textColor: "rgb(255, 0, 0)",
                        //     backColor: "rgb(0, 255, 255)"
                        // },
                        ease: KeyframeTweener.linear
                    },
                ]
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
