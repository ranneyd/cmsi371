/*
 * This is a very simple module that demonstrates rudimentary,
 * pixel-level image processing.
 */
var Nanoshop = {
    /*
     * A basic "darkener."
     */
    darkener: function (x, y, r, g, b, a) {
        return [ r / 2, g / 2, b / 2, a ];
    },
    matrix: function (x, y, r, g, b, a) {
        return[r * 8/9, g * 9/8, b * 8/9, a];
    },
    spotlight: function (x, y, r, g, b, a) {
        var light = {
            x: 500, 
            y: 500,
            brightness: 255,
            radius: 300,
        };

        var distanceFromLight = function( x, y ) {
            var xSquared = Math.pow( light.x - x, 2 );
            var ySquared = Math.pow( light.y - y, 2 );
            return Math.sqrt( xSquared + ySquared );
        };
        var usDistance = distanceFromLight( x, y );

        var pixelAugment = light.brightness * (light.radius - usDistance )/ light.radius;

        var brightenPixel = function( val ){
            return Math.min(255, val + pixelAugment);
        };

        return[brightenPixel(r), brightenPixel(g), brightenPixel(b), a];
    },

    /*
     * Applies the given filter to the given ImageData object,
     * then modifies its pixels according to the given filter.
     *
     * A filter is a function (x, y, r, g, b, a) that returns another
     * pixel as a 4-element array representing an RGBA value.
     */
    applyFilter: function (imageData, filter) {
        // For every pixel, replace with something determined by the filter.
        var pixelArray = imageData.data;

        for (var i = 0, max = imageData.width * imageData.height * 4; i < max; i += 4) {
            var pixelIndex = i / 4;

            var pixel = filter(
                pixelIndex % imageData.width, Math.floor(pixelIndex / imageData.height),
                pixelArray[i], pixelArray[i + 1], pixelArray[i + 2], pixelArray[i + 3]
            );

            for (var j = 0; j < 4; j += 1) {
                pixelArray[i + j] = pixel[j];
            }
        }

        return imageData;
    }
};
