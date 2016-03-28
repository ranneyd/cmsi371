/*
 * For maximum modularity, we place everything within a single function that
 * takes the canvas that it will need.
 */
(function (canvas) {

    // Grab the WebGL rendering context.
    var gl = GLSLUtilities.getGL(canvas);
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }

    // Set up settings that will not change.  This is not "canned" into a
    // utility function because these settings really can vary from program
    // to program.
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.viewport(0, 0, canvas.width, canvas.height);


    // Build the objects to display.
    var objectsToDraw = myShapes( GLSLUtilities, gl );

    // Initialize the shaders.
    var abort = false;
    var shaderProgram = GLSLUtilities.initSimpleShaderProgram(
        gl,
        $("#vertex-shader").text(),
        $("#fragment-shader").text(),

        // Very cursory error-checking here...
        function (shader) {
            abort = true;
            alert("Shader problem: " + gl.getShaderInfoLog(shader));
        },

        // Another simplistic error check: we don't even access the faulty
        // shader program.
        function (shaderProgram) {
            abort = true;
            alert("Could not link shaders...sorry.");
        }
    );

    // If the abort variable is true here, we can't continue.
    if (abort) {
        alert("Fatal errors encountered; we cannot continue.");
        return;
    }

    // All done --- tell WebGL to use the shader program from now on.
    gl.useProgram(shaderProgram);


    /*
     * Displays the scene.
     */
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        // Display the objects.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            let shape = objectsToDraw[i];
            shape.transform(rotateMatrix);
            shape.draw( shaderProgram );
        }

        // All done.
        gl.flush();
    };

    /*
     * Animates the scene.
     */
    var animationActive = false;
    var previousTimestamp = null;
    // Make it the identity matrix at the beginning
    let rotateMatrix = new Matrix();

    var advanceScene = function (timestamp) {
        // Check if the user has turned things off.
        if (!animationActive) {
            return;
        }

        // Initialize the timestamp.
        if (!previousTimestamp) {
            previousTimestamp = timestamp;
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // Check if it's time to advance.
        var progress = timestamp - previousTimestamp;
        if (progress < 30) {
            // Do nothing if it's too soon.
            window.requestAnimationFrame(advanceScene);
            return;
        }

        // All clear.
        drawScene();


        // Request the next frame.
        previousTimestamp = timestamp;
        window.requestAnimationFrame(advanceScene);
    };

    // Draw the initial scene.
    drawScene();
    // Vector representing rotation axis [x, y, z]
    const ROTATION_VECTOR = [1, 1, 1];
    // Set the rotation matrix to actually rotate
    rotateMatrix = Matrix.rotate(0.03, ...ROTATION_VECTOR);

    // Set up the rotation toggle: clicking on the canvas does it.
    $("#rotate").click(function () {
        animationActive = !animationActive;
        if (animationActive) {
            previousTimestamp = null;
            window.requestAnimationFrame(advanceScene);
        }
    });

}(document.getElementById("hello-webgl")));
