'use strict';

// A fork of matrix.js, streamlined for WebGL. Everything is column-major and we assume every matrix
// is 4x4

class Matrix {
    constructor( matrix ) {
        if( !matrix ) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        }
        else{
            this.matrix = matrix;
        }
    }
    copy( b ) {
        for(let i = 0; i < 16; ++i){
            this.matrix[i] = b.matrix[i];
        }
        return this;
    }
    duplicate() {
        return new Matrix( this.matrix );
    }

    get gl() {
        let matrix = [];
        for( let col = 0; col < 4; ++col ) {
            for( let row = 0; row < 4; ++row ) {
                matrix.push(this.matrix[row * 4 + col]);
            }
        }
        return matrix;
    }
    scalarMultiply( scalar ) {
        for(let i = 0; i < 16; ++i) {
            this.matrix[i] *= scalar;
        }
        return this;
    }
    add( b ) {
        return this.addition( b, false );
    }
    subtract( b ) {
        return this.addition( b, true );
    }

    // helper function so addition/subtraction can have mutual code
    // More efficient than scaling by -1 then adding for subtraction
    // because it's only one loop
    // Would be private if I could in javascript
    addition( b, subtracting ) {
        let negativePerhaps = subtracting ? -1 : 1;
        for( let i = 0; i < 16; ++i ) {
            this.matrix[i] += negativePerhaps * b.matrix[i];
        }
        return this;
    }
    multiply( b ) {
        let result = [];

        for( let row = 0; row < 4; ++row ) {
            let rowObj = [];
            for( let col = 0; col < 4; ++col ) {
                let elem = 0;
                for( let i = 0; i < 4; ++i) {
                    elem += this.matrix[row * 4 + i]
                          * b.matrix[i * 4 + col];
                }
                rowObj.push(elem);
            }
            result = result.concat(rowObj);
        }
        this.matrix = result;
        return this;
    }
    // Like multiply, but the argument matrix is now the left one
    transform( a ) {
        let result = [];

        for( let row = 0; row < 4; ++row ) {
            let rowObj = [];
            for( let col = 0; col < 4; ++col ) {
                let elem = 0;
                for( let i = 0; i < 4; ++i) {
                    elem += a.matrix[row * 4 + i]
                          * this.matrix[i * 4 + col];
                }
                rowObj.push(elem);
            }
            result = result.concat(rowObj);
        }
        this.matrix = result;
        return this;
    }

    // Transforms

    // Returns a matrix that translates by dx, dy, and dz
    translate( dx, dy, dz ) {
        return this.transform(new Matrix([1,0,0,dx,0,1,0,dy,0,0,1,dz,0,0,0,1],4,4));
    }
    static translate( dx, dy, dz) {
        return (new Matrix()).translate( dx, dy, dz );
    }
    // Returns a matrix that translates by sx, sy, and sz
    scale(sx, sy, sz) {
        return this.transform(new Matrix([sx,0,0,0,0,sy,0,0,0,0,sz,0,0,0,0,1],4,4));
    }
    static scale( sx, sy, sz) {
        return (new Matrix()).scale( sx, sy, sz );
    }
    // Returns a matrix that rotates theta radians around a vector defined by
    // rz, ry, and rz. From Dondi's starter code
    rotate(angle, x, y, z) {
        // In production code, this function should be associated
        // with a matrix object with associated functions.
        var axisLength = Math.sqrt((x * x) + (y * y) + (z * z));
        var s = Math.sin(angle * Math.PI / 180.0);
        var c = Math.cos(angle * Math.PI / 180.0);
        var oneMinusC = 1.0 - c;

        // Normalize the axis vector of rotation.
        x /= axisLength;
        y /= axisLength;
        z /= axisLength;

        // Now we can calculate the other terms.
        // "2" for "squared."
        var x2 = x * x;
        var y2 = y * y;
        var z2 = z * z;
        var xy = x * y;
        var yz = y * z;
        var xz = x * z;
        var xs = x * s;
        var ys = y * s;
        var zs = z * s;

        // GL expects its matrices in column major order.
        return this.transform(new Matrix( [
            (x2 * oneMinusC) + c,
            (xy * oneMinusC) + zs,
            (xz * oneMinusC) - ys,
            0.0,

            (xy * oneMinusC) - zs,
            (y2 * oneMinusC) + c,
            (yz * oneMinusC) + xs,
            0.0,

            (xz * oneMinusC) + ys,
            (yz * oneMinusC) - xs,
            (z2 * oneMinusC) + c,
            0.0,

            0.0,
            0.0,
            0.0,
            1.0
        ] ));
    }
    static rotate(theta, rx, ry, rz) {
        return (new Matrix()).rotate(theta, rx, ry, rz) ;
    }
    ortho(left, right, bottom, top, zNear, zFar) {
        let width = right - left;
        let height = top - bottom;
        let depth = zFar - zNear;

        return this.transform(new Matrix([
            2.0 / width,
            0.0,
            0.0,
            0.0,

            0.0,
            2.0 / height,
            0.0,
            0.0,

            0.0,
            0.0,
            -2.0 / depth,
            0.0,

            -(right + left) / width,
            -(top + bottom) / height,
            -(zFar + zNear) / depth,
            1.0
        ]));
    }
    static ortho(left, right, bottom, top, zNear, zFar) {
        return (new Matrix()).ortho(left, right, bottom, top, zNear, zFar);
    }
    frustumProject( L, R, B, T, N, F ) {
        return this.transform(new Matrix([
                2 * N / (R - L), 0, ( R + L ) / ( R - L ), 0,
                0, 2 * N / ( T - B ), ( T + B ) / ( T - B ), 0,
                0, 0, - ( F + N ) / ( F - N ), -2 * N * F / ( F - N ),
                0, 0, -1, 0
            ], 4, 4));
    }
    static frustumProject( L, R, B, T, N, F ) {
        return (new Matrix()).frustumProject( L, R, B, T, N, F );
    }
}