"use strict";

function GraphicsManager(_xcene) {
    //
    var _renderingContext;
    var _shaderProgram;

    Object.defineProperty(this, "xcene", {
        get: function() { return _xcene; }
    });
    
    (function setUpRenderingContext() {
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
        //
    }());
    
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
    enableVertexAttributeArray: function(index) {
        this.renderingContext.enableVertexAttribArray(index);
    },    
    
    clear: function (
        mask = (
            WebGLRenderingContext.COLOR_BUFFER_BIT |
            WebGLRenderingContext.DEPTH_BUFFER_BIT
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