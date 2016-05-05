'use strict';

class Shape{
    // GLSL: GLSLUtilities object
    // gl: WebGL rendering context
    // fill: boolean. True if we're using triangles (filling it in), false if lines
    // color: object with r,g,b properties
    constructor( GLSL, gl, fill, color ) {
        this.GLSL = GLSL;
        this.gl = gl;
        this.colorObj = color;
        this.fill = fill;

        this.X = 0;
        this.Y = 0;
        this.Z = 0;

        this.vertices = [];
        this.indices = [];
        this.transformMatrix = new Matrix();
        this.children = [];
    }
    // Finishes the construction process. When creating a subclass of Shape,
    // the constructor should begin with a call to the super constructor and
    // end with a call to this function
    finish() {
        if( this.fill ) {
            this.vertices = this.toRawTriangleArray();
        }
        else {
            this.vertices = this.toRawLineArray();
        }
        // pass to GLSL
        this.buffer = this.GLSL.initVertexBuffer( this.gl, this.vertices );

        this.colorFixer();
    }
    colorFixer() {
        // If we have a single color, we expand that into an array
        // of the same color over and over.
        this.colors = [];
        for ( let j = 0, maxj = this.vertices.length / 3;
                j < maxj; ++j ) {
            this.colors = this.colors.concat(
                this.color.r,
                this.color.g,
                this.color.b
            );
        }
        this.colorBuffer = this.GLSL.initVertexBuffer(this.gl, this.colors);
    }
    set color( color ){
        this.colorObj = color;
        this.colorFixer();
    }
    get color() {
        return this.colorObj;
    }
    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray() {
        var result = [];

        for (var i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[this.indices[i][j]]
                );
            }
        }

        return result;
    }

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray() {
        var result = [];

        for (var i = 0, maxi = this.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = this.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    this.vertices[this.indices[i][j]],
                    this.vertices[this.indices[i][(j + 1) % maxj]]
                );
            }
        }

        return result;
    }
    // Deep copies of everything
    copy( shape ) {
        this.GLSL = shape.GLSL;
        this.gl = shape.gl;
        this.color = shape.color;
        this.fill = shape.fill;
        this.transformMatrix = shape.transformMatrix.duplicate();

        let vertices = [];
        let indices = [];

        for(let i = 0; i < shape.vertices.length; ++i) {
            let vertex = [];
            let index = [];
            for(let j = 0; j < 0; ++j) {
                vertex.push(shape.vertices[i][j]);
                index.push(shape.indices[i][j]);
            }
            vertices.push(vertex);
            indices.push(index);
        }

        this.vertices = vertices;
        this.indices = indices;

        for(let child of shape.children) {
            this.children.push( child.duplicate() );
        }

        return this;
    }
    // Should be overloaded
    duplicate(){
        let shape = new Shape( this.GLSL, this.gl, this.fill, this.color );
        shape.copy( this );
        return shape;
    }

    // Draws the shape in the gl context supplied at construction
    draw( shaderProgram ) {
        let gl = this.gl;
        if( this.vertices.length ) {
            // Hold on to the important variables within the shaders.
            let vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
            gl.enableVertexAttribArray(vertexPosition);
            let vertexColor = gl.getAttribLocation(shaderProgram, "vertexColor");
            gl.enableVertexAttribArray(vertexColor);
            let transformMatrix = gl.getUniformLocation(shaderProgram, "transformMatrix");

            gl.uniformMatrix4fv(transformMatrix, gl.FALSE, new Float32Array( this.matrixGL ));

            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

            // Set the varying vertex coordinates.
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
            gl.drawArrays(this.fill ? gl.TRIANGLES : gl.LINES, 0, this.vertices.length / 3);
        }

        // Draw children
        for(let child of this.children) {
            child.draw( shaderProgram );
        }
    }

    // Applies the supplied matrix as a transformation to this shape. It has
    // nothing to do with robots or disguises. Very careful not to edit
    // supplied matrix
    transform( matrix ) {
        this.transformMatrix.multiplyLeft( matrix );
        for(let i = 0; i < this.children.length; ++i) {
            this.children[i].transform( matrix );
        }
    }

    // Getter for transform matrix in GL happy form
    get matrixGL() {
        return this.transformMatrix.colMajor;
    }

    addChild( child ) {
        this.children.push(child);
        return this;
    }
}
class Cube extends Shape {
    constructor( GLSL, gl, fill, color ) {
        super( GLSL, gl, fill, color );

        const [S, X, Y, Z] = [1, this.X, this.Y, this.Z];
        this.vertices = [
            // Front face
            [X, Y, Z], //0 NW
            [X, Y - S, Z], //1 SW
            [X - S, Y, Z], //2 NE
            [X - S, Y - S, Z], //3 SE
            // Rear face
            [X, Y, Z - S], //4 NW
            [X, Y - S, Z - S], //5 SW
            [X - S, Y, Z - S], //6 NE
            [X - S, Y - S, Z - S], //7 SE
        ];

        this.indices = [
            // front
            [0, 1, 2],
            [1, 2, 3],
            // rear
            [6, 7, 5],
            [6, 5, 4],
            // top
            [0, 2, 4],
            [2, 6, 4],
            // bottom,
            [3, 1, 5],
            [5, 7, 3],
            // left
            [0, 5, 1],
            [4, 5, 0],
            //right
            [2, 3, 7],
            [6, 2, 7]
        ];

        this.finish();
    }
    duplicate(){
        let shape = new Cube( this.GLSL, this.gl, this.fill, this.color );
        shape.copy( this );
        return shape;
    }
}

// Cube with "raised edges". Depth is a value less than 1, where 0 produces a
// standard cube, 1 produces an "empty box", or a hollow cube, and negative
// values invert the bevel. Values are computed linearly. WidthRatio is the
// ratio of the width of the bevel to the radius of the cube. A widthRatio of
// 1 makes a bevel the entire width of the cube, or a standard cube (with more
// triangles), a widthRatio of 0 produces edges that are just faces with no
// width, and everything in between is linear. Thus a widthRatio of 0.5 would
// make a bevel half the distance to the center.
class BevelCube extends Shape{
    constructor( GLSL, gl, fill, color, D, widthRatio) {
        super( GLSL, gl, fill, color );

        const [S, W, X, Y, Z] = [1, widthRatio / 2, this.X, this.Y, this.Z];

        this.vertices = [
            // Front face
            [X, Y, Z],                      //0 NW
            [X, Y - S, Z],                  //1 SW
            [X - S, Y, Z],                  //2 NE
            [X - S, Y - S, Z],              //3 SE
            // Inner front face
            [X - W, Y, Z - W],              //4 NW
            [X - W, Y - D, Z - W],          //5 SW
            [X + W - S, Y, Z - W],          //6 NE
            [X + W - S, Y - D, Z - W],      //7 SE
            // Rear face
            [X, Y, Z - S],                  //8 NW
            [X, Y - S, Z - S],              //9 SW
            [X - S, Y, Z - S],              //10 NE
            [X - S, Y - S, Z - S],          //11 SE
            // Inner rear face
            [X - W, Y, Z + W - S],          //12 NW
            [X - W, Y - D, Z + W - S],      //13 SW
            [X + W - S, Y, Z + W - S],      //14 NE
            [X + W - S, Y - D, Z + W - S],  //15 SE
        ];

        this.indices = [
            // front
            [0, 1, 2],
            [1, 2, 3],
            // inner front
            [4, 5, 6],
            [5, 6, 7],
            // rear
            [10, 11, 9],
            [10, 9, 8],
            // inner rear
            [14, 15, 13],
            [14, 13, 12],
            // bottom,
            [3, 9, 11],
            [3, 1, 9],
            // inner bottom
            [7, 13, 15],
            [7, 5, 13],
            // left
            [0, 9, 1],
            [8, 9, 0],
            // Inner left
            [4, 13, 5],
            [12, 13, 4],
            // right
            [2, 3, 11],
            [10, 2, 11],
            // Inner right
            [6, 7, 15],
            [14, 6, 15],
            // top left
            [8, 0, 4],
            [8, 4, 12],
            // top rear
            [8, 12, 14],
            [8, 14, 10],
            // top right
            [10, 14, 6],
            [10, 6, 2],
            // top front
            [0, 4, 6],
            [0, 6, 2],
        ];

        this.finish();
    }
    duplicate(){
        let shape = new BevelCube(
            this.GLSL,
            this.gl,
            this.fill,
            this.color,
            this.depth,
            this.widthRatio
        );
        shape.copy( this );
        return shape;
    }
}

class RoundShape extends Shape {
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color );
        this.resolution = resolution;
    }
    copy( shape ){
        super.copy( shape );
        this.resolution = shape.resolution;
        return this;
    }
    duplicate(){
        let shape = new RoundShape(
            this.GLSL, this.gl, this.fill, this.color, this.resolution
        );
        shape.copy( this );
        return shape;
    }
}
class Cone extends RoundShape {
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color, resolution );

        this.H = 1;
        this.R = 1;

        this.vertices = [
            [ this.X, this.Y, this.Z]
        ];
        this.indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 1; i < resolution + 1; ++i) {
            this.vertices.push(
                [this.R * Math.cos(angle) , this.Y - this.H , this.R * Math.sin(angle)]
            );
            if( i > 1 ) {
                this.indices.push([0, i - 1, i]);
            }
            angle += thetaDelta;
        }
        this.indices.push([0, resolution, 1]);

        this.finish();
    }
    duplicate(){
        let shape = new Cone( this.GLSL, this.gl, this.fill, this.color, this.resolution );
        shape.copy( this );
        return shape;
    }
}
class FrustumCylinder extends RoundShape {
    constructor( GLSL, gl, fill, color, resolution, upperToLower ) {
        super( GLSL, gl, fill, color, resolution );

        this.A = upperToLower;
        this.B = 1
        this.H = 1;

        this.vertices = [];
        this.indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 0; i < resolution + 1; ++i) {
            this.vertices.push(
                [this.A * Math.cos(angle) , this.Y , this.A * Math.sin(angle)]
            );
            this.vertices.push(
                [this.B * Math.cos(angle) , this.Y - this.H , this.B * Math.sin(angle)]
            );

            if( i > 0 ) {
                let verts = {
                    upper: {
                        left: 2 * (i - 1),
                        right: 2 * i
                    },
                    lower: {
                        left: 2 * (i - 1) + 1,
                        right: 2 * i + 1
                    }
                }
                this.indices.push([verts.upper.left, verts.lower.left, verts.upper.right]);
                this.indices.push([verts.upper.right, verts.lower.left, verts.lower.right]);
            }

            angle += thetaDelta;
        }

        this.finish();
    }
    duplicate(){
        let shape = new FrustumCylinder(
            this.GLSL,
            this.gl,
            this.fill,
            this.color,
            this.resolution,
            this.A
        );
        shape.copy( this );
        return shape;
    }
}

class Cylinder extends FrustumCylinder{
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color, resolution, 1);
    }
    duplicate(){
        let shape = new Cylinder(
            this.GLSL,
            this.gl,
            this.fill,
            this.color,
            this.resolution,
            this.upperToLower
        );
        shape.copy( this );
        return shape;
    }
}
class Sphere extends RoundShape{
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color, resolution);

        // Generate the sphere as stacked frustum cylinders. Each one gets
        // smaller as we go up the sphere. Each time we make a duplicate and
        // rotate it pi radians to make the bottom half of the sphere

        // Scale of the current slice of sphere. Begins at 1 and gets smaller
        let scale = 1;

        // Angle increases by the step every time
        let lastAngle = 0;
        let step = Math.PI / (2 * resolution);
        let angle = step;

        for( let i = 1; i < resolution; ++i ) {
            // Cosine gives us horizontal size. Each slice has a ratio of top
            // to bottom proportional to the cosine of the new angle to the
            // previous angle. This way each slice has a bottom width of the
            // previous slice's top width
            let upperToLower = Math.cos(angle) / Math.cos(lastAngle);

            let part = new FrustumCylinder(
                GLSLUtilities,
                gl,
                fill,
                color,
                resolution,
                upperToLower
            );

            // Sine is vertical size. Same logic as before basically.
            let sin = Math.sin(angle);
            let sinLast = Math.sin(lastAngle);

            part.transform( Matrix.scale(scale, sin - sinLast , scale) );
            part.transform( Matrix.translate(0, sin ,0) );

            // We reduce the scale using this same ratio
            scale *= upperToLower;
            lastAngle += step;
            angle += step;


            this.children.push(part);

            let bottomPart = part.duplicate();

            bottomPart.transform(Matrix.rotate(Math.PI, 1, 0, 0));

            this.children.push(bottomPart);
        }
        // Do the caps
        {
            let top = new Cone(
                GLSLUtilities,
                gl,
                fill,
                color,
                resolution
            );

            let sin = Math.sin(angle);
            let sinLast = Math.sin(lastAngle);
            top.transform( Matrix.scale(scale, sin - sinLast, scale) );
            top.transform( Matrix.translate(0, 1,0) );

            this.children.push( top );

            let bot = top.duplicate();

            bot.transform(Matrix.rotate(Math.PI, 1, 0, 0));

            this.children.push(bot);
        }

        this.finish();
    }
    duplicate() {
        let shape = new Sphere(
            this.GLSL,
            this.gl,
            this.fill,
            this.color,
            this.resolution
        );
        shape.copy( this );
        return shape;
    }
}

// This is kind of like a cylinder, but one side comes inward. So it can look
// like a D or a U depending on "depth"
class Smile extends RoundShape {
    constructor( GLSL, gl, fill, color, resolution, D ) {
        super( GLSL, gl, fill, color, resolution );

        this.R = 1
        this.H = 1;

        this.vertices = [];
        this.indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        let i = 0;
        for(; i < resolution + 1; ++i) {
            let R = this.R;
            if( i >= resolution / 2) {
                R = -D;
            }
            this.vertices.push(
                [this.R * Math.cos(angle) , this.Y , R * Math.sin(angle)]
            );
            this.vertices.push(
                [this.R * Math.cos(angle) , this.Y - this.H , R * Math.sin(angle)]
            );

            if( i > 0 ) {
                let verts = {
                    upper: {
                        left: 2 * (i - 1),
                        right: 2 * i
                    },
                    lower: {
                        left: 2 * (i - 1) + 1,
                        right: 2 * i + 1
                    }
                }
                this.indices.push([verts.upper.left, verts.lower.left, verts.upper.right]);
                this.indices.push([verts.upper.right, verts.lower.left, verts.lower.right]);
            }

            angle += thetaDelta;
        }
        let verts = {
            upper: {
                left: 2 * (i - 1),
                right: 0
            },
            lower: {
                left: 2 * (i - 1) + 1,
                right: 1
            }
        }
        this.indices.push([verts.upper.left, verts.lower.left, verts.upper.right]);
        this.indices.push([verts.upper.right, verts.lower.left, verts.lower.right]);

        let res2 = 2 * resolution;
        for(i = 0; i < resolution; ++i) {
            let i2 = 2 * i;
            this.indices.push([i2 + 3, i2 + 1, res2 - i2 - 1]);
            this.indices.push([i2 + 4, i2 + 2, res2 - i2 - 2]);
        }


        this.finish();
    }
    duplicate(){
        let shape = new Smile( this.GLSL, this.gl, this.fill, this.color, this.resolution, this.depth );
        shape.copy( this );
        return shape;
    }
}