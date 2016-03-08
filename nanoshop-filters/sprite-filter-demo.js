'use strict';
/*
 * This demo script uses the NanoshopNeighborhood module to apply a
 * "pixel neighborhood" filter on a canvas drawing.
 */
(function () {
    var canvas = $("#canvas")[0];
    var renderingContext = canvas.getContext("2d");


    // Init computer
    renderingContext.save();
    renderingContext.translate( 500, 400 );
    computer(renderingContext, {
        textColorR: 0,
        textColorG: 255,
        textColorB: 255,
        backColorR: 255,
        backColorG: 0,
        backColorB: 0,
        compColorR: 100,
        compColorG: 100,
        compColorB: 100
    })
    renderingContext.restore();

    // Init kid
    renderingContext.save();
    renderingContext.translate( 200, 300 );
    renderingContext.rotate(-1);
    renderingContext.scale(1.7, 1);
    kid(renderingContext, {
        eyeRedness: 100,
        mouthYOffset: -30,
        eyeSpreadDelta: 70,
        eyeYOffset: 20
    })
    renderingContext.restore();

    // Init explosion
    renderingContext.save();
    renderingContext.translate( 500, 375 );
    explosion(renderingContext);
    renderingContext.restore();

    renderingContext.putImageData(
        Nanoshop.applyFilter(
            renderingContext.getImageData(0, 0, canvas.width, canvas.height),
            Nanoshop.darkener   
        ),
        0, 0
    );
    renderingContext.putImageData(
        NanoshopNeighborhood.applyFilter(
            renderingContext,
            renderingContext.getImageData(0, 0, canvas.width, canvas.height),
            NanoshopNeighborhood.averager
        ),
        0, 0
    );
    renderingContext.putImageData(
        Nanoshop.applyFilter(
            renderingContext.getImageData(0, 0, canvas.width, canvas.height),
            // This is a basic "darkener."
            Nanoshop.spotlight
        ),
        0, 0
    );
}());
