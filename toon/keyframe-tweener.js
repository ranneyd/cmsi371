/*
 * A simple keyframe-tweening animation module for 2D
 * canvas elements.
 */
(function () {
    // The big one: animation initialization.  The settings parameter
    // is expected to be a JavaScript object with the following
    // properties:
    //
    // - renderingContext: the 2D canvas rendering context to use
    // - width: the width of the canvas element
    // - height: the height of the canvas element
    // - sprites: the array of sprites to animate
    // - frameRate: number of frames per second (default 24)
    //
    // In turn, each sprite is a JavaScript object with the following
    // properties:
    //
    // - draw: the function that draws the sprite
    // - keyframes: the array of keyframes that the sprite should follow
    //
    // Finally, each keyframe is a JavaScript object with the following
    // properties.  Unlike the other objects, defaults are provided in
    // case a property is not present:
    //
    // - frame: the global animation frame number in which this keyframe
    //          is to appear
    // - ease: the easing function to use (default is KeyframeTweener.linear)
    // - tx, ty: the location of the sprite (default is 0, 0)
    // - sx, sy: the scale factor of the sprite (default is 1, 1)
    // - rotate: the rotation angle of the sprite (default is 0)
    //
    // In addition, any properties added to this object other than the ones
    // listed will be passed to the sprite to animate it.
    var initializeAnimation = function (settings) {
        // We need to keep track of the current frame.
        var currentFrame = 0,

            // Avoid having to go through settings to get to the
            // rendering context and sprites.
            renderingContext = settings.renderingContext,
            width = settings.width,
            height = settings.height,
            sprites = settings.sprites,

            previousTimestamp = null,
            nextFrame = function (timestamp) {
                // Bail-out #1: We just started.
                if (!previousTimestamp) {
                    previousTimestamp = timestamp;
                    window.requestAnimationFrame(nextFrame);
                    return;
                }

                // Bail-out #2: Too soon.
                if (timestamp - previousTimestamp < (1000 / (settings.frameRate || 24))) {
                    window.requestAnimationFrame(nextFrame);
                    return;
                }

                // Clear the canvas.
                renderingContext.clearRect(0, 0, width, height);

                // For every sprite, go to the current pair of keyframes.
                // Then, draw the sprite based on the current frame.
                for (var i = 0, maxI = sprites.length; i < maxI; i += 1) {
                    for (var j = 0, maxJ = sprites[i].keyframes.length - 1; j < maxJ; j += 1) {
                        // We look for keyframe pairs such that the current
                        // frame is between their frame numbers.
                        if ((sprites[i].keyframes[j].frame <= currentFrame) &&
                                (currentFrame <= sprites[i].keyframes[j + 1].frame)) {
                            // Point to the start and end keyframes.
                            var startKeyframe = sprites[i].keyframes[j],
                                endKeyframe = sprites[i].keyframes[j + 1];

                            // Save the rendering context state.
                            renderingContext.save();

                            // Set up our start and distance values, using defaults
                            // if necessary.
                            var ease = startKeyframe.ease || KeyframeTweener.linear,

                                txStart = startKeyframe.tx || 0,
                                txDistance = (endKeyframe.tx || 0) - txStart,

                                tyStart = startKeyframe.ty || 0,
                                tyDistance = (endKeyframe.ty || 0) - tyStart,

                                sxStart = startKeyframe.sx || 1,
                                sxDistance = (endKeyframe.sx || 1) - sxStart,

                                syStart = startKeyframe.sy || 1,
                                syDistance = (endKeyframe.sy || 1) - syStart,

                                rotateStart = (startKeyframe.rotate || 0) * Math.PI / 180,
                                rotateDistance = (endKeyframe.rotate || 0) * Math.PI / 180 - rotateStart;

                            var currentTweenFrame = currentFrame - startKeyframe.frame,
                                duration = endKeyframe.frame - startKeyframe.frame + 1;

                            // Build our transform according to where we should be.
                            renderingContext.translate(
                                ease(currentTweenFrame, txStart, txDistance, duration),
                                ease(currentTweenFrame, tyStart, tyDistance, duration)
                            );
                            
                            renderingContext.rotate(
                                ease(currentTweenFrame, rotateStart, rotateDistance, duration)
                            );

                            renderingContext.scale(
                                ease(currentTweenFrame, sxStart, sxDistance, duration),
                                ease(currentTweenFrame, syStart, syDistance, duration)
                            );

                            // arbitrary props
                            var props = {};

                            // Get every property in the props object
                            for( var propKey in startKeyframe.props ) {

                                var startKeyframeProp = startKeyframe.props[propKey],
                                    distanceKeyframProp = (endKeyframe.props[propKey] 
                                                            - startKeyframeProp) || 0;
                                // We can only tween numeric values
                                if(isNaN(startKeyframeProp)){
                                    // If it's a non-tweenable value, just set it immediately
                                    props[propKey] = startKeyframeProp;
                                } else {
                                    props[propKey] = ease(currentTweenFrame,
                                                          startKeyframeProp,
                                                          distanceKeyframProp,
                                                          duration);
                                }

                            }

                            // Draw the sprite.
                            sprites[i].draw(renderingContext, props);

                            // Clean up.
                            renderingContext.restore();
                        }
                    }
                }

                // Move to the next frame.
                currentFrame += 1;
                previousTimestamp = timestamp;
                window.requestAnimationFrame(nextFrame);
            };

        window.requestAnimationFrame(nextFrame);
    };

    window.KeyframeTweener = {
        // The module comes with a library of common easing functions.
        linear: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete + start;
        },

        linearStep: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return Math.floor(distance * percentComplete + start);
        },

        quadEaseIn: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return distance * percentComplete * percentComplete + start;
        },

        quadEaseOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / duration;
            return -distance * percentComplete * (percentComplete - 2) + start;
        },

        quadEaseInAndOut: function (currentTime, start, distance, duration) {
            var percentComplete = currentTime / (duration / 2);
            return (percentComplete < 1) ?
                    (distance / 2) * percentComplete * percentComplete + start :
                    (-distance / 2) * ((percentComplete - 1) * (percentComplete - 3) - 1) + start;
        },
        // We're going to go 1 beyond the bound, then return
        wackyEaseOutAndIn: function (currentTime, start, distance, duration) {
            var distanceOut = 1;
            var percentComplete = currentTime / duration;
            return (percentComplete < .5) ?
                    (distance * (1 + distanceOut)) * (percentComplete * 2) + start :
                    (distance * (1 + distanceOut) - distance * distanceOut * 2 * (percentComplete - 0.5)) + start;
        },

        // From https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
        easeInExpo: function (t, b, c, d) {
            return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
        },

        // Sinusoidal, but instead of a quarter of a period, we'll do 1.25 periods so it oscillates
        sineAlt: function (currentTime, start, distance, duration) {
            return distance * Math.sin((currentTime/duration)* 5* Math.PI / 2) + start
        },

        // Take the curve x^3 and shift it up 1 and right 1 and make it half the size so it's a unit
        // It will look kind of like this, but curvier.
        //
        //  1|
        //   |  __ /
        //   |/
        //   ---------
        //          1
        cubic: function (currentTime, start, distance, duration) {
            // We want x^3 from -1 to 1
            var x = 2 * (currentTime / duration) - 1;
            return distance * (0.5 * (Math.pow(x, 3) + 1) )+ start
        },

        initialize: initializeAnimation
    };
}());
