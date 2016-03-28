'use strict';

class Shape{
    // GLSL: GLSLUtilities object
    // gl: WebGL rendering context
    // fill: boolean. True if we're using triangles (filling it in), false if lines
    // color: object with r,g,b properties
    constructor( GLSL, gl, fill, color ) {
        this.GLSL = GLSL;
        this.gl = gl;
        this.color = color
        this.X = 0;
        this.Y = 0;
        this.Z = 0;
        this.vertices = [];
        this.indices = [];
        this.fill = fill;
    }

    finish() {
        if( this.fill ) {
            this.vertices = this.toRawTriangleArray();
        }
        else {
            this.vertices = this.toRawLineArray();
        }
        // pass to GLSL
        this.buffer = this.GLSL.initVertexBuffer( this.gl, this.vertices );

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

    // Deep copies vertices and indices
    copy() {
        let shape = new Shape( this.color );
        let vertices = new Array( this.vertices.length );
        let indices = new Array( this.indices.length );

        for(let i = 0; i < this.vertices.length; ++i) {
            let vertex = new Array(3);
            for(let j = 0; j < 0; ++j) {
                vertex[j] = this.vertices[i][j];
            }
            vertices[i] = vertex;
        }

        shape.vertices = vertices;
        shape.indices = indices;
        return shape;
    }

    draw( vertexColor, vertexPosition ) {
        let gl = this.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.vertexAttribPointer(vertexColor, 3, gl.FLOAT, false, 0, 0);

        // Set the varying vertex coordinates.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(this.fill ? gl.TRIANGLES : gl.LINES, 0, this.vertices.length / 3);
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
}
class Cube extends Shape {
    constructor( GLSL, gl, fill, color ) {
        super( GLSL, gl, fill, color );
        
        const [S, X, Y, Z] = [0.5, 0, 0, 0];
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
}

class RoundShape extends Shape {
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color );
        this.resolution = resolution;
    }
    copy() {
        let shape = super.copy();
        shape.resolution = this.resolution;
        return shape;
    }
}
class Cone extends RoundShape {
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color, resolution );
        
        this.H = 0.5;
        this.R = 0.5;

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
}
class FrustomCylinder extends RoundShape {
    constructor( GLSL, gl, fill, color, resolution, upperToLower ) {
        super( GLSL, gl, fill, color, resolution );

        this.A = upperToLower * 0.5;
        this.B = 0.5
        this.H = 0.5;

        this.vertices = [];
        this.indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 0; i < resolution + 2; ++i) {
            this.vertices.push(
                [this.A * Math.cos(angle) , this.Y , this.A * Math.sin(angle)]
            );
            this.vertices.push(
                [this.B * Math.cos(angle) , this.Y - this.H , this.B * Math.sin(angle)]
            );

            if( i > 1 ) {
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
}

class Cylinder extends FrustomCylinder{
    constructor( GLSL, gl, fill, color, resolution ) {
        super( GLSL, gl, fill, color, resolution, 1);
    }
}