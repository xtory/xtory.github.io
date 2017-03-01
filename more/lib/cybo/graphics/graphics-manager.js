"use strict";

function GraphicsManager(_xcene) {
    //
    var _renderingContext;
    var _shaderProgram;

    Object.defineProperty(this, "xcene", {
        get: function() { return _xcene; }
    });
    
    setUpWebGLRenderingContext();
    
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
    function setUpWebGLRenderingContext() {
        //
        // Try to grab the standard context. If it fails, fallback to experimental.
        //
        // Note:
        // IE11 only supports "experimental-webgl".
        //
        _renderingContext = _xcene.mainCanvas.getContext("webgl");
        if (_renderingContext === null) {
            //
            _renderingContext =
                _xcene.mainCanvas.getContext("experimental-webgl");
            
            if (_renderingContext !== null) {
                //
                alert (
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
        
        // Enable depth testing
        _renderingContext.enable(_renderingContext.DEPTH_TEST);

        // Near things obscure far things
        _renderingContext.depthFunc(_renderingContext.LEQUAL);
        //
    }
}

Object.defineProperty(GraphicsManager, "DEFAULT_COLOR_BUFFER_VALUE", {
    get: function() { return new Color(0.25, 0.25, 0.25, 1.0); },
})

Object.defineProperty(GraphicsManager, "DEFAULT_DEPTH_BUFFER_VALUE", {
    get: function() { return 1; }
});

Object.defineProperty(GraphicsManager, "DEFAULT_STENCIL_BUFFER_VALUE", {
    get: function() { return 1; }
});

GraphicsManager.prototype = {
    //
    // Public methods.
    //
    enableVertexAttribute: function(vertexAttributeLocation) {
        this.renderingContext.enableVertexAttribArray(vertexAttributeLocation);
    },    
    
    clear: function (
        mask = (
            renderingContext.COLOR_BUFFER_BIT |
            renderingContext.DEPTH_BUFFER_BIT
        ),
        color = GraphicsManager.DEFAULT_COLOR_BUFFER_VALUE,
        depth = GraphicsManager.DEFAULT_DEPTH_BUFFER_VALUE,
        s = GraphicsManager.DEFAULT_STENCIL_BUFFER_VALUE
    ){
        this.renderingContext.clearColor(color.r, color.g, color.b, color.a);
        this.renderingContext.clearDepth(depth);
        this.renderingContext.clearStencil(s);

        this.renderingContext.clear(mask);
    },
    
    //
    // Accessors.
    //
    getAttributeLocation: function(shaderProgram, attributeName) {
        return this.renderingContext.getAttribLocation(shaderProgram, attributeName);
    },
    
    getUniformLocation: function(shaderProgram, uniformName) {
        return this.renderingContext.getUniformLocation(shaderProgram, uniformName);
    }
};
