'use strict';
// Build the objects to display.

var myShapes = (GLSLUtilities, gl) => {
    let objects = [];

    const RES = 30;

    let scale = 0.5;

    let leftEye = new Sphere( GLSLUtilities, gl, true, { r: 1, g: 1, b: 0 }, RES );
    let rightEye = new Sphere( GLSLUtilities, gl, true, { r: 1, g: 0, b: 1 }, RES );
    let eyeScale = scale * 0.4;
    leftEye.transform( Matrix.scale(eyeScale,  eyeScale, eyeScale));
    leftEye.transform( Matrix.translate(-scale*0.6, 0, -scale*0.9));

    rightEye.transform( Matrix.scale(eyeScale,  eyeScale, eyeScale));
    rightEye.transform( Matrix.translate(scale*0.6, 0, -scale*0.9));


    let head = new Sphere( GLSLUtilities, gl, true, { r: 1, g: 0.8, b: 0 }, RES );

    head.transform( Matrix.scale(scale,  scale, scale));

    head.addChild(leftEye);
    head.addChild(rightEye);

    objects.push( head );



    return objects;
}

