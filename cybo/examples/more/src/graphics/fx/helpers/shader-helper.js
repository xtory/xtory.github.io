"use strict";

function ShaderHelper(_graphicsManager) {
    //
    var _webGLRenderingContext =
        _graphicsManager.renderingContext;
    
    Object.defineProperty(this, "renderingContext", {
        get: function() { return _webGLRenderingContext; }
    });
}

ShaderHelper.prototype = {
    //
    // Public methods.
    //
    setUpShaderProgram: function(vertexShader, fragmentShader) {
        //
        var shaderProgram =
            this.renderingContext.createProgram();
        
        this.renderingContext.attachShader(shaderProgram, vertexShader);
        this.renderingContext.attachShader(shaderProgram, fragmentShader);
        this.renderingContext.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (JSHelper.isUndefinedOrNull (
                this.renderingContext.getProgramParameter (
                    shaderProgram,
                    this.renderingContext.LINK_STATUS
                )
            ) === true)
        {
            throw (
                "Unable to initialize the shader program: " +
                this.renderingContext.getProgramInfoLog(shader)
            );
        }
        
        return shaderProgram;
    }
};
