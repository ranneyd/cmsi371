'use strict';
// Build the objects to display.

var myShapes = (GLSLUtilities, gl) => {
    let objects = [];

    const RES = 10;
    
    let cylinder = new Cylinder( GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 }, RES);

    let cap = new Cone( GLSLUtilities, gl, true, { r: 0.5, g: 0.0, b: 0.0 }, RES);
    cap.transform( Matrix.scale(1, 0, 1) );

    let botCap = cap.duplicate();
    botCap.color = { r: 0.0, g: 0.5, b: 0.0 };
    botCap.transform( Matrix.translate(0, -1, 0) );

    cylinder.addChild(cap);
    cylinder.addChild(botCap);

    let scale = 0.2;
    cylinder.transform( Matrix.scale(scale, scale, scale) );
    cylinder.transform( Matrix.translate(-0.5, -0.5, -0.5) );

    //objects.push(cylinder);


    let sphere = new Shape( GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 } );

    scale = 1;
    let up = 0;
    let lastAngle = 0;
    let step = Math.PI / (2 * RES);
    let angle = step;
    for(let i = 1; i < RES; ++i) {
        let upperToLower = Math.cos(angle) / Math.cos(lastAngle);
        let part = new FrustomCylinder( GLSLUtilities, gl, true, { r: 1 * i / RES, g: 0.0, b: 0.0 }, RES, upperToLower);
        
        let h = Math.cos(lastAngle) / RES;
        up += h;
        
        part.transform( Matrix.scale(scale, h , scale) );
        part.transform( Matrix.translate(0, up ,0) );

        scale *= upperToLower;
        lastAngle += step;
        angle += step;


        sphere.addChild(part);

        let newPart = part.duplicate();

        newPart.transform(Matrix.rotate(Math.PI, 1, 0, 0));

        sphere.addChild(newPart);
    }
    // Do the caps
    {
        let top = new Cone( GLSLUtilities, gl, true, { r: 0.0, g: 0.0, b: 0.5 }, RES );
        
        let h = Math.cos(lastAngle) / RES;
        top.transform( Matrix.scale(scale, h, scale) );
        top.transform( Matrix.translate(0, up + h,0) );

        sphere.addChild( top );

        let bot = top.duplicate();


        bot.transform(Matrix.rotate(Math.PI, 1, 0, 0));

        sphere.addChild(bot);
    }





    scale = 1;
    // For some reason I can't explain, this only looks right when scaled
    // vertically by 1.5
    sphere.transform( Matrix.scale(scale, 1.5 * scale, scale));

    objects.push( sphere );

    return objects;
}

