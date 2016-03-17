class Matrix{
    // Take in a two dimensional array representing the matrix Will throw an
    // exception if sub-arrays aren't the same length or non-array
    constructor( matrix ) {
        if(matrix) {
            this.matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            this.height = 4;
            this.width = 4;
        }
        else {
            let height = matrix.length;
            if(height === 0 ){
                this.matrix = [];
            }
            else{
                let width = matrix[0].length;
                this.matrix = [];
                for(let i = 0; i < matrix.length; ++i) {
                    let row = matrix[i];
                    if(typeof row !== 'array' || row.length !== width) {
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
    get array(){
        return [...this.top, ...this.middle, ...this.bottom];
    }
    get array2d(){
        return [this.top, this.middle, this.bottom];
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

    }
    multiply(matrix){
        let result = Matrix.multiply(this, matrix);
        this.top = result.top;
        this.middle = result.middle;
        this.bottom = result.bottom;
        return this;
    }
}