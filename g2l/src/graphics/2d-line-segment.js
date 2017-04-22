import { DepthBufferValues } from './depth-buffer-values';
import { Vector2D }          from '../math/2d-vector';
import { Vector3D }          from '../math/3d-vector';

//
// Constructor.
//
function LineSegment2D (
    _lineSegmentBatch,
    _screenPosition1,
    _screenPosition2,
    _screenThickness,
    _color
){
    // 1. Vertex positions.
    this.vertexPositions = LineSegment2D.createVertexPositions (
        _screenPosition1,
        _screenPosition2,
        _screenThickness
    );
    
    // 2. Vertex colors.
    this.vertexColors = LineSegment2D.createVertexColors(_color);

    // 3. Indices.
    this.indices = LineSegment2D.DEFAULT_INDICES;
}

//
// Static constants (after Object.freeze()).
//
LineSegment2D.VERTEX_COUNT  = 4;
LineSegment2D.POSITION_SIZE = 3; // (x, y, z)
LineSegment2D.COLOR_SIZE    = 4; // (r, g, b, a)
LineSegment2D.INDEX_COUNT   = 6; // (0, 1, 2, 2, 1, 3)

LineSegment2D.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

LineSegment2D.DEFAULT_INDICES = [ 0, 1, 2, 2, 1, 3 ];

//
// Static methods.
// 
LineSegment2D.createVertexPositions = function (
    screenPosition1,
    screenPosition2,
    screenThickness
){
    // Note:
    // Sprite.createVertexPositions() returns a Float32Array directly, but Line-
    // Segment doesn't.

    //
    // Vertex positions.
    //
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

    return [
        p3.x, p3.y, screenPosition2.z,
        p4.x, p4.y, screenPosition2.z,
        p5.x, p5.y, screenPosition1.z,
        p6.x, p6.y, screenPosition1.z
    ];
};

LineSegment2D.createVertexColors = function(color) {
    //
    // Note:
    // Sprite.createVertexColors() returns a Float32Array directly, but LineSegment2D
    // doesn't.
    /*
    return new Float32Array ([
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a
    ]);
    */
    return [
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a
    ];
    // :Note
};

Object.freeze(LineSegment2D);

export { LineSegment2D };
