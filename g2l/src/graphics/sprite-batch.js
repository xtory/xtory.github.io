import { ScreenCoordinateHelper } from './helpers/screen-coordinate-helper';
import { Sprite }                 from './sprite';
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

SpriteBatch.prototype = {
    //
    // No contents.
};

//
// Static methods.
//
SpriteBatch.createSpriteVertices = function (
    renderer,
    p,        // centerScreenPosition,
    size,     // screenSize,
    color,    // vertexColor,
    rect      // sourceTextureCoordinateRect
){
    // 1. Positions.
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    var vertexPositions = [
        new Vector3D(p.x+halfWidth, p.y-halfHeight, p.z),
        new Vector3D(p.x+halfWidth, p.y+halfHeight, p.z),
        new Vector3D(p.x-halfWidth, p.y-halfHeight, p.z),
        new Vector3D(p.x-halfWidth, p.y+halfHeight, p.z) 
    ];

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

    // 2. Colors.
    var vertexColors = [];

    for (var i=0; i<4; i++) {
        vertexColors = vertexColors.concat(color.toArray());
    }

    // 3. Texture coordinates.
    var vertexTextureCoordinates = [
        rect.right, rect.bottom, // (1.0, 0.0), for instance.
        rect.right, rect.top,    // (1.0, 1.0),
        rect.left,  rect.bottom, // (0.0, 0.0),
        rect.left,  rect.top     // (0.0, 1.0)
    ];

    return {
        positions: vertexPositions2,
        colors: vertexColors,
        textureCoordinates: vertexTextureCoordinates
    };
}

SpriteBatch.createSpriteVertices2 = function (
    renderer, // renderer.
    p,        // centerScreenPosition,
    size,     // screenSize,
    color,    // vertexColor,
    rect      // sourceTextureCoordinateRect
){
    // 1. Positions.
    var halfWidth = size.width * 0.5;
    var halfHeight = size.height * 0.5;

    var vertexPositions = [
        new Vector3D(p.x+halfWidth, p.y-halfHeight, p.z),
        new Vector3D(p.x+halfWidth, p.y+halfHeight, p.z),
        new Vector3D(p.x-halfWidth, p.y-halfHeight, p.z),
        new Vector3D(p.x-halfWidth, p.y+halfHeight, p.z) 
    ];

    var vertexPositions2 = new Float32Array (
        Sprite.POSITION_SIZE * Sprite.VERTEX_COUNT
    );

    var array;
    for (var i=0; i<Sprite.VERTEX_COUNT; i++) {
        //
        var item = vertexPositions[i];

        var p = ScreenCoordinateHelper.toClipSpace (
            renderer.canvas,
            item
        );

        array = p.toArray();
        for (var j=0; j<Sprite.POSITION_SIZE; j++) {
            vertexPositions2[Sprite.POSITION_SIZE*i + j] = array[j];
        }
    }

    // 2. Colors.
    var vertexColors = new Float32Array (
        Sprite.COLOR_SIZE * Sprite.VERTEX_COUNT
    );

    array = color.toArray();
    for (var i=0; i<Sprite.VERTEX_COUNT; i++) {
        //
        for (var j=0; j<Sprite.COLOR_SIZE; j++) {
            //
            vertexColors[Sprite.COLOR_SIZE*i + j] = array[j];
        }
    }

    // 3. Texture coordinates.
    var vertexTextureCoordinates = new Float32Array ([
        rect.right, rect.bottom, // (1.0, 0.0), for instance.
        rect.right, rect.top,    // (1.0, 1.0),
        rect.left,  rect.bottom, // (0.0, 0.0),
        rect.left,  rect.top     // (0.0, 1.0)
    ]);

    return {
        positions: vertexPositions2,
        colors: vertexColors,
        textureCoordinates: vertexTextureCoordinates
    };
}

Object.freeze(SpriteBatch);

export { SpriteBatch };
