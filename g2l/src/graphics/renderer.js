// Note:
// This engine doesn't handle window's resize event anymore. See the article...
// https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html

// Note:
// See viewport.js to understand the relationship between viewport and canvas.

import { CanvasCoordinateHelper  } from './helpers/canvas-coordinate-helper';
import { ClearOptions  }           from './clear-options';
import { Color  }                  from './color';
import { Colors }                  from './colors';
import { DepthBufferValues }       from './depth-buffer-values';
import { MathHelper }              from '../math/helpers/math-helper';
import { Matrix4x4 }               from '../math/4x4-matrix';
import { Vector2D }                from '../math/2d-vector';

//
// Constructor.
//
function Renderer(_settings) {
    //
    // Note:
    // 'settings' include...
    // - canvas
    // - usesDefaultStyles

    var _self;
    var _canvas;
    var _gl;
    var _program;
    var _clearColor;
    var _clearDepth;
    var _clearStencil;

    try {
        //
        _self = this;

        setUpCanvas();

        setUpStyles();

        setUpWebGLContext();

        setUpTimers();

    } catch (e) {
        //
        console.log('g2l.Renderer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'canvas', {
        'get': function() { return _canvas; }
    });
    
    Object.defineProperty(_self, 'gl', {
        'get': function() { return _gl; }
    });

    // Note:
    // This engine uses a constant viewport. To get viewport size for displaying
    // (nor for drawing), use canvas.clientWidth and clientHeight instead. If we
    // want to change x, y of the viewport, use gl to change it manually. This
    // engine doesn't handle it for us.
    /*
    Object.defineProperty(_self, 'viewport', {
        //
        'get': function() {
            //
            var value = _gl.getParameter(_gl.VIEWPORT);

            var p1 = new Vector2D(value[0], value[1]);
            var p2 = new Vector2D(value[2], value[3]);
            var p3 = CanvasCoordinateHelper.fromDrawToDisplaySpace(_canvas, p1);
            var p4 = CanvasCoordinateHelper.fromDrawToDisplaySpace(_canvas, p2);

            return new Viewport(p3.x, p3.y, p4.x, p4.y);
        },

        'set': function(value) {
            //
            var p1 = new Vector2D(value[0], value[1]);
            var p2 = new Vector2D(value[2], value[3]);
            var p3 = CanvasCoordinateHelper.fromDisplayToDrawSpace(_canvas, p1);
            var p4 = CanvasCoordinateHelper.fromDisplayToDrawSpace(_canvas, p2);

            _gl.viewport(p3.x, p3.y, p4.x, p4.y);
        }
    });
    */
    
    Object.defineProperty(_self, 'program', {
        //
        get: function() {
            return _program;
        },
        
        set: function(value) {
            //
            if (value === _program)
            {
                return;                
            }
            
            _program = value;
            _gl.useProgram(_program.webGLProgram);
        },
    });

    //
    // Private methods.
    //
    function setUpCanvas() {
        //
        if (_settings !== undefined &&
            _settings.canvas !== undefined) {
            //
            _canvas = _settings.canvas;

        } else {
            //
            if (document.body === undefined) {
                throw 'document.body === undefined';
            }

            _canvas = document.createElementNS (
                'http://www.w3.org/1999/xhtml',
                'canvas'
            );

            _canvas.width = Renderer.CANVAS_WIDTH;
            _canvas.height = Renderer.CANVAS_HEIGHT;

            //document.body.appendChild(_canvas);
        }
    }

    function setUpStyles() {
        //
        // Note:
        // This function is used to replace CSS below...
        //
        // canvas {
        //     width:   100%;
        //     height:  100%;
        //     display: block; /* prevents scrollbar */
        // }
        //
        if (_settings !== undefined &&
            _settings.usesDefaultStyles === false) {
            return;
        }

        var style = _canvas.style;
        style.width = '100%';
        style.height = '100%';
        style.display = 'block';
    }    

    function setUpWebGLContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experimental.
        //
        // Note:
        // IE11 only supports 'experimental-webgl'.
        //
        _gl = _canvas.getContext('webgl');
        if (_gl === null) {
            //
            _gl = _canvas.getContext('experimental-webgl');
            if (_gl !== null) {
                //
                console.log (
                    'Your browser supports WebGL. \n\n' +
                    'However, it indicates the support is experimental. ' +
                    'That is, not all WebGL functionality may be supported, ' +
                    'and content may not run as expected.'
                );

            } else {
                //
                alert (
                    'Unable to initialize WebGL. Your browser may not support it.'
                );

                throw 'A WebGL-not-supported exception raised.';
            }
        }

        // See notes in DepthBufferValues.js
        _gl.depthRange (
            DepthBufferValues.NEAR_CLIP_PLANE, // = 0.0
            DepthBufferValues.FAR_CLIP_PLANE   // = 1.0
        );

        _clearColor = Renderer.DEFAULT_CLEAR_COLOR;
        _clearDepth = Renderer.DEFAULT_CLEAR_DEPTH;;
        _clearStencil = Renderer.DEFAULT_CLEAR_STENCIL;

        _gl.clearColor (
            // Part 1.
            _clearColor.r, _clearColor.g, _clearColor.b,
            // Part 2.
            _clearColor.a
        );

        _gl.clearDepth(_clearDepth);
        _gl.clearStencil(_clearStencil);
        
        // Sets up the states.
        setUpStates();
        
        // Flips the source data along its vertical axis to make WebGL's texture
        // coordinates (S, T) work correctly.
        _gl.pixelStorei (
            _gl.UNPACK_FLIP_Y_WEBGL,
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
        _gl.disable(_gl.BLEND); // default: disable.
    }

    function setUpDepthStencilState() {
        //
        // Depth.
        _gl.enable(_gl.DEPTH_TEST); // default: disable.
        _gl.depthFunc(_gl.LEQUAL); // default: LESS.

        // Stencil.
        _gl.disable(_gl.STENCIL_TEST); // default: disable.
    }

    function setUpSamplerState() {
        //
        // Note:
        // The way of setting WebGL's sampler states is different from DirectX.
    }

    function setUpRasterizerState() {
        //
        _gl.enable(_gl.CULL_FACE); // default: disable.
        _gl.cullFace(_gl.BACK); // default: BACK.
    }

    function setUpTimers() {
        //
        // Note:
        // Provides requestAnimationFrame in a cross browser way.
        // @author paulirish / http://paulirish.com/

        if (window.requestAnimationFrame === undefined) {
            //
            window.requestAnimationFrame = (function() {
                //
                return (
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (
                        callback, // function FrameRequestCallback
                        element   // DOMElement Element
                    ){
                        window.setTimeout(callback, 1000/60);
                    }
                );
            })();
        }
    }

    //
    // Privileged methods.
    //
    this.run = function(update, draw) {
        //
        render();

        function render() {
            //
            requestAnimationFrame(render);

            if (update !== undefined) {
                update();
            }

            if (draw !== undefined) {
                draw();
            }
        }
    };

    this.clear = function(clearOptions, color, depth, stencil) {
        //
        if (color !== undefined &&
            Color.areEqual(color, _clearColor) === false) {
            //
            _clearColor = color;
            
            _gl.clearColor (
                // Part 1.
                _clearColor.r, _clearColor.g, _clearColor.b,
                // Part 2.
                _clearColor.a
            );
        }
        
        if (depth !== undefined &&
            depth !== _clearDepth) {
            _clearDepth = depth;
            _gl.clearDepth(_clearDepth);
        }

        if (stencil !== undefined &&
            stencil !== _clearStencil) {
            _clearStencil = stencil;
            _gl.clearStencil(_clearStencil);
        }

        // Note:
        // There's no _clearOptions.

        if (clearOptions === undefined) {
            clearOptions = Renderer.DEFAULT_CLEAR_OPTIONS;
        }

        _gl.clear(clearOptions);
    };

    this.drawPrimitives = function (
        primitiveType,
        start, // Index of start vertex.
        count
    ){
        _gl.drawArrays(primitiveType, start, count);
    };
    
    this.drawIndexedPrimitives = function (
        indexBuffer,
        primitiveType, count, offset
    ){
        if (offset === undefined) {
            offset = 0;
        }

        _gl.bindBuffer (
            _gl.ELEMENT_ARRAY_BUFFER,
            indexBuffer.webGLBuffer
        );
        
        _gl.drawElements (
            primitiveType,
            count,
            _gl.UNSIGNED_SHORT,
            offset
        );
    };
    
    //
    // Accessors.
    //
    this.getAttributeLocation = function(program, attributeName) {
        //
        return _gl.getAttribLocation(program.webGLProgram, attributeName);
    };
    
    this.getUniformLocation = function(program, uniformName) {
        //
        return _gl.getUniformLocation(program.webGLProgram, uniformName);
    };

    this.setAttribute = function(attributeLocation, buffer) {
        //
        // Binds the buffer before calling gl.vertexAttribPointer().
        _gl.bindBuffer (
            _gl.ARRAY_BUFFER,
            buffer.webGLBuffer
        );

        _gl.vertexAttribPointer (
            attributeLocation,
            buffer.size,
            _gl.FLOAT,
            false,
            0,
            0
        );

        // Turns the 'generic' vertex attribute array on at a given index position.
        // That is, this vertex attribute location (an 'index') doesn't belong to
        // any specific shader program.
        _gl.enableVertexAttribArray (
            attributeLocation
        );
    };

    this.setSampler = function(samplerUniformLocation, texture, unit) {
        //
        if (unit === undefined) {
            unit = Renderer.DEFAULT_TEXTURE_UNIT;
        }

        // Note:
        // gl.TEXTUREX are numbers,
        // gl.TEXTURE0 = 33984,
        // gl.TEXTURE1 = 33985,
        // ...

        _gl.activeTexture(_gl.TEXTURE0 + unit);
        _gl.bindTexture(_gl.TEXTURE_2D, texture.webGLTexture);

        _self.setUniform(samplerUniformLocation, unit);
    };

    this.setUniform = function(uniformLocation, value) {
        //
        if ((value instanceof Matrix4x4) === true) {
            //
            _gl.uniformMatrix4fv (
                uniformLocation,
                false, // which is always false.
                new Float32Array(value.elements)
            );

        } else {
            _gl.uniform1i(uniformLocation, value);
        }
    };
}

//
// Static constants (after Object.freeze()).
//
Renderer.CANVAS_WIDTH = 1024;
Renderer.CANVAS_HEIGHT = 1024;

Renderer.DEFAULT_CLEAR_OPTIONS =
    ClearOptions.COLOR_BUFFER | ClearOptions.DEPTH_BUFFER;

Renderer.DEFAULT_CLEAR_COLOR   = Colors.DEFAULT_BACKGROUND;
Renderer.DEFAULT_CLEAR_DEPTH   = 1;
Renderer.DEFAULT_CLEAR_STENCIL = 0;
Renderer.DEFAULT_TEXTURE_UNIT  = 0;

Object.freeze(Renderer);

export { Renderer };
