/*
 * Unit tests for our matrix object.
 */
$(function () {

    // This suite checks instantiation basics.
    test("Creation and Data Access", function () {
        let identity = new Matrix();

        deepEqual(identity.array, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], "Identity Array");
        deepEqual(identity.array2d, [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]], "Identity 2d Array");
        equal(identity.height, 4, "Identity height");
        equal(identity.width, 4, "Identity width");

        let m = new Matrix([[1,2,3],[4,5,6],[7,8,9]]);

        deepEqual(m.array, [1,2,3,4,5,6,7,8,9], "Matrix array");
        deepEqual(m.array2d, [[1,2,3],[4,5,6],[7,8,9]], "Matrix 2d array");

        equal(m.height, 3, "Matrix height");
        equal(m.width, 3, "Matrix width");

        let nonSquare = new Matrix([[1,2,3],[4,5,6],[7,8,9],[10, 11, 12]]);

        deepEqual(nonSquare.array, [1,2,3,4,5,6,7,8,9,10,11,12], "nonSquare array");
        deepEqual(nonSquare.array2d, [[1,2,3],[4,5,6],[7,8,9],[10, 11, 12]], "nonSquare 2d array");

        equal(nonSquare.height, 4, "nonSquare height");
        equal(nonSquare.width, 3, "nonSquare width");

        let empty = new Matrix([]);

        deepEqual(empty.array, [], "empty Array");
        deepEqual(empty.array2d, [], "empty 2d Array");
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

    // test("Dot Product", function () {
    //     var v1 = new Vector(-5, -2),
    //         v2 = new Vector(-3, 4);

    //     equal(v1.dot(v2), 7, "2D dot product");

    //     // Try for a perpendicular.
    //     v1 = new Vector(Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    //     v2 = new Vector(-Math.sqrt(2) / 2, Math.sqrt(2) / 2);
    //     equal(v1.dot(v2), 0, "Perpendicular 2D dot product");

    //     // Try 3D.
    //     v1 = new Vector(3, 2, 5);
    //     v2 = new Vector(4, -1, 3);
    //     equal(v1.dot(v2), 25, "3D dot product");

    //     // And 4D.
    //     v1 = new Vector(2, 2, 4, 8);
    //     v2 = new Vector(-1, 7, 0, 20);
    //     equal(v1.dot(v2), 172, "4D dot product");

    //     // Check for errors.
    //     v1 = new Vector(4, 2);
    //     v2 = new Vector(3, 9, 1);

    //     // We can actually check for a *specific* exception, but
    //     // we won't go that far for now.
    //     throws(
    //         function () {
    //             return v1.dot(v2);
    //         },
    //         "Check for matrixs of different sizes"
    //     );
    // });

    // test("Cross Product", function () {
    //     var v1 = new Vector(3, 4),
    //         v2 = new Vector(1, 2),
    //         vresult;

    //     // The cross product is restricted to 3D, so we start
    //     // with an error check.
    //     throws(
    //         function () {
    //             return v1.cross(v2);
    //         },
    //         "Check for non-3D matrixs"
    //     );

    //     // Yeah, this is a bit of a trivial case.  But it at least
    //     // establishes the right-handedness of a cross-product.
    //     v1 = new Vector(1, 0, 0);
    //     v2 = new Vector(0, 1, 0);
    //     vresult = v1.cross(v2);

    //     equal(vresult.x(), 0, "Cross product first element");
    //     equal(vresult.y(), 0, "Cross product second element");
    //     equal(vresult.z(), 1, "Cross product third element");

    //     // This one shows that switching matrix order produces
    //     // the opposite-pointing normal.
    //     vresult = v2.cross(v1);

    //     equal(vresult.x(), 0, "Cross product first element");
    //     equal(vresult.y(), 0, "Cross product second element");
    //     equal(vresult.z(), -1, "Cross product third element");
    // });

    // test("Magnitude and Unit Vectors", function () {
    //     var v = new Vector(3, 4);

    //     // The classic example.
    //     equal(v.magnitude(), 5, "2D magnitude check");

    //     // Kind of a cheat, but still tests the third dimension.
    //     v = new Vector(5, 0, 12);
    //     equal(v.magnitude(), 13, "3D magnitude check");

    //     // Now for unit matrixs.
    //     v = (new Vector(3, 4)).unit();

    //     equal(v.magnitude(), 1, "2D unit matrix check");
    //     equal(v.x(), 3 / 5, "2D unit matrix first element");
    //     equal(v.y(), 4 / 5, "2D unit matrix second element");

    //     v = (new Vector(0, -7, 24)).unit();

    //     equal(v.magnitude(), 1, "3D unit matrix check");
    //     equal(v.x(), 0, "3D unit matrix first element");
    //     equal(v.y(), -7 / 25, "3D unit matrix second element");
    //     equal(v.z(), 24 / 25, "3D unit matrix third element");
    // });

    // test("Projection", function () {
    //     var v = new Vector(3, 3, 0),
    //         vresult = v.projection(new Vector(5, 0, 0));

    //     equal(vresult.magnitude(), 3, "3D matrix projection magnitude check");
    //     equal(vresult.x(), 3, "3D matrix projection first element");
    //     equal(vresult.y(), 0, "3D matrix projection second element");
    //     equal(vresult.z(), 0, "3D matrix projection third element");

    //     // Error check: projection only applies to matrixs with the same
    //     // number of dimensions.
    //     throws(
    //         function () {
    //             (new Vector(5, 2)).projection(new Vector(9, 8, 1));
    //         },
    //         "Ensure that projection applies only to matrixs with the same number of dimensions"
    //     );
    // });

});
