import { ClearOptions  }               from './clear-options';
import { Color  }                      from './color';
import { Colors }                      from './colors';
import { MathHelper }                  from '../math/helpers/math-helper';
import { WebGLRenderingContextHelper } from './helpers/webgl-rendering-context-helper';
import { JSHelper }                    from '../helpers/js-helper';

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
        Object.defineProperty(this, 'xcene', {
            'get': function() { return _xcene; }
        });

        setUpRenderingContext();

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

    } catch (e) {
        //
        console.log('GraphicsManager: '+ e);

        throw e;
    }

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
            
            this.renderingContext.clearColor (
                // Part 1.
                _clearColor.r, _clearColor.g, _clearColor.b,
                // Part 2.
                _clearColor.a
            );
        }
        
        if (depth !== undefined &&
            depth !== _clearDepth) {
            _clearDepth = depth;
            this.renderingContext.clearDepth(_clearDepth);
        }

        if (stencil !== undefined &&
            stencil !== _clearStencil) {
            _clearStencil = stencil;
            this.renderingContext.clearStencil(_clearStencil);
        }

        // Note:
        // There's no _clearOptions.

        if (clearOptions === undefined) {
            clearOptions = GraphicsManager.DEFAULT_CLEAR_OPTIONS;
        }

        this.renderingContext.clear(clearOptions);
    }
}

//
// Prototype.
//
GraphicsManager.prototype = {
    //
    // Public methods.
    //
    enableVertexAttribute: function(vertexAttributeLocation) {
        this.renderingContext.enableVertexAttribArray(vertexAttributeLocation);
    },
    
    //
    // Accessors.
    //
    getAttributeLocation: function(shaderProgram, attributeName) {
        //
        return this.renderingContext.getAttribLocation (
            shaderProgram,
            attributeName
        );
    },
    
    getUniformLocation: function(shaderProgram, uniformName) {
        //
        return this.renderingContext.getUniformLocation (
            shaderProgram,
            uniformName
        );
    },

    setMatrix4x4Uniform: function(uniformLocation, m) {
        //
        this.renderingContext.uniformMatrix4fv (
            uniformLocation,
            false, // which is always false.
            new Float32Array(m.elements)
        );
    },

    setSamplerUniform: function(uniformLocation, s) {
        //
        this.renderingContext.uniform1i (
            uniformLocation,
            s
        );
    }
};

//
// Static constants (after Object.freeze()).
//
GraphicsManager.DEFAULT_CLEAR_OPTIONS =
    ClearOptions.COLOR_BUFFER | ClearOptions.DEPTH_BUFFER;

GraphicsManager.DEFAULT_CLEAR_COLOR   = Colors.DEFAULT_BACKGROUND;
GraphicsManager.DEFAULT_CLEAR_DEPTH   = 1;
GraphicsManager.DEFAULT_CLEAR_STENCIL = 0;

Object.freeze(GraphicsManager);

export { GraphicsManager };
