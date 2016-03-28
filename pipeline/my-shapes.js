'use strict';
// Build the objects to display.

var myShapes = (GLSLUtilities, gl) => {
    let objects = [];
    objects.push(new Cylinder( GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 }, 50));
    objects.push(new Cube( GLSLUtilities, gl, false, { r: 0.0, g: 0.5, b: 0.0 }));
    return objects;
}

