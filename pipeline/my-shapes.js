'use strict';
// Build the objects to display.

var myShapes = (GLSLUtilities, gl) => {
    let objects = [];

    const RES = 50;
    
    let cylinder = new Cylinder( GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 }, RES);

    let cap = new Cone( GLSLUtilities, gl, true, { r: 0.5, g: 0.0, b: 0.0 }, RES);
    cap.transform( Matrix.scale(1, 0, 1) );

    let botCap = cap.duplicate();
    botCap.color = { r: 0.0, g: 0.5, b: 0.0 };
    botCap.transform( Matrix.translate(0, -1, 0) );

    cylinder.addChild(cap);
    cylinder.addChild(botCap);

    let scale = 0.5;
    cylinder.transform( Matrix.scale(scale, scale, scale) );
    cylinder.transform( Matrix.translate(-0.5, -0.5, -0.5) );

    //objects.push(cylinder);


    let sphere = new Sphere( GLSLUtilities, gl, false, { r: 0.0, g: 0.0, b: 0.5 }, RES );

    sphere.transform( Matrix.scale(scale,  scale, scale));

    objects.push( sphere );

    return objects;
}

