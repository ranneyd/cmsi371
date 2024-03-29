'use strict';
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

    var globalTransform = Matrix.scale(0.9, 0.9, 0.9);

    var vertexNormal = false;

    var shapeType = "cone";

    var objectsToDraw = [];
    // Build the objects to display.
    var generateShapes = function() {
        switch(shapeType){
            case "sphere":
                var shape = Shapes.sphere(50);
                break;
            case "cone":
                var shape = [Shapes.cone(50)];
                break;
            case "beveled":
                var shape = [Shapes.bevelCube(0.5, 0.5)];
                break;
            default:
                var shape = [Shapes.cube()];
        }

        for(let part of shape) {
            objectsToDraw.push({
                vertices: Shapes.toRawTriangleArray(part),

                // 12 triangles in all.
                color: part.color || { r: 1.0, g: 0.75, b: 0.5 },

                // We make the specular reflection be white.
                specularColor: { r: 1.0, g: 1.0, b: 1.0 },
                shininess: 16,

                // Like colors, one normal per vertex.  This can be simplified
                // with helper functions, of course.
                normals: vertexNormal ? Shapes.toVertexNormalArray(part) : Shapes.toNormalArray(part),

                mode: gl.TRIANGLES,

                matrix: part.matrix
            });
        };

        // Pass the vertices to WebGL.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            objectsToDraw[i].buffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].vertices);

            if (!objectsToDraw[i].colors) {
                // If we have a single color, we expand that into an array
                // of the same color over and over.
                objectsToDraw[i].colors = [];
                for (var j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                    objectsToDraw[i].colors = objectsToDraw[i].colors.concat(
                        objectsToDraw[i].color.r,
                        objectsToDraw[i].color.g,
                        objectsToDraw[i].color.b
                    );
                }
            }
            objectsToDraw[i].colorBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].colors);

            // Same trick with specular colors.
            if (!objectsToDraw[i].specularColors) {
                // Future refactor: helper function to convert a single value or
                // array into an array of copies of itself.
                objectsToDraw[i].specularColors = [];
                for (var j = 0, maxj = objectsToDraw[i].vertices.length / 3; j < maxj; j += 1) {
                    objectsToDraw[i].specularColors = objectsToDraw[i].specularColors.concat(
                        objectsToDraw[i].specularColor.r,
                        objectsToDraw[i].specularColor.g,
                        objectsToDraw[i].specularColor.b
                    );
                }
            }
            objectsToDraw[i].specularBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].specularColors);

            // One more buffer: normals.
            objectsToDraw[i].normalBuffer = GLSLUtilities.initVertexBuffer(gl, objectsToDraw[i].normals);
        }
    };
    generateShapes();

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

    // Hold on to the important variables within the shaders.
    var vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    var vertexDiffuseColor = gl.getAttribLocation(shaderProgram, "vertexDiffuseColor");
    gl.enableVertexAttribArray(vertexDiffuseColor);
    var vertexSpecularColor = gl.getAttribLocation(shaderProgram, "vertexSpecularColor");
    gl.enableVertexAttribArray(vertexSpecularColor);
    var normalVector = gl.getAttribLocation(shaderProgram, "normalVector");
    gl.enableVertexAttribArray(normalVector);

    // Finally, we come to the typical setup for transformation matrices:
    // model-view and projection, managed separately.
    var modelViewMatrix = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
    var xRotationMatrix = gl.getUniformLocation(shaderProgram, "xRotationMatrix");
    var yRotationMatrix = gl.getUniformLocation(shaderProgram, "yRotationMatrix");
    var projectionMatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");

    // Note the additional variables.
    var lightPosition = gl.getUniformLocation(shaderProgram, "lightPosition");
    var lightPosition2 = gl.getUniformLocation(shaderProgram, "lightPosition2");
    var lightDiffuse = gl.getUniformLocation(shaderProgram, "lightDiffuse");
    var lightSpecular = gl.getUniformLocation(shaderProgram, "lightSpecular");
    var shininess = gl.getUniformLocation(shaderProgram, "shininess");

    /*
     * Displays an individual object, including a transformation that now varies
     * for each object drawn.
     */
    var drawObject = function (object) {
        // Set the varying colors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
        gl.vertexAttribPointer(vertexDiffuseColor, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, object.specularBuffer);
        gl.vertexAttribPointer(vertexSpecularColor, 3, gl.FLOAT, false, 0, 0);

        // Set the shininess.
        gl.uniform1f(shininess, object.shininess);

        let transform = object.matrix.duplicate().transform(globalTransform);

        gl.uniformMatrix4fv(modelViewMatrix, gl.FALSE, new Float32Array(transform.gl));

        // Set the varying normal vectors.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.normalBuffer);
        gl.vertexAttribPointer(normalVector, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(object.mode, 0, object.vertices.length / 3);
    };

    /*
     * Displays the scene.
     */
    var rotationAroundX = 0.0;
    var rotationAroundY = 0.0;
    var drawScene = function () {
        // Clear the display.
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Set the overall rotation.
        gl.uniformMatrix4fv(xRotationMatrix, gl.FALSE, new Float32Array(
            (new Matrix()).rotate(rotationAroundX, 1.0, 0.0, 0.0).gl
        ));
        gl.uniformMatrix4fv(yRotationMatrix, gl.FALSE, new Float32Array(
            (new Matrix()).rotate(rotationAroundY, 0.0, 1.0, 0.0).gl
        ));

        // Display the objects.
        for (var i = 0, maxi = objectsToDraw.length; i < maxi; i += 1) {
            drawObject(objectsToDraw[i]);
        }

        // All done.
        gl.flush();
    };

    /*
     * Performs rotation calculations.
     */
    var rotateScene = function (event) {
        rotationAroundX = xRotationStart - yDragStart + event.clientY;
        rotationAroundY = yRotationStart - xDragStart + event.clientX;
        drawScene();
    };

    // Because our canvas element will not change size (in this program),
    // we can set up the projection matrix once, and leave it at that.
    // Note how this finally allows us to "see" a greater coordinate range.
    // We keep the vertical range fixed, but change the horizontal range
    // according to the aspect ratio of the canvas.  We can also expand
    // the z range now.
    gl.uniformMatrix4fv(projectionMatrix, gl.FALSE, new Float32Array((new Matrix()).ortho(
        -2 * (canvas.width / canvas.height),
        2 * (canvas.width / canvas.height),
        -2,
        2,
        -10,
        10
    ).gl));

    var light1X = 1000.0;
    var light1Y = 1000.0;
    var light1Z = 1000.0;
    var light2X = -1000.0;
    var light2Y = -1000.0;
    var light2Z = -1000.0;
    var lightR = 1.0;
    var lightG = 1.0;
    var lightB = 1.0;
    var specR = 0.3;
    var specG = 0.3;
    var specB = 0.3;

    // Set up our one light source and its colors.
    gl.uniform4fv(lightPosition, [light1X, light1Y, light1Z, 1.0]);
    gl.uniform4fv(lightPosition2, [light2X, light2Y, light2Z, 1.0]);

    gl.uniform3fv(lightDiffuse, [lightR, lightG, lightB]);
    gl.uniform3fv(lightSpecular, [specR, specG, specB]);


    // Instead of animation, we do interaction: let the mouse control rotation.
    var xDragStart;
    var yDragStart;
    var xRotationStart;
    var yRotationStart;
    $(canvas).mousedown(function (event) {
        xDragStart = event.clientX;
        yDragStart = event.clientY;
        xRotationStart = rotationAroundX;
        yRotationStart = rotationAroundY;
        $(canvas).mousemove(rotateScene);
    }).mouseup(function (event) {
        $(canvas).unbind("mousemove");
    });

    $( "#light1X" ).slider({
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light1X = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition, [light1X, light1Y, light1Z, 1.0]);
            drawScene();
        }
    });
    $( "#light1Y" ).slider({
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light1Y = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition, [light1X, light1Y, light1Z, 1.0]);
            drawScene();
        }
    });
    $( "#light1Z" ).slider({
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light1Z = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition, [light1X, light1Y, light1Z, 1.0]);
            drawScene();
        }
    });

    $( "#light2X" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light2X = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition2, [light2X, light2Y, light2Z, 1.0]);
            drawScene();
        }
    });
    $( "#light2Y" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light2Y = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition2, [light2X, light2Y, light2Z, 1.0]);
            drawScene();
        }
    });
    $( "#light2Z" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            light2Z = 1000.0 - slide * 2000.0;
            gl.uniform4fv(lightPosition2, [light2X, light2Y, light2Z, 1.0]);
            drawScene();
        }
    });
    $( "#lightR" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            lightR = slide;
            gl.uniform3fv(lightDiffuse, [lightR, lightG, lightB]);
            drawScene();
        }
    });
    $( "#lightG" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            lightG = slide;
            gl.uniform3fv(lightDiffuse, [lightR, lightG, lightB]);
            drawScene();
        }
    });
    $( "#lightB" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            lightB = slide;
            gl.uniform3fv(lightDiffuse, [lightR, lightG, lightB]);
            drawScene();
        }
    });

    $( "#lightIntensity" ).slider({
        value: 100,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            lightR = slide;
            lightG = slide;
            lightB = slide;
            gl.uniform3fv(lightDiffuse, [lightR, lightG, lightB]);
            drawScene();

            $("#lightR").slider({value: ui.value});
            $("#lightG").slider({value: ui.value});
            $("#lightB").slider({value: ui.value});
        }
    });

    $( "#specR" ).slider({
        value: 30,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            specR = slide;
            gl.uniform3fv(lightSpecular, [specR, specG, specB]);
            drawScene();
        }
    });
    $( "#specG" ).slider({
        value: 30,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            specG = slide;
            gl.uniform3fv(lightSpecular, [specR, specG, specB]);
            drawScene();
        }
    });
    $( "#specB" ).slider({
        value: 30,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            specB = slide;
            gl.uniform3fv(lightSpecular, [specR, specG, specB]);
            drawScene();
        }
    });

    $( "#specIntensity" ).slider({
        value: 30,
        slide: function( event, ui ) {
            let slide = ui.value / 100;
            specR = slide;
            specG = slide;
            specB = slide;
            gl.uniform3fv(lightSpecular, [specR, specG, specB]);
            drawScene();

            $("#specR").slider({value: ui.value});
            $("#specG").slider({value: ui.value});
            $("#specB").slider({value: ui.value});
        }
    });

    $("#vertexNormal").click(function(){
       objectsToDraw = [];
       vertexNormal = $(this).is(":checked");
       generateShapes();
       drawScene();
    });
    $("#sphereButton").click(function(){
       objectsToDraw = [];
       shapeType = "sphere";
       generateShapes();
       drawScene();
    });
    $("#coneButton").click(function(){
       objectsToDraw = [];
       shapeType = "cone";
       generateShapes();
       drawScene();
    });
    $("#beveledButton").click(function(){
       objectsToDraw = [];
       shapeType = "beveled";
       generateShapes();
       drawScene();
    });
    $("#cubeButton").click(function(){
       objectsToDraw = [];
       shapeType = "cube";
       generateShapes();
       drawScene();
    });


    // Draw the initial scene.
    drawScene();

}(document.getElementById("light-even-more-webgl")));
