import { Colors }                from './colors';
import { DepthBufferValues }     from './depth-buffer-values';
import { Rect }                  from './rect';
import { SpriteCreationOptions } from './sprite-creation-options';

//
// Constructor.
//
function Sprite (
    _spriteBatch,
    _texture,
    _creationOptions,
    _centerScreenPosition,
    _screenSize,
    _vertexColor,
    _sourceTextureCoordinateRect
){
    if (_creationOptions === undefined) {
        _creationOptions = Sprite.DEFAULT_CREATION_OPTIONS;
    }

    this.creationOptions = _creationOptions;

    if (_vertexColor === undefined) {
        _vertexColor = Sprite.DEFAULT_VERTEX_COLOR;
    }

    if (_sourceTextureCoordinateRect === undefined) {
        //
        _sourceTextureCoordinateRect =
            Sprite.DEFAULT_SOURCE_TEXTURE_COORDINATE_RECT;
    }

    this.texture = _texture;

    // 1. Vertex positions.
    if ((_creationOptions & SpriteCreationOptions.VERTEX_POSITIONS) !==
        SpriteCreationOptions.VERTEX_POSITIONS) {
        throw 'A sprite-creation exception raised.';
    }

    this.vertexPositions = Sprite.createVertexPositions (
        _centerScreenPosition,
        _screenSize
    );
    
    // 2. Vertex colors.
    this.vertexColors = (
        // Part 1.
        ((_creationOptions & SpriteCreationOptions.VERTEX_COLORS) ===
        SpriteCreationOptions.VERTEX_COLORS) ?
        // Part 2.
        Sprite.createVertexColors(_vertexColor) :
        // Part 3.
        null
    );

    // 3. Vertex texture coordinates.
    this.vertexTextureCoordinates = (
        // Part 1.
        ((_creationOptions & SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ===
        SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ?
        // Part 2.
        Sprite.createVertexTextureCoordinates(_sourceTextureCoordinateRect) :
        // Part 3.
        null
    );
}

//
// Static constants (after Object.freeze()).
//
Sprite.VERTEX_COUNT            = 4;
Sprite.POSITION_SIZE           = 3; // (x, y, z)
Sprite.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite.TEXTURE_COORDINATE_SIZE = 2; // (s, t)

// Note:
/*
Sprite.DEFAULT_CREATION_OPTIONS = (
    SpriteCreationOptions.VERTEX_POSITIONS |
    SpriteCreationOptions.VERTEX_COLORS |
    SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES
);
*/
Sprite.DEFAULT_CREATION_OPTIONS =
    SpriteCreationOptions.VERTEX_POSITIONS;
// :Note

Sprite.DEFAULT_SCREEN_POSITION_DEPTH =
    DepthBufferValues.NEAR_CLIP_PLANE;

Sprite.DEFAULT_VERTEX_COLOR =
    Colors.WHITE;

Sprite.DEFAULT_SOURCE_TEXTURE_COORDINATE_RECT =
    new Rect(0, 0, 1, 1);

Sprite.DEFAULT_VERTEX_COLORS = new Float32Array (
    [].concat (
        Sprite.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite.DEFAULT_VERTEX_COLOR.toArray()
    )
);

Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES = new Float32Array ([
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
]);

//
// Static methods.
// 
Sprite.createVertexPositions = function(p, size) {
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

Sprite.createVertexColors = function(color) {
    //
    return new Float32Array ([
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a
    ]);
}

Sprite.createVertexTextureCoordinates = function(rect) {
    //
    return new Float32Array ([
        rect.right, rect.bottom, // lower-right.
        rect.right, rect.top,    // upper-right.
        rect.left,  rect.bottom, // lower-left.
        rect.left,  rect.top     // upper-left.
    ]);
}

Object.freeze(Sprite);

export { Sprite };
