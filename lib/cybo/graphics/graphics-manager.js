define ([
    "./color",
    "./colors",
    "../helpers/js-helper"
], function (
    Color,
    Colors,
    JSHelper
){
    "use strict";
    
    //
    // Constructor.
    //
    function GraphicsManager(_xcene) {
        //
        var _webGLRenderingContext;
        var _shaderProgram;

        Object.defineProperty(this, "xcene", {
            "get": function() { return _xcene; }
        });

        setUpWebGLRenderingContext();

        Object.defineProperty(this, "renderingContext", {
            get: function() { return _webGLRenderingContext; },
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
                _webGLRenderingContext.useProgram(_shaderProgram);
            },
        });
        
        //
        // Private methods.
        //
        function setUpWebGLRenderingContext() {
            //
            // Try to grab the standard context.
            _webGLRenderingContext =
                _xcene.mainCanvas.getContext("webgl");

            if (_webGLRenderingContext === null) {
                //
                alert (
                    "mainCanvas.getContext(\"webgl\") failed. Try " +
                    "mainCanvas.getContext(\"experimental-webgl\") instead."
                );

                _webGLRenderingContext =
                    _xcene.mainCanvas.getContext("experimental-webgl");
                
                if (!_webGLRenderingContext) {
                    //
                    throw (
                        "mainCanvas.getContext(\"experimental-webgl\") also failed. " +
                        "No WebGL support."
                    );
                }
            }

            // If we don't have a GL context, give up now
            // if (!this.renderingContext)
            // {
            //     // alert("Unable to initialize WebGL. Your browser may not support it.");
            //     // return;
            //     throw "Unable to initialize WebGL. Your browser may not support it.";
            // }
            
            // Enable depth testing
            _webGLRenderingContext.enable(WebGLRenderingContext.DEPTH_TEST);

            // Near things obscure far things
            _webGLRenderingContext.depthFunc(WebGLRenderingContext.LEQUAL);
            
            // Flips the source data along its vertical axis to make WebGL's texture
            // coordinates (S, T) work correctly.
            _webGLRenderingContext.pixelStorei (
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
        
        clear: function (
            mask = (
                WebGLRenderingContext.COLOR_BUFFER_BIT |
                WebGLRenderingContext.DEPTH_BUFFER_BIT
            ),
            color = GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE,
            depth = GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE,
            stencil = GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE
        ){
            this.renderingContext.clearColor(color.r, color.g, color.b, color.a);
            this.renderingContext.clearDepth(depth);
            this.renderingContext.clearStencil(stencil);

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
    // Constants.
    //
    Object.defineProperty(GraphicsManager, "DEFAULT_COLOR_BUFFER_VALUE", {
        get: function() { return Colors.DEFAULT_BACKGROUND; },
    })

    Object.defineProperty(GraphicsManager, "DEFAULT_DEPTH_BUFFER_VALUE", {
        get: function() { return 1; }
    });

    Object.defineProperty(GraphicsManager, "DEFAULT_STENCIL_BUFFER_VALUE", {
        get: function() { return 1; }
    });    

    return GraphicsManager;
});
