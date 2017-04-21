import { DepthBufferValues } from './depth-buffer-values';
import { Vector2D }          from '../math/2d-vector';
import { Vector3D }          from '../math/3d-vector';

//
// Constructor.
//
function LineSegment (
    _lineSegmentBatch,
    _screenPosition1,
    _screenPosition2,
    _color,
    _screenThickness
){
    // 1. Vertex positions.
    this.vertexPositions = LineSegment.createVertexPositions (
        _screenPosition1,
        _screenPosition2,
        _screenThickness
    );
    
    // 2. Vertex colors.
    this.vertexColors = LineSegment.createVertexColors(_color);

    // 3. Indices.
    this.indices = LineSegment.DEFAULT_INDICES;
}

//
// Static constants (after Object.freeze()).
//
LineSegment.VERTEX_COUNT  = 4;
LineSegment.POSITION_SIZE = 3; // (x, y, z)
LineSegment.COLOR_SIZE    = 4; // (r, g, b, a)
LineSegment.INDEX_COUNT   = 6; // (0, 1, 2, 2, 1, 3)

LineSegment.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

LineSegment.DEFAULT_INDICES = [ 0, 1, 2, 2, 1, 3 ];

//
// Static methods.
// 
LineSegment.createVertexPositions = function (
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
    var lowerRightCorner = Vector2D.subtractVectors(p2, v); // p2 - v
    var upperRightCorner = Vector2D.addVectors(p2, v);      // p2 + v
    var lowerLeftCorner  = Vector2D.subtractVectors(p1, v); // p1 - v
    var upperLeftCorner  = Vector2D.addVectors(p1, v);      // p1 + v

    // Test:
    /*
    var p3 = new Vector3D (
        lowerRightCorner.x,
        lowerRightCorner.y,
        screenPosition2.z
    );

    var p4 = new Vector3D (
        upperRightCorner.x,
        upperRightCorner.y,
        screenPosition2.z
    );

    var p5 = new Vector3D (
        lowerLeftCorner.x,
        lowerLeftCorner.y,
        screenPosition1.z
    );

    var p6 = new Vector3D (
        upperLeftCorner.x,
        upperLeftCorner.y,
        screenPosition1.z
    );
    
    var vertexPositions = [ p3, p4, p5, p6 ];

    var vertexPositions2 = [];

    for (var i=0; i<vertexPositions.length; i++) {
        //
        var item = vertexPositions[i];

        var p = ScreenCoordinateHelper.toClipSpace (
            renderer.canvas,
            item
        );

        vertexPositions2 = vertexPositions2.concat(p.toArray());
    }

    return vertexPositions2;
    */

    return [
        lowerRightCorner.x, lowerRightCorner.y, screenPosition2.z,
        upperRightCorner.x, upperRightCorner.y, screenPosition2.z,
        lowerLeftCorner.x,  lowerLeftCorner.y,  screenPosition1.z,
        upperLeftCorner.x,  upperLeftCorner.y,  screenPosition1.z
    ];
    // :Test
}

LineSegment.createVertexColors = function(color) {
    //
    // Note:
    // Sprite.createVertexColors() returns a Float32Array directly, but LineSegment
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
}

Object.freeze(LineSegment);

export { LineSegment };
