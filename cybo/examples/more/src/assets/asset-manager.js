'use strict';

function AssetManager(_xcene) {
    //
    var _renderingContext;
    
    Object.defineProperty(this, 'xcene', {
        get: function() { return _xcene; }
    });
    
    _renderingContext =
        _xcene.graphicsManager.renderingContext;

    Object.defineProperty(this, 'renderingContext', {
        get: function() { return _renderingContext; }
    });
}

AssetManager.prototype = {
    //
    loadShader: function(shaderType, shaderSource) {
        //
        var shader;

        if (shaderType === ShaderType.VERTEX_SHADER) {
            //
            shader = this.renderingContext.createShader (
                this.renderingContext.VERTEX_SHADER
            );
        } else if (
            shaderType === ShaderType.FRAGMENT_SHADER
        ){
            shader = this.renderingContext.createShader (
                this.renderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }        

        // Send the source to the shader object
        this.renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        this.renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                this.renderingContext.getShaderParameter (
                    shader,
                    this.renderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                this.renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    },
    //
    // loadShaderFromHtmlElement
    //
    // Loads a shader program by scouring the current document,
    // looking for a script with the specified ID.
    //
    loadShaderFromHtmlElement: function(id) {
        //
        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.

        if (shaderScript === null) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.

        var shaderSource = '';
        var currentChild = shaderScript.firstChild;

        while (currentChild !== null) {
            //
            if (currentChild.nodeType === Node.TEXT_NODE) {
                shaderSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.

        var shader;

        if (shaderScript.type === 'x-shader/x-vertex') {
            //
            shader = this.renderingContext.createShader (
                this.renderingContext.VERTEX_SHADER
            );
        } else if (
            shaderScript.type === 'x-shader/x-fragment'
        ){
            shader = this.renderingContext.createShader (
                this.renderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }

        // Send the source to the shader object
        this.renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        this.renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                this.renderingContext.getShaderParameter (
                    shader,
                    this.renderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                this.renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    }
};
