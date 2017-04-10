import { MathHelper }   from '../math/helpers/math-helper';
import { Texture2D }    from '../graphics/2d-texture';

//
// Constructor.
//
function TextureLoader(_loader) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('g2l.TextureLoader: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'loader', {
        'get': function() { return _loader; }
    })

    //
    // Privileged methods.
    //
    this.loadTexture2D = function(url) {
        //
        var image = new Image();
        var texture = new Texture2D(_self);

        image.addEventListener('load', function() {
            handleTextureLoaded(image, texture);
        });

        image.src = url;

        function handleTextureLoaded(image, texture) {
            //
            _gl.bindTexture (
                _gl.TEXTURE_2D,
                texture.webGLTexture
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

            // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no
            // LINEAR_MIPMAP_LINEAR.
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

            texture.width = image.width;
            texture.height = image.height;
        }

        return texture;
    };
}

Object.freeze(TextureLoader);

export { TextureLoader };
