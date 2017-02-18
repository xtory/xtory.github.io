"use strict";

function ShaderHelper(_graphicsManager) {
    //
    var _renderingContext =
        _graphicsManager.renderingContext;
    
    Object.defineProperty(this, "renderingContext", {
        get: function() { return _renderingContext; }
    });
}

ShaderHelper.prototype = {
    //
    // Methods.
    //
    setUpShaderProgram: function(vertexShader, fragmentShader) {
        //
        var shaderProgram =
            this.renderingContext.createProgram();
        
        this.renderingContext.attachShader(shaderProgram, vertexShader);
        this.renderingContext.attachShader(shaderProgram, fragmentShader);
        this.renderingContext.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (JSHelper.isNullOrUndefined (
                this.renderingContext.getProgramParameter (
                    shaderProgram,
                    WebGLRenderingContext.LINK_STATUS
                )
            ) === true)
        {
            throw (
                "Unable to initialize the shader program: " +
                this.renderingContext.getProgramInfoLog(shader)
            );
        }
        
        var test = ShaderType.VertexShader;
        
        return shaderProgram;
    }
};
