// Note:
// Sprite.createVertexXxx() returns a Float32Array directly, but LineSegment2D
// doesn't. Instead, LineSegment2D's vertexPositions, vertexColors, indices are
// all arrays cuz later the values in these arrays will be combined to big Float32-
// Arrays or Uint16Array, not now.

import { DepthBufferValues } from './depth-buffer-values';
import { Vector2D } from '../math/2d-vector';

//
// Constructor.
//
function LineSegment2D (
    _lineSegmentBatch,
    _screenPosition1,
    _screenPosition2,
    _screenThickness,
    _color,
    _vertexPositions, // which is a [], not a Float32Array.
    _vertexColors     // which is a [], not a Float32Array.
){
    // 1. Vertex positions.
    LineSegment2D.createVertexPositions (
        // Part 1.
        _vertexPositions,
        // Part 2.
        _screenPosition1, _screenPosition2, _screenThickness
    );
    
    // 2. Vertex colors.
    LineSegment2D.createVertexColors(_vertexColors, _color);

    // Note:
    // Let LineSegment2DBatch get indices using LineSegment2D.INDICES directly.
    /*
    // 3. Indices.
    this.indices = LineSegment2D.INDICES;
    */
}

//
// Static constants.
//
LineSegment2D.VERTEX_COUNT  = 4;
LineSegment2D.POSITION_SIZE = 3; // (x, y, z)
LineSegment2D.COLOR_SIZE    = 4; // (r, g, b, a)
LineSegment2D.INDEX_COUNT   = 6; // (0, 1, 2, 2, 1, 3)

LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

LineSegment2D.INDICES = [ 0, 1, 2, 2, 1, 3 ];

//
// Static methods.
// 
LineSegment2D.createVertexPositions = function (
    a,
    screenPosition1,
    screenPosition2,
    screenThickness
){
    // Note:
    // See the note in the beginning of this constructor function.

    var p1 = screenPosition1.xy;
    var p2 = screenPosition2.xy;

    // Note:
    // Imagine p1 is on the lower-left side of p2.
    //
    //         p2
    //        /
    //       /
    //      /
    //    p1
    //
    // Then calculate a perpendicular vector, which is the 90 degrees 'counter-
    // clockwise' rotated result of the input vector: (p2 - p1). In this case,
    // v is from lower-right to upper-left.
    //
    var v = Vector2D.calculatePerpendicularVectorOf (
        Vector2D.subtractVectors(p2, p1) // p2 - p1
    );

    v = Vector2D.calculateUnitVectorOf(v);

    var halfScreenThickness = screenThickness * 0.5;

    // Note:
    // Use the imagination above, 4 corners are then found below.

    v = Vector2D.multiplyVectorByScalar(v, halfScreenThickness);

    // Lower right.
    var p3 = Vector2D.subtractVectors(p2, v); // p2 - v

    // Upper rght.
    var p4 = Vector2D.addVectors(p2, v); // p2 + v

    // Lower left.
    var p5 = Vector2D.subtractVectors(p1, v); // p1 - v

    // Upper left.
    var p6 = Vector2D.addVectors(p1, v); // p1 + v

    a[0]=p3.x;    a[ 1]=p3.y;    a[ 2]=screenPosition2.z;
    a[3]=p4.x;    a[ 4]=p4.y;    a[ 5]=screenPosition2.z;
    a[6]=p5.x;    a[ 7]=p5.y;    a[ 8]=screenPosition1.z;
    a[9]=p6.x;    a[10]=p6.y;    a[11]=screenPosition1.z;
};

LineSegment2D.createVertexColors = function(a, color) {
    //
    // Note:
    // See the note in the beginning of this constructor function.
    //
    a[ 0]=color.r;    a[ 1]=color.g;    a[ 2]=color.b;    a[ 3]=color.a;
    a[ 4]=color.r;    a[ 5]=color.g;    a[ 6]=color.b;    a[ 7]=color.a;
    a[ 8]=color.r;    a[ 9]=color.g;    a[10]=color.b;    a[11]=color.a;
    a[12]=color.r;    a[13]=color.g;    a[14]=color.b;    a[15]=color.a;
};

export { LineSegment2D };
