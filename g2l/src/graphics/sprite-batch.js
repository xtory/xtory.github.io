import { ScreenCoordinateHelper } from './helpers/screen-coordinate-helper';
import { Sprite }                 from './sprite';
import { SpriteCreationOptions }  from './sprite-creation-options';
import { Vector3D }               from '../math/3d-vector';

//
// Constructor.
//
function SpriteBatch(_renderer) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _renderer.gl;

    } catch (e) {
        //
        console.log('g2l.SpriteBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });
}

//
// Static methods.
//
// 
SpriteBatch.createSpriteVertices = function (
    renderer, // renderer.
    options,  // spriteCreationOptions,
    p,        // centerScreenPosition,
    size,     // screenSize,
    color,    // vertexColor,
    rect      // sourceTextureCoordinateRect
){
    if (options === undefined) {
        options = Sprite.DEFAULT_CREATION_OPTIONS;
    }

    // 1. Positions.
    if ((options & SpriteCreationOptions.VERTEX_POSITIONS) !==
        SpriteCreationOptions.VERTEX_POSITIONS) {
        throw 'A sprite-creation exception raised.';
    }

    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    var vertexPositions = new Float32Array ([
        p.x+halfWidth, p.y-halfHeight, p.z,
        p.x+halfWidth, p.y+halfHeight, p.z,
        p.x-halfWidth, p.y-halfHeight, p.z,
        p.x-halfWidth, p.y+halfHeight, p.z 
    ]);

    // 2. Colors.
    var vertexColors = null;
    
    if ((options & SpriteCreationOptions.VERTEX_COLORS) ===
        SpriteCreationOptions.VERTEX_COLORS) {
        //
        vertexColors = new Float32Array (
            Sprite.COLOR_SIZE * Sprite.VERTEX_COUNT
        );

        var array = color.toArray();
        for (var i=0; i<Sprite.VERTEX_COUNT; i++) {
            //
            for (var j=0; j<Sprite.COLOR_SIZE; j++) {
                //
                vertexColors[Sprite.COLOR_SIZE*i + j] = array[j];
            }
        }
    }

    // 3. Texture coordinates.
    var vertexTextureCoordinates = null;

    if ((options & SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ===
        SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) {
        //
        var vertexTextureCoordinates = new Float32Array ([
            rect.right, rect.bottom, // (1.0, 0.0), for instance.
            rect.right, rect.top,    // (1.0, 1.0),
            rect.left,  rect.bottom, // (0.0, 0.0),
            rect.left,  rect.top     // (0.0, 1.0)
        ])
    }

    return {
        positions: vertexPositions,
        colors: vertexColors,
        textureCoordinates: vertexTextureCoordinates
    };
}

Object.freeze(SpriteBatch);

export { SpriteBatch };
