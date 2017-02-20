define ([
    "../helpers/js-helper",
    "./color"
], function (
    JSHelper,
    Color
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

        setUpRenderingContext();
        
        Object.defineProperty(this, "renderingContext", {
            get: function() { return _renderingContext; },
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
        function setUpRenderingContext() {
            //
            // Try to grab the standard context.
            try {
                _renderingContext = _xcene.mainCanvas.getContext("webgl");
            }
            catch(e) {
            }

            // If we don't have a GL context, give up now
            //if (!this.renderingContext)
            if (JSHelper.isNullOrUndefined(_renderingContext) === true)
            {
                // alert("Unable to initialize WebGL. Your browser may not support it.");
                // return;
                throw "Unable to initialize WebGL. Your browser may not support it.";
            }
            
            // Enable depth testing
            _renderingContext.enable(WebGLRenderingContext.DEPTH_TEST);

            // Near things obscure far things
            _renderingContext.depthFunc(WebGLRenderingContext.LEQUAL);
        }        
    }

    //
    // Prototype.
    //
    GraphicsManager.prototype = {
        //
        // Public methods.
        //
        enableVertexAttributeArray: function(index) {
            this.renderingContext.enableVertexAttribArray(index);
        },

        setUpBuffer: function (
            target = WebGLRenderingContext.ARRAY_BUFFER,
            buffer,
            srcData,
            usage = WebGLRenderingContext.STATIC_DRAW
        ){
            this.renderingContext.bindBuffer(target, buffer);
            this.renderingContext.bufferData(target, srcData, usage);
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
        getAttributeLocation: function(attributeName) {
            //
            if (JSHelper.isNullOrUndefined(this.shaderProgram) === true) {
                return null;
            }

            return this.renderingContext.getAttribLocation (
                this.shaderProgram,
                attributeName
            );
        },        
        
        getUniformLocation: function(uniformName){
            //
            if (JSHelper.isNullOrUndefined(this.shaderProgram) === true) {
                return null;
            }

            return this.renderingContext.getUniformLocation (
                this.shaderProgram,
                uniformName
            );
        }
    };

    //
    // Constants.
    //
    Object.defineProperty(GraphicsManager, "DEFAULT_COLOR_BUFFER_VALUE", {
        get: function() { return new Color(0.25, 0.25, 0.25, 1.0); },
    })

    Object.defineProperty(GraphicsManager, "DEFAULT_DEPTH_BUFFER_VALUE", {
        get: function() { return 1; }
    });

    Object.defineProperty(GraphicsManager, "DEFAULT_STENCIL_BUFFER_VALUE", {
        get: function() { return 1; }
    });    

    return GraphicsManager;
});
