class Matrix {
    // Take in a two dimensional array representing the matrix Will throw an
    // exception if sub-arrays aren't the same length or non-array
    constructor( matrix ) {
        if( !matrix ) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.height = 4;
            this.width = 4;
        }
        else {
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

        for( let row = 0; row < b.width; ++row ) {
            let rowObj = [];
            for( let col = 0; col < this.height; ++col ) {
                let elem = 0;
                for( let i = 0; i < this.width; ++i) {
                    elem += this.matrix[row * this.width + i]
                          * b.matrix[i * b.width + col];
                }
                rowObj.push(elem);
            }
            result.concat(rowObj);
        }
        this.matrix = result;
        this.width = b.width;
        return this;
    }
}