// Note:
// DB uses
// - key: url (string)
// - value: Texture
//
import { MathHelper } from '../math/helpers/math-helper';
import { Texture2D }  from '../graphics/2d-texture';

//
// Constructor.
//
function TextureLoader(_loader) {
    //
    var _self;
    var _gl;
    var _db;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;
        _db = {};

    } catch (e) {
        //
        console.log('xtory.graphicsLibrary.TextureLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });

    //
    // Private methods.
    //
    function createWebGLTexture() {
        return _gl.createTexture();
    }
    
    function handleTexture2DLoaded(image, webGLTexture) {
        //
        _gl.bindTexture (
            _gl.TEXTURE_2D,
            webGLTexture
        );

        _gl.texImage2D (
            _gl.TEXTURE_2D,    // target
            0,                 // level
            _gl.RGBA,          // internalFormat
            _gl.RGBA,          // format
            _gl.UNSIGNED_BYTE, // type
            image              // htmlImageElement
        );

        if (MathHelper.isPowerOfTwo(image.width) === true &&
            MathHelper.isPowerOfTwo(image.height) === true) {
            //
            _gl.generateMipmap(_gl.TEXTURE_2D);
            
            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_MIN_FILTER,
                _gl.LINEAR_MIPMAP_LINEAR
            );

        } else {
            //
            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_MIN_FILTER,
                _gl.LINEAR
            );
        }

        // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no LINEAR_
        // MIPMAP_LINEAR.
        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_MAG_FILTER,
            _gl.LINEAR
        );

        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_WRAP_S,
            _gl.CLAMP_TO_EDGE
        );

        _gl.texParameteri (
            _gl.TEXTURE_2D,
            _gl.TEXTURE_WRAP_T,
            _gl.CLAMP_TO_EDGE
        );

        _gl.bindTexture(_gl.TEXTURE_2D, null);
    }

    //
    // Privileged methods.
    //
    this.loadTexture2D = function(url) {
        //
        if (url === undefined) {
            throw 'An argument-undefined exception raised.';
        }

        var texture = _db[url];
        if (texture !== undefined) {
            return texture;
        }

        var texture = new Texture2D(_self);
        _db[url] = texture;

        var image = new Image();

        image.addEventListener('load', function() {
            //
            try {
                //
                var webGLTexture = createWebGLTexture();

                handleTexture2DLoaded(image, webGLTexture);

                texture.width = image.width;
                texture.height = image.height;
                texture.webGLTexture = webGLTexture;

            } catch (e) {
                //
                console.log('xtory.graphicsLibrary.TextureLoader.loadTexture2D(): ' + e);

                throw e;
            }
        });

        image.addEventListener('error', function() {
            //
            console.log (
                'xtory.graphicsLibrary.TextureLoader.loadTexture2D() could not load image: ' +
                url
            );
        });

        image.src = url;

        return texture;
    };
}

export { TextureLoader };
