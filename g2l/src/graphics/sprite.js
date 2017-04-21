import { Colors }                from './colors';
import { DepthBufferValues }     from './depth-buffer-values';
import { Rect }                  from './rect';
import { SpriteFlushingOptions } from './sprite-flushing-options';

//
// Constructor.
//
function Sprite (
    _spriteBatch,
    _texture,
    _centerScreenPosition,
    _screenSize,
    _sourceRect, // source texture coordinate rect.
    _color,
    _vertexPositions,         // which is a Float32Array.
    _vertexTextureCoordinates // which is a Float32Array.
){
    this.texture = _texture;

    // 1. Vertex positions.
    Sprite.createVertexPositions (
        // Part 1.
        _vertexPositions,
        // Part 2.
        _centerScreenPosition, _screenSize
    );

    // 2. Vertex texture coordinates.
    if (// Part 1.
        _sourceRect === undefined ||
        // Part 2.
        Rect.areEqual (
            _sourceRect,
            Sprite.DEFAULT_SOURCE_RECT
        ) === true) {
        //
        this.flushingOptions = SpriteFlushingOptions.VERTEX_POSITIONS;

    } else {
        //
        this.flushingOptions = (
            SpriteFlushingOptions.VERTEX_POSITIONS |
            SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES
        );

        Sprite.createVertexTextureCoordinates (
            _vertexTextureCoordinates,
            _sourceRect
        );
    }

    // 3. color.
    if (_color === undefined) {
        //
        this.color = Sprite.DEFAULT_COLOR;

    } else {
        //
        this.color = new Float32Array(_color.toArray());
    }
}

//
// Static constants (after Object.freeze()).
//
Sprite.VERTEX_COUNT            = 4;
Sprite.POSITION_SIZE           = 3; // (x, y, z)
Sprite.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite.TEXTURE_COORDINATE_SIZE = 2; // (s, t)

Sprite.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

Sprite.DEFAULT_COLOR = new Float32Array (
    Colors.WHITE.toArray()
);

Sprite.DEFAULT_SOURCE_RECT = new Rect(0, 0, 1, 1);

Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES = new Float32Array ([
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
]);

//
// Static methods.
// 
Sprite.createVertexPositions = function(a, p, size) {
    //
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    a[0]=p.x+halfWidth;    a[ 1]=p.y-halfHeight;    a[ 2]=p.z;
    a[3]=p.x+halfWidth;    a[ 4]=p.y+halfHeight;    a[ 5]=p.z;
    a[6]=p.x-halfWidth;    a[ 7]=p.y-halfHeight;    a[ 8]=p.z;
    a[9]=p.x-halfWidth;    a[10]=p.y+halfHeight;    a[11]=p.z;
};

Sprite.createVertexTextureCoordinates = function(a, rect) {
    //
    a[0]=rect.right;    a[1]=rect.bottom; // lower-right.
    a[2]=rect.right;    a[3]=rect.top;    // upper-right.
    a[4]=rect.left;     a[5]=rect.bottom; // lower-left.
    a[6]=rect.left;     a[7]=rect.top;    // upper-left.
};

Object.freeze(Sprite);

export { Sprite };
