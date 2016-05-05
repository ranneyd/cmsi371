/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {
    /*
     * Returns the vertices for a small icosahedron.
     */
    icosahedron: function () {
        // These variables are actually "constants" for icosahedron coordinates.
        var X = 0.525731112119133606;
        var Z = 0.850650808352039932;

        return {
            vertices: [
                [ -X, 0.0, Z ],
                [ X, 0.0, Z ],
                [ -X, 0.0, -Z ],
                [ X, 0.0, -Z ],
                [ 0.0, Z, X ],
                [ 0.0, Z, -X ],
                [ 0.0, -Z, X ],
                [ 0.0, -Z, -X ],
                [ Z, X, 0.0 ],
                [ -Z, X, 0.0 ],
                [ Z, -X, 0.0 ],
                [ -Z, -X, 0.0 ]
            ],

            indices: [
                [ 1, 4, 0 ],
                [ 4, 9, 0 ],
                [ 4, 5, 9 ],
                [ 8, 5, 4 ],
                [ 1, 8, 4 ],
                [ 1, 10, 8 ],
                [ 10, 3, 8 ],
                [ 8, 3, 5 ],
                [ 3, 2, 5 ],
                [ 3, 7, 2 ],
                [ 3, 10, 7 ],
                [ 10, 6, 7 ],
                [ 6, 11, 7 ],
                [ 6, 0, 11 ],
                [ 6, 1, 0 ],
                [ 10, 1, 6 ],
                [ 11, 0, 9 ],
                [ 2, 11, 9 ],
                [ 5, 2, 9 ],
                [ 11, 2, 7 ]
            ],

            matrix: new Matrix()
        };
    },

    /*
     * Returns the vertices for a small cube.  Note the breakdown into triangles.
     */
    cube: function () {
        return {
            vertices: [
                [ 0.5, 0.5, 0.5 ],
                [ 0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, -0.5 ],
                [ -0.5, 0.5, 0.5 ],
                [ 0.5, -0.5, 0.5 ],
                [ 0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, -0.5 ],
                [ -0.5, -0.5, 0.5 ]
            ],

            indices: [
                [ 0, 1, 3 ],
                [ 2, 3, 1 ],
                [ 0, 3, 4 ],
                [ 7, 4, 3 ],
                [ 0, 4, 1 ],
                [ 5, 1, 4 ],
                [ 1, 5, 6 ],
                [ 2, 1, 6 ],
                [ 2, 7, 3 ],
                [ 6, 7, 2 ],
                [ 4, 7, 6 ],
                [ 5, 4, 6 ]
            ],

            matrix: new Matrix()
        };
    },
    cone: function(resolution) {
        const H = 1;
        const R = 1;
        const X = 0;
        const Y = 0;
        const Z = 0;

        vertices = [
            [ X, Y, Z]
        ];
        indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 1; i < resolution + 1; ++i) {
            vertices.push(
                [R * Math.cos(angle) , Y - H , R * Math.sin(angle)]
            );
            if( i > 1 ) {
                indices.push([0, i - 1, i]);
            }
            angle += thetaDelta;
        }
        indices.push([0, resolution, 1]);

        return {
            vertices: vertices,
            indices: indices,
            matrix: new Matrix()
        };
    },
    // A: ratio of top to bottom
    frustumCylinder: function (A, resolution) {
        const B = 1;
        const H = 1;
        const X = 1;
        const Y = 1;
        const Z = 1;

        let vertices = [];
        let indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 0; i < resolution + 1; ++i) {
            vertices.push(
                [A * Math.cos(angle) , Y , A * Math.sin(angle)]
            );
            vertices.push(
                [B * Math.cos(angle) , Y - H , B * Math.sin(angle)]
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
                indices.push([verts.upper.left, verts.lower.left, verts.upper.right]);
                indices.push([verts.upper.right, verts.lower.left, verts.lower.right]);
            }

            angle += thetaDelta;
        }
        return {
            vertices: vertices,
            indices: indices,
            matrix: new Matrix()
        };
    },
    cylinder: function(resolution){
        return Shapes.frustumCylinder(1, resolution);
    },
    sphere: function(resolution) {
        // Generate the sphere as stacked frustum cylinders. Each one gets
        // smaller as we go up the sphere. Each time we make a duplicate and
        // rotate it pi radians to make the bottom half of the sphere

        // Scale of the current slice of sphere. Begins at 1 and gets smaller
        let scale = 1;

        // Angle increases by the step every time
        let lastAngle = 0;
        let step = Math.PI / (2 * resolution);
        let angle = step;

        let children = [];

        for( let i = 1; i < resolution; ++i ) {
            // Cosine gives us horizontal size. Each slice has a ratio of top
            // to bottom proportional to the cosine of the new angle to the
            // previous angle. This way each slice has a bottom width of the
            // previous slice's top width
            let upperToLower = Math.cos(angle) / Math.cos(lastAngle);

            let part = Shapes.frustumCylinder(upperToLower, resolution);

            // Sine is vertical size. Same logic as before basically.
            let sin = Math.sin(angle);
            let sinLast = Math.sin(lastAngle);

            part.matrix.scale(scale, sin - sinLast , scale);
            // I do not know why this is 2 *. But it doesn't work without it
            part.matrix.translate(0, 2 * sinLast, 0);

            // We reduce the scale using this same ratio
            scale *= upperToLower;
            lastAngle += step;
            angle += step;

            let bottomPart = Shapes.frustumCylinder(1/upperToLower, resolution);
            bottomPart.matrix.scale(scale, sin - sinLast , scale);
            // I do not know why this is * 2. But it doesn't work without it
            bottomPart.matrix.translate(0, -2 * sin, 0);

            children.push(part);

            children.push(bottomPart);
        }
        // Do the caps

        let top = Shapes.cone(resolution);
        top.color = {r: 0.0, b: 1.0, g: 0.0};

        let sin = Math.sin(angle);
        let sinLast = Math.sin(lastAngle);
        top.matrix.scale(scale, sin - sinLast, scale);
        top.matrix.translate(0, 1, 0);

        children.push( top );

        let bot = Shapes.cone(resolution);
        bot.color = {r: 0.0, b: 0.0, g: 1.0};

        //bot.matrix.scale(scale, sin - sinLast, scale);
        bot.matrix.translate(0, -2, 0);

        children.push(bot);

        return children;
    },
    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as triangles.
     */
    toRawTriangleArray: function (indexedVertices) {
        var result = [];

        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for turning indexed vertices into a "raw" coordinate array
     * arranged as line segments.
     */
    toRawLineArray: function (indexedVertices) {
        var result = [];

        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    indexedVertices.vertices[
                        indexedVertices.indices[i][j]
                    ],

                    indexedVertices.vertices[
                        indexedVertices.indices[i][(j + 1) % maxj]
                    ]
                );
            }
        }

        return result;
    },

    /*
     * Utility function for computing normal vectors based on indexed vertices.
     * The secret: take the cross product of each triangle.  Note that vertex order
     * now matters---the resulting normal faces out from the side of the triangle
     * that "sees" the vertices listed counterclockwise.
     *
     * The vector computations involved here mean that the Vector module must be
     * loaded up for this function to work.
     */
    toNormalArray: function (indexedVertices) {
        var result = [];

        // For each face...
        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // We form vectors from the first and second then second and third vertices.
            var p0 = indexedVertices.vertices[indexedVertices.indices[i][0]];
            var p1 = indexedVertices.vertices[indexedVertices.indices[i][1]];
            var p2 = indexedVertices.vertices[indexedVertices.indices[i][2]];

            // Technically, the first value is not a vector, but v can stand for vertex
            // anyway, so...
            var v0 = new Vector(p0[0], p0[1], p0[2]);
            var v1 = new Vector(p1[0], p1[1], p1[2]).subtract(v0);
            var v2 = new Vector(p2[0], p2[1], p2[2]).subtract(v0);
            var normal = v1.cross(v2).unit();

            // We then use this same normal for every vertex in this face.
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    },

    /*
     * Another utility function for computing normals, this time just converting
     * every vertex into its unit vector version.  This works mainly for objects
     * that are centered around the origin.
     */
    toVertexNormalArray: function (indexedVertices) {
        var result = [];

        // For each face...
        for (var i = 0, maxi = indexedVertices.indices.length; i < maxi; i += 1) {
            // For each vertex in that face...
            for (var j = 0, maxj = indexedVertices.indices[i].length; j < maxj; j += 1) {
                var p = indexedVertices.vertices[indexedVertices.indices[i][j]];
                var normal = new Vector(p[0], p[1], p[2]).unit();
                result = result.concat(
                    [ normal.x(), normal.y(), normal.z() ]
                );
            }
        }

        return result;
    }

};
