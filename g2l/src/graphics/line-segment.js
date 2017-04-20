import { DepthBufferValues } from './depth-buffer-values';
import { Sprite } from './sprite';

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
    this.vertexColors = Sprite.createVertexColors(_color);
}

//
// Static constants (after Object.freeze()).
//
LineSegment.VERTEX_COUNT  = 4;
LineSegment.POSITION_SIZE = 3; // (x, y, z)
LineSegment.COLOR_SIZE    = 4; // (r, g, b, a)

LineSegment.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

//
// Static methods.
// 
LineSegment.createVertexPositions = function(p1, p2, s) {
    //
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    return new Float32Array ([
        p.x+halfWidth, p.y-halfHeight, p.z,
        p.x+halfWidth, p.y+halfHeight, p.z,
        p.x-halfWidth, p.y-halfHeight, p.z,
        p.x-halfWidth, p.y+halfHeight, p.z 
    ]);
}

Object.freeze(LineSegment);

export { LineSegment };
