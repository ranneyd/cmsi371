'use strict';
/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
 */
(function () {
    var canvas = $("#canvas")[0];
    var renderingContext = canvas.getContext("2d");

    var currentFrame = 0;

    var nextFrame = () => {
        if(currentFrame > 200){
            renderingContext.putImageData(
                Nanoshop.applyFilter(
                    renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                    Nanoshop.darkener
                ),
                0, 0
            );
            renderingContext.putImageData(
                Nanoshop.applyFilter(
                    renderingContext.getImageData(0, 0, canvas.width, canvas.height),
                    // This is a basic "darkener."
                    Nanoshop.matrix
                ),
                0, 0
            );
        }
        currentFrame++;
        window.requestAnimationFrame(nextFrame);
    };
    nextFrame();
}());
