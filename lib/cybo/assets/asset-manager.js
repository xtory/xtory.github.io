define ([
    "../graphics/fx/shader-type",
    "../helpers/js-helper",
    "../helpers/math-helper"
], function (
    ShaderType,
    JSHelper,
    MathHelper
){
    "use strict";
    
    //
    // Constructor.
    //
    function AssetManager(_xcene) {
        //
        var _renderingContext;

        Object.defineProperty(this, "xcene", {
            get: function() { return _xcene; }
        });
        
        _renderingContext =
            _xcene.graphicsManager.renderingContext;

        Object.defineProperty(this, "renderingContext", {
            get: function() { return _renderingContext; }
        });
    }

    //
    // Prototype.
    //
    AssetManager.prototype = {
        //
        // Public methods.
        //
        loadShader: function(shaderType, shaderSource) {
            //
            var renderingContext = this.renderingContext;
            var shader;

            if (shaderType === ShaderType.VERTEX_SHADER) {
                //
                shader = renderingContext.createShader (
                    WebGLRenderingContext.VERTEX_SHADER
                );
            } else if (
                shaderType === ShaderType.FRAGMENT_SHADER
            ){
                shader = renderingContext.createShader (
                    WebGLRenderingContext.FRAGMENT_SHADER
                );
            } else {
                return null; // Unknown shader type
            }        

            // Send the source to the shader object
            renderingContext.shaderSource(shader, shaderSource);

            // Compile the shader program
            renderingContext.compileShader(shader);

            // See if it compiled successfully
            if (JSHelper.isUndefinedOrNull (
                    renderingContext.getShaderParameter (
                        shader,
                        WebGLRenderingContext.COMPILE_STATUS
                    )
                ) === true)
            {
                throw (
                    "An error occurred compiling the shaders: " +
                    renderingContext.getShaderInfoLog(shader)
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
            var renderingContext = this.renderingContext;

            var shaderScript = document.getElementById(id);

            // Didn't find an element with the specified ID; abort.

            if (shaderScript === null) {
                return null;
            }

            // Walk through the source element's children, building the
            // shader source string.

            var shaderSource = "";
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

            if (shaderScript.type === "x-shader/x-vertex") {
                //
                shader = renderingContext.createShader (
                    WebGLRenderingContext.VERTEX_SHADER
                );
            } else if (
                shaderScript.type === "x-shader/x-fragment"
            ){
                shader = renderingContext.createShader (
                    WebGLRenderingContext.FRAGMENT_SHADER
                );
            } else {
                return null; // Unknown shader type
            }

            // Send the source to the shader object
            renderingContext.shaderSource(shader, shaderSource);

            // Compile the shader program
            renderingContext.compileShader(shader);

            // See if it compiled successfully
            if (JSHelper.isUndefinedOrNull (
                    renderingContext.getShaderParameter (
                        shader,
                        WebGLRenderingContext.COMPILE_STATUS
                    )
                ) === true)
            {
                throw (
                    "An error occurred compiling the shaders: " +
                    renderingContext.getShaderInfoLog(shader)
                );
            }

            return shader;
        },

        loadTexture2D: function(imageSourceUrl) {
            //
            var renderingContext = this.renderingContext;

            var image = new Image();
            var texture = renderingContext.createTexture();

            image.addEventListener("load", function() {
                handleTextureLoaded(image, texture);
            });

            image.src = imageSourceUrl;

            function handleTextureLoaded(image, texture) {
                //
                renderingContext.bindTexture (
                    WebGLRenderingContext.TEXTURE_2D,
                    texture
                );

                renderingContext.texImage2D (
                    WebGLRenderingContext.TEXTURE_2D,    // target
                    0,                                   // level
                    WebGLRenderingContext.RGBA,          // internalFormat
                    WebGLRenderingContext.RGBA,          // format
                    WebGLRenderingContext.UNSIGNED_BYTE, // type
                    image                                // htmlImageElement
                );

                if (MathHelper.isPowerOfTwo(image.width) === true &&
                    MathHelper.isPowerOfTwo(image.height) === true) {
                    //
                    renderingContext.generateMipmap (
                        WebGLRenderingContext.TEXTURE_2D
                    );
                    
                    renderingContext.texParameteri (
                        WebGLRenderingContext.TEXTURE_2D,
                        WebGLRenderingContext.TEXTURE_MIN_FILTER,
                        WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
                    );

                } else {
                    //
                    renderingContext.texParameteri (
                        WebGLRenderingContext.TEXTURE_2D,
                        WebGLRenderingContext.TEXTURE_MIN_FILTER,
                        WebGLRenderingContext.LINEAR
                    );
                }

                // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no
                // LINEAR_MIPMAP_LINEAR.
                renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_MAG_FILTER,
                    WebGLRenderingContext.LINEAR
                );

                renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_WRAP_S,
                    WebGLRenderingContext.CLAMP_TO_EDGE
                );

                renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_WRAP_T,
                    WebGLRenderingContext.CLAMP_TO_EDGE
                );

                renderingContext.bindTexture (
                    WebGLRenderingContext.TEXTURE_2D,
                    null
                );
            }

            return texture;
        }
    };

    Object.freeze(AssetManager);
    return AssetManager;
});
