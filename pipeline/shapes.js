'use strict';
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
            ]
        };
    },
    /*
     * Returns the vertices for a small cone.
     */
    cone: function (faceCount) {
        const X = 0;
        const Y = 0;
        const Z = 0;
        const H = 0.5;
        const R = 0.5;

        let vertices = [
            [ X, Y, Z]
        ];
        let indices = [];

        let thetaDelta = 2 * Math.PI / faceCount;
        let angle = 0;
        for(let i = 1; i < faceCount + 1; ++i) {
            vertices.push(
                [R * Math.cos(angle) , Y - H , R * Math.sin(angle)]
            );
            if( i > 1 ) {
                indices.push([0, i - 1, i]);
            }
            angle += thetaDelta;
        }
        indices.push([0, faceCount, 1]);

        return {
            vertices: vertices,
            indices: indices
        };
    },
    cylinder: function(resolution) {
        const R = 0.5;
        const H = 0.5;
        const X = 0;
        const Y = 0;
        const Z = 0;

        let vertices = [];
        let indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 0; i < resolution + 2; ++i) {
            vertices.push(
                [R * Math.cos(angle) , Y , R * Math.sin(angle)]
            );
            vertices.push(
                [R * Math.cos(angle) , Y - H , R * Math.sin(angle)]
            );

            if( i > 1 ) {
                let [nw, sw, ne, se] = [2 * i - 2, 2 * i - 1, 2 * i, 2 * i + 1]
                indices.push([ne, nw, se]);
                indices.push([sw, se, nw]);
            }

            angle += thetaDelta;
        }
        for(let i = 1; i < resolution; ++i) {
            indices.push([0, 2 * i, 2 * (i + 1)]);
            indices.push([1, 2 * i + 1, 2 * (i + 1) + 1]);
        }

        return {
            vertices: vertices,
            indices: indices
        };
    },
    roundedCylinder: function(upperToLower, resolution){
        const A = upperToLower;
        const B = 1
        const H = 0.5;
        const X = 0;
        const Y = 0;
        const Z = 0;

        let vertices = [];
        let indices = [];

        let thetaDelta = 2 * Math.PI / resolution;
        let angle = 0;
        for(let i = 0; i < resolution + 2; ++i) {
            vertices.push(
                [A * Math.cos(angle) , Y , A * Math.sin(angle)]
            );
            vertices.push(
                [B * Math.cos(angle) , Y - H , B * Math.sin(angle)]
            );
            vertices.push(
                [A * Math.cos(angle) , Y - 2 * H , A * Math.sin(angle)]
            );

            if( i > 1 ) {
                let verts = {
                    upper: {
                        left: 3 * (i - 1),
                        right: 3 * i
                    },
                    middle: {
                        left: 3 * (i - 1) + 1,
                        right: 3 * i + 1
                    },
                    lower: {
                        left: 3 * (i - 1) + 2,
                        right: 3 * i +2
                    }
                }
                indices.push([verts.upper.left, verts.middle.left, verts.upper.right]);
                indices.push([verts.upper.right, verts.middle.left, verts.middle.right]);
                indices.push([verts.middle.left, verts.lower.left, verts.middle.right]);
                indices.push([verts.middle.right, verts.lower.left, verts.lower.right]);
            }

            angle += thetaDelta;
        }
        for(let i = 1; i < resolution; ++i) {
            indices.push([0, 3 * i, 3 * (i + 1)]);
            indices.push([2, 3 * i + 2, 3 * (i + 1) + 2]);
        }

        return {
            vertices: vertices,
            indices: indices
        };

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
    }

};
