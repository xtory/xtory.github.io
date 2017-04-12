import { Colors }                from './colors';
import { Rect }                  from './rect';
import { SpriteBatch }           from './sprite-batch';
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
    if (_vertexColor === undefined) {
        _vertexColor = Colors.WHITE;
    }

    if (_sourceTextureCoordinateRect === undefined) {
        _sourceTextureCoordinateRect = new Rect(0, 0, 1, 1);
    }

    this.texture = _texture;

    var vertices = SpriteBatch.createSpriteVertices (
        _spriteBatch.renderer,
        _creationOptions,
        _centerScreenPosition,
        _screenSize,
        _vertexColor,
        _sourceTextureCoordinateRect
    );

    this.vertexPositions = vertices.positions;
    this.vertexColors = vertices.colors;
    this.vertexTextureCoordinates = vertices.textureCoordinates;
}

//
// Static constants (after Object.freeze()).
//
Sprite.VERTEX_COUNT            = 4;
Sprite.POSITION_SIZE           = 3; // (x, y, z)
Sprite.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite.TEXTURE_COORDINATE_SIZE = 2; // (s, t)

Sprite.DEFAULT_CREATION_OPTIONS = (
    SpriteCreationOptions.VERTEX_POSITIONS |
    SpriteCreationOptions.VERTEX_COLORS |
    SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES
);

Sprite.DEFAULT_VERTEX_COLORS = new Float32Array (
    [].concat (
        Colors.WHITE.toArray(),
        Colors.WHITE.toArray(),
        Colors.WHITE.toArray(),
        Colors.WHITE.toArray()
    )
);

Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES = new Float32Array ([
    1.0, 0.0, // lower-right.
    1.0, 1.0, // upper-right.
    0.0, 0.0, // lower-left.
    0.0, 1.0  // upper-left.
]);

Object.freeze(Sprite);

export { Sprite };
