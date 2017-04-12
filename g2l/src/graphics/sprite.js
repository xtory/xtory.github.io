import { Colors }      from './colors';
import { Rect }        from './rect';
import { SpriteBatch } from './sprite-batch';

//
// Constructor.
//
function Sprite (
    _spriteBatch,
    _texture,
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
Sprite.POSITION_SIZE           = 4; // (x, y, z, w)
Sprite.POSITION_SIZE2          = 3; // (x, y, z)
Sprite.COLOR_SIZE              = 4; // (r, g, b, a)
Sprite.TEXTURE_COORDINATE_SIZE = 2; // (s, t)

Object.freeze(Sprite);

export { Sprite };
