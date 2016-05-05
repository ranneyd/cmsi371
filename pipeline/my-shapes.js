'use strict';
// Build the objects to display.

var myShapes = (GLSLUtilities, gl, refs) => {
    let objects = [];

    const RES = 40;

    let scale = 0.5;

    let leftEye = new Sphere( GLSLUtilities, gl, true, { r: 1.2, g: 1.2, b: 1.2 }, RES );
    let leftPupil = new Sphere( GLSLUtilities, gl, true, { r: 0, g: 0, b: 0 }, RES );
    let rightEye = new Sphere( GLSLUtilities, gl, true, { r: 1.2, g: 1.2, b: 1.2 }, RES );
    let rightPupil = new Sphere( GLSLUtilities, gl, true, { r: 0, g: 0, b: 0 }, RES );

    let eyeScale = scale * 0.4;
    let pupilScale = eyeScale * 0.2;
    leftEye.transform( Matrix.scale(eyeScale,  eyeScale, eyeScale));
    leftEye.transform( Matrix.translate(-scale*0.4, scale*0.2, -scale*0.7));
    leftPupil.transform( Matrix.scale(pupilScale,  pupilScale, pupilScale));
    leftPupil.transform( Matrix.translate(-scale*0.5, scale*0.2, -scale*1.05));
    leftEye.addChild(leftPupil);


    rightEye.transform( Matrix.scale(eyeScale,  eyeScale, eyeScale));
    rightEye.transform( Matrix.translate(scale*0.4, scale*0.2, -scale*0.7) );
    rightPupil.transform( Matrix.scale(pupilScale,  pupilScale, pupilScale));
    rightPupil.transform( Matrix.translate(scale*0.5, scale*0.2, -scale*1.05));
    rightEye.addChild(rightPupil);


    let smile = new Smile( GLSLUtilities, gl, true, { r: 1, g: 0, b: 0 }, RES, 0.1);

    let smileScale = scale * 0.5;

    smile.transform( Matrix.scale(smileScale,  smileScale, smileScale));
    smile.transform( Matrix.rotate(Math.PI / 2,  1, 0, 0) );

    smile.transform( Matrix.translate(0, -smileScale * 0.5, -smileScale));


    let head = new Sphere( GLSLUtilities, gl, true, { r: 1.2, g: 1.2, b: 0 }, RES );

    head.transform( Matrix.scale(scale,  scale, scale));

    head.addChild(leftEye);
    head.addChild(rightEye);
    head.addChild(smile);

    objects.push( head );


    refs.smile = smile;
    return objects;
}

