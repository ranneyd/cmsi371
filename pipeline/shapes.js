'use strict';
/*
 * This module defines/generates vertex arrays for certain predefined shapes.
 * The "shapes" are returned as indexed vertices, with utility functions for
 * converting these into "raw" coordinate arrays.
 */
var Shapes = {
    /*
     * Returns the vertices and indices for a small cone.
     */
    cube: function () {
        const [S, X, Y, Z] = [0.5, 0, 0, 0];
        let vertices = [
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

        let indices = [
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
        return {
            vertices: vertices,
            indices: indices
        }
    },
    /*
     * Returns the vertices and indices for a small cone.
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
    frustomOfCone: function(upperToLower, resolution){
        const A = upperToLower * 0.5;
        const B = 0.5
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
                indices.push([verts.upper.left, verts.lower.left, verts.upper.right]);
                indices.push([verts.upper.right, verts.lower.left, verts.lower.right]);
            }

            angle += thetaDelta;
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
