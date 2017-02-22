define ([
    "../../../helpers/js-helper",
    "../shader-type"
], function (
    JSHelper,
    ShaderType
){
    "use strict";
    
    //
    // Constructor.
    //
    function ShaderHelper(_graphicsManager) {
        //
        var _renderingContext =
            _graphicsManager.renderingContext;
        
        Object.defineProperty(this, "renderingContext", {
            get: function() { return _renderingContext; }
        });
    }

    //
    // Prototype.
    //
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

    return ShaderHelper;
});
