import { ClearOptions  }               from './clear-options';
import { Color  }                      from './color';
import { Colors }                      from './colors';
import { MathHelper }                  from '../math/helpers/math-helper';
import { Matrix4x4 }                   from '../math/4x4-matrix';
import { WebGLRenderingContextHelper } from './helpers/webgl-rendering-context-helper';

//
// Constructor.
//
function GraphicsManager(_xcene) {
    //
    var _renderingContext;
    var _viewport;
    var _shaderProgram;
    var _clearColor;
    var _clearDepth;
    var _clearStencil;

    try {
        //
        setUpRenderingContext();

    } catch (e) {
        //
        console.log('GraphicsManager: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'xcene', {
        'get': function() { return _xcene; }
    });
    
    Object.defineProperty(this, 'renderingContext', {
        get: function() { return _renderingContext; }
    });

    Object.defineProperty(this, 'viewport', {
        //
        'get': function() {
            return _viewport;
        },

        'set': function(value) {
            //
            if (value !== undefined &&
                _viewport !== undefined &&
                value.left   === _viewport.left &&
                value.bottom === _viewport.bottom &&
                value.width  === _viewport.width &&
                value.height === _viewport.height) {
                return;
            }

            _viewport = value;

            // Resets the WebGLRenderingContext's viewport as well.
            _renderingContext.viewport (
                // Part 1.
                _viewport.left, _viewport.bottom,
                // Part 2.
                _viewport.width, _viewport.height
            );
        }
    });
    
    Object.defineProperty(this, 'shaderProgram', {
        //
        get: function() {
            return _shaderProgram;
        },
        
        set: function(value) {
            //
            if (value === _shaderProgram)
            {
                return;                
            }
            
            _shaderProgram = value;
            _renderingContext.useProgram(_shaderProgram);
        },
    });

    //
    // Private methods.
    //
    function setUpRenderingContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experi-
        // mental.
        //
        // Note:
        // IE11 only supports 'experimental-webgl'.
        //
        _renderingContext =
            _xcene.mainCanvas.getContext('webgl');

        if (_renderingContext === null) {
            //
            _renderingContext =
                _xcene.mainCanvas.getContext('experimental-webgl');
            
            if (_renderingContext !== null) {
                //
                console.log (
                    'Your browser supports WebGL. \n\n' +
                    'However, it indicates the support is experimental. ' +
                    'That is, not all WebGL functionality may be supported, ' +
                    'and content may not run as expected.'
                );
            }
            else {
                //
                alert (
                    'Unable to initialize WebGL. Your browser may not support it.'
                );

                throw 'WebGL-not-supported exception raised.';
            }
        }

        WebGLRenderingContextHelper.syncConstants(_renderingContext);

        _clearColor   = GraphicsManager.DEFAULT_CLEAR_COLOR;
        _clearDepth   = GraphicsManager.DEFAULT_CLEAR_DEPTH;;
        _clearStencil = GraphicsManager.DEFAULT_CLEAR_STENCIL;

        _renderingContext.clearColor (
            // Part 1.
            _clearColor.r, _clearColor.g, _clearColor.b,
            // Part 2.
            _clearColor.a
        );

        _renderingContext.clearDepth(_clearDepth);
        _renderingContext.clearStencil(_clearStencil);
        
        // Sets up the states.
        setUpStates();
        
        // Flips the source data along its vertical axis to make WebGL's texture
        // coordinates (S, T) work correctly.
        _renderingContext.pixelStorei (
            WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL,
            true
        );
    };

    function setUpStates() {
        //
        setUpAlphaBlendState();

        setUpDepthStencilState();

        setUpSamplerState();

        setUpRasterizerState();
    }

    function setUpAlphaBlendState() {
        //
        _renderingContext.disable(WebGLRenderingContext.BLEND); // default: disable.
    }

    function setUpDepthStencilState() {
        //
        // Depth.
        _renderingContext.enable(WebGLRenderingContext.DEPTH_TEST); // default: disable.
        _renderingContext.depthFunc(WebGLRenderingContext.LEQUAL); // default: LESS.

        // Stencil.
        _renderingContext.disable(WebGLRenderingContext.STENCIL_TEST); // default: disable.
    }

    function setUpSamplerState() {
        //
        // Note:
        // The way of setting WebGL's sampler states is different from DirectX.
    }

    function setUpRasterizerState() {
        //
        _renderingContext.enable(WebGLRenderingContext.CULL_FACE); // default: disable.
        _renderingContext.cullFace(WebGLRenderingContext.BACK); // default: BACK.
    }

    //
    // Privileged methods.
    //
    this.setUpVertexBuffer = function(buffer, items) {
        //
        _renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            buffer
        );
        
        _renderingContext.bufferData (
            WebGLRenderingContext.ARRAY_BUFFER,
            new Float32Array(items),
            WebGLRenderingContext.STATIC_DRAW
        );
    };

    this.setUpIndexBuffer = function(buffer, items) {
        //
        _renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            buffer
        );

        //
        // Note:
        // DirectX supports 16-bit or 32-bit index buffers. But in this engine,
        // so far, only 16-bit index buffer is supported.
        /*
        if (uses16Bits === true) {
            //
            _renderingContext.bufferData (
                WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(items),
                WebGLRenderingContext.STATIC_DRAW
            );

        } else {
            //
            _renderingContext.bufferData (
                WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(items),
                WebGLRenderingContext.STATIC_DRAW
            );
        }
        */

        _renderingContext.bufferData (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(items),
            WebGLRenderingContext.STATIC_DRAW
        );
        // :Note
    };

    this.clear = function(clearOptions, color, depth, stencil) {
        //
        // if (// Part 1.
        //     color !== undefined && (
        //     // Part 2.
        //     color.r !== _clearColor.r ||
        //     color.g !== _clearColor.g ||
        //     color.b !== _clearColor.b ||
        //     color.a !== _clearColor.a)) {
        if (color !== undefined &&
            Color.areEqual(color, _clearColor) === false) {
            //
            _clearColor = color;
            
            _renderingContext.clearColor (
                // Part 1.
                _clearColor.r, _clearColor.g, _clearColor.b,
                // Part 2.
                _clearColor.a
            );
        }
        
        if (depth !== undefined &&
            depth !== _clearDepth) {
            _clearDepth = depth;
            _renderingContext.clearDepth(_clearDepth);
        }

        if (stencil !== undefined &&
            stencil !== _clearStencil) {
            _clearStencil = stencil;
            _renderingContext.clearStencil(_clearStencil);
        }

        // Note:
        // There's no _clearOptions.

        if (clearOptions === undefined) {
            clearOptions = GraphicsManager.DEFAULT_CLEAR_OPTIONS;
        }

        _renderingContext.clear(clearOptions);
    };

    this.drawPrimitives = function (
        primitiveType,
        start, // Index of start vertex.
        count
    ){
        _renderingContext.drawArrays(primitiveType, start, count);
    };
    
    this.drawIndexedPrimitives = function (
        indexBuffer,
        primitiveType, count, offset
    ){
        if (offset === undefined) {
            offset = 0;
        }

        _renderingContext.bindBuffer (
            WebGLRenderingContext.ELEMENT_ARRAY_BUFFER,
            indexBuffer
        );
        
        _renderingContext.drawElements (
            primitiveType,
            count,
            WebGLRenderingContext.UNSIGNED_SHORT,
            offset
        );
    };
    
    //
    // Accessors.
    //
    this.getShaderAttributeLocation = function(shaderProgram, attributeName) {
        //
        return _renderingContext.getAttribLocation (
            shaderProgram,
            attributeName
        );
    };
    
    this.getShaderUniformLocation = function(shaderProgram, uniformName) {
        //
        return _renderingContext.getUniformLocation (
            shaderProgram,
            uniformName
        );
    };

    this.setShaderAttribute = function(attributeLocation, buffer, size) {
        //
        _renderingContext.bindBuffer (
            WebGLRenderingContext.ARRAY_BUFFER,
            buffer
        );

        _renderingContext.enableVertexAttribArray (
            attributeLocation
        );

        _renderingContext.vertexAttribPointer (
            attributeLocation,
            size,
            WebGLRenderingContext.FLOAT,
            false,
            0,
            0
        );
    };

    this.setShaderSampler = function(samplerUniformLocation, texture, unit) {
        //
        if (unit === undefined) {
            unit = GraphicsManager.DEFAULT_TEXTURE_UNIT;
        }

        // Note:
        // WebGLRenderingContext.TEXTUREX are numbers,
        // WebGLRenderingContext.TEXTURE0 = 33984,
        // WebGLRenderingContext.TEXTURE1 = 33985,
        // ...

        _renderingContext.activeTexture (
            WebGLRenderingContext.TEXTURE0 + unit
        );

        _renderingContext.bindTexture (
            WebGLRenderingContext.TEXTURE_2D,
            texture
        );

        this.setShaderUniform(samplerUniformLocation, unit);
    };

    this.setShaderUniform = function(uniformLocation, value) {
        //
        if ((value instanceof Matrix4x4) === true) {
            //
            _renderingContext.uniformMatrix4fv (
                uniformLocation,
                false, // which is always false.
                new Float32Array(value.elements)
            );

        } else {
            _renderingContext.uniform1i(uniformLocation, value);
        }
    };
}

//
// Static constants (after Object.freeze()).
//
GraphicsManager.DEFAULT_CLEAR_OPTIONS =
    ClearOptions.COLOR_BUFFER | ClearOptions.DEPTH_BUFFER;

GraphicsManager.DEFAULT_CLEAR_COLOR   = Colors.DEFAULT_BACKGROUND;
GraphicsManager.DEFAULT_CLEAR_DEPTH   = 1;
GraphicsManager.DEFAULT_CLEAR_STENCIL = 0;
GraphicsManager.DEFAULT_TEXTURE_UNIT  = 0;

Object.freeze(GraphicsManager);

export { GraphicsManager };
