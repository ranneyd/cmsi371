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
        
        duration = 330,
        explosionTime = 20,
        compPos = { x: 600, y: 300 },
        kidPos = { x: 300, y: 200 },
        sprites = [
            {
                draw: computer,
                // The computer flickers, so the keyframes will be frequent and numerous. It's
                // easier to generate them with this function
                keyframes: ( function () {
                    var keyframes = [],
                        flickerPeriod = 1.5;

                    for( var i = 0; i < (0 || ( duration / flickerPeriod )); ++i ) {
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
                            // linearStep is linear but always returns an int
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
                        props:{
                            eyeRedness: 0,
                            mouthYOffset: 0,
                        },
                        ease: KeyframeTweener.quadEaseIn
                    },
                    {
                        frame: 80,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 1,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: 0,
                            eyeSpreadDelta: 0,
                        },
                        ease: KeyframeTweener.sineAlt
                    },
                    {
                        frame: 200,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 1,
                        rotate: 75,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: 0,
                            eyeSpreadDelta: 0,
                        },
                        ease: KeyframeTweener.wackyEaseOutAndIn
                    },
                    {
                        frame: 240,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 1,
                        rotate: 0,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: -30,
                            eyeSpreadDelta: -30,
                        },
                        ease: KeyframeTweener.quadEaseOut
                    },
                    {
                        frame: duration - explosionTime - 30,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 1.5,
                        rotate: 720,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: 30,
                            eyeSpreadDelta: 30,
                        },
                        ease: KeyframeTweener.easeInExpo
                    },
                    {
                        frame: duration - explosionTime - 2,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: .2,
                        sy: .2,
                        rotate: 360,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: -20,
                            eyeSpreadDelta: -20,
                        },
                        ease: KeyframeTweener.quadEaseOut
                    },
                    {
                        frame: duration,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 1,
                        sy: 1,
                        rotate: 360,
                        props:{
                            eyeRedness: 100,
                            mouthYOffset: 3000,
                            eyeSpreadDelta: 3000,
                        },
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
                        ease: KeyframeTweener.cubic
                    },

                    {
                        frame: duration-5,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 4,
                        sy: 4,
                        ease: KeyframeTweener.linear
                    },
                    {
                        frame: duration,
                        tx: kidPos.x,
                        ty: kidPos.y,
                        sx: 15,
                        sy: 15,
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
