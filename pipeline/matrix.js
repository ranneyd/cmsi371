class Matrix{
    // Take in a two dimensional array representing the matrix Will throw an
    // exception if sub-arrays aren't the same length or non-array
    constructor( matrix ) {
        if(!matrix) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.height = 4;
            this.width = 4;
        }
        else {
            let height = matrix.length;
            if(height === 0 ){
                this.matrix = [];
                this.width = 0;
                this.height = 0;
            }
            else{
                this.width = matrix[0].length;
                this.height = 0;
                this.matrix = [];
                for(let i = 0; i < matrix.length; ++i) {
                    this.height++;
                    let row = matrix[i];
                    if(row.length !== this.width) {
                        let msg = "Matrix must be an array of arrays where all "
                                + "sub-arrays are the same length";
                        throw new Error(msg);
                    }
                    else{
                        this.matrix = this.matrix.concat(row);
                    }
                }
            }
            
        }
    }
    copy(Matrix){
        this.matrix = Matrix.matrix;
        this.height = Matrix.height;
        this.width = Matrix.width;
        return this;
    }
    get array(){
        return this.matrix;
    }
    get array2d(){
        let matrix = [];
        for(let row = 0; row < this.height; ++row) {
            let rowObj = [];
            for(let col = 0; col < this.width; ++col) {
                rowObj.push(this.matrix[row * this.width + col]);
            }
            matrix.push(rowObj);
        }
        return matrix;
    }
    scale(scalar){
        for(let i = 0; i < 3; ++i) {
            this.top[i] *= scalar;
            this.middle[i] *= scalar;
            this.bottom[i] *= scalar;
        }
        return this;
    }
    static multiply(a, b){
        let result = new Matrix();

        this.copy(result);
    }
    multiply(matrix){
        let result = Matrix.multiply(this, matrix);
        this.matrix = result.matrix
        return this;
    }
}