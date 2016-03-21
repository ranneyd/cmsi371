class Matrix {
    // Options:
    //    1) Pass nothing, get a 4x4 identity matrix
    //    2) Pass in one two-dimensional array representing the matrix. Will
    //       throw an exception if sub-arrays aren't the same length or nonarray
    //    3) Pass a one-dimensional array representing the matrix, a width, and
    //       a height. Throws an exception if length of array doesn't equal the
    //       width times the height
    constructor( matrix, width, height ) {
        if( !matrix ) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.height = 4;
            this.width = 4;
        }
        else if (!width) {
            let height = matrix.length;
            if( height === 0 ) {
                this.matrix = [];
                this.width = 0;
                this.height = 0;
            }
            else {
                this.width = matrix[0].length;
                this.height = 0;
                this.matrix = [];
                for( let i = 0; i < matrix.length; ++i ) {
                    this.height++;
                    let row = matrix[i];
                    if( row.length !== this.width ) {
                        let msg = "Matrix must be an array of arrays where all "
                                + "sub-arrays are the same length";
                        throw new Error(msg);
                    }
                    else {
                        this.matrix = this.matrix.concat(row);
                    }
                }
            }
        }
        else if(!height) {
            let msg = "Constructor needs either a two-dimensional array, or a "
                    + "one-dimensional array, a width, and a height";
            throw new Error( msg );
        }
        else {
            if( matrix.length !== width * height) {
                let msg = `Passed array has a length (${matrix.length}) that `
                        + `doesn't work with this width (${width}) and height `
                        + `(${height})`;
                throw new Error( msg );
            }
            this.height = height;
            this.width = width;
            this.matrix = matrix;
        }
    }
    copy( b ) {
        this.matrix = b.matrix;
        this.height = b.height;
        this.width = b.width;
        return this;
    }
    static duplicate( b ) {
        return new Matrix( b.array2d );
    }
    get array() {
        return this.matrix;
    }
    get array2d() {
        if( this.height === 0 ) {
            return [[]];
        }
        let matrix = [];
        for( let row = 0; row < this.height; ++row ) {
            let rowObj = [];
            for( let col = 0; col < this.width; ++col ) {
                rowObj.push(this.matrix[row * this.width + col]);
            }
            matrix.push(rowObj);
        }
        return matrix;
    }
    get colMajor() {
        if( this.height === 0 ) {
            return [[]];
        }
        let matrix = [];
        for( let col = 0; col < this.width; ++col ) {
            let rowObj = [];
            for( let row = 0; row < this.height; ++row ) {
                rowObj.push(this.matrix[row * this.width + col]);
            }
            matrix.push(rowObj);
        }
        return matrix;
    }
    static scale(a, scalar){
        return Matrix.duplicate(a).scale( scalar );
    }
    scale( scalar ) {
        let length = this.matrix.length;
        for(let i = 0; i < length; ++i) {
            this.matrix[i] *= scalar;
        }
        return this;
    }
    static add( a, b ) {
        return Matrix.duplicate( a ).add( b );
    }
    static subtract( a, b ) {
        return Matrix.duplicate( a ).subtract( b );
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
        if( this.width !== b.width || this.height !== b.height ) {
            let msg = `Matrix a (${this.width}, ${this.height}) must have the `
                    + `same dimensions as matrix b (${b.width}, ${b.height})`;
            throw new Error( msg );
        }

        let length = this.matrix.length;
        let negativePerhaps = subtracting ? -1 : 1;
        for( let i = 0; i < length; ++i ) {
            this.matrix[i] += negativePerhaps * b.matrix[i];
        }

        return this;
    }
    static multiply( a, b ) {
        return Matrix.duplicate( a ).multiply( b );
    }
    multiply( b ) {
        if( this.width !== b.height ) {
            let msg = `Matrix a must have a width (${this.width}) equal to `
                    + `matrix b's height(${b.height})`;
            throw new Error( msg );
        }
        let result = [];

        for( let row = 0; row < this.height; ++row ) {
            let rowObj = [];
            for( let col = 0; col < b.width; ++col ) {
                let elem = 0;
                for( let i = 0; i < this.width; ++i) {
                    elem += this.matrix[row * this.width + i]
                          * b.matrix[i * b.width + col];
                }
                rowObj.push(elem);
            }
            result = result.concat(rowObj);
        }
        this.matrix = result;
        this.width = b.width;
        return this;
    }

    determinant(){
        if(this.width !== this.height) {
            let msg = "Determinant can only be found for square matrices";
            throw new Error( msg );
        }
        const N = this.width;
        if(N === 1) {
            return this.matrix[0];
        }

        let det = 0;
        for(let i = 0; i < N; ++i) {
            let elem = this.matrix[i];
            let matrix = new Array(N - 1);
            // construct our sub-matrix
            for(let row = 1; row < N; ++row) {
                matrix[row - 1] = [];
                for(let col = 0; col < N; ++ col) {
                    // Ignore the column that contains the element we scale by
                    if( col !== i ) {
                        matrix[row - 1].push(this.matrix[row * N + col]);
                    }
                }
            }
            // sign alternates
            det += (i % 2 ? -1 : 1) * elem * (new Matrix(matrix)).determinant();
        }

        return det;
    }

    // Transforms

    // Returns a matrix that translates by dx, dy, and dz
    static translate(dx, dy, dz) {
        return new Matrix([1,0,0,dx,0,1,0,dy,0,0,1,dz,0,0,0,1],4,4);;
    }
    // Returns a matrix that translates by sx, sy, and sz
    static scale(sx, sy, sz) {
        return new Matrix([sx,0,0,0,0,sy,0,0,0,0,sz,0,0,0,0,1],4,4);
    }
    // // Returns a matrix that rotates around a vector defined by rz, ry, and rz
    // static scale(rx, ry, rz) {
    //     let mat = new Matrix([sx,0,0,0,0,sy,0,0,0,0,sz,0,0,0,0,1],4,4);
    //     return transform( mat );
    // }
}