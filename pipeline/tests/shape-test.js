/*
 * Unit tests for our shape object.
 */
$(function () {
    // Grab the WebGL rendering context.
    var gl = GLSLUtilities.getGL(document.getElementById("hello-webgl"));
    if (!gl) {
        alert("No WebGL context found...sorry.");

        // No WebGL, no use going on...
        return;
    }
    test("Basic", function () {
        let shape = new Shape(GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 });
        shape.finish();
        equal(shape, shape, "Should be equal to self");
        notEqual(shape.duplicate(), shape, "Should not be equal to a duplicate");

        let scale = Matrix.scale(5, 5, 5);
        shape.transform( scale );
        deepEqual(shape.matrixGL, scale.colMajor, "Simple transform");

        let translate = Matrix.translate(0.5, 0.5, 0.5);
        shape.transform( translate );
        deepEqual(shape.matrixGL, Matrix.multiply(translate, scale).colMajor, "Simple transform");
    });
});
