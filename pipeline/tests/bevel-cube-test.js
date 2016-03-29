/*
 * Unit tests for our bevel cube object.
 */
$(function () {
    // Grab the WebGL rendering context.
    var canvas = document.getElementById("hello-webgl");
    var gl = GLSLUtilities.getGL( canvas );
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

    test("Bevel Cube", function () {
        let shape = new BevelCube(GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 }, 0.5, 0.5);
        equal(shape, shape, "Should be equal to self");
        notEqual(shape.duplicate(), shape, "Should not be equal to a duplicate");

        deepEqual(shape.vertices.length, 252, "Vertices length");

        shape = new BevelCube(GLSLUtilities, gl, false, { r: 0.0, g: 0.0, b: 0.5 }, 0.5, 0.5);
        deepEqual(shape.vertices.length, 504, "Vertices length (not filled)");

        let scale = Matrix.scale(0.5,0.5,0.5);
        shape.transform( scale );
        deepEqual(shape.matrixGL, scale.colMajor, "Simple scale");

        let translate = Matrix.translate(0.5, 0.5, 0.5);
        shape.transform( translate );
        deepEqual(shape.matrixGL, translate.multiply(scale).colMajor, "Simple translate");
    
        let rotate = Matrix.rotate(Math.PI / 4, 1, 1, 1);
        shape.transform( rotate );
        deepEqual(shape.matrixGL, rotate.multiply(translate).colMajor, "Simple rotate");

        shape.draw( shaderProgram );

    });
});
