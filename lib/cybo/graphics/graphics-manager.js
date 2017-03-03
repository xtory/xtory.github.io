define ([
    "./color",
    "./colors",
    "./helpers/webgl-rendering-context-helper",
    "../helpers/js-helper"
], function (
    Color,
    Colors,
    WebGLRenderingContextHelper,
    JSHelper
){
    "use strict";
    
    //
    // Constructor.
    //
    function GraphicsManager(_xcene) {
        //
        var _renderingContext;
        var _shaderProgram;

        Object.defineProperty(this, "xcene", {
            "get": function() { return _xcene; }
        });

        setUpWebGLRenderingContext();

        Object.defineProperty(this, "renderingContext", {
            get: function() { return _renderingContext; }
        });
        
        Object.defineProperty(this, "shaderProgram", {
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
        function setUpWebGLRenderingContext() {
            //
            // Try to grab the standard context. If it fails, fallback to experi-
            // mental.
            //
            // Note:
            // IE11 only supports "experimental-webgl".
            //
            _renderingContext =
                _xcene.mainCanvas.getContext("webgl");

            if (_renderingContext === null) {
                //
                _renderingContext =
                    _xcene.mainCanvas.getContext("experimental-webgl");
                
                if (_renderingContext !== null) {
                    //
                    console.log (
                        "Your browser supports WebGL. \n\n" +
                        "However, it indicates the support is experimental. " +
                        "That is, not all WebGL functionality may be supported, " +
                        "and content may not run as expected."
                    );
                }
                else {
                    //
                    alert (
                        "Unable to initialize WebGL. Your browser may not support it."
                    );

                    throw "WebGL-not-supported exception raised.";
                }
            }

            WebGLRenderingContextHelper.syncConstants(_renderingContext);
            
            // Enable depth testing
            _renderingContext.enable(WebGLRenderingContext.DEPTH_TEST);

            // Near things obscure far things
            _renderingContext.depthFunc(WebGLRenderingContext.LEQUAL);
            
            // Flips the source data along its vertical axis to make WebGL's texture
            // coordinates (S, T) work correctly.
            _renderingContext.pixelStorei (
                WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL,
                true
            );
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
        
        clear: function(mask, color, depth, s) {
            //
            if (mask === undefined) {
                //
                mask = (
                    WebGLRenderingContext.COLOR_BUFFER_BIT |
                    WebGLRenderingContext.DEPTH_BUFFER_BIT
                );
            }

            if (color === undefined) {
                color = GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE;
            }
            
            if (depth === undefined) {
                depth = GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE;
            }
            
            if (s === undefined) {
                s = GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE;
            }

            this.renderingContext.clearColor(color.r, color.g, color.b, color.a);
            this.renderingContext.clearDepth(depth);
            this.renderingContext.clearStencil(s);

            this.renderingContext.clear(mask);
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
    GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE   = Colors.DEFAULT_BACKGROUND;
    GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE   = 1;
    GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE = 0;

    Object.freeze(GraphicsManager);
    return GraphicsManager;
});
