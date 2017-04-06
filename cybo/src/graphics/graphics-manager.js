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
function GraphicsManager(_xcene) {
    //
    var _canvas;
    var _gl;
    var _program;
    var _clearColor;
    var _clearDepth;
    var _clearStencil;

    try {
        //
        setUpCanvas();

        setUpStyles();

        setUpWebGLContext();

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

    Object.defineProperty(this, 'canvas', {
        'get': function() { return _canvas; }
    });
    
    Object.defineProperty(this, 'webGLContext', {
        get: function() { return _gl; }
    });

    // Note:
    // This engine uses a constant viewport. To get viewport size for displaying
    // (nor for drawing), use canvas.clientWidth and clientHeight instead. If we
    // want to change x, y of the viewport, use gl to change it manually. This
    // engine doesn't handle it for us.
    /*
    Object.defineProperty(this, 'viewport', {
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
    
    Object.defineProperty(this, 'program', {
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
            _gl.useProgram(_program);
        },
    });

    //
    // Private methods.
    //
    function setUpCanvas() {
        //
        if (_xcene.settings !== undefined &&
            _xcene.settings.canvas !== undefined) {
            //
            _canvas = _xcene.settings.canvas;

        } else {
            //
            if (document.body === undefined) {
                throw 'document.body === undefined';
            }

            _canvas = document.createElementNS (
                'http://www.w3.org/1999/xhtml',
                'canvas'
            );

            _canvas.width = GraphicsManager.CANVAS_WIDTH;
            _canvas.height = GraphicsManager.CANVAS_HEIGHT;

            document.body.appendChild(_canvas);
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
        if (_xcene.settings !== undefined &&
            _xcene.settings.usesDefaultStyles === false) {
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

        _clearColor = GraphicsManager.DEFAULT_CLEAR_COLOR;
        _clearDepth = GraphicsManager.DEFAULT_CLEAR_DEPTH;;
        _clearStencil = GraphicsManager.DEFAULT_CLEAR_STENCIL;

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

    //
    // Privileged methods.
    //
    this.setUpVertexBuffer = function(buffer, items) {
        //
        _gl.bindBuffer (
            _gl.ARRAY_BUFFER,
            buffer
        );
        
        _gl.bufferData (
            _gl.ARRAY_BUFFER,
            new Float32Array(items),
            _gl.STATIC_DRAW
        );
    };

    this.setUpIndexBuffer = function(buffer, items) {
        //
        _gl.bindBuffer (
            _gl.ELEMENT_ARRAY_BUFFER,
            buffer
        );

        // Note:
        // DirectX supports 16-bit or 32-bit index buffers. But in this engine,
        // so far, only 16-bit index buffer is supported.
        /*
        if (uses16Bits === true) {
            //
            _gl.bufferData (
                _gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(items),
                _gl.STATIC_DRAW
            );

        } else {
            //
            _gl.bufferData (
                _gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(items),
                _gl.STATIC_DRAW
            );
        }
        */

        _gl.bufferData (
            _gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(items),
            _gl.STATIC_DRAW
        );
        // :Note
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
            clearOptions = GraphicsManager.DEFAULT_CLEAR_OPTIONS;
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
            indexBuffer
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
        return _gl.getAttribLocation(program, attributeName);
    };
    
    this.getUniformLocation = function(program, uniformName) {
        //
        return _gl.getUniformLocation(program, uniformName);
    };

    this.setAttribute = function(attributeLocation, buffer, size) {
        //
        // Binds the buffer before calling gl.vertexAttribPointer().
        _gl.bindBuffer (
            _gl.ARRAY_BUFFER,
            buffer
        );

        _gl.vertexAttribPointer (
            attributeLocation,
            size,
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
            unit = GraphicsManager.DEFAULT_TEXTURE_UNIT;
        }

        // Note:
        // gl.TEXTUREX are numbers,
        // gl.TEXTURE0 = 33984,
        // gl.TEXTURE1 = 33985,
        // ...

        _gl.activeTexture(_gl.TEXTURE0 + unit);
        _gl.bindTexture(_gl.TEXTURE_2D, texture);

        this.setUniform(samplerUniformLocation, unit);
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
GraphicsManager.CANVAS_WIDTH = 1024;
GraphicsManager.CANVAS_HEIGHT = 1024;

GraphicsManager.DEFAULT_CLEAR_OPTIONS =
    ClearOptions.COLOR_BUFFER | ClearOptions.DEPTH_BUFFER;

GraphicsManager.DEFAULT_CLEAR_COLOR   = Colors.DEFAULT_BACKGROUND;
GraphicsManager.DEFAULT_CLEAR_DEPTH   = 1;
GraphicsManager.DEFAULT_CLEAR_STENCIL = 0;
GraphicsManager.DEFAULT_TEXTURE_UNIT  = 0;

Object.freeze(GraphicsManager);

export { GraphicsManager };
