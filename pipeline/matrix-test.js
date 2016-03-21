/*
 * Unit tests for our matrix object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        let identity = new Matrix();

        deepEqual(identity.array, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], "Identity Array");
        deepEqual(identity.array2d, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], "Identity 2d Array");
        deepEqual(identity.array2d, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], "Identity column major");
        equal(identity.height, 4, "Identity height");
        equal(identity.width, 4, "Identity width");

        let m = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);

        deepEqual(m.array, [1,2,3,4,5,6,7,8,9], "Matrix array");
        deepEqual(m.array2d, [[1,2,3],[4,5,6],[7,8,9]], "Matrix 2d array");
        deepEqual(m.colMajor, [[1,4,7],[2,5,8],[3,6,9]], "Matrix column major");

        equal(m.height, 3, "Matrix height");
        equal(m.width, 3, "Matrix width");

        let single = new Matrix([[42]]);

        deepEqual(single.array, [42], "1x1 array");
        deepEqual(single.array2d, [[42]], "1x1 2d array");
        deepEqual(single.colMajor, [[42]], "1x1 column major");

        equal(single.height, 1, "1x1 height");
        equal(single.width, 1, "1x1 width");

        let nonSquare = new Matrix([[1,2,3],[4,5,6],[7,8,9],[10, 11, 12]]);

        deepEqual(nonSquare.array, [1,2,3,4,5,6,7,8,9,10,11,12], "nonSquare array");
        deepEqual(nonSquare.array2d, [[1,2,3],[4,5,6],[7,8,9],[10, 11, 12]], "nonSquare 2d array");
        deepEqual(nonSquare.colMajor, [[1,4,7,10],[2,5,8,11],[3,6,9,12]], "nonSquare column major");


        equal(nonSquare.height, 4, "nonSquare height");
        equal(nonSquare.width, 3, "nonSquare width");

        let empty = new Matrix([]);

        deepEqual(empty.array, [], "empty Array");
        deepEqual(empty.array2d, [[]], "empty 2d Array");
        deepEqual(empty.colMajor, [[]], "empty column major");
        equal(empty.height, 0, "empty height");
        equal(empty.width, 0, "empty width");


        let dupe = Matrix.duplicate(m);
        deepEqual(dupe, m, "Duplication equality");
        deepEqual(dupe.width, m.width, "Duplication width equality");
        deepEqual(dupe.height, m.height, "Duplication height equality");

        dupe.copy(nonSquare);
        deepEqual(dupe, nonSquare, "Copy equality");
        deepEqual(dupe.width, nonSquare.width, "Copy width equality");
        deepEqual(dupe.height, nonSquare.height, "Copy height equality");

        let otherConstructor = new Matrix([1, 2, 3, 4], 2, 2);

        deepEqual(otherConstructor.array, [1, 2, 3, 4], "Other Constructor Array");
        deepEqual(otherConstructor.array2d, [[1,2], [3,4]], "Other Constructor 2d Array");
        equal(otherConstructor.height, 2, "Other Constructor height");
        equal(otherConstructor.width, 2, "Other Constructor width");

        let otherNonSquare = new Matrix([1, 2, 3, 4], 1, 4);

        deepEqual(otherNonSquare.array, [1, 2, 3, 4], "Other Constructor (non square) Array");
        deepEqual(otherNonSquare.array2d, [[1],[2], [3],[4]], "Other Constructor (non square) 2d Array");
        equal(otherNonSquare.height, 4, "Other Constructor (non square) height");
        equal(otherNonSquare.width, 1, "Other Constructor (non square) width");

        let otherNonSquare2 = new Matrix([1, 2, 3, 4, 5, 6], 3, 2);

        deepEqual(otherNonSquare2.array, [1, 2, 3, 4, 5, 6], "Other Constructor (non square) Array 2");
        deepEqual(otherNonSquare2.array2d, [[1, 2, 3],[4, 5, 6]], "Other Constructor (non square) 2d Array 2");
        equal(otherNonSquare2.height, 2, "Other Constructor (non square) height 2");
        equal(otherNonSquare2.width, 3, "Other Constructor (non square) width 2");

    });

    test("Addition and Subtraction", function () {
        let m1 = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
        let m2 = new Matrix([[4,5,6],[7,8,9],[10,11,12]]);
        let sum = Matrix.add(m1, m2);
        let difference = Matrix.subtract(m1, m2);

        deepEqual(sum.array2d, [[5,7,9],[11,13,15],[17,19,21]], "Matrix sum");
        deepEqual(difference.array2d, [[-3,-3,-3],[-3,-3,-3],[-3,-3,-3]], "Matrix difference");

        //errors
        let m3 = new Matrix([[4,5,6]]);
        throws(
            () => {
                return Matrix.add(m1, m3);
            }
            ,"Addition without same dimensions"
        );
    });

    test("Scaling", function () {
        let m = new Matrix([[1,2,3],[4,5,6],[7,8,9],[10,11,12]]);
        let scaledM = Matrix.scale(m, 5);
        
        deepEqual(scaledM.array, [5,10,15,20,25,30,35,40,45,50,55,60], "Scaling by 5");
        deepEqual(scaledM.height, 4, "Scaling by 5 height");
        deepEqual(scaledM.width, 3, "Scaling by 5 width");

        let zeroM = Matrix.scale(m, 0);
        deepEqual(zeroM.array, [0,0,0,0,0,0,0,0,0,0,0,0], "Scaling by 0");
        deepEqual(zeroM.height, 4, "Scaling by 0 height");
        deepEqual(zeroM.width, 3, "Scaling by 0 width");
    });
    test("Multiplication", function () {
        let identity = new Matrix();
        let m1 = new Matrix([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]);
        let product = Matrix.multiply(m1, identity);

        deepEqual(product.height, m1.height, "Identity multiplication height");
        deepEqual(product.width, m1.width, "Identity multiplication width");
        deepEqual(product, m1, "Identity multiplication");

        let m2 = new Matrix([1,2,3,4], 4, 1);
        let m3 = new Matrix([1,2,3,4], 1, 4);
        let expected = new Matrix([30], 1,1);

        product = Matrix.multiply(m2, m3);

        deepEqual(product.height, expected.height, "Row multiplication height");
        deepEqual(product.width, expected.width, "Row multiplication width");
        deepEqual(product, expected, "Row multiplication");

        expected = new Matrix([[1,2,3,4], [2,4,6,8], [3,6,9,12], [4,8,12,16]]);
        product = Matrix.multiply(m3, m2);

        deepEqual(product.height, expected.height, "Row multiplication (other way) height");
        deepEqual(product.width, expected.width, "Row multiplication (other way) width");
        deepEqual(product, expected, "Row multiplication (other way)");

        let m4 = new Matrix([[1,1,1],[2,2,2],[3,3,3]]);
        let m5 = new Matrix([[4,4,4],[5,5,5],[6,6,6]]);

        expected = new Matrix([[15,15,15],[30,30,30],[45,45,45]]);
        product = Matrix.multiply(m4, m5);

        deepEqual(product.height, expected.height, "Square multiplication height");
        deepEqual(product.width, expected.width, "Square multiplication width");
        deepEqual(product, expected, "Square multiplication");

        expected = new Matrix([[24,24,24],[30,30,30],[36,36,36]]);
        product = Matrix.multiply(m5, m4);

        deepEqual(product.height, expected.height, "Square multiplication (other way) height");
        deepEqual(product.width, expected.width, "Square multiplication (other way) width");
        deepEqual(product, expected, "Square multiplication (other way)");

        let m6 = new Matrix([1,2,3,4,5,6], 3, 2);
        let m7 = new Matrix([1,2,3,4,5,6], 2, 3);

        expected = new Matrix([22,28,49,64], 2, 2);
        product = Matrix.multiply(m6, m7);


        deepEqual(product.height, expected.height, "3x2, 2x3 height");
        deepEqual(product.width, expected.width, "3x2, 2x3 width");
        deepEqual(product, expected, "3x2, 2x3 multiplication");
    });
    test("Determinant", function() {
        let identity = new Matrix();
        deepEqual(identity.determinant(), 1, "Identity determinant");

        let m1 = new Matrix([[42]]);
        deepEqual(m1.determinant(), 42, "1x1 determinant");
        
        let m2 = new Matrix([[1,2],[3,4]]);
        deepEqual(m2.determinant(), -2, "2x2 determinant");

        let m3 = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);
        deepEqual(m3.determinant(), 0, "3x3 determinant");

        let m4 = new Matrix([[5,2,3,4],[1,4,3,4],[7,2,3,4],[1,2,3,2]]);
        deepEqual(m4.determinant(), 24, "4x4 determinant");
    });
    test("Translation", function() {
        let move111 = Matrix.translate(1,1,1);
        deepEqual(move111(0,0,0).array, [1,1,1,1], "Move origin by 1,1,1");
        deepEqual(move111(1,1,1).array, [2,2,2,1], "Move 1,1,1 by 1,1,1");
        deepEqual(move111(-1,-1,-1).array, [0,0,0,1], "Move -1,-1,-1 by 1,1,1");

        let move222 = Matrix.translate(2,2,2);
        deepEqual(move222(0,0,0).array, [2,2,2,1], "Move origin by 2,2,2");
        deepEqual(move222(1,1,1).array, [3,3,3,1], "Move 1,1,1 by 2,2,2");
        deepEqual(move222(-1,-1,-1).array, [1,1,1,1], "Move -1,-1,-1 by 2,2,2");

        let negMove111 = Matrix.translate(-1,-1,-1);
        deepEqual(negMove111(0,0,0).array, [-1,-1,-1,1], "Move origin by -1,-1,-1");
        deepEqual(negMove111(1,1,1).array, [0,0,0,1], "Move 1,1,1 by -1,-1,-1");
        deepEqual(negMove111(-1,-1,-1).array, [-2,-2,-2,1], "Move -1,-1,-1 by -1,-1,-1");


        let move = Matrix.translate(42,-69,153);
        deepEqual(move(0,0,0).array, [42,-69,153,1], "Move origin by 42,-69,153");
        deepEqual(move(1,1,1).array, [43,-68,154,1], "Move 1,1,1 by 42,-69,153");
        deepEqual(move(-1,-1,-1).array, [41,-70,152,1], "Move -1,-1,-1 by 42,-69,153");

    });
});
