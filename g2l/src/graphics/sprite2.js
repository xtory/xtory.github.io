import { Colors }                from './colors';
import { Rect }                  from './rect';
import { SpriteCreationOptions } from './sprite-creation-options';

//
// Constructor.
//
function Sprite2 (
    _spriteBatch,
    _texture,
    _creationOptions,
    _centerScreenPosition,
    _screenSize,
    _vertexColor,
    _sourceTextureCoordinateRect
){
    if (_creationOptions === undefined) {
        _creationOptions = Sprite2.DEFAULT_CREATION_OPTIONS;
    }

    this.creationOptions = _creationOptions;

    if (_vertexColor === undefined) {
        _vertexColor = Sprite2.DEFAULT_VERTEX_COLOR;
    }

    if (_sourceTextureCoordinateRect === undefined) {
        //
        _sourceTextureCoordinateRect =
            Sprite2.DEFAULT_SOURCE_TEXTURE_COORDINATE_RECT;
    }

    this.texture = _texture;

    // 1. Vertex positions.
    if ((_creationOptions & SpriteCreationOptions.VERTEX_POSITIONS) !==
        SpriteCreationOptions.VERTEX_POSITIONS) {
        throw 'A sprite-creation exception raised.';
    }

    this.vertexPositions = Sprite2.createVertexPositions2 (
        _centerScreenPosition,
        _screenSize
    );
    
    // 2. Vertex colors.
    this.vertexColors = (
        // Part 1.
        ((_creationOptions & SpriteCreationOptions.VERTEX_COLORS) ===
        SpriteCreationOptions.VERTEX_COLORS) ?
        // Part 2.
        Sprite2.createVertexColors2(_vertexColor) :
        // Part 3.
        Sprite2.DEFAULT_VERTEX_COLORS2 //null
    );

    // 3. Vertex texture coordinates.
    this.vertexTextureCoordinates = (
        // Part 1.
        ((_creationOptions & SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ===
        SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ?
        // Part 2.
        Sprite2.createVertexTextureCoordinates2(_sourceTextureCoordinateRect) :
        // Part 3.
        Sprite2.DEFAULT_VERTEX_TEXTURE_COORDINATES2 //null
    );
}

//
// Static constants (after Object.freeze()).
//
Sprite2.VERTEX_COUNT            = 4;
Sprite2.POSITION_SIZE           = 3; // (x, y, z)
Sprite2.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite2.TEXTURE_COORDINATE_SIZE = 2; // (s, t)
Sprite2.INDEX_COUNT             = 6; // (0, 1, 2, 2, 1, 3)

// Note:
/*
Sprite2.DEFAULT_CREATION_OPTIONS = (
    SpriteCreationOptions.VERTEX_POSITIONS |
    SpriteCreationOptions.VERTEX_COLORS |
    SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES
);
*/
Sprite2.DEFAULT_CREATION_OPTIONS = (
    SpriteCreationOptions.VERTEX_POSITIONS
);

Sprite2.DEFAULT_VERTEX_COLOR = Colors.WHITE;

Sprite2.DEFAULT_SOURCE_TEXTURE_COORDINATE_RECT = new Rect(0, 0, 1, 1);

Sprite2.DEFAULT_VERTEX_COLORS = new Float32Array (
    [].concat (
        Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
        Sprite2.DEFAULT_VERTEX_COLOR.toArray()
    )
);

Sprite2.DEFAULT_VERTEX_COLORS2 = [].concat (
    Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
    Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
    Sprite2.DEFAULT_VERTEX_COLOR.toArray(),
    Sprite2.DEFAULT_VERTEX_COLOR.toArray()
);

Sprite2.DEFAULT_VERTEX_TEXTURE_COORDINATES = new Float32Array ([
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
]);

Sprite2.DEFAULT_VERTEX_TEXTURE_COORDINATES2 = [
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
];

Sprite2.DEFAULT_INDICES = new Uint16Array ([
    0, 1, 2,
    2, 1, 3
]);

//
// Static methods.
// 
Sprite2.createVertexPositions = function(p, size) {
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

Sprite2.createVertexPositions2 = function(p, size) {
    //
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    return [
        p.x+halfWidth, p.y-halfHeight, p.z,
        p.x+halfWidth, p.y+halfHeight, p.z,
        p.x-halfWidth, p.y-halfHeight, p.z,
        p.x-halfWidth, p.y+halfHeight, p.z 
    ];
}


Sprite2.createVertexColors = function(color) {
    //
    return new Float32Array ([
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a
    ]);
}

Sprite2.createVertexColors2 = function(color) {
    //
    return [
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a,
        color.r, color.g, color.b, color.a
    ];
}

Sprite2.createVertexTextureCoordinates = function(rect) {
    //
    return new Float32Array ([
        rect.right, rect.bottom, // lower-right.
        rect.right, rect.top,    // upper-right.
        rect.left,  rect.bottom, // lower-left.
        rect.left,  rect.top     // upper-left.
    ]);
}

Sprite2.createVertexTextureCoordinates2 = function(rect) {
    //
    return [
        rect.right, rect.bottom, // lower-right.
        rect.right, rect.top,    // upper-right.
        rect.left,  rect.bottom, // lower-left.
        rect.left,  rect.top     // upper-left.
    ];
}

Object.freeze(Sprite2);

export { Sprite2 };
